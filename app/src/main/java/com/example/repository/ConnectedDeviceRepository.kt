package com.example.repository

import com.example.data.local.ConnectedDeviceDao
import com.example.data.local.ConnectedDeviceEntity
import com.example.model.ConnectedDevice
import com.example.model.RouterResult
import com.example.service.RouterService
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import java.net.Inet4Address
import java.net.NetworkInterface

class ConnectedDeviceRepository(
    private val routerService: RouterService,
    private val deviceDao: ConnectedDeviceDao
) {

    fun getLocalIpv4Address(): String? {
        return try {
            val interfaces = NetworkInterface.getNetworkInterfaces()
            while (interfaces.hasMoreElements()) {
                val intf = interfaces.nextElement()
                val addrs = intf.inetAddresses
                while (addrs.hasMoreElements()) {
                    val addr = addrs.nextElement()
                    if (!addr.isLoopbackAddress && addr is Inet4Address) {
                        return addr.hostAddress
                    }
                }
            }
            null
        } catch (_: Exception) {
            null
        }
    }

    fun observeDevices(): Flow<List<ConnectedDevice>> {
        val adminIp = getLocalIpv4Address()
        return deviceDao.getAllDevices().map { entities ->
            entities.map { it.toDomainDevice(adminIp) }
        }
    }

    suspend fun refreshConnectedDevices(ip: String): RouterResult<List<ConnectedDevice>> {
        val result = routerService.queryConnectedDevices(ip)
        if (result is RouterResult.Success) {
            val entities = result.data.map { device ->
                ConnectedDeviceEntity(
                    macAddress = device.macAddress,
                    ipAddress = device.ipAddress,
                    deviceName = device.deviceName,
                    isOnline = device.isOnline,
                    wifiBand = device.wifiBand,
                    rssi = device.rssi,
                    lastSeenTimestamp = System.currentTimeMillis()
                )
            }
            deviceDao.clearDevices()
            deviceDao.insertDevices(entities)
        }
        return result
    }

    suspend fun clearLocalCache() {
        deviceDao.clearDevices()
    }
}
