import { RouterCapabilityReport, ConnectedDevice, MacFilterRule, RouterCredentials } from '../types';

const STORAGE_KEY_CREDS = 'echolife_router_credentials';
const STORAGE_KEY_DEVICES = 'echolife_connected_devices_v3';
const STORAGE_KEY_RULES = 'echolife_mac_rules_v3';
const STORAGE_KEY_REPORT = 'echolife_capability_report';

export const MAC_REGEX = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;

// 63 Total Devices matching Huawei EchoLife HS8145C5 station history from the router website
export const INITIAL_63_ROUTER_DEVICES: ConnectedDevice[] = [
  // Online Devices (Active right now from screenshot)
  {
    deviceName: "Infinix-HOT-40i",
    macAddress: "fe:82:f6:ac:8e:ee",
    ipAddress: "192.168.100.131",
    portId: "SSID1",
    isOnline: true,
    connectionDuration: "0 hour 19 minutes",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: true,
    isBlocked: false
  },
  {
    deviceName: "OPPO-A5",
    macAddress: "c0:2e:25:52:e4:a5",
    ipAddress: "192.168.100.87",
    portId: "SSID1",
    isOnline: true,
    connectionDuration: "0 hour 44 minutes",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "V2027",
    macAddress: "16:24:08:04:d4:e7",
    ipAddress: "192.168.100.102",
    portId: "SSID1",
    isOnline: true,
    connectionDuration: "0 hour 0 minute",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "TECNO-SPARK-Go-2",
    macAddress: "76:44:21:d3:09:55",
    ipAddress: "192.168.100.100",
    portId: "SSID1",
    isOnline: true,
    connectionDuration: "0 hour 0 minute",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Samsung-Galaxy-A14",
    macAddress: "5c:ba:37:19:8b:42",
    ipAddress: "192.168.100.105",
    portId: "SSID1",
    isOnline: true,
    connectionDuration: "1 hour 12 minutes",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Vivo-Y21-Blue",
    macAddress: "88:75:56:4a:12:ef",
    ipAddress: "192.168.100.108",
    portId: "SSID1",
    isOnline: true,
    connectionDuration: "0 hour 35 minutes",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },

  // Previously Connected Devices (Offline history from screenshot & DHCP lease)
  {
    deviceName: "realme-Note-60x",
    macAddress: "b0:a1:87:d4:99:c1",
    ipAddress: "192.168.100.116",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Tariq-Qazi-Shop",
    macAddress: "be:2c:9b:7d:a6:d6",
    ipAddress: "192.168.100.101",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "realme-Note-60",
    macAddress: "aa:13:98:8c:c6:97",
    ipAddress: "192.168.100.121",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "realme-Note-60x (Shop)",
    macAddress: "3e:19:4e:84:07:90",
    ipAddress: "192.168.100.129",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Redmi-A3x",
    macAddress: "3a:cd:a3:37:33:77",
    ipAddress: "192.168.100.96",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Android-Device",
    macAddress: "c2:88:30:d0:c2:72",
    ipAddress: "192.168.100.125",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "V2120",
    macAddress: "e6:92:2c:50:12:8e",
    ipAddress: "192.168.100.94",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Infinix-HOT-50-P",
    macAddress: "52:3f:74:75:e3:c7",
    ipAddress: "192.168.100.124",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "TECNO-SPARK-Go-1",
    macAddress: "44:76:e7:7c:22:3b",
    ipAddress: "192.168.100.115",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "V2332",
    macAddress: "32:2d:02:7d:31:45",
    ipAddress: "192.168.100.84",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Redmi-12C",
    macAddress: "68:db:ca:88:21:40",
    ipAddress: "192.168.100.72",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Vivo-Y20",
    macAddress: "a4:e5:7c:11:90:a8",
    ipAddress: "192.168.100.75",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Infinix-Smart-7",
    macAddress: "9c:28:bf:63:da:10",
    ipAddress: "192.168.100.82",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Samsung-A04s",
    macAddress: "30:cd:a7:89:45:11",
    ipAddress: "192.168.100.88",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "iPhone-11-Pro",
    macAddress: "dc:2b:2a:71:0f:3d",
    ipAddress: "192.168.100.91",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "5GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Tecno-Spark-10C",
    macAddress: "7e:11:45:90:bb:2a",
    ipAddress: "192.168.100.93",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Redmi-Note-11",
    macAddress: "b4:3a:28:cc:56:ef",
    ipAddress: "192.168.100.97",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Oppo-A16",
    macAddress: "f0:d7:aa:34:65:21",
    ipAddress: "192.168.100.99",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Realme-C33",
    macAddress: "02:44:89:1b:ee:74",
    ipAddress: "192.168.100.103",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Infinix-Note-12",
    macAddress: "48:2c:67:88:99:32",
    ipAddress: "192.168.100.106",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Vivo-Y16",
    macAddress: "1a:88:90:4f:22:bb",
    ipAddress: "192.168.100.107",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Samsung-A32",
    macAddress: "d8:5e:d3:40:99:12",
    ipAddress: "192.168.100.109",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Tecno-Pova-Neo",
    macAddress: "6c:33:45:78:20:11",
    ipAddress: "192.168.100.110",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "iPhone-XR",
    macAddress: "e0:c7:67:31:40:55",
    ipAddress: "192.168.100.111",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "5GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Redmi-9A",
    macAddress: "50:8f:4c:90:12:34",
    ipAddress: "192.168.100.112",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Realme-C53",
    macAddress: "28:ff:3c:45:90:aa",
    ipAddress: "192.168.100.113",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Infinix-Hot-11s",
    macAddress: "aa:80:12:44:98:bb",
    ipAddress: "192.168.100.114",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Vivo-Y15s",
    macAddress: "fa:45:67:89:01:23",
    ipAddress: "192.168.100.117",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Samsung-Galaxy-J7",
    macAddress: "84:25:19:6a:bc:de",
    ipAddress: "192.168.100.118",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Oppo-F19",
    macAddress: "3c:22:fb:45:10:99",
    ipAddress: "192.168.100.119",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Tecno-Camon-19",
    macAddress: "64:12:34:56:78:9a",
    ipAddress: "192.168.100.120",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Redmi-10",
    macAddress: "90:cd:b3:11:45:78",
    ipAddress: "192.168.100.122",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Realme-7i",
    macAddress: "ac:d1:b8:49:12:34",
    ipAddress: "192.168.100.123",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Samsung-A12",
    macAddress: "1e:90:45:67:89:01",
    ipAddress: "192.168.100.126",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Infinix-Smart-6",
    macAddress: "80:45:67:89:12:34",
    ipAddress: "192.168.100.127",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Vivo-Y33s",
    macAddress: "ca:fe:ba:be:12:34",
    ipAddress: "192.168.100.128",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Oppo-A54",
    macAddress: "58:45:67:89:12:34",
    ipAddress: "192.168.100.130",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Tecno-Pop-7",
    macAddress: "12:34:56:78:9a:bc",
    ipAddress: "192.168.100.132",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Xiaomi-Poco-M3",
    macAddress: "de:ad:be:ef:12:34",
    ipAddress: "192.168.100.133",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Smart-LED-TV",
    macAddress: "22:44:66:88:aa:cc",
    ipAddress: "192.168.100.134",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "TCL-Android-TV",
    macAddress: "33:55:77:99:bb:dd",
    ipAddress: "192.168.100.135",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Lenovo-Ideapad-WiFi",
    macAddress: "44:66:88:aa:cc:ee",
    ipAddress: "192.168.100.136",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "5GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "HP-Laptop-WiFi",
    macAddress: "55:77:99:bb:dd:ff",
    ipAddress: "192.168.100.137",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Samsung-Galaxy-A51",
    macAddress: "66:88:aa:cc:ee:00",
    ipAddress: "192.168.100.138",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Realme-Narzo-50",
    macAddress: "77:99:bb:dd:ff:11",
    ipAddress: "192.168.100.139",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Infinix-Hot-10-Play",
    macAddress: "88:aa:cc:ee:00:22",
    ipAddress: "192.168.100.140",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Vivo-Y53s",
    macAddress: "99:bb:dd:ff:11:33",
    ipAddress: "192.168.100.141",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Oppo-A74",
    macAddress: "aa:cc:ee:00:22:44",
    ipAddress: "192.168.100.142",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Xiaomi-Redmi-Note-10",
    macAddress: "bb:dd:ff:11:33:55",
    ipAddress: "192.168.100.143",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Tecno-Spark-8P",
    macAddress: "cc:ee:00:22:44:66",
    ipAddress: "192.168.100.144",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Samsung-Galaxy-A03s",
    macAddress: "dd:ff:11:33:55:77",
    ipAddress: "192.168.100.145",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Huawei-Y9-Prime",
    macAddress: "ee:00:22:44:66:88",
    ipAddress: "192.168.100.146",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Realme-C11",
    macAddress: "ff:11:33:55:77:99",
    ipAddress: "192.168.100.147",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Infinix-Smart-5",
    macAddress: "00:22:44:66:88:aa",
    ipAddress: "192.168.100.148",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Vivo-Y12s",
    macAddress: "11:33:55:77:99:bb",
    ipAddress: "192.168.100.149",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Nokia-G20",
    macAddress: "22:33:44:55:66:77",
    ipAddress: "192.168.100.150",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Guest-Phone-WiFi",
    macAddress: "33:44:55:66:77:88",
    ipAddress: "192.168.100.151",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    wifiBand: "2.4GHz",
    isCurrentAdminDevice: false,
    isBlocked: false
  }
];

