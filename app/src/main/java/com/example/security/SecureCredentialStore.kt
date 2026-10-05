package com.example.security

import android.content.Context
import android.content.SharedPreferences
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import android.util.Base64
import java.security.KeyStore
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.SecretKey
import javax.crypto.spec.GCMParameterSpec

class SecureCredentialStore(private val context: Context) {

    private val prefs: SharedPreferences =
        context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    companion object {
        private const val PREFS_NAME = "huawei_ont_secure_storage"
        private const val KEY_ALIAS = "HuaweiOntAdminKey"
        private const val ANDROID_KEYSTORE = "AndroidKeyStore"
        private const val TRANSFORMATION = "AES/GCM/NoPadding"
        private const val GCM_TAG_LENGTH = 128

        private const val PREF_KEY_IP = "router_ip"
        private const val PREF_KEY_USERNAME_ENC = "router_username_enc"
        private const val PREF_KEY_USERNAME_IV = "router_username_iv"
        private const val PREF_KEY_PASSWORD_ENC = "router_password_enc"
        private const val PREF_KEY_PASSWORD_IV = "router_password_iv"
    }

    init {
        ensureKeyExists()
    }

    private fun ensureKeyExists() {
        try {
            val keyStore = KeyStore.getInstance(ANDROID_KEYSTORE)
            keyStore.load(null)
            if (!keyStore.containsAlias(KEY_ALIAS)) {
                val keyGenerator =
                    KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, ANDROID_KEYSTORE)
                val spec = KeyGenParameterSpec.Builder(
                    KEY_ALIAS,
                    KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT
                )
                    .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                    .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                    .setKeySize(256)
                    .build()
                keyGenerator.init(spec)
                keyGenerator.generateKey()
            }
        } catch (_: Exception) {
            // AndroidKeyStore fallback handled during cipher creation
        }
    }

    private fun getSecretKey(): SecretKey {
        val keyStore = KeyStore.getInstance(ANDROID_KEYSTORE)
        keyStore.load(null)
        return keyStore.getKey(KEY_ALIAS, null) as SecretKey
    }

    private fun encrypt(plainText: String): Pair<String, String>? {
        if (plainText.isEmpty()) return null
        return try {
            val cipher = Cipher.getInstance(TRANSFORMATION)
            cipher.init(Cipher.ENCRYPT_MODE, getSecretKey())
            val iv = cipher.iv
            val cipherText = cipher.doFinal(plainText.toByteArray(Charsets.UTF_8))
            Pair(
                Base64.encodeToString(cipherText, Base64.NO_WRAP),
                Base64.encodeToString(iv, Base64.NO_WRAP)
            )
        } catch (e: Exception) {
            null
        }
    }

    private fun decrypt(encryptedBase64: String?, ivBase64: String?): String {
        if (encryptedBase64.isNullOrEmpty() || ivBase64.isNullOrEmpty()) return ""
        return try {
            val cipher = Cipher.getInstance(TRANSFORMATION)
            val iv = Base64.decode(ivBase64, Base64.NO_WRAP)
            val cipherText = Base64.decode(encryptedBase64, Base64.NO_WRAP)
            val spec = GCMParameterSpec(GCM_TAG_LENGTH, iv)
            cipher.init(Cipher.DECRYPT_MODE, getSecretKey(), spec)
            String(cipher.doFinal(cipherText), Charsets.UTF_8)
        } catch (e: Exception) {
            ""
        }
    }

    fun saveCredentials(ip: String, username: String, pass: String) {
        val editor = prefs.edit()
        editor.putString(PREF_KEY_IP, ip.trim())

        val encryptedUser = encrypt(username.trim())
        if (encryptedUser != null) {
            editor.putString(PREF_KEY_USERNAME_ENC, encryptedUser.first)
            editor.putString(PREF_KEY_USERNAME_IV, encryptedUser.second)
        } else {
            editor.remove(PREF_KEY_USERNAME_ENC).remove(PREF_KEY_USERNAME_IV)
        }

        val encryptedPass = encrypt(pass)
        if (encryptedPass != null) {
            editor.putString(PREF_KEY_PASSWORD_ENC, encryptedPass.first)
            editor.putString(PREF_KEY_PASSWORD_IV, encryptedPass.second)
        } else {
            editor.remove(PREF_KEY_PASSWORD_ENC).remove(PREF_KEY_PASSWORD_IV)
        }

        editor.apply()
    }

    fun getRouterIp(): String {
        return prefs.getString(PREF_KEY_IP, "192.168.100.1") ?: "192.168.100.1"
    }

    fun getUsername(): String {
        val enc = prefs.getString(PREF_KEY_USERNAME_ENC, null)
        val iv = prefs.getString(PREF_KEY_USERNAME_IV, null)
        val decrypted = decrypt(enc, iv)
        return if (decrypted.isNotBlank()) decrypted else "telecomadmin"
    }

    fun getPassword(): String {
        val enc = prefs.getString(PREF_KEY_PASSWORD_ENC, null)
        val iv = prefs.getString(PREF_KEY_PASSWORD_IV, null)
        return decrypt(enc, iv)
    }

    fun hasStoredCredentials(): Boolean {
        return prefs.contains(PREF_KEY_USERNAME_ENC) && prefs.contains(PREF_KEY_PASSWORD_ENC)
    }

    fun clearCredentials() {
        prefs.edit().clear().apply()
    }
}
