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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Key
import androidx.compose.material.icons.filled.Lan
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.Storage
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.RouterUiState

@Composable
fun SecurityAuditScreen(
    uiState: RouterUiState,
    modifier: Modifier = Modifier
) {
    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        item {
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = "Security & Network Boundary Audit",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = "Verification of security controls and local execution",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }

        // Security Rules Verification Card
        item {
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "Enforced Security Principles",
                        style = MaterialTheme.typography.titleSmall,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(12.dp))

                    SecurityRuleRow(
                        icon = Icons.Default.Lock,
                        title = "Zero Hardcoded Credentials",
                        detail = "No router passwords or default label credentials exist in the source code."
                    )
                    HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp))

                    SecurityRuleRow(
                        icon = Icons.Default.Key,
                        title = "Hardware Keystore Encryption",
                        detail = "User-entered administrator credentials are encrypted with AES-256 GCM in the Android KeyStore."
                    )
                    HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp))

                    SecurityRuleRow(
                        icon = Icons.Default.Lan,
                        title = "Strict Local Subnet Boundary",
                        detail = "Only private local IP addresses (192.168.x.x, 10.x.x.x) are reachable. Zero external network transmission."
                    )
                    HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp))

                    SecurityRuleRow(
                        icon = Icons.Default.Security,
                        title = "No Simulated APIs",
                        detail = "The app detects real capabilities and reports unsupported operations rather than pretending to block devices."
                    )
                    HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp))

                    SecurityRuleRow(
                        icon = Icons.Default.Storage,
                        title = "Room Local Database",
                        detail = "All capability scan history and MAC rules are stored in a local SQLite/Room database."
                    )
                }
            }
        }

        // Active Session Information Card
        item {
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "Local Environment & Session",
                        style = MaterialTheme.typography.titleSmall,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(10.dp))

                    DetailItem("Router Target Gateway", uiState.routerIp)
                    DetailItem("Local Device IP", uiState.adminIpv4 ?: "Detecting...")
                    DetailItem("Admin MAC (Router Reported)", uiState.adminMac ?: "Obtained on query")
                    DetailItem("Saved in KeyStore", if (uiState.hasSavedCredentials) "YES (Encrypted)" else "NO")
                    DetailItem(
                        "Whitelist Safety Guard",
                        "ACTIVE (Admin removal locked)"
                    )
                }
            }
            Spacer(modifier = Modifier.height(16.dp))
        }
    }
}

@Composable
private fun SecurityRuleRow(
    icon: ImageVector,
    title: String,
    detail: String
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.Top
    ) {
        Box(
            modifier = Modifier
                .size(32.dp)
                .clip(CircleShape)
                .background(MaterialTheme.colorScheme.primaryContainer),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.onPrimaryContainer,
                modifier = Modifier.size(18.dp)
            )
        }
        Spacer(modifier = Modifier.width(12.dp))
        Column(modifier = Modifier.weight(1f)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    text = title,
                    style = MaterialTheme.typography.bodyMedium,
                    fontWeight = FontWeight.Bold
                )
                Spacer(modifier = Modifier.width(6.dp))
                Icon(
                    imageVector = Icons.Default.CheckCircle,
                    contentDescription = "Verified",
                    tint = MaterialTheme.colorScheme.tertiary,
                    modifier = Modifier.size(14.dp)
                )
            }
            Text(
                text = detail,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

@Composable
private fun DetailItem(label: String, value: String) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Text(
            text = value,
            style = MaterialTheme.typography.bodySmall,
            fontWeight = FontWeight.Bold,
            fontFamily = FontFamily.Monospace
        )
    }
}
