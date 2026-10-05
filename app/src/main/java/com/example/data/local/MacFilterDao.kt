package com.example.data.local

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface MacFilterDao {
    @Query("SELECT * FROM mac_filter_rules WHERE ruleType = :ruleType ORDER BY updatedAt DESC")
    fun getRulesByType(ruleType: String): Flow<List<MacFilterEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertRule(rule: MacFilterEntity): Long

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertRules(rules: List<MacFilterEntity>)

    @Query("DELETE FROM mac_filter_rules WHERE macAddress = :macAddress AND ruleType = :ruleType")
    suspend fun deleteRule(macAddress: String, ruleType: String)

    @Query("DELETE FROM mac_filter_rules WHERE ruleType = :ruleType")
    suspend fun clearRulesByType(ruleType: String)
}
