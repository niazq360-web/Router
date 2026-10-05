package com.example

import android.content.Context
import androidx.test.core.app.ApplicationProvider
import com.example.service.RouterAuthentication
import com.example.service.RouterService
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [34])
class ExampleRobolectricTest {

  @Test
  fun `read string from context`() {
    val context = ApplicationProvider.getApplicationContext<Context>()
    val appName = context.getString(R.string.app_name)
    assertEquals("EchoLife Manager", appName)
  }

  @Test
  fun `validate local ip boundaries`() {
    val auth = RouterAuthentication()
    assertTrue(auth.validateLocalIp("192.168.100.1"))
    assertTrue(auth.validateLocalIp("192.168.1.1"))
    assertTrue(auth.validateLocalIp("10.0.0.1"))
    assertTrue(auth.validateLocalIp("172.16.0.1"))
    assertTrue(auth.validateLocalIp("127.0.0.1"))
    // External IPs must be rejected for security
    assertFalse(auth.validateLocalIp("8.8.8.8"))
    assertFalse(auth.validateLocalIp("1.1.1.1"))
  }

  @Test
  fun `validate mac address pattern`() {
    assertTrue(RouterService.MAC_PATTERN.matcher("00:11:22:33:44:55").matches())
    assertTrue(RouterService.MAC_PATTERN.matcher("AA:BB:CC:DD:EE:FF").matches())
    assertFalse(RouterService.MAC_PATTERN.matcher("invalid_mac").matches())
    assertFalse(RouterService.MAC_PATTERN.matcher("00:11:22:33:44").matches())
  }
}

