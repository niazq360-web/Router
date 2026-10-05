package com.example.model

enum class RouterCapabilityStatus {
    SUPPORTED,
    NOT_SUPPORTED,
    UNKNOWN
}

enum class AuthStatus {
    NOT_TESTED,
    SUCCESS,
    FAILED_BAD_CREDENTIALS,
    FAILED_TIMEOUT,
    FAILED_UNREACHABLE,
    CHALLENGE_REQUIRED
}

enum class FilterType {
    BLACKLIST,
    WHITELIST
}

sealed class RouterResult<out T> {
    data class Success<out T>(val data: T, val message: String? = null) : RouterResult<T>()
    data class Unsupported(
        val message: String = "This HS8145C5 firmware does not expose this operation through the available local management interface.",
        val details: String? = null
    ) : RouterResult<Nothing>()
    data class Error(val error: String, val cause: Throwable? = null) : RouterResult<Nothing>()
}

data class RouterCapabilityReport(
    val routerModel: String = "Huawei EchoLife HS8145C5 (Probing...)",
    val firmwareVersion: String = "Unknown",
    val authStatus: AuthStatus = AuthStatus.NOT_TESTED,
    val macFilteringCapability: RouterCapabilityStatus = RouterCapabilityStatus.UNKNOWN,
    val connectedDeviceCapability: RouterCapabilityStatus = RouterCapabilityStatus.UNKNOWN,
    // Detailed 9-point capability checklist
    val canAuthenticate: RouterCapabilityStatus = RouterCapabilityStatus.UNKNOWN,
    val canReadConnectedDevices: RouterCapabilityStatus = RouterCapabilityStatus.UNKNOWN,
    val canReadMacFilter: RouterCapabilityStatus = RouterCapabilityStatus.UNKNOWN,
    val canAddBlacklist: RouterCapabilityStatus = RouterCapabilityStatus.UNKNOWN,
    val canRemoveBlacklist: RouterCapabilityStatus = RouterCapabilityStatus.UNKNOWN,
    val canReadWhitelist: RouterCapabilityStatus = RouterCapabilityStatus.UNKNOWN,
    val canAddWhitelist: RouterCapabilityStatus = RouterCapabilityStatus.UNKNOWN,
    val canRemoveWhitelist: RouterCapabilityStatus = RouterCapabilityStatus.UNKNOWN,
    val canToggleFilterMode: RouterCapabilityStatus = RouterCapabilityStatus.UNKNOWN,
    val rawDiagnostics: String = "",
    val timestamp: Long = System.currentTimeMillis()
)

data class ConnectedDevice(
    val macAddress: String,
    val ipAddress: String,
    val deviceName: String,
    val isOnline: Boolean = true,
    val wifiBand: String = "Unknown",
    val rssi: Int? = null,
    val isCurrentAdminDevice: Boolean = false,
    val isBlacklisted: Boolean = false,
    val isWhitelisted: Boolean = false
)

data class MacFilterRule(
    val id: Long = 0,
    val macAddress: String,
    val deviceName: String = "",
    val ruleType: FilterType,
    val isSyncedToRouter: Boolean = false,
    val routerConfirmed: Boolean = false,
    val statusMessage: String = "",
    val updatedAt: Long = System.currentTimeMillis()
)
