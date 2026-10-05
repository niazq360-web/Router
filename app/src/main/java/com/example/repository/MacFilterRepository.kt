package com.example.repository

import com.example.data.local.MacFilterDao
import com.example.data.local.MacFilterEntity
import com.example.model.FilterType
import com.example.model.MacFilterRule
import com.example.model.RouterResult
import com.example.service.RouterService
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

class MacFilterRepository(
    private val routerService: RouterService,
    private val macFilterDao: MacFilterDao
) {

    fun observeRules(filterType: FilterType): Flow<List<MacFilterRule>> {
        return macFilterDao.getRulesByType(filterType.name).map { list ->
            list.map { it.toDomainRule() }
        }
    }

    suspend fun refreshRulesFromRouter(ip: String): RouterResult<List<MacFilterRule>> {
        val result = routerService.queryMacFilterRules(ip)
        if (result is RouterResult.Success) {
            val entities = result.data.map { rule ->
                MacFilterEntity(
                    macAddress = rule.macAddress,
                    deviceName = rule.deviceName,
                    ruleType = rule.ruleType.name,
                    isSyncedToRouter = true,
                    routerConfirmed = true,
                    statusMessage = "Confirmed by router"
                )
            }
            macFilterDao.clearRulesByType(FilterType.BLACKLIST.name)
            macFilterDao.insertRules(entities)
        }
        return result
    }

    suspend fun addRule(
        ip: String,
        macAddress: String,
        deviceName: String,
        filterType: FilterType
    ): RouterResult<Boolean> {
        val normalizedMac = macAddress.trim().uppercase()
        val routerResult = routerService.addMacFilterRule(ip, normalizedMac, filterType)

        // Store locally marked with actual router confirmation status
        val entity = MacFilterEntity(
            macAddress = normalizedMac,
            deviceName = deviceName.ifBlank { "Device-${normalizedMac.takeLast(5)}" },
            ruleType = filterType.name,
            isSyncedToRouter = routerResult is RouterResult.Success,
            routerConfirmed = routerResult is RouterResult.Success,
            statusMessage = when (routerResult) {
                is RouterResult.Success -> "Router Confirmed: Added"
                is RouterResult.Unsupported -> routerResult.message
                is RouterResult.Error -> "Failed: ${routerResult.error}"
            }
        )
        macFilterDao.insertRule(entity)

        return routerResult
    }

    suspend fun removeRule(
        ip: String,
        macAddress: String,
        filterType: FilterType
    ): RouterResult<Boolean> {
        val normalizedMac = macAddress.trim().uppercase()
        val routerResult = routerService.removeMacFilterRule(ip, normalizedMac, filterType)

        if (routerResult is RouterResult.Success) {
            macFilterDao.deleteRule(normalizedMac, filterType.name)
        }
        return routerResult
    }

    suspend fun toggleWhitelistMode(
        ip: String,
        enable: Boolean
    ): RouterResult<Boolean> {
        return routerService.toggleWhitelistMode(ip, enable)
    }
}
