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
import androidx.compose.material.icons.filled.Block
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
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

@Composable
fun BlacklistScreen(
    uiState: RouterUiState,
    rules: List<MacFilterRule>,
    onRefresh: () -> Unit,
    onAddMac: (mac: String, name: String) -> Unit,
    onRemoveMac: (mac: String) -> Unit,
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
                    containerColor = MaterialTheme.colorScheme.error,
                    contentColor = MaterialTheme.colorScheme.onError,
                    modifier = Modifier.testTag("add_blacklist_fab")
                ) {
                    Icon(Icons.Default.Add, contentDescription = "Add MAC to Blacklist")
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
                        text = "Router Blacklist",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "${rules.size} blocked MAC addresses",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }

                IconButton(
                    onClick = onRefresh,
                    enabled = !uiState.isRefreshingFilters,
                    modifier = Modifier.testTag("refresh_blacklist_button")
                ) {
                    if (uiState.isRefreshingFilters) {
                        CircularProgressIndicator(modifier = Modifier.size(22.dp), strokeWidth = 2.dp)
                    } else {
                        Icon(
                            imageVector = Icons.Default.Refresh,
                            contentDescription = "Refresh from router"
                        )
                    }
                }
            }

            // If not supported by firmware, display mandatory user warning
            if (capability == RouterCapabilityStatus.NOT_SUPPORTED) {
                Card(
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.errorContainer),
                    shape = RoundedCornerShape(16.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 8.dp)
                        .testTag("unsupported_blacklist_card")
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
                            text = "This Huawei HS8145C5 ONT firmware does not accept programmatic Blacklist injection. Features are not simulated.",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onErrorContainer.copy(alpha = 0.8f)
                        )
                    }
                }
            }

            if (rules.isEmpty() && capability != RouterCapabilityStatus.NOT_SUPPORTED) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(24.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(
                            imageVector = Icons.Default.Block,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.4f),
                            modifier = Modifier.size(64.dp)
                        )
                        Spacer(modifier = Modifier.height(12.dp))
                        Text(
                            text = "Blacklist is Empty",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Medium
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "No MAC addresses are currently blocked on the router.",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Button(
                            onClick = { showAddDialog = true },
                            colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error)
                        ) {
                            Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Add MAC to Blacklist")
                        }
                    }
                }
            } else {
                LazyColumn(
                    verticalArrangement = Arrangement.spacedBy(10.dp),
                    modifier = Modifier.fillMaxSize()
                ) {
                    items(rules, key = { it.macAddress }) { rule ->
                        BlacklistRuleCard(
                            rule = rule,
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

    if (showAddDialog) {
        MacInputDialog(
            title = "Add MAC to Blacklist",
            confirmButtonText = "Block on Router",
            onDismiss = { showAddDialog = false },
            onConfirm = { mac, name ->
                onAddMac(mac, name)
                showAddDialog = false
            }
        )
    }
}

@Composable
fun BlacklistRuleCard(
    rule: MacFilterRule,
    onRemove: () -> Unit
) {
    Card(
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
        modifier = Modifier
            .fillMaxWidth()
            .testTag("blacklist_rule_${rule.macAddress.replace(":", "")}")
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
                    .background(MaterialTheme.colorScheme.errorContainer),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.Block,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.onErrorContainer,
                    modifier = Modifier.size(20.dp)
                )
            }
            Spacer(modifier = Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = rule.deviceName.ifBlank { "Blocked Device" },
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.Bold
                )
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
            IconButton(
                onClick = onRemove,
                modifier = Modifier.testTag("unblock_button_${rule.macAddress.replace(":", "")}")
            ) {
                Icon(
                    imageVector = Icons.Default.Delete,
                    contentDescription = "Unblock",
                    tint = MaterialTheme.colorScheme.error
                )
            }
        }
    }
}
