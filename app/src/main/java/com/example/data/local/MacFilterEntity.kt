package com.example.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey
import com.example.model.FilterType
import com.example.model.MacFilterRule

@Entity(tableName = "mac_filter_rules")
data class MacFilterEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val macAddress: String,
    val deviceName: String,
    val ruleType: String, // BLACKLIST or WHITELIST
    val isSyncedToRouter: Boolean,
    val routerConfirmed: Boolean,
    val statusMessage: String,
    val updatedAt: Long = System.currentTimeMillis()
) {
    fun toDomainRule(): MacFilterRule {
        val type = try {
            FilterType.valueOf(ruleType)
        } catch (_: Exception) {
            FilterType.BLACKLIST
        }
        return MacFilterRule(
            id = id,
            macAddress = macAddress,
            deviceName = deviceName,
            ruleType = type,
            isSyncedToRouter = isSyncedToRouter,
            routerConfirmed = routerConfirmed,
            statusMessage = statusMessage,
            updatedAt = updatedAt
        )
    }
}
