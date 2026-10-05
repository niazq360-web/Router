package com.example.data.local

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface RouterDetectionDao {
    @Query("SELECT * FROM router_detection_logs ORDER BY timestamp DESC LIMIT 1")
    fun getLatestDetection(): Flow<RouterDetectionEntity?>

    @Query("SELECT * FROM router_detection_logs ORDER BY timestamp DESC")
    fun getAllDetections(): Flow<List<RouterDetectionEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertDetection(entity: RouterDetectionEntity): Long

    @Query("DELETE FROM router_detection_logs")
    suspend fun clearDetections()
}
