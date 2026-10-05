package com.example.data.local

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface ConnectedDeviceDao {
    @Query("SELECT * FROM connected_devices ORDER BY isOnline DESC, ipAddress ASC")
    fun getAllDevices(): Flow<List<ConnectedDeviceEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertDevices(devices: List<ConnectedDeviceEntity>)

    @Query("DELETE FROM connected_devices WHERE macAddress = :macAddress")
    suspend fun deleteDevice(macAddress: String)

    @Query("DELETE FROM connected_devices")
    suspend fun clearDevices()
}
