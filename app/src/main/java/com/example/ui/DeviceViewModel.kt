package com.example.ui

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.local.AppDatabase
import com.example.data.local.RouterDetectionEntity
import com.example.model.AuthStatus
import com.example.model.ConnectedDevice
import com.example.model.FilterType
import com.example.model.MacFilterRule
import com.example.model.RouterCapabilityReport
import com.example.model.RouterCapabilityStatus
import com.example.model.RouterResult
import com.example.repository.ConnectedDeviceRepository
import com.example.repository.MacFilterRepository
import com.example.security.SecureCredentialStore
import com.example.service.RouterAuthentication
import com.example.service.RouterService
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

data class RouterUiState(
    val routerIp: String = "192.168.100.1",
    val usernameInput: String = "telecomadmin",
    val passwordInput: String = "",
    val hasSavedCredentials: Boolean = false,
    val isTestingConnection: Boolean = false,
    val isRefreshingDevices: Boolean = false,
    val isRefreshingFilters: Boolean = false,
    val capabilityReport: RouterCapabilityReport? = null,
    val whitelistModeEnabled: Boolean = false,
    val adminIpv4: String? = null,
    val adminMac: String? = null,
    val showSafetyDialog: Boolean = false,
    val statusBannerMessage: String? = null,
    val statusBannerIsError: Boolean = false
)

class DeviceViewModel(application: Application) : AndroidViewModel(application) {

    private val db = AppDatabase.getInstance(application)
    private val secureStore = SecureCredentialStore(application)
    private val auth = RouterAuthentication()
    private val routerService = RouterService(auth)

    private val deviceRepository = ConnectedDeviceRepository(routerService, db.connectedDeviceDao())
    private val macFilterRepository = MacFilterRepository(routerService, db.macFilterDao())

    private val _uiState = MutableStateFlow(
        RouterUiState(
            routerIp = secureStore.getRouterIp(),
            usernameInput = secureStore.getUsername(),
            passwordInput = secureStore.getPassword(),
            hasSavedCredentials = secureStore.hasStoredCredentials(),
            adminIpv4 = deviceRepository.getLocalIpv4Address()
        )
    )
    val uiState: StateFlow<RouterUiState> = _uiState.asStateFlow()

    val connectedDevices: StateFlow<List<ConnectedDevice>> = deviceRepository.observeDevices()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val blacklistRules: StateFlow<List<MacFilterRule>> =
        macFilterRepository.observeRules(FilterType.BLACKLIST)
            .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val whitelistRules: StateFlow<List<MacFilterRule>> =
        macFilterRepository.observeRules(FilterType.WHITELIST)
            .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    private val _snackBarMessages = MutableSharedFlow<String>()
    val snackBarMessages: SharedFlow<String> = _snackBarMessages.asSharedFlow()

    init {
        // Load latest cached capability report if available
        viewModelScope.launch {
            db.routerDetectionDao().getLatestDetection().collect { entity ->
                if (entity != null && _uiState.value.capabilityReport == null) {
                    _uiState.value = _uiState.value.copy(
                        capabilityReport = entity.toDomainReport()
                    )
                }
            }
        }
        detectAdminDevice()
    }

    private fun detectAdminDevice() {
        val ip = deviceRepository.getLocalIpv4Address()
        _uiState.value = _uiState.value.copy(adminIpv4 = ip)
    }

    fun onRouterIpChanged(newIp: String) {
        _uiState.value = _uiState.value.copy(routerIp = newIp)
    }

    fun onUsernameChanged(newUser: String) {
        _uiState.value = _uiState.value.copy(usernameInput = newUser)
    }

    fun onPasswordChanged(newPass: String) {
        _uiState.value = _uiState.value.copy(passwordInput = newPass)
    }

    fun saveCredentials() {
        val current = _uiState.value
        secureStore.saveCredentials(current.routerIp, current.usernameInput, current.passwordInput)
        _uiState.value = current.copy(hasSavedCredentials = true)
        viewModelScope.launch {
            _snackBarMessages.emit("Credentials securely stored in Android KeyStore.")
        }
    }

    fun clearStoredCredentials() {
        secureStore.clearCredentials()
        auth.clearSession()
        _uiState.value = _uiState.value.copy(
            usernameInput = "",
            passwordInput = "",
            hasSavedCredentials = false
        )
        viewModelScope.launch {
            _snackBarMessages.emit("Router credentials cleared from secure storage.")
        }
    }

