package com.example.ui.screens

import android.annotation.SuppressLint
import android.graphics.Bitmap
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.compose.foundation.background
import androidx.compose.foundation.horizontalScroll
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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material.icons.filled.FilterAlt
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.MedicalServices
import androidx.compose.material.icons.filled.OpenInBrowser
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Router
import androidx.compose.material.icons.filled.Tune
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material.icons.filled.Wifi
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
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
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import com.example.ui.RouterUiState

data class RouterShortcut(
    val title: String,
    val path: String,
    val icon: ImageVector,
    val category: String
)

@SuppressLint("SetJavaScriptEnabled")
@Composable
fun RouterWebConsoleScreen(
    uiState: RouterUiState,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val baseUrl = "http://${uiState.routerIp.trim()}"

    val shortcuts = remember(baseUrl) {
        listOf(
            RouterShortcut("Home Page", "/index.asp", Icons.Default.Home, "Overview"),
            RouterShortcut("One-Click Diagnosis", "/html/bbsp/maintenance/diagnose.asp", Icons.Default.MedicalServices, "Tools"),
            RouterShortcut("System Info", "/html/bbsp/systeminfo/deviceinfo.asp", Icons.Default.Info, "Status"),
            RouterShortcut("WLAN MAC Filter", "/html/bbsp/wlanmacfilter/wlanmacfilter.asp", Icons.Default.FilterAlt, "Advanced"),
            RouterShortcut("Connected Devices", "/html/bbsp/userdevinfo/userdevinfo.asp", Icons.Default.Wifi, "Advanced"),
            RouterShortcut("Advanced Settings", "/html/bbsp/common/managemode.asp", Icons.Default.Tune, "Advanced")
        )
    }

    var currentPath by remember { mutableStateOf("/index.asp") }
    var webViewInstance by remember { mutableStateOf<WebView?>(null) }
    var isLoading by remember { mutableStateOf(false) }
    var loadError by remember { mutableStateOf<String?>(null) }
    var pageTitle by remember { mutableStateOf("Huawei HS8145C5 Console") }

    Column(modifier = modifier.fillMaxSize()) {
        // Quick Jump Bar matching the menu structure in screenshot
        Surface(
            color = MaterialTheme.colorScheme.surfaceVariant,
            tonalElevation = 2.dp,
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(vertical = 8.dp)) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(10.dp)
                                .clip(RoundedCornerShape(5.dp))
                                .background(Color(0xFF0284C7))
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "HS8145C5 Web Console",
                            style = MaterialTheme.typography.labelLarge,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    // Navigation Controls
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        IconButton(
                            onClick = { webViewInstance?.goBack() },
                            enabled = webViewInstance?.canGoBack() == true,
                            modifier = Modifier.size(32.dp)
                        ) {
                            Icon(Icons.Default.ArrowBack, contentDescription = "Back", modifier = Modifier.size(16.dp))
                        }
                        IconButton(
                            onClick = { webViewInstance?.goForward() },
                            enabled = webViewInstance?.canGoForward() == true,
                            modifier = Modifier.size(32.dp)
                        ) {
                            Icon(Icons.Default.ArrowForward, contentDescription = "Forward", modifier = Modifier.size(16.dp))
                        }
                        IconButton(
                            onClick = { webViewInstance?.reload() },
                            modifier = Modifier.size(32.dp)
                        ) {
                            Icon(Icons.Default.Refresh, contentDescription = "Reload", modifier = Modifier.size(16.dp))
                        }
                    }
                }

                // Shortcuts matching the screenshot menu
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .horizontalScroll(rememberScrollState())
                        .padding(horizontal = 12.dp, vertical = 4.dp),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    shortcuts.forEach { shortcut ->
                        val isSelected = currentPath == shortcut.path
                        FilterChip(
                            selected = isSelected,
                            onClick = {
                                currentPath = shortcut.path
                                loadError = null
                                webViewInstance?.loadUrl("$baseUrl${shortcut.path}")
                            },
                            label = { Text(shortcut.title, fontSize = 11.sp) },
                            leadingIcon = {
                                Icon(
                                    imageVector = shortcut.icon,
                                    contentDescription = null,
                                    modifier = Modifier.size(14.dp)
                                )
                            },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = MaterialTheme.colorScheme.primaryContainer,
                                selectedLabelColor = MaterialTheme.colorScheme.onPrimaryContainer
                            )
                        )
                    }
                }

                // Current URL bar
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 12.dp, vertical = 2.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "$baseUrl$currentPath",
                        style = MaterialTheme.typography.labelSmall,
                        fontFamily = FontFamily.Monospace,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }

        if (isLoading) {
            LinearProgressIndicator(modifier = Modifier.fillMaxWidth())
        }

        if (loadError != null) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(24.dp),
                contentAlignment = Alignment.Center
            ) {
                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.errorContainer),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.padding(20.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Icon(
                            imageVector = Icons.Default.Warning,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.onErrorContainer,
                            modifier = Modifier.size(48.dp)
                        )
                        Spacer(modifier = Modifier.height(12.dp))
                        Text(
                            text = "Cannot Connect to HS8145C5 Console",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onErrorContainer
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = "Target: $baseUrl$currentPath\nError: $loadError\n\nPlease ensure your device is connected to the router's local Wi-Fi network and verify the router IP (192.168.100.1 / 192.168.1.1).",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onErrorContainer.copy(alpha = 0.9f)
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Button(
                            onClick = {
                                loadError = null
                                webViewInstance?.loadUrl("$baseUrl$currentPath")
                            }
                        ) {
                            Text("Retry Connection")
                        }
                    }
                }
            }
        } else {
            AndroidView(
                factory = { ctx ->
                    WebView(ctx).apply {
                        settings.javaScriptEnabled = true
                        settings.domStorageEnabled = true
                        settings.loadWithOverviewMode = true
                        settings.useWideViewPort = true
                        settings.builtInZoomControls = true
                        settings.displayZoomControls = false
                        settings.cacheMode = WebSettings.LOAD_DEFAULT

                        webViewClient = object : WebViewClient() {
                            override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                                isLoading = true
                                loadError = null
                            }

                            override fun onPageFinished(view: WebView?, url: String?) {
                                isLoading = false
                                if (url != null) {
                                    val relative = url.removePrefix(baseUrl)
                                    if (relative.isNotBlank()) currentPath = relative
                                }
                                pageTitle = view?.title ?: "HS8145C5"
                            }

                            override fun onReceivedError(
                                view: WebView?,
                                request: WebResourceRequest?,
                                error: WebResourceError?
                            ) {
                                if (request?.isForMainFrame == true) {
                                    isLoading = false
                                    loadError = error?.description?.toString() ?: "Connection failed"
                                }
                            }
                        }
                        webViewInstance = this
                        loadUrl("$baseUrl$currentPath")
                    }
                },
                update = { webView ->
                    webViewInstance = webView
                },
                modifier = Modifier
                    .fillMaxSize()
                    .testTag("router_web_console_view")
            )
        }
    }
}
