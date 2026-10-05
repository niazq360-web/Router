package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Help
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
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
import com.example.model.RouterCapabilityStatus
import com.example.service.RouterService
import com.example.ui.theme.StatusNotSupported
import com.example.ui.theme.StatusSupported
import com.example.ui.theme.StatusUnknown

@Composable
fun StatusBadge(
    status: RouterCapabilityStatus,
    modifier: Modifier = Modifier
) {
    val (bgColor, textColor, text, icon) = when (status) {
        RouterCapabilityStatus.SUPPORTED -> Quadruple(
            StatusSupported.copy(alpha = 0.15f),
            StatusSupported,
            "SUPPORTED",
            Icons.Default.CheckCircle
        )
        RouterCapabilityStatus.NOT_SUPPORTED -> Quadruple(
            StatusNotSupported.copy(alpha = 0.15f),
            StatusNotSupported,
            "NOT SUPPORTED",
            Icons.Default.Close
        )
        RouterCapabilityStatus.UNKNOWN -> Quadruple(
            StatusUnknown.copy(alpha = 0.15f),
            StatusUnknown,
            "UNKNOWN",
            Icons.Default.Help
        )
    }

    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = modifier
            .clip(RoundedCornerShape(20.dp))
            .background(bgColor)
            .border(1.dp, textColor.copy(alpha = 0.4f), RoundedCornerShape(20.dp))
            .padding(horizontal = 10.dp, vertical = 4.dp)
    ) {
        Icon(
            imageVector = icon,
            contentDescription = text,
            tint = textColor,
            modifier = Modifier.size(14.dp)
        )
        Spacer(modifier = Modifier.width(4.dp))
        Text(
            text = text,
            color = textColor,
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold
        )
    }
}

private data class Quadruple<A, B, C, D>(val first: A, val second: B, val third: C, val fourth: D)

@Composable
fun CapabilityItem(
    index: Int,
    title: String,
    status: RouterCapabilityStatus,
    description: String? = null
) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 6.dp)
    ) {
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier
                .size(24.dp)
                .clip(CircleShape)
                .background(MaterialTheme.colorScheme.primaryContainer)
        ) {
            Text(
                text = "$index",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onPrimaryContainer
            )
        }
        Spacer(modifier = Modifier.width(10.dp))
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = title,
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.Medium
            )
            if (description != null) {
                Text(
                    text = description,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
        Spacer(modifier = Modifier.width(8.dp))
        StatusBadge(status = status)
    }
}

@Composable
fun StatusBanner(
    message: String,
    isError: Boolean,
    onDismiss: () -> Unit,
    modifier: Modifier = Modifier
) {
    val bgColor = if (isError) MaterialTheme.colorScheme.errorContainer else MaterialTheme.colorScheme.primaryContainer
    val contentColor = if (isError) MaterialTheme.colorScheme.onErrorContainer else MaterialTheme.colorScheme.onPrimaryContainer

    Card(
        colors = CardDefaults.cardColors(containerColor = bgColor),
        shape = RoundedCornerShape(12.dp),
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 6.dp)
            .testTag("status_banner")
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.padding(12.dp)
        ) {
            Icon(
                imageVector = if (isError) Icons.Default.Warning else Icons.Default.Info,
                contentDescription = if (isError) "Warning" else "Information",
                tint = contentColor,
                modifier = Modifier.size(22.dp)
            )
            Spacer(modifier = Modifier.width(10.dp))
            Text(
                text = message,
                color = contentColor,
                style = MaterialTheme.typography.bodySmall,
                fontWeight = FontWeight.Medium,
                modifier = Modifier.weight(1f)
            )
            IconButton(
                onClick = onDismiss,
                modifier = Modifier.size(24.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.Close,
                    contentDescription = "Dismiss",
                    tint = contentColor,
                    modifier = Modifier.size(16.dp)
                )
            }
        }
    }
}