    fun testRouterConnection() {
        val current = _uiState.value
        val ip = current.routerIp.trim()
        val user = current.usernameInput.trim()
        val pass = current.passwordInput

        _uiState.value = current.copy(
            isTestingConnection = true,
            statusBannerMessage = null
        )

        viewModelScope.launch {
            when (val result = routerService.detectCapabilities(ip, user, pass)) {
                is RouterResult.Success -> {
                    val report = result.data
                    // Persist detection to Room
                    val entity = RouterDetectionEntity(
                        routerIp = ip,
                        routerModel = report.routerModel,
                        firmwareVersion = report.firmwareVersion,
                        authStatus = report.authStatus.name,
                        macFilteringCapability = report.macFilteringCapability.name,
                        connectedDeviceCapability = report.connectedDeviceCapability.name,
                        rawDiagnostics = report.rawDiagnostics
                    )
                    db.routerDetectionDao().insertDetection(entity)

                    _uiState.value = _uiState.value.copy(
                        isTestingConnection = false,
                        capabilityReport = report,
                        statusBannerMessage = "Capabilities probe complete: ${report.routerModel}",
                        statusBannerIsError = false
                    )

                    // Also try to query devices and MAC rules if capabilities indicate support
                    if (report.connectedDeviceCapability == RouterCapabilityStatus.SUPPORTED) {
                        refreshConnectedDevices()
                    }
                    if (report.macFilteringCapability == RouterCapabilityStatus.SUPPORTED) {
                        refreshMacFilters()
                    }
                }
                is RouterResult.Unsupported -> {
                    _uiState.value = _uiState.value.copy(
                        isTestingConnection = false,
                        statusBannerMessage = result.message,
                        statusBannerIsError = true
                    )
                }
                is RouterResult.Error -> {
                    _uiState.value = _uiState.value.copy(
                        isTestingConnection = false,
                        statusBannerMessage = "Connection failed: ${result.error}",
                        statusBannerIsError = true
                    )
                }
            }
        }
    }

    fun refreshConnectedDevices() {
        val ip = _uiState.value.routerIp.trim()
        _uiState.value = _uiState.value.copy(isRefreshingDevices = true)
        viewModelScope.launch {
            when (val result = deviceRepository.refreshConnectedDevices(ip)) {
                is RouterResult.Success -> {
                    val devices = result.data
                    val admin = devices.find { it.isCurrentAdminDevice }
                    _uiState.value = _uiState.value.copy(
                        isRefreshingDevices = false,
                        adminMac = admin?.macAddress,
                        statusBannerMessage = "Retrieved ${devices.size} connected devices from router.",
                        statusBannerIsError = false
                    )
                }
                is RouterResult.Unsupported -> {
                    _uiState.value = _uiState.value.copy(
                        isRefreshingDevices = false,
                        statusBannerMessage = result.message,
                        statusBannerIsError = true
                    )
                }
                is RouterResult.Error -> {
                    _uiState.value = _uiState.value.copy(
                        isRefreshingDevices = false,
                        statusBannerMessage = "Error querying devices: ${result.error}",
                        statusBannerIsError = true
                    )
                }
            }
        }
    }

    fun refreshMacFilters() {
        val ip = _uiState.value.routerIp.trim()
        _uiState.value = _uiState.value.copy(isRefreshingFilters = true)
        viewModelScope.launch {
            when (val result = macFilterRepository.refreshRulesFromRouter(ip)) {
                is RouterResult.Success -> {
                    _uiState.value = _uiState.value.copy(
                        isRefreshingFilters = false,
                        statusBannerMessage = "Retrieved MAC filtering rules from router.",
                        statusBannerIsError = false
                    )
                }
                is RouterResult.Unsupported -> {
                    _uiState.value = _uiState.value.copy(
                        isRefreshingFilters = false,
                        statusBannerMessage = result.message,
                        statusBannerIsError = true
                    )
                }
                is RouterResult.Error -> {
                    _uiState.value = _uiState.value.copy(
                        isRefreshingFilters = false,
                        statusBannerMessage = result.error,
                        statusBannerIsError = true
                    )
                }
            }
        }
    }

    fun addMacToBlacklist(mac: String, deviceName: String = "") {
        val ip = _uiState.value.routerIp.trim()
        viewModelScope.launch {
            when (val result = macFilterRepository.addRule(ip, mac, deviceName, FilterType.BLACKLIST)) {
                is RouterResult.Success -> {
                    _snackBarMessages.emit(result.message ?: "Device $mac added to blacklist.")
                }
                is RouterResult.Unsupported -> {
                    _uiState.value = _uiState.value.copy(
                        statusBannerMessage = result.message,
                        statusBannerIsError = true
                    )
                    _snackBarMessages.emit(result.message)
                }
                is RouterResult.Error -> {
                    _snackBarMessages.emit("Failed to add to blacklist: ${result.error}")
                }
            }
        }
    }

