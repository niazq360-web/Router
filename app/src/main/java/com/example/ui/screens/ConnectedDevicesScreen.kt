package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Block
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Devices
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.PhoneAndroid
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material.icons.filled.Wifi
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.model.ConnectedDevice
import com.example.model.RouterCapabilityStatus
import com.example.service.RouterService
import com.example.ui.RouterUiState
import com.example.ui.components.MacInputDialog

@Composable
fun ConnectedDevicesScreen(
    uiState: RouterUiState,
    devices: List<ConnectedDevice>,
    onRefresh: () -> Unit,
    onBlockDevice: (ConnectedDevice) -> Unit,
    onWhitelistDevice: (ConnectedDevice) -> Unit,
    modifier: Modifier = Modifier
) {
    val capability = uiState.capabilityReport?.connectedDeviceCapability ?: RouterCapabilityStatus.UNKNOWN
    var deviceToBlock by remember { mutableStateOf<ConnectedDevice?>(null) }
    var deviceToWhitelist by remember { mutableStateOf<ConnectedDevice?>(null) }

    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp)
    ) {
        // Header with Refresh
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 12.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "Connected Devices",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = "${devices.size} devices discovered via router station table",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            IconButton(
                onClick = onRefresh,
                enabled = !uiState.isRefreshingDevices,
                modifier = Modifier.testTag("refresh_devices_button")
            ) {
                if (uiState.isRefreshingDevices) {
                    CircularProgressIndicator(modifier = Modifier.size(22.dp), strokeWidth = 2.dp)
                } else {
                    Icon(
                        imageVector = Icons.Default.Refresh,
                        contentDescription = "Refresh from router"
                    )
                }
            }
        }

        // Check if firmware capability is NOT_SUPPORTED
        if (capability == RouterCapabilityStatus.NOT_SUPPORTED) {
            Card(
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.errorContainer),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 8.dp)
                    .testTag("unsupported_devices_card")
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.Warning,
                            contentDescription = "Alert",
                            tint = MaterialTheme.colorScheme.onErrorContainer,
                            modifier = Modifier.size(24.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Operation Not Supported by Firmware",
                            style = MaterialTheme.typography.titleSmall,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onErrorContainer
                        )
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = RouterService.UNSUPPORTED_FIRMWARE_MSG,
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.SemiBold,
                        color = MaterialTheme.colorScheme.onErrorContainer
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = "Carrier firmware on this Huawei EchoLife HS8145C5 restricts station query endpoints to interactive browser sessions. The app will not fake device lists.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onErrorContainer.copy(alpha = 0.8f)
                    )
                }
            }
        }

        if (devices.isEmpty() && capability != RouterCapabilityStatus.NOT_SUPPORTED) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(24.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(
                        imageVector = Icons.Default.Devices,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.4f),
                        modifier = Modifier.size(64.dp)
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = "No Connected Devices Found Yet",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Medium
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Connect to your router and tap Refresh to query the ONT station table.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Button(
                        onClick = onRefresh,
                        modifier = Modifier.testTag("empty_state_refresh_button")
                    ) {
                        Icon(Icons.Default.Refresh, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Query Router")
                    }
                }
            }
        } else {
            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(10.dp),
                modifier = Modifier.fillMaxSize()
            ) {
                items(devices, key = { it.macAddress }) { device ->
                    DeviceCard(
                        device = device,
                        onBlock = { deviceToBlock = device },
                        onWhitelist = { deviceToWhitelist = device }
                    )
                }
                item {
                    Spacer(modifier = Modifier.height(16.dp))
                }
            }
        }
    }

    if (deviceToBlock != null) {
        val dev = deviceToBlock!!
        MacInputDialog(
            title = "Block Device (Blacklist)",
            confirmButtonText = "Block on Router",
            initialMac = dev.macAddress,
            initialName = dev.deviceName,
            onDismiss = { deviceToBlock = null },
            onConfirm = { mac, _ ->
                onBlockDevice(dev.copy(macAddress = mac))
                deviceToBlock = null
            }
        )
    }

    if (deviceToWhitelist != null) {
        val dev = deviceToWhitelist!!
        MacInputDialog(
            title = "Add to Whitelist",
            confirmButtonText = "Authorize MAC",
            initialMac = dev.macAddress,
            initialName = dev.deviceName,
            onDismiss = { deviceToWhitelist = null },
            onConfirm = { mac, _ ->
                onWhitelistDevice(dev.copy(macAddress = mac))
                deviceToWhitelist = null
            }
        )
    }
}

@Composable
fun DeviceCard(
    device: ConnectedDevice,
    onBlock: () -> Unit,
    onWhitelist: () -> Unit
) {
    Card(
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
        modifier = Modifier
            .fillMaxWidth()
            .testTag("device_card_${device.macAddress.replace(":", "")}")
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(40.dp)
                        .clip(CircleShape)
                        .background(
                            if (device.isCurrentAdminDevice) MaterialTheme.colorScheme.primary
                            else MaterialTheme.colorScheme.secondaryContainer
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = if (device.isCurrentAdminDevice) Icons.Default.PhoneAndroid else Icons.Default.Wifi,
                        contentDescription = null,
                        tint = if (device.isCurrentAdminDevice) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onSecondaryContainer,
                        modifier = Modifier.size(22.dp)
                    )
                }
                Spacer(modifier = Modifier.width(12.dp))
                Column(modifier = Modifier.weight(1f)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = device.deviceName,
                            style = MaterialTheme.typography.titleSmall,
                            fontWeight = FontWeight.Bold
                        )
                        if (device.isCurrentAdminDevice) {
                            Spacer(modifier = Modifier.width(6.dp))
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(6.dp))
                                    .background(MaterialTheme.colorScheme.primaryContainer)
                                    .padding(horizontal = 6.dp, vertical = 2.dp)
                            ) {
                                Text(
                                    text = "YOU (ADMIN)",
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.onPrimaryContainer
                                )
                            }
                        }
                    }
                    Text(
                        text = "MAC: ${device.macAddress}",
                        style = MaterialTheme.typography.bodySmall,
                        fontFamily = FontFamily.Monospace,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Text(
                        text = "IP: ${device.ipAddress} • Band: ${device.wifiBand}",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Action Row
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.End
            ) {
                OutlinedButton(
                    onClick = onWhitelist,
                    modifier = Modifier.height(36.dp)
                ) {
                    Icon(Icons.Default.CheckCircle, contentDescription = null, modifier = Modifier.size(14.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Whitelist", fontSize = 12.sp)
                }
                Spacer(modifier = Modifier.width(8.dp))
                Button(
                    onClick = onBlock,
                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error),
                    enabled = !device.isCurrentAdminDevice,
                    modifier = Modifier.height(36.dp)
                ) {
                    Icon(Icons.Default.Block, contentDescription = null, modifier = Modifier.size(14.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(if (device.isCurrentAdminDevice) "Protected" else "Block", fontSize = 12.sp)
                }
            }
        }
    }
}
