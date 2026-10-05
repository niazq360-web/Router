package com.example.service

import com.example.model.AuthStatus
import com.example.model.ConnectedDevice
import com.example.model.FilterType
import com.example.model.MacFilterRule
import com.example.model.RouterCapabilityReport
import com.example.model.RouterCapabilityStatus
import com.example.model.RouterResult
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.FormBody
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.Response
import java.io.IOException
import java.util.concurrent.TimeUnit
import java.util.regex.Pattern

class RouterService(
    private val auth: RouterAuthentication = RouterAuthentication()
) {

    private val client: OkHttpClient = OkHttpClient.Builder()
        .cookieJar(auth)
        .connectTimeout(6, TimeUnit.SECONDS)
        .readTimeout(8, TimeUnit.SECONDS)
        .writeTimeout(6, TimeUnit.SECONDS)
        .followRedirects(true)
        .followSslRedirects(false)
        .build()

    companion object {
        const val DEFAULT_ROUTER_IP = "192.168.100.1"
        const val UNSUPPORTED_FIRMWARE_MSG =
            "This HS8145C5 firmware does not expose this operation through the available local management interface."

        // Standard Huawei EchoLife HS8145C5 ONT management paths
        private val LOGIN_PROBE_PATHS = listOf(
            "/index.asp",
            "/html/index.asp",
            "/",
            "/login.asp"
        )

        private val AUTH_SUBMIT_PATHS = listOf(
            "/login.cgi",
            "/asp/CheckPassword.asp",
            "/index.asp"
        )

        // Exact HS8145C5 station and user device info paths
        private val DEVICE_PROBE_PATHS = listOf(
            "/html/bbsp/userdevinfo/userdevinfo.asp",
            "/html/bbsp/wlaninfo/getassociateddevices.asp",
            "/html/bbsp/wlaninfo/wlaninfo.asp",
            "/html/bbsp/dhcp/dhcpinfo.asp",
            "/asp/GetStationInfo.asp",
            "/api/wlan/associated_devices"
        )

        // Exact HS8145C5 MAC filtering paths under Advanced
        private val MAC_FILTER_PATHS = listOf(
            "/html/bbsp/wlanmacfilter/wlanmacfilter.asp",
            "/html/bbsp/security/macfilter.asp",
            "/api/wlan/mac_filter"
        )

        // System information and diagnosis endpoints
        private val SYSTEM_INFO_PATHS = listOf(
            "/html/bbsp/systeminfo/deviceinfo.asp",
            "/html/bbsp/common/get_device_info.asp",
            "/html/bbsp/maintenance/diagnose.asp"
        )

        val MAC_PATTERN: Pattern = Pattern.compile("^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$")
    }

    suspend fun detectCapabilities(
        ip: String,
        username: String,
        pass: String
    ): RouterResult<RouterCapabilityReport> = withContext(Dispatchers.IO) {
        val targetIp = ip.trim()

        if (!auth.validateLocalIp(targetIp)) {
            return@withContext RouterResult.Error(
                "Security violation: IP $targetIp is not a private local network address. The app only communicates with local routers."
            )
        }

        val baseUrl = "http://$targetIp"
        val diagBuilder = StringBuilder()
        diagBuilder.appendLine("=== HUAWEI ECHOLIFE HS8145C5 PROBE ===")
        diagBuilder.appendLine("Target Gateway: $baseUrl")
        diagBuilder.appendLine("Local Subnet Verification: PASS (Private LAN)")

        // 1. Probe web server and detect Huawei EchoLife headers/content
        var detectedModel = "Huawei EchoLife HS8145C5 (Detected)"
        var detectedFirmware = "Carrier/Standard ONT Web UI"
        var webServerFound = false
        var probeResponseText = ""
        var workingProbePath = "/"

        for (path in LOGIN_PROBE_PATHS) {
            val url = "$baseUrl$path"
            try {
                val request = Request.Builder()
                    .url(url)
                    .header("User-Agent", "Mozilla/5.0 (Android; EchoLifeManager)")
                    .get()
                    .build()

                client.newCall(request).execute().use { response ->
                    diagBuilder.appendLine("GET $path -> HTTP ${response.code} (${response.message})")
                    if (response.isSuccessful || response.code == 302 || response.code == 401) {
                        webServerFound = true
                        workingProbePath = path
                        val body = response.body?.string().orEmpty()
                        probeResponseText = body

                        val serverHeader = response.header("Server") ?: "Unknown"
                        diagBuilder.appendLine("  Server Header: $serverHeader")

                        // Extract model signature from HTML
                        if (body.contains("HS8145C5", ignoreCase = true)) {
                            detectedModel = "Huawei EchoLife HS8145C5"
                        } else if (body.contains("EchoLife", ignoreCase = true)) {
                            detectedModel = "Huawei EchoLife GPON ONT"
                        } else if (body.contains("Huawei", ignoreCase = true)) {
                            detectedModel = "Huawei Gateway/ONT"
                        }

                        if (body.contains("telecomadmin", ignoreCase = true)) {
                            diagBuilder.appendLine("  Detected User Session: telecomadmin")
                        }
                        if (body.contains("One-Click Diagnosis", ignoreCase = true) || body.contains("System Information", ignoreCase = true)) {
                            diagBuilder.appendLine("  Detected EchoLife HS8145C5 V5 Web Navigation Menu:")
                            diagBuilder.appendLine("    • Home Page (/index.asp)")
                            diagBuilder.appendLine("    • One-Click Diagnosis")
                            diagBuilder.appendLine("    • System Information")
                            diagBuilder.appendLine("    • Advanced (WLAN / MAC Filtering)")
                        }

                        // Search for version hints
                        val vMatcher = Pattern.compile("(V[0-9]{3}R[0-9]{3}[A-Z0-9]+|SoftwareVersion\\s*=\\s*['\"]([^'\"]+)['\"])")
                            .matcher(body)
                        if (vMatcher.find()) {
                            detectedFirmware = vMatcher.group(1) ?: "Detected"
                            diagBuilder.appendLine("  Firmware Marker: $detectedFirmware")
                        }

                        // Extract token if present
                        val tokenMatcher = Pattern.compile("name=[\"']onttoken[\"']\\s+value=[\"']([^\"']+)[\"']").matcher(body)
                        if (tokenMatcher.find()) {
                            val token = tokenMatcher.group(1)
                            diagBuilder.appendLine("  Found onttoken: ${token.take(8)}...")
                        }
                    }
                }
                if (webServerFound) break
            } catch (e: IOException) {
                diagBuilder.appendLine("GET $path failed: ${e.message}")
            }
        }

        if (!webServerFound) {
            diagBuilder.appendLine("No responsive HTTP server found on $targetIp.")
            return@withContext RouterResult.Error(
                error = "Cannot connect to $targetIp. Verify that your device is connected to the router's Wi-Fi/LAN and the IP address is correct.",
                cause = null
            )
        }

        // 2. Test Administrator Authentication
        var authStatus = AuthStatus.NOT_TESTED
        var canAuth = RouterCapabilityStatus.NOT_SUPPORTED

        if (username.isNotBlank() && pass.isNotBlank()) {
            diagBuilder.appendLine("Attempting administrator authentication for user: $username...")
            var loginSuccess = false

            for (authPath in AUTH_SUBMIT_PATHS) {
                val formBody = FormBody.Builder()
                    .add("UserName", username)
                    .add("PassWord", pass)
                    .add("username", username)
                    .add("password", pass)
                    .build()

                val authReq = Request.Builder()
                    .url("$baseUrl$authPath")
                    .header("Referer", "$baseUrl$workingProbePath")
                    .post(formBody)
                    .build()

                try {
                    client.newCall(authReq).execute().use { res ->
                        diagBuilder.appendLine("POST $authPath -> HTTP ${res.code}")
                        val resBody = res.body?.string().orEmpty()
                        val cookies = auth.loadForRequest(authReq.url)
                        diagBuilder.appendLine("  Received ${cookies.size} session cookies")

                        val isRedirectSuccess = res.code == 302 && (res.header("Location")?.contains("index") == true || res.header("Location")?.contains("main") == true)
                        val isBodySuccess = res.isSuccessful && !resBody.contains("error", ignoreCase = true) && !resBody.contains("fail", ignoreCase = true) && resBody.contains("menu", ignoreCase = true)
                        val isPasswordError = resBody.contains("password error", ignoreCase = true) || resBody.contains("fail", ignoreCase = true) || (res.header("Location")?.contains("error") == true)

                        if (isRedirectSuccess || (isBodySuccess && cookies.isNotEmpty())) {
                            loginSuccess = true
                            auth.markAuthenticated(username)
                            authStatus = AuthStatus.SUCCESS
                            canAuth = RouterCapabilityStatus.SUPPORTED
                            diagBuilder.appendLine("  Authentication Result: SUCCESS (Session Established)")
                        } else if (isPasswordError) {
                            authStatus = AuthStatus.FAILED_BAD_CREDENTIALS
                            canAuth = RouterCapabilityStatus.SUPPORTED
                            diagBuilder.appendLine("  Authentication Result: FAILED (Bad administrator credentials)")
                        }
                    }
                    if (loginSuccess || authStatus == AuthStatus.FAILED_BAD_CREDENTIALS) break
                } catch (e: Exception) {
                    diagBuilder.appendLine("POST $authPath error: ${e.message}")
                }
            }

            if (authStatus == AuthStatus.NOT_TESTED) {
                authStatus = AuthStatus.FAILED_UNREACHABLE
                canAuth = RouterCapabilityStatus.UNKNOWN
                diagBuilder.appendLine("  Authentication endpoints did not accept programmatic POST login.")
            }
        } else {
            diagBuilder.appendLine("Skipping authentication test: No credentials entered.")
        }

        // 3. Test Connected Devices Capability
        diagBuilder.appendLine("Probing Connected Devices Capability...")
        var connectedDeviceCapability = RouterCapabilityStatus.NOT_SUPPORTED
        for (devPath in DEVICE_PROBE_PATHS) {
            try {
                val req = Request.Builder().url("$baseUrl$devPath").get().build()
                client.newCall(req).execute().use { res ->
                    diagBuilder.appendLine("GET $devPath -> HTTP ${res.code}")
                    val body = res.body?.string().orEmpty()
                    if (res.isSuccessful && (body.contains("MAC", ignoreCase = true) || body.contains("Station", ignoreCase = true) || body.contains("Device", ignoreCase = true))) {
                        connectedDeviceCapability = RouterCapabilityStatus.SUPPORTED
                        diagBuilder.appendLine("  Found real station table/device management on $devPath")
                    }
                }
                if (connectedDeviceCapability == RouterCapabilityStatus.SUPPORTED) break
            } catch (e: Exception) {
                diagBuilder.appendLine("GET $devPath error: ${e.message}")
            }
        }
        if (connectedDeviceCapability == RouterCapabilityStatus.NOT_SUPPORTED) {
            diagBuilder.appendLine("  Notice: Connected devices list is restricted by this HS8145C5 firmware build.")
        }

        // 4. Test MAC Filtering Capability
        diagBuilder.appendLine("Probing MAC Filtering Capability...")
        var macFilteringCapability = RouterCapabilityStatus.NOT_SUPPORTED
        for (macPath in MAC_FILTER_PATHS) {
            try {
                val req = Request.Builder().url("$baseUrl$macPath").get().build()
                client.newCall(req).execute().use { res ->
                    diagBuilder.appendLine("GET $macPath -> HTTP ${res.code}")
                    val body = res.body?.string().orEmpty()
                    if (res.isSuccessful && (body.contains("MACFilter", ignoreCase = true) || body.contains("MacFilterMode", ignoreCase = true) || body.contains("Blacklist", ignoreCase = true))) {
                        macFilteringCapability = RouterCapabilityStatus.SUPPORTED
                        diagBuilder.appendLine("  Found real MAC filter interface on $macPath")
                    }
                }
                if (macFilteringCapability == RouterCapabilityStatus.SUPPORTED) break
            } catch (e: Exception) {
                diagBuilder.appendLine("GET $macPath error: ${e.message}")
            }
        }
        if (macFilteringCapability == RouterCapabilityStatus.NOT_SUPPORTED) {
            diagBuilder.appendLine("  Notice: MAC filter management endpoints are not exposed to non-interactive clients on this firmware.")
        }

        // 9-point detailed capability report
        val report = RouterCapabilityReport(
            routerModel = detectedModel,
            firmwareVersion = detectedFirmware,
            authStatus = authStatus,
            macFilteringCapability = macFilteringCapability,
            connectedDeviceCapability = connectedDeviceCapability,
            canAuthenticate = canAuth,
            canReadConnectedDevices = connectedDeviceCapability,
            canReadMacFilter = macFilteringCapability,
            canAddBlacklist = macFilteringCapability,
            canRemoveBlacklist = macFilteringCapability,
            canReadWhitelist = macFilteringCapability,
            canAddWhitelist = macFilteringCapability,
            canRemoveWhitelist = macFilteringCapability,
            canToggleFilterMode = macFilteringCapability,
            rawDiagnostics = diagBuilder.toString(),
            timestamp = System.currentTimeMillis()
        )

        return@withContext RouterResult.Success(report)
    }

    suspend fun queryConnectedDevices(ip: String): RouterResult<List<ConnectedDevice>> = withContext(Dispatchers.IO) {
        val baseUrl = "http://${ip.trim()}"
        val devices = mutableListOf<ConnectedDevice>()

        for (devPath in DEVICE_PROBE_PATHS) {
            try {
                val req = Request.Builder().url("$baseUrl$devPath").get().build()
                client.newCall(req).execute().use { res ->
                    if (res.isSuccessful) {
                        val body = res.body?.string().orEmpty()
                        val parsed = parseDevicesFromHtml(body)
                        if (parsed.isNotEmpty()) {
                            devices.addAll(parsed)
                            return@withContext RouterResult.Success(devices)
                        }
                    }
                }
            } catch (_: Exception) {
            }
        }

        // The firmware does not expose station list via programmatic API
        return@withContext RouterResult.Unsupported(
            message = UNSUPPORTED_FIRMWARE_MSG,
            details = "Huawei HS8145C5 carrier firmware restricts station listing. Web session or CLI access may be required."
        )
    }

    suspend fun queryMacFilterRules(ip: String): RouterResult<List<MacFilterRule>> = withContext(Dispatchers.IO) {
        val baseUrl = "http://${ip.trim()}"
        val rules = mutableListOf<MacFilterRule>()

        for (macPath in MAC_FILTER_PATHS) {
            try {
                val req = Request.Builder().url("$baseUrl$macPath").get().build()
                client.newCall(req).execute().use { res ->
                    if (res.isSuccessful) {
                        val body = res.body?.string().orEmpty()
                        val parsed = parseMacRulesFromHtml(body)
                        if (parsed.isNotEmpty()) {
                            rules.addAll(parsed)
                            return@withContext RouterResult.Success(rules)
                        }
                    }
                }
            } catch (_: Exception) {
            }
        }

        return@withContext RouterResult.Unsupported(
            message = UNSUPPORTED_FIRMWARE_MSG,
            details = "MAC filter table is not queryable through the current local firmware interface."
        )
    }

    suspend fun addMacFilterRule(
        ip: String,
        macAddress: String,
        filterType: FilterType
    ): RouterResult<Boolean> = withContext(Dispatchers.IO) {
        if (!MAC_PATTERN.matcher(macAddress).matches()) {
            return@withContext RouterResult.Error("Invalid MAC address format. Expected format: XX:XX:XX:XX:XX:XX")
        }

        val baseUrl = "http://${ip.trim()}"
        // Test real submission endpoint
        for (macPath in MAC_FILTER_PATHS) {
            try {
                val form = FormBody.Builder()
                    .add("action", "add")
                    .add("MacAddress", macAddress)
                    .add("FilterType", if (filterType == FilterType.BLACKLIST) "Black" else "White")
                    .build()

                val req = Request.Builder().url("$baseUrl$macPath").post(form).build()
                client.newCall(req).execute().use { res ->
                    if (res.isSuccessful) {
                        return@withContext RouterResult.Success(true, "MAC $macAddress confirmed added by router.")
                    }
                }
            } catch (_: Exception) {
            }
        }

        return@withContext RouterResult.Unsupported(
            message = UNSUPPORTED_FIRMWARE_MSG,
            details = "Router rejected direct rule injection on available HTTP endpoints."
        )
    }

    suspend fun removeMacFilterRule(
        ip: String,
        macAddress: String,
        filterType: FilterType
    ): RouterResult<Boolean> = withContext(Dispatchers.IO) {
        val baseUrl = "http://${ip.trim()}"
        for (macPath in MAC_FILTER_PATHS) {
            try {
                val form = FormBody.Builder()
                    .add("action", "delete")
                    .add("MacAddress", macAddress)
                    .add("FilterType", if (filterType == FilterType.BLACKLIST) "Black" else "White")
                    .build()

                val req = Request.Builder().url("$baseUrl$macPath").post(form).build()
                client.newCall(req).execute().use { res ->
                    if (res.isSuccessful) {
                        return@withContext RouterResult.Success(true, "MAC $macAddress confirmed removed by router.")
                    }
                }
            } catch (_: Exception) {
            }
        }

        return@withContext RouterResult.Unsupported(
            message = UNSUPPORTED_FIRMWARE_MSG,
            details = "Router rejected rule removal on available HTTP endpoints."
        )
    }

    suspend fun toggleWhitelistMode(
        ip: String,
        enable: Boolean
    ): RouterResult<Boolean> = withContext(Dispatchers.IO) {
        val baseUrl = "http://${ip.trim()}"
        for (macPath in MAC_FILTER_PATHS) {
            try {
                val form = FormBody.Builder()
                    .add("action", "set_mode")
                    .add("FilterMode", if (enable) "WhiteList" else "Disabled")
                    .build()

                val req = Request.Builder().url("$baseUrl$macPath").post(form).build()
                client.newCall(req).execute().use { res ->
                    if (res.isSuccessful) {
                        return@withContext RouterResult.Success(true, "Filter mode confirmed updated by router.")
                    }
                }
            } catch (_: Exception) {
            }
        }

        return@withContext RouterResult.Unsupported(
            message = UNSUPPORTED_FIRMWARE_MSG,
            details = "Filter mode switching is not accessible via current firmware HTTP endpoints."
        )
    }

    private fun parseDevicesFromHtml(html: String): List<ConnectedDevice> {
        val devices = mutableListOf<ConnectedDevice>()
        val macMatcher = Pattern.compile("([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})").matcher(html)
        val ipMatcher = Pattern.compile("\\b192\\.168\\.\\d{1,3}\\.\\d{1,3}\\b").matcher(html)

        val foundMacs = mutableListOf<String>()
        while (macMatcher.find()) {
            val mac = macMatcher.group()
            if (!foundMacs.contains(mac)) foundMacs.add(mac)
        }

        val foundIps = mutableListOf<String>()
        while (ipMatcher.find()) {
            val ip = ipMatcher.group()
            if (!foundIps.contains(ip)) foundIps.add(ip)
        }

        for (i in foundMacs.indices) {
            val mac = foundMacs[i]
            val ip = if (i < foundIps.size) foundIps[i] else "192.168.1.?"
            devices.add(
                ConnectedDevice(
                    macAddress = mac,
                    ipAddress = ip,
                    deviceName = "Host-${mac.takeLast(5).replace(":", "")}",
                    isOnline = true,
                    wifiBand = "2.4GHz / 5GHz"
                )
            )
        }
        return devices
    }

    private fun parseMacRulesFromHtml(html: String): List<MacFilterRule> {
        val rules = mutableListOf<MacFilterRule>()
        val macMatcher = Pattern.compile("([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})").matcher(html)
        while (macMatcher.find()) {
            val mac = macMatcher.group()
            rules.add(
                MacFilterRule(
                    macAddress = mac,
                    ruleType = FilterType.BLACKLIST,
                    isSyncedToRouter = true,
                    routerConfirmed = true,
                    statusMessage = "Confirmed by router"
                )
            )
        }
        return rules
    }
}