    fun removeMacFromBlacklist(mac: String) {
        val ip = _uiState.value.routerIp.trim()
        viewModelScope.launch {
            when (val result = macFilterRepository.removeRule(ip, mac, FilterType.BLACKLIST)) {
                is RouterResult.Success -> {
                    _snackBarMessages.emit("Device $mac removed from blacklist.")
                }
                is RouterResult.Unsupported -> {
                    _snackBarMessages.emit(result.message)
                }
                is RouterResult.Error -> {
                    _snackBarMessages.emit("Failed to remove: ${result.error}")
                }
            }
        }
    }

    fun blockConnectedDevice(device: ConnectedDevice) {
        addMacToBlacklist(device.macAddress, device.deviceName)
    }

    fun addMacToWhitelist(mac: String, deviceName: String = "") {
        val ip = _uiState.value.routerIp.trim()
        viewModelScope.launch {
            when (val result = macFilterRepository.addRule(ip, mac, deviceName, FilterType.WHITELIST)) {
                is RouterResult.Success -> {
                    _snackBarMessages.emit(result.message ?: "Device $mac added to whitelist.")
                }
                is RouterResult.Unsupported -> {
                    _uiState.value = _uiState.value.copy(
                        statusBannerMessage = result.message,
                        statusBannerIsError = true
                    )
                    _snackBarMessages.emit(result.message)
                }
                is RouterResult.Error -> {
                    _snackBarMessages.emit("Failed to add to whitelist: ${result.error}")
                }
            }
        }
    }

    fun removeMacFromWhitelist(mac: String) {
        // SAFETY: Never automatically remove the administrator from the whitelist!
        val currentAdminMac = _uiState.value.adminMac
        if (currentAdminMac != null && currentAdminMac.equals(mac, ignoreCase = true)) {
            viewModelScope.launch {
                _snackBarMessages.emit("Safety restriction: Cannot remove the administrator device ($mac) from whitelist.")
            }
            return
        }

        val ip = _uiState.value.routerIp.trim()
        viewModelScope.launch {
            when (val result = macFilterRepository.removeRule(ip, mac, FilterType.WHITELIST)) {
                is RouterResult.Success -> {
                    _snackBarMessages.emit("Device $mac removed from whitelist.")
                }
                is RouterResult.Unsupported -> {
                    _snackBarMessages.emit(result.message)
                }
                is RouterResult.Error -> {
                    _snackBarMessages.emit("Failed to remove: ${result.error}")
                }
            }
        }
    }

    fun requestToggleWhitelistMode(enable: Boolean) {
        if (enable) {
            // Must trigger safety confirmation flow
            _uiState.value = _uiState.value.copy(showSafetyDialog = true)
        } else {
            executeWhitelistToggle(false)
        }
    }

    fun dismissSafetyDialog() {
        _uiState.value = _uiState.value.copy(showSafetyDialog = false)
    }

    fun confirmEnableWhitelistMode() {
        _uiState.value = _uiState.value.copy(showSafetyDialog = false)
        executeWhitelistToggle(true)
    }

    private fun executeWhitelistToggle(enable: Boolean) {
        val ip = _uiState.value.routerIp.trim()
        viewModelScope.launch {
            when (val result = macFilterRepository.toggleWhitelistMode(ip, enable)) {
                is RouterResult.Success -> {
                    _uiState.value = _uiState.value.copy(whitelistModeEnabled = enable)
                    _snackBarMessages.emit(
                        if (enable) "Whitelist mode ENABLED: Only authorized devices can connect."
                        else "Whitelist mode DISABLED: Standard Wi-Fi access restored."
                    )
                }
                is RouterResult.Unsupported -> {
                    _uiState.value = _uiState.value.copy(
                        statusBannerMessage = result.message,
                        statusBannerIsError = true
                    )
                    _snackBarMessages.emit(result.message)
                }
                is RouterResult.Error -> {
                    _snackBarMessages.emit("Failed to change mode: ${result.error}")
                }
            }
        }
    }

    fun dismissBanner() {
        _uiState.value = _uiState.value.copy(statusBannerMessage = null)
    }
}
