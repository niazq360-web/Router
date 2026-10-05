package com.example.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey
import com.example.model.ConnectedDevice

@Entity(tableName = "connected_devices")
data class ConnectedDeviceEntity(
    @PrimaryKey
    val macAddress: String,
    val ipAddress: String,
    val deviceName: String,
    val isOnline: Boolean,
    val wifiBand: String,
    val rssi: Int?,
    val lastSeenTimestamp: Long = System.currentTimeMillis()
) {
    fun toDomainDevice(adminIp: String? = null): ConnectedDevice {
        val isAdmin = adminIp != null && adminIp == ipAddress
        return ConnectedDevice(
            macAddress = macAddress,
            ipAddress = ipAddress,
            deviceName = deviceName.ifBlank { "Unknown Device" },
            isOnline = isOnline,
            wifiBand = wifiBand,
            rssi = rssi,
            isCurrentAdminDevice = isAdmin
        )
    }
}
