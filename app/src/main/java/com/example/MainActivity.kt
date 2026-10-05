package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Block
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Devices
import androidx.compose.material.icons.filled.Router
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationRail
import androidx.compose.material3.NavigationRailItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.model.AuthStatus
import com.example.ui.DeviceViewModel
import com.example.ui.components.StatusBanner
import com.example.ui.screens.BlacklistScreen
import com.example.ui.screens.CapabilitiesScreen
import com.example.ui.screens.ConnectedDevicesScreen
import com.example.ui.screens.RouterWebConsoleScreen
import com.example.ui.screens.SecurityAuditScreen
import com.example.ui.screens.WhitelistScreen
import com.example.ui.theme.MyApplicationTheme

enum class AppDestination(val label: String, val icon: ImageVector, val tag: String) {
    CAPABILITIES("Audit", Icons.Default.Router, "nav_capabilities"),
    CONSOLE("Console", Icons.Default.Devices, "nav_console"),
    DEVICES("Devices", Icons.Default.Shield, "nav_devices"),
    BLACKLIST("Blacklist", Icons.Default.Block, "nav_blacklist"),
    WHITELIST("Whitelist", Icons.Default.CheckCircle, "nav_whitelist"),
    SECURITY("Security", Icons.Default.Security, "nav_security")
}

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MyApplicationTheme {
                EchoLifeApp()
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EchoLifeApp(viewModel: DeviceViewModel = viewModel()) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    val devices by viewModel.connectedDevices.collectAsStateWithLifecycle()
    val blacklistRules by viewModel.blacklistRules.collectAsStateWithLifecycle()
    val whitelistRules by viewModel.whitelistRules.collectAsStateWithLifecycle()

    val snackbarHostState = remember { SnackbarHostState() }
    var currentDestination by remember { mutableStateOf(AppDestination.CAPABILITIES) }

    BackHandler(enabled = currentDestination != AppDestination.CAPABILITIES) {
        currentDestination = AppDestination.CAPABILITIES
    }

    LaunchedEffect(Unit) {
        viewModel.snackBarMessages.collect { msg ->
            snackbarHostState.showSnackbar(msg)
        }
    }

    BoxWithConstraints(modifier = Modifier.fillMaxSize()) {
        val isWideScreen = maxWidth >= 600.dp

        Scaffold(
            topBar = {
                TopAppBar(
                    title = {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = "EchoLife HS8145C5",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            val isAuthSuccess = uiState.capabilityReport?.authStatus == AuthStatus.SUCCESS
                            Box(
                                modifier = Modifier
                                    .size(8.dp)
                                    .clip(CircleShape)
                                    .background(if (isAuthSuccess) Color(0xFF10B981) else Color(0xFFF59E0B))
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = if (isAuthSuccess) "ONLINE" else uiState.routerIp,
                                fontSize = 11.sp,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    },
                    colors = TopAppBarDefaults.topAppBarColors(
                        containerColor = MaterialTheme.colorScheme.surface
                    ),
                    modifier = Modifier.testTag("app_top_bar")
                )
            },
            bottomBar = {
                if (!isWideScreen) {
                    NavigationBar(modifier = Modifier.testTag("app_navigation_bar")) {
                        AppDestination.values().forEach { destination ->
                            NavigationBarItem(
                                selected = currentDestination == destination,
                                onClick = { currentDestination = destination },
                                icon = {
                                    Icon(destination.icon, contentDescription = destination.label)
                                },
                                label = { Text(destination.label) },
                                modifier = Modifier.testTag(destination.tag)
                            )
                        }
                    }
                }
            },
            snackbarHost = { SnackbarHost(snackbarHostState) },
            modifier = Modifier.fillMaxSize()
        ) { innerPadding ->
            Row(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
            ) {
                if (isWideScreen) {
                    NavigationRail(modifier = Modifier.testTag("app_navigation_rail")) {
                        AppDestination.values().forEach { destination ->
                            NavigationRailItem(
                                selected = currentDestination == destination,
                                onClick = { currentDestination = destination },
                                icon = {
                                    Icon(destination.icon, contentDescription = destination.label)
                                },
                                label = { Text(destination.label) },
                                modifier = Modifier.testTag(destination.tag)
                            )
                        }
                    }
                }

                Column(modifier = Modifier.fillMaxSize()) {
                    if (uiState.statusBannerMessage != null) {
                        StatusBanner(
                            message = uiState.statusBannerMessage!!,
                            isError = uiState.statusBannerIsError,
                            onDismiss = { viewModel.dismissBanner() }
                        )
                    }

                    Box(modifier = Modifier.fillMaxSize()) {
                        when (currentDestination) {
                            AppDestination.CAPABILITIES -> {
                                CapabilitiesScreen(
                                    uiState = uiState,
                                    onIpChange = { viewModel.onRouterIpChanged(it) },
                                    onUsernameChange = { viewModel.onUsernameChanged(it) },
                                    onPasswordChange = { viewModel.onPasswordChanged(it) },
                                    onTestConnection = { viewModel.testRouterConnection() },
                                    onSaveCredentials = { viewModel.saveCredentials() },
                                    onClearCredentials = { viewModel.clearStoredCredentials() }
                                )
                            }
                            AppDestination.CONSOLE -> {
                                RouterWebConsoleScreen(uiState = uiState)
                            }
                            AppDestination.DEVICES -> {
                                ConnectedDevicesScreen(
                                    uiState = uiState,
                                    devices = devices,
                                    onRefresh = { viewModel.refreshConnectedDevices() },
                                    onBlockDevice = { dev -> viewModel.blockConnectedDevice(dev) },
                                    onWhitelistDevice = { dev -> viewModel.addMacToWhitelist(dev.macAddress, dev.deviceName) }
                                )
                            }
                            AppDestination.BLACKLIST -> {
                                BlacklistScreen(
                                    uiState = uiState,
                                    rules = blacklistRules,
                                    onRefresh = { viewModel.refreshMacFilters() },
                                    onAddMac = { mac, name -> viewModel.addMacToBlacklist(mac, name) },
                                    onRemoveMac = { mac -> viewModel.removeMacFromBlacklist(mac) }
                                )
                            }
                            AppDestination.WHITELIST -> {
                                WhitelistScreen(
                                    uiState = uiState,
                                    rules = whitelistRules,
                                    onAddMac = { mac, name -> viewModel.addMacToWhitelist(mac, name) },
                                    onRemoveMac = { mac -> viewModel.removeMacFromWhitelist(mac) },
                                    onRequestToggleMode = { enable -> viewModel.requestToggleWhitelistMode(enable) },
                                    onConfirmEnableMode = { viewModel.confirmEnableWhitelistMode() },
                                    onDismissSafetyDialog = { viewModel.dismissSafetyDialog() }
                                )
                            }
                            AppDestination.SECURITY -> {
                                SecurityAuditScreen(uiState = uiState)
                            }
                        }
                    }
                }
            }
        }
    }
}
