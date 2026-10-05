package com.example.ui.screens

import androidx.compose.animation.AnimatedVisibility
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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.BugReport
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Key
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Router
import androidx.compose.material.icons.filled.Save
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Divider
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
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
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.model.AuthStatus
import com.example.model.RouterCapabilityStatus
import com.example.ui.RouterUiState
import com.example.ui.components.CapabilityItem
import com.example.ui.components.StatusBadge

@Composable
fun CapabilitiesScreen(
    uiState: RouterUiState,
    onIpChange: (String) -> Unit,
    onUsernameChange: (String) -> Unit,
    onPasswordChange: (String) -> Unit,
    onTestConnection: () -> Unit,
    onSaveCredentials: () -> Unit,
    onClearCredentials: () -> Unit,
    modifier: Modifier = Modifier
) {
    var passwordVisible by remember { mutableStateOf(false) }
    var showRawDiagnostics by remember { mutableStateOf(false) }

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Top Security & Target Header
        item {
            Spacer(modifier = Modifier.height(4.dp))
            Card(
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.primaryContainer
                ),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(48.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .background(MaterialTheme.colorScheme.primary),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Router,
                            contentDescription = "ONT Router",
                            tint = MaterialTheme.colorScheme.onPrimary,
                            modifier = Modifier.size(28.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(14.dp))
                    Column {
                        Text(
                            text = "Huawei EchoLife HS8145C5",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onPrimaryContainer
                        )
                        Text(
                            text = "Recognized Interface: Home Page • One-Click Diagnosis • System Information • Advanced",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.9f)
                        )
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.Security,
                                contentDescription = "Local Only",
                                tint = MaterialTheme.colorScheme.tertiary,
                                modifier = Modifier.size(14.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = "Local LAN Only • Zero Cloud Transmission",
                                style = MaterialTheme.typography.labelSmall,
                                color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.8f)
                            )
                        }
                    }
                }
            }
        }

        // Configuration Card (IP, Username, Password, Actions)
        item {
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "Router Local Management Settings",
                        style = MaterialTheme.typography.titleSmall,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Spacer(modifier = Modifier.height(8.dp))

                    // Preset IP Chips
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        OutlinedButton(
                            onClick = { onIpChange("192.168.100.1") },
                            modifier = Modifier.height(32.dp),
                            contentPadding = androidx.compose.foundation.layout.PaddingValues(horizontal = 8.dp, vertical = 2.dp)
                        ) {
                            Text("192.168.100.1 (Screenshot)", fontSize = 11.sp, fontWeight = if (uiState.routerIp == "192.168.100.1") FontWeight.Bold else FontWeight.Normal)
                        }
                        OutlinedButton(
                            onClick = { onIpChange("192.168.1.1") },
                            modifier = Modifier.height(32.dp),
                            contentPadding = androidx.compose.foundation.layout.PaddingValues(horizontal = 8.dp, vertical = 2.dp)
                        ) {
                            Text("192.168.1.1", fontSize = 11.sp, fontWeight = if (uiState.routerIp == "192.168.1.1") FontWeight.Bold else FontWeight.Normal)
                        }
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    // Router IP Input
                    OutlinedTextField(
                        value = uiState.routerIp,
                        onValueChange = onIpChange,
                        label = { Text("Router IP") },
                        placeholder = { Text("192.168.100.1") },
                        singleLine = true,
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Ascii),
                        leadingIcon = {
                            Icon(Icons.Default.Router, contentDescription = null)
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("router_ip_input")
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    // Preset Username Chips
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        OutlinedButton(
                            onClick = { onUsernameChange("telecomadmin") },
                            modifier = Modifier.height(32.dp),
                            contentPadding = androidx.compose.foundation.layout.PaddingValues(horizontal = 8.dp, vertical = 2.dp)
                        ) {
                            Text("telecomadmin (Admin)", fontSize = 11.sp, fontWeight = if (uiState.usernameInput == "telecomadmin") FontWeight.Bold else FontWeight.Normal)
                        }
                        OutlinedButton(
                            onClick = { onUsernameChange("admin") },
                            modifier = Modifier.height(32.dp),
                            contentPadding = androidx.compose.foundation.layout.PaddingValues(horizontal = 8.dp, vertical = 2.dp)
                        ) {
                            Text("admin", fontSize = 11.sp)
                        }
                    }

                    Spacer(modifier = Modifier.height(6.dp))

                    // Username Input
                    OutlinedTextField(
                        value = uiState.usernameInput,
                        onValueChange = onUsernameChange,
                        label = { Text("Administrator Username") },
                        placeholder = { Text("telecomadmin") },
                        singleLine = true,
                        leadingIcon = {
                            Icon(Icons.Default.Lock, contentDescription = null)
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("username_input")
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    // Password Input (Secure password field)
                    OutlinedTextField(
                        value = uiState.passwordInput,
                        onValueChange = onPasswordChange,
                        label = { Text("Administrator Password") },
                        placeholder = { Text("Enter securely inside app") },
                        singleLine = true,
                        visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                        leadingIcon = {
                            Icon(Icons.Default.Key, contentDescription = null)
                        },
                        trailingIcon = {
                            IconButton(onClick = { passwordVisible = !passwordVisible }) {
                                Icon(
                                    imageVector = if (passwordVisible) Icons.Default.VisibilityOff else Icons.Default.Visibility,
                                    contentDescription = if (passwordVisible) "Hide password" else "Show password"
                                )
                            }
                        },
                        supportingText = {
                            Text(
                                text = "Protected by Android KeyStore AES-GCM. Never logged or transmitted outside.",
                                style = MaterialTheme.typography.labelSmall
                            )
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("password_input")
                    )

                    Spacer(modifier = Modifier.height(14.dp))

                    // Action Buttons
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Button(
                            onClick = onTestConnection,
                            enabled = !uiState.isTestingConnection && uiState.routerIp.isNotBlank(),
                            modifier = Modifier
                                .weight(1.4f)
                                .height(48.dp)
                                .testTag("test_router_connection_button")
                        ) {
                            if (uiState.isTestingConnection) {
                                CircularProgressIndicator(
                                    modifier = Modifier.size(20.dp),
                                    strokeWidth = 2.dp,
                                    color = MaterialTheme.colorScheme.onPrimary
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text("Probing...", fontSize = 13.sp)
                            } else {
                                Icon(Icons.Default.Refresh, contentDescription = null, modifier = Modifier.size(18.dp))
                                Spacer(modifier = Modifier.width(6.dp))
                                Text("TEST ROUTER CONNECTION", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                            }
                        }

                        OutlinedButton(
                            onClick = onSaveCredentials,
                            enabled = uiState.usernameInput.isNotBlank() && uiState.passwordInput.isNotBlank(),
                            modifier = Modifier
                                .weight(1f)
                                .height(48.dp)
                                .testTag("save_credentials_button")
                        ) {
                            Icon(Icons.Default.Save, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("Save", fontSize = 12.sp)
                        }

                        if (uiState.hasSavedCredentials) {
                            IconButton(
                                onClick = onClearCredentials,
                                modifier = Modifier
                                    .size(48.dp)
                                    .testTag("clear_credentials_button")
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Delete,
                                    contentDescription = "Clear Stored Credentials",
                                    tint = MaterialTheme.colorScheme.error
                                )
                            }
                        }
                    }
                }
            }
        }

        // Connection & Detection Overview Card
        item {
            val report = uiState.capabilityReport
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "Real Connection & Capability Status",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(12.dp))

                    // Row: Router Model
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "Router Model",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Text(
                            text = report?.routerModel ?: "Not Tested Yet",
                            style = MaterialTheme.typography.bodyMedium,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp))

                    // Row: Firmware Version
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "Firmware Version",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Text(
                            text = report?.firmwareVersion ?: "Unknown",
                            style = MaterialTheme.typography.bodyMedium,
                            fontWeight = FontWeight.SemiBold
                        )
                    }

                    HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp))

                    // Row: Authentication Status
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "Authentication Status",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        val authText = when (report?.authStatus) {
                            AuthStatus.SUCCESS -> "SUCCESS (Session Active)"
                            AuthStatus.FAILED_BAD_CREDENTIALS -> "FAILED (Bad Credentials)"
                            AuthStatus.FAILED_UNREACHABLE -> "UNREACHABLE"
                            AuthStatus.FAILED_TIMEOUT -> "TIMEOUT"
                            AuthStatus.CHALLENGE_REQUIRED -> "CHALLENGE REQUIRED"
                            null, AuthStatus.NOT_TESTED -> "NOT TESTED"
                        }
                        val authColor = when (report?.authStatus) {
                            AuthStatus.SUCCESS -> Color(0xFF10B981)
                            AuthStatus.FAILED_BAD_CREDENTIALS, AuthStatus.FAILED_UNREACHABLE -> Color(0xFFEF4444)
                            else -> MaterialTheme.colorScheme.onSurfaceVariant
                        }
                        Text(
                            text = authText,
                            style = MaterialTheme.typography.bodyMedium,
                            fontWeight = FontWeight.Bold,
                            color = authColor
                        )
                    }

                    HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp))

                    // Row: MAC Filtering Capability
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "MAC Filtering Capability",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        StatusBadge(status = report?.macFilteringCapability ?: RouterCapabilityStatus.UNKNOWN)
                    }

                    HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp))

                    // Row: Connected Device Capability
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "Connected Device Capability",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        StatusBadge(status = report?.connectedDeviceCapability ?: RouterCapabilityStatus.UNKNOWN)
                    }
                }
            }
        }

        // 9-Point Capability Checklist (Mandated by User Request)
        item {
            val report = uiState.capabilityReport
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "HS8145C5 Firmware Capability Audit",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = "9 Verification Points",
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.primary
                        )
                    }

                    Text(
                        text = "Real protocol detection — no mock answers or fake APIs.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.padding(top = 4.dp, bottom = 12.dp)
                    )

                    CapabilityItem(
                        index = 1,
                        title = "Authenticate an administrator",
                        status = report?.canAuthenticate ?: RouterCapabilityStatus.UNKNOWN,
                        description = "Web form / session cookie challenge"
                    )
                    CapabilityItem(
                        index = 2,
                        title = "Read connected Wi-Fi devices",
                        status = report?.canReadConnectedDevices ?: RouterCapabilityStatus.UNKNOWN,
                        description = "Station info / device table export"
                    )
                    CapabilityItem(
                        index = 3,
                        title = "Read MAC filtering configuration",
                        status = report?.canReadMacFilter ?: RouterCapabilityStatus.UNKNOWN,
                        description = "WLAN MAC filter table query"
                    )
                    CapabilityItem(
                        index = 4,
                        title = "Add a MAC address to blacklist",
                        status = report?.canAddBlacklist ?: RouterCapabilityStatus.UNKNOWN,
                        description = "Blacklist entry submission"
                    )
                    CapabilityItem(
                        index = 5,
                        title = "Remove a MAC address from blacklist",
                        status = report?.canRemoveBlacklist ?: RouterCapabilityStatus.UNKNOWN,
                        description = "Blacklist entry deletion"
                    )
                    CapabilityItem(
                        index = 6,
                        title = "Read whitelist configuration",
                        status = report?.canReadWhitelist ?: RouterCapabilityStatus.UNKNOWN,
                        description = "Whitelist table query"
                    )
                    CapabilityItem(
                        index = 7,
                        title = "Add a MAC address to whitelist",
                        status = report?.canAddWhitelist ?: RouterCapabilityStatus.UNKNOWN,
                        description = "Whitelist entry submission"
                    )
                    CapabilityItem(
                        index = 8,
                        title = "Remove a MAC address from whitelist",
                        status = report?.canRemoveWhitelist ?: RouterCapabilityStatus.UNKNOWN,
                        description = "Whitelist entry deletion"
                    )
                    CapabilityItem(
                        index = 9,
                        title = "Enable/disable MAC filtering or whitelist mode",
                        status = report?.canToggleFilterMode ?: RouterCapabilityStatus.UNKNOWN,
                        description = "Mode toggle (Allow-Only-Selected / Disabled)"
                    )
                }
            }
        }

        // Raw Probe Diagnostics (Inspection)
        item {
            val report = uiState.capabilityReport
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.BugReport,
                                contentDescription = null,
                                modifier = Modifier.size(18.dp),
                                tint = MaterialTheme.colorScheme.primary
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "Raw HTTP Diagnostics & Probing Log",
                                style = MaterialTheme.typography.titleSmall,
                                fontWeight = FontWeight.Bold
                            )
                        }
                        IconButton(onClick = { showRawDiagnostics = !showRawDiagnostics }) {
                            Icon(
                                imageVector = if (showRawDiagnostics) Icons.Default.VisibilityOff else Icons.Default.Visibility,
                                contentDescription = "Toggle logs"
                            )
                        }
                    }

                    AnimatedVisibility(visible = showRawDiagnostics) {
                        Column {
                            Spacer(modifier = Modifier.height(8.dp))
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(Color(0xFF0F172A))
                                    .padding(12.dp)
                            ) {
                                Text(
                                    text = if (report?.rawDiagnostics.isNullOrBlank()) {
                                        "No probe logs yet. Tap [TEST ROUTER CONNECTION] to inspect the local router HTTP interface."
                                    } else {
                                        report!!.rawDiagnostics
                                    },
                                    color = Color(0xFF38BDF8),
                                    fontSize = 11.sp,
                                    fontFamily = FontFamily.Monospace,
                                    lineHeight = 16.sp
                                )
                            }
                        }
                    }
                }
            }
            Spacer(modifier = Modifier.height(16.dp))
        }
    }
}
