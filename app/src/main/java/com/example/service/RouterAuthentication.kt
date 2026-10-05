package com.example.service

import okhttp3.Cookie
import okhttp3.CookieJar
import okhttp3.HttpUrl
import java.net.InetAddress
import java.util.concurrent.ConcurrentHashMap

class RouterAuthentication : CookieJar {

    private val cookieStore = ConcurrentHashMap<String, MutableList<Cookie>>()

    @Volatile
    var isAuthenticated: Boolean = false
        private set

    @Volatile
    var currentUsername: String? = null
        private set

    @Volatile
    var ontToken: String? = null
        private set

    @Volatile
    var lastLoginTime: Long = 0L
        private set

    override fun saveFromResponse(url: HttpUrl, cookies: List<Cookie>) {
        val host = url.host
        val existing = cookieStore.getOrPut(host) { mutableListOf() }
        synchronized(existing) {
            for (newCookie in cookies) {
                existing.removeAll { it.name == newCookie.name }
                existing.add(newCookie)
            }
        }
    }

    override fun loadForRequest(url: HttpUrl): List<Cookie> {
        val host = url.host
        val cookies = cookieStore[host] ?: return emptyList()
        val now = System.currentTimeMillis()
        synchronized(cookies) {
            cookies.removeAll { it.expiresAt < now }
            return ArrayList(cookies)
        }
    }

    fun markAuthenticated(username: String, token: String? = null) {
        isAuthenticated = true
        currentUsername = username
        ontToken = token
        lastLoginTime = System.currentTimeMillis()
    }

    fun clearSession() {
        isAuthenticated = false
        currentUsername = null
        ontToken = null
        lastLoginTime = 0L
        cookieStore.clear()
    }

    /**
     * Enforce security rule: The app must only communicate with the router on the local network.
     */
    fun validateLocalIp(ip: String): Boolean {
        return try {
            val address = InetAddress.getByName(ip)
            address.isSiteLocalAddress || address.isLoopbackAddress || address.isLinkLocalAddress
        } catch (_: Exception) {
            // Regex check for standard private subnets
            val privateIpRegex = Regex(
                "^(192\\.168\\.\\d{1,3}\\.\\d{1,3}|10\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}|172\\.(1[6-9]|2\\d|3[01])\\.\\d{1,3}\\.\\d{1,3}|127\\.0\\.0\\.1)$"
            )
            privateIpRegex.matches(ip)
        }
    }
}
