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
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Switch
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
import com.example.model.MacFilterRule
import com.example.model.RouterCapabilityStatus
import com.example.service.RouterService
import com.example.ui.RouterUiState
import com.example.ui.components.MacInputDialog
import com.example.ui.components.SafetyWarningDialog

@Composable
fun WhitelistScreen(
    uiState: RouterUiState,
    rules: List<MacFilterRule>,
    onAddMac: (mac: String, name: String) -> Unit,
    onRemoveMac: (mac: String) -> Unit,
    onRequestToggleMode: (Boolean) -> Unit,
    onConfirmEnableMode: () -> Unit,
    onDismissSafetyDialog: () -> Unit,
    modifier: Modifier = Modifier
) {
    var showAddDialog by remember { mutableStateOf(false) }
    val capability = uiState.capabilityReport?.macFilteringCapability ?: RouterCapabilityStatus.UNKNOWN

    Scaffold(
        modifier = modifier.fillMaxSize(),
        floatingActionButton = {
            if (capability != RouterCapabilityStatus.NOT_SUPPORTED) {
                FloatingActionButton(
                    onClick = { showAddDialog = true },
                    containerColor = MaterialTheme.colorScheme.primary,
                    contentColor = MaterialTheme.colorScheme.onPrimary,
                    modifier = Modifier.testTag("add_whitelist_fab")
                ) {
                    Icon(Icons.Default.Add, contentDescription = "Add MAC to Whitelist")
                }
            }
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(horizontal = 16.dp)
        ) {
            // Top Whitelist Mode Controller Card
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(
                    containerColor = if (uiState.whitelistModeEnabled) MaterialTheme.colorScheme.primaryContainer
                    else MaterialTheme.colorScheme.surfaceVariant
                ),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 10.dp)
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(42.dp)
                            .clip(CircleShape)
                            .background(
                                if (uiState.whitelistModeEnabled) MaterialTheme.colorScheme.primary
                                else MaterialTheme.colorScheme.secondaryContainer
                            ),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Shield,
                            contentDescription = null,
                            tint = if (uiState.whitelistModeEnabled) MaterialTheme.colorScheme.onPrimary
                            else MaterialTheme.colorScheme.onSecondaryContainer,
                            modifier = Modifier.size(24.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(14.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "Allow-Only-Selected Mode",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = if (uiState.whitelistModeEnabled) "Active: Non-whitelisted devices blocked"
                            else "Disabled: Standard network access",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                    Switch(
                        checked = uiState.whitelistModeEnabled,
                        onCheckedChange = { checked ->
                            onRequestToggleMode(checked)
                        },
                        enabled = capability != RouterCapabilityStatus.NOT_SUPPORTED,
                        modifier = Modifier.testTag("whitelist_mode_switch")
                    )
                }
            }

            // If not supported by firmware, display mandatory message
            if (capability == RouterCapabilityStatus.NOT_SUPPORTED) {
                Card(
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.errorContainer),
                    shape = RoundedCornerShape(16.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 6.dp)
                        .testTag("unsupported_whitelist_card")
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
                            text = "Whitelist filtering endpoints are locked by the current Huawei HS8145C5 ONT firmware image.",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onErrorContainer.copy(alpha = 0.8f)
                        )
                    }
                }
            }

            // Rules List or Empty State
            if (rules.isEmpty() && capability != RouterCapabilityStatus.NOT_SUPPORTED) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(24.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(
                            imageVector = Icons.Default.Shield,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.4f),
                            modifier = Modifier.size(64.dp)
                        )
                        Spacer(modifier = Modifier.height(12.dp))
                        Text(
                            text = "Whitelist is Empty",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Medium
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "Add devices to allow connection before turning on Allow-Only mode.",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Button(onClick = { showAddDialog = true }) {
                            Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Add Device to Whitelist")
                        }
                    }
                }
            } else {
                LazyColumn(
                    verticalArrangement = Arrangement.spacedBy(10.dp),
                    modifier = Modifier.fillMaxSize()
                ) {
                    items(rules, key = { it.macAddress }) { rule ->
                        val isAdmin = uiState.adminMac != null && uiState.adminMac.equals(rule.macAddress, ignoreCase = true)
                        WhitelistRuleCard(
                            rule = rule,
                            isAdminDevice = isAdmin,
                            onRemove = { onRemoveMac(rule.macAddress) }
                        )
                    }
                    item {
                        Spacer(modifier = Modifier.height(80.dp))
                    }
                }
            }
        }
    }

    // Safety Dialog
    if (uiState.showSafetyDialog) {
        SafetyWarningDialog(
            adminIpv4 = uiState.adminIpv4,
            adminMac = uiState.adminMac,
            onDismiss = onDismissSafetyDialog,
            onConfirm = onConfirmEnableMode
        )
    }

    if (showAddDialog) {
        MacInputDialog(
            title = "Add MAC to Whitelist",
            confirmButtonText = "Authorize on Router",
            onDismiss = { showAddDialog = false },
            onConfirm = { mac, name ->
                onAddMac(mac, name)
                showAddDialog = false
            }
        )
    }
}

@Composable
fun WhitelistRuleCard(
    rule: MacFilterRule,
    isAdminDevice: Boolean,
    onRemove: () -> Unit
) {
    Card(
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
        modifier = Modifier
            .fillMaxWidth()
            .testTag("whitelist_rule_${rule.macAddress.replace(":", "")}")
    ) {
        Row(
            modifier = Modifier
                .padding(14.dp)
                .fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(40.dp)
                    .clip(CircleShape)
                    .background(
                        if (isAdminDevice) MaterialTheme.colorScheme.primaryContainer
                        else MaterialTheme.colorScheme.surface
                    ),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = if (isAdminDevice) Icons.Default.Lock else Icons.Default.CheckCircle,
                    contentDescription = null,
                    tint = if (isAdminDevice) MaterialTheme.colorScheme.primary else Color(0xFF10B981),
                    modifier = Modifier.size(20.dp)
                )
            }
            Spacer(modifier = Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = rule.deviceName.ifBlank { "Authorized Device" },
                        style = MaterialTheme.typography.titleSmall,
                        fontWeight = FontWeight.Bold
                    )
                    if (isAdminDevice) {
                        Spacer(modifier = Modifier.width(6.dp))
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(6.dp))
                                .background(MaterialTheme.colorScheme.primary)
                                .padding(horizontal = 6.dp, vertical = 2.dp)
                        ) {
                            Text(
                                text = "ADMIN PROTECTED",
                                fontSize = 8.sp,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onPrimary
                            )
                        }
                    }
                }
                Text(
                    text = rule.macAddress,
                    style = MaterialTheme.typography.bodySmall,
                    fontFamily = FontFamily.Monospace,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Text(
                    text = if (rule.routerConfirmed) "Router Confirmed • Active" else rule.statusMessage,
                    style = MaterialTheme.typography.labelSmall,
                    color = if (rule.routerConfirmed) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.error
                )
            }

            if (!isAdminDevice) {
                IconButton(
                    onClick = onRemove,
                    modifier = Modifier.testTag("remove_whitelist_${rule.macAddress.replace(":", "")}")
                ) {
                    Icon(
                        imageVector = Icons.Default.Delete,
                        contentDescription = "Remove from whitelist",
                        tint = MaterialTheme.colorScheme.error
                    )
                }
            }
        }
    }
}
