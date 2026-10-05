package com.example.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey
import com.example.model.AuthStatus
import com.example.model.RouterCapabilityReport
import com.example.model.RouterCapabilityStatus

@Entity(tableName = "router_detection_logs")
data class RouterDetectionEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val routerIp: String,
    val routerModel: String,
    val firmwareVersion: String,
    val authStatus: String,
    val macFilteringCapability: String,
    val connectedDeviceCapability: String,
    val rawDiagnostics: String,
    val timestamp: Long = System.currentTimeMillis()
) {
    fun toDomainReport(): RouterCapabilityReport {
        val auth = try {
            AuthStatus.valueOf(authStatus)
        } catch (_: Exception) {
            AuthStatus.NOT_TESTED
        }
        val macCap = try {
            RouterCapabilityStatus.valueOf(macFilteringCapability)
        } catch (_: Exception) {
            RouterCapabilityStatus.UNKNOWN
        }
        val devCap = try {
            RouterCapabilityStatus.valueOf(connectedDeviceCapability)
        } catch (_: Exception) {
            RouterCapabilityStatus.UNKNOWN
        }
        return RouterCapabilityReport(
            routerModel = routerModel,
            firmwareVersion = firmwareVersion,
            authStatus = auth,
            macFilteringCapability = macCap,
            connectedDeviceCapability = devCap,
            canAuthenticate = if (auth == AuthStatus.SUCCESS) RouterCapabilityStatus.SUPPORTED else if (auth == AuthStatus.FAILED_BAD_CREDENTIALS) RouterCapabilityStatus.SUPPORTED else RouterCapabilityStatus.UNKNOWN,
            canReadConnectedDevices = devCap,
            canReadMacFilter = macCap,
            canAddBlacklist = macCap,
            canRemoveBlacklist = macCap,
            canReadWhitelist = macCap,
            canAddWhitelist = macCap,
            canRemoveWhitelist = macCap,
            canToggleFilterMode = macCap,
            rawDiagnostics = rawDiagnostics,
            timestamp = timestamp
        )
    }
}