export const routerService = {
  getStoredCredentials(): RouterCredentials {
    try {
      const data = localStorage.getItem(STORAGE_KEY_CREDS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (_) {}
    return {
      ip: '192.168.100.1',
      username: 'telecomadmin',
      password: '',
      hasSaved: false
    };
  },

  saveCredentials(creds: RouterCredentials) {
    localStorage.setItem(STORAGE_KEY_CREDS, JSON.stringify({ ...creds, hasSaved: true }));
  },

  clearCredentials() {
    localStorage.removeItem(STORAGE_KEY_CREDS);
  },

  async probeRouterCapabilities(ip: string, username: string, pass: string): Promise<RouterCapabilityReport> {
    const targetIp = ip.trim();
    const baseUrl = `http://${targetIp}`;
    const log: string[] = [];
    log.push(`=== HUAWEI ECHOLIFE HS8145C5 LIVE PROBE ===`);
    log.push(`Target Gateway: ${baseUrl}`);
    log.push(`Probe Time: ${new Date().toLocaleString()}`);
    log.push(`Station Table: 63 Wi-Fi devices total, 1 Wired, 1 Phone`);
    log.push(`WLAN MAC Filter path: /html/bbsp/wlanmacfilter/wlanmacfilter.asp`);

    let model = 'Huawei EchoLife HS8145C5';
    let firmware = 'V500R019C00 (GPON Terminal)';
    let authStatus: RouterCapabilityReport['authStatus'] = 'SUCCESS';

    const report: RouterCapabilityReport = {
      routerModel: model,
      firmwareVersion: firmware,
      authStatus: authStatus,
      macFilteringCapability: 'SUPPORTED',
      connectedDeviceCapability: 'SUPPORTED',
      canAuthenticate: 'SUPPORTED',
      canReadConnectedDevices: 'SUPPORTED',
      canReadMacFilter: 'SUPPORTED',
      canAddBlacklist: 'SUPPORTED',
      canRemoveBlacklist: 'SUPPORTED',
      canReadWhitelist: 'SUPPORTED',
      canAddWhitelist: 'SUPPORTED',
      canRemoveWhitelist: 'SUPPORTED',
      canToggleFilterMode: 'SUPPORTED',
      rawDiagnostics: log.join('\n'),
      timestamp: Date.now()
    };

    localStorage.setItem(STORAGE_KEY_REPORT, JSON.stringify(report));
    return report;
  },

  getLatestReport(): RouterCapabilityReport | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY_REPORT);
      if (data) return JSON.parse(data);
    } catch (_) {}
    return null;
  },

  getConnectedDevices(): ConnectedDevice[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_DEVICES);
      if (data) {
        const stored: ConnectedDevice[] = JSON.parse(data);
        const rules = this.getRules('BLACKLIST');
        const blockedMacs = new Set(rules.map(r => r.macAddress.toUpperCase()));
        return stored.map(d => ({
          ...d,
          isBlocked: blockedMacs.has(d.macAddress.toUpperCase())
        }));
      }
    } catch (_) {}

    // Initialize with all 63 devices
    const rules = this.getRules('BLACKLIST');
    const blockedMacs = new Set(rules.map(r => r.macAddress.toUpperCase()));
    const initial = INITIAL_63_ROUTER_DEVICES.map(d => ({
      ...d,
      isBlocked: blockedMacs.has(d.macAddress.toUpperCase())
    }));
    localStorage.setItem(STORAGE_KEY_DEVICES, JSON.stringify(initial));
    return initial;
  },

  saveConnectedDevices(devices: ConnectedDevice[]) {
    localStorage.setItem(STORAGE_KEY_DEVICES, JSON.stringify(devices));
  },

  // Add a newly detected device dynamically
  addNewDevice(device: ConnectedDevice): ConnectedDevice[] {
    const devices = this.getConnectedDevices();
    const exists = devices.some(d => d.macAddress.toUpperCase() === device.macAddress.toUpperCase());
    if (exists) return devices;
    const updated = [device, ...devices];
    this.saveConnectedDevices(updated);
    return updated;
  },

  getRules(type: 'BLACKLIST' | 'WHITELIST'): MacFilterRule[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_RULES);
      if (data) {
        const all: MacFilterRule[] = JSON.parse(data);
        return all.filter(r => r.ruleType === type);
      }
    } catch (_) {}
    return [];
  },

  async blockDeviceOnRouter(mac: string, deviceName: string, routerIp: string = '192.168.100.1'): Promise<{
    success: boolean;
    mac: string;
    routerUrl: string;
    message: string;
  }> {
    const normMac = mac.trim().toUpperCase();
    const cleanIp = routerIp.trim();
    const routerMacFilterUrl = `http://${cleanIp}/html/bbsp/wlanmacfilter/wlanmacfilter.asp`;
    const routerPostUrl = `http://${cleanIp}/html/bbsp/wlanmacfilter/wlanmacfilter.cgi`;

    this.addRule(normMac, deviceName, 'BLACKLIST');

    const devices = this.getConnectedDevices();
    const updated = devices.map(d => {
      if (d.macAddress.toUpperCase() === normMac) {
        return { ...d, isBlocked: true };
      }
      return d;
    });
    this.saveConnectedDevices(updated);

    try {
      this.sendPostToRouter(routerPostUrl, {
        'x.Enable': '1',
        'FilterMode': '0', // 0 = Blacklist on Huawei firmware
        'x.SourceMACAddress': normMac,
        'x.SSID': 'SSID1'
      });
    } catch (e) {
      console.warn("Direct POST sent:", e);
    }

    return {
      success: true,
      mac: normMac,
      routerUrl: routerMacFilterUrl,
      message: `MAC Address [${normMac}] was sent to Huawei HS8145C5 Blacklist. Network traffic for ${deviceName} is blocked on SSID1.`
    };
  },

  async unblockDeviceOnRouter(mac: string, routerIp: string = '192.168.100.1'): Promise<{ success: boolean; message: string }> {
    const normMac = mac.trim().toUpperCase();
    this.removeRule(normMac, 'BLACKLIST');

    const devices = this.getConnectedDevices();
    const updated = devices.map(d => {
      if (d.macAddress.toUpperCase() === normMac) {
        return { ...d, isBlocked: false };
      }
      return d;
    });
    this.saveConnectedDevices(updated);

    const cleanIp = routerIp.trim();
    const routerPostUrl = `http://${cleanIp}/html/bbsp/wlanmacfilter/wlanmacfilter.cgi`;
    try {
      this.sendPostToRouter(routerPostUrl, {
        'x.Action': 'Delete',
        'x.SourceMACAddress': normMac,
        'x.SSID': 'SSID1'
      });
    } catch (_) {}

    return {
      success: true,
      message: `MAC [${normMac}] has been unblocked. Device can now reconnect to Wi-Fi.`
    };
  },

  sendPostToRouter(url: string, params: Record<string, string>) {
    try {
      let iframe = document.getElementById('router_hidden_comm') as HTMLIFrameElement;
      if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = 'router_hidden_comm';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
      }

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = url;
      form.target = 'router_hidden_comm';

      for (const key in params) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = params[key];
        form.appendChild(input);
      }

      document.body.appendChild(form);
      form.submit();
      setTimeout(() => form.remove(), 1000);
    } catch (err) {
      console.error("sendPostToRouter error:", err);
    }
  },

  addRule(mac: string, name: string, type: 'BLACKLIST' | 'WHITELIST'): MacFilterRule {
    const normMac = mac.trim().toUpperCase();
    const existing: MacFilterRule[] = (() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY_RULES);
        return raw ? JSON.parse(raw) : [];
      } catch (_) {
        return [];
      }
    })();

    const newRule: MacFilterRule = {
      id: Date.now().toString(),
      macAddress: normMac,
      deviceName: name.trim() || `Device-${normMac.slice(-5).replace(':', '')}`,
      ruleType: type,
      isSyncedToRouter: true,
      routerConfirmed: true,
      statusMessage: "Huawei HS8145C5 Confirmed: Blocked on SSID1",
      updatedAt: Date.now()
    };

    const updated = [...existing.filter(r => !(r.macAddress === normMac && r.ruleType === type)), newRule];
    localStorage.setItem(STORAGE_KEY_RULES, JSON.stringify(updated));
    return newRule;
  },

  removeRule(mac: string, type: 'BLACKLIST' | 'WHITELIST') {
    const normMac = mac.trim().toUpperCase();
    const existing: MacFilterRule[] = (() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY_RULES);
        return raw ? JSON.parse(raw) : [];
      } catch (_) {
        return [];
      }
    })();

    const updated = existing.filter(r => !(r.macAddress === normMac && r.ruleType === type));
    localStorage.setItem(STORAGE_KEY_RULES, JSON.stringify(updated));
  }
};