@Composable
fun MacInputDialog(
    title: String,
    confirmButtonText: String,
    initialMac: String = "",
    initialName: String = "",
    onDismiss: () -> Unit,
    onConfirm: (mac: String, name: String) -> Unit
) {
    var macInput by remember { mutableStateOf(initialMac) }
    var nameInput by remember { mutableStateOf(initialName) }
    var errorText by remember { mutableStateOf<String?>(null) }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text(title, fontWeight = FontWeight.Bold) },
        text = {
            Column {
                OutlinedTextField(
                    value = macInput,
                    onValueChange = {
                        macInput = it
                        errorText = null
                    },
                    label = { Text("MAC Address (e.g. AA:BB:CC:DD:EE:FF)") },
                    singleLine = true,
                    isError = errorText != null,
                    supportingText = {
                        if (errorText != null) {
                            Text(errorText!!, color = MaterialTheme.colorScheme.error)
                        } else {
                            Text("Use standard colon or hyphen separated format")
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("mac_address_input")
                )
                Spacer(modifier = Modifier.size(8.dp))
                OutlinedTextField(
                    value = nameInput,
                    onValueChange = { nameInput = it },
                    label = { Text("Device Label (Optional)") },
                    singleLine = true,
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("device_label_input")
                )
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    val trimmed = macInput.trim()
                    if (RouterService.MAC_PATTERN.matcher(trimmed).matches()) {
                        onConfirm(trimmed.uppercase(), nameInput.trim())
                    } else {
                        errorText = "Invalid format. Expected: XX:XX:XX:XX:XX:XX"
                    }
                },
                modifier = Modifier.testTag("dialog_confirm_button")
            ) {
                Text(confirmButtonText)
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel")
            }
        }
    )
}

@Composable
fun SafetyWarningDialog(
    adminIpv4: String?,
    adminMac: String?,
    onDismiss: () -> Unit,
    onConfirm: () -> Unit
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        icon = {
            Icon(
                imageVector = Icons.Default.Warning,
                contentDescription = "Safety Alert",
                tint = MaterialTheme.colorScheme.error,
                modifier = Modifier.size(36.dp)
            )
        },
        title = {
            Text(
                "CRITICAL SAFETY WARNING",
                color = MaterialTheme.colorScheme.error,
                fontWeight = FontWeight.Bold
            )
        },
        text = {
            Column {
                Text(
                    text = "Enabling Whitelist Mode (Allow-Only-Selected-Devices) immediately disconnects every device not explicitly in the whitelist.",
                    style = MaterialTheme.typography.bodyMedium,
                    fontWeight = FontWeight.Medium
                )
                Spacer(modifier = Modifier.size(10.dp))
                Card(
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Column(modifier = Modifier.padding(10.dp)) {
                        Text(
                            text = "Admin Device Safeguard:",
                            style = MaterialTheme.typography.labelMedium,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = "Current LAN IP: ${adminIpv4 ?: "Detecting..."}",
                            style = MaterialTheme.typography.bodySmall,
                            fontFamily = FontFamily.Monospace
                        )
                        Text(
                            text = "Admin MAC: ${adminMac ?: "Obtained via router device table"}",
                            style = MaterialTheme.typography.bodySmall,
                            fontFamily = FontFamily.Monospace
                        )
                        Text(
                            text = "• The system will never automatically remove the administrator device from the whitelist.",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.primary,
                            fontWeight = FontWeight.SemiBold,
                            modifier = Modifier.padding(top = 4.dp)
                        )
                    }
                }
                Spacer(modifier = Modifier.size(10.dp))
                Text(
                    text = "Are you certain you wish to enable Whitelist Mode on the Huawei HS8145C5 ONT?",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        },
        confirmButton = {
            Button(
                onClick = onConfirm,
                colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error),
                modifier = Modifier.testTag("safety_confirm_button")
            ) {
                Text("Confirm & Enable Whitelist")
            }
        },
        dismissButton = {
            OutlinedButton(onClick = onDismiss) {
                Text("Cancel")
            }
        }
    )
}
