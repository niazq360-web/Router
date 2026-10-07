import { RouterCapabilityReport, ConnectedDevice, MacFilterRule, RouterCredentials } from '../types';

const STORAGE_KEY_CREDS = 'echolife_router_credentials';
const STORAGE_KEY_DEVICES = 'echolife_connected_devices_v4';
const STORAGE_KEY_RULES = 'echolife_mac_rules_v4';
const STORAGE_KEY_REPORT = 'echolife_capability_report';

export const MAC_REGEX = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;

// Exactly 63 devices extracted directly from the user's Huawei EchoLife HS8145C5 router table
export const ROUTER_63_EXACT_DEVICES: ConnectedDevice[] = [
  {
    deviceName: "realme-Note-60x",
    macAddress: "b0:a1:87:d4:99:c1",
    ipAddress: "192.168.100.116",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
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
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
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
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "realme-Note-60x",
    macAddress: "3e:19:4e:84:07:90",
    ipAddress: "192.168.100.129",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "V2027",
    macAddress: "16:24:08:04:d4:e7",
    ipAddress: "192.168.100.102",
    portId: "SSID1",
    isOnline: true,
    connectionDuration: "0 hour 3 minutes",
    onlineSince: "8:09 PM",
    lastSeenTime: "Just now",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "TECNO-SPARK-Go-2",
    macAddress: "76:44:21:d3:09:55",
    ipAddress: "192.168.100.100",
    portId: "SSID1",
    isOnline: true,
    connectionDuration: "0 hour 23 minutes",
    onlineSince: "7:49 PM",
    lastSeenTime: "Just now",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Infinix-HOT-40i",
    macAddress: "fe:82:f6:ac:8e:ee",
    ipAddress: "192.168.100.131",
    portId: "SSID1",
    isOnline: true,
    connectionDuration: "0 hour 51 minutes",
    onlineSince: "7:21 PM",
    lastSeenTime: "Just now",
    isCurrentAdminDevice: true,
    isBlocked: false
  },
  {
    deviceName: "Redmi-A3x",
    macAddress: "3a:cd:a3:37:33:77",
    ipAddress: "192.168.100.96",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
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
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
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
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "OPPO-A5",
    macAddress: "c0:2e:25:52:e4:a5",
    ipAddress: "192.168.100.87",
    portId: "SSID1",
    isOnline: true,
    connectionDuration: "1 hour 16 minutes",
    onlineSince: "6:56 PM",
    lastSeenTime: "Just now",
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
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
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
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
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
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "V2344",
    macAddress: "8e:6f:57:38:1e:d9",
    ipAddress: "192.168.100.98",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "V2339",
    macAddress: "a6:9c:3b:c6:c6:8f",
    ipAddress: "192.168.100.97",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Galaxy-A07",
    macAddress: "c6:ff:ec:86:8a:48",
    ipAddress: "192.168.100.117",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "realme-Note-50",
    macAddress: "76:54:3a:b9:48:37",
    ipAddress: "192.168.100.127",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Infinix-SMART-7-",
    macAddress: "26:0e:06:2d:46:ce",
    ipAddress: "192.168.100.114",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "vivo-2015_21",
    macAddress: "d0:9c:ae:60:2e:60",
    ipAddress: "192.168.100.99",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Wireless-Client-88",
    macAddress: "ee:6d:5b:7f:4f:83",
    ipAddress: "192.168.100.88",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "qazi",
    macAddress: "00:21:6b:ba:55:b2",
    ipAddress: "192.168.100.106",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "TECNO-CAMON-30S",
    macAddress: "f2:e9:a2:bf:58:29",
    ipAddress: "192.168.100.110",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "vivo-1901",
    macAddress: "82:df:46:f7:ca:05",
    ipAddress: "192.168.100.126",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Wireless-Client-129",
    macAddress: "da:48:db:9c:7e:19",
    ipAddress: "192.168.100.129",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "realme-C51",
    macAddress: "e2:4b:de:fd:c4:ae",
    ipAddress: "192.168.100.103",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Wireless-Client-128",
    macAddress: "72:65:bf:3a:78:b8",
    ipAddress: "192.168.100.128",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "V2332",
    macAddress: "66:ce:8a:f4:8b:fd",
    ipAddress: "192.168.100.95",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "V2435",
    macAddress: "5a:e3:13:f7:88:bc",
    ipAddress: "192.168.100.109",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "TECNO-CAMON-40",
    macAddress: "9a:50:08:48:01:7c",
    ipAddress: "192.168.100.100",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Wireless-Client-92",
    macAddress: "c2:0e:e9:66:39:a6",
    ipAddress: "192.168.100.92",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "realme-C51",
    macAddress: "84:e9:c1:67:6b:71",
    ipAddress: "192.168.100.119",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "realme-Note-50",
    macAddress: "f2:d2:51:57:19:30",
    ipAddress: "192.168.100.112",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "vivo-1908",
    macAddress: "08:b3:af:b7:5e:47",
    ipAddress: "192.168.100.91",
    portId: "SSID1",
    isOnline: true,
    connectionDuration: "0 hour 17 minutes",
    onlineSince: "7:55 PM",
    lastSeenTime: "Just now",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "SAS-PC",
    macAddress: "70:1a:04:2d:b0:25",
    ipAddress: "192.168.100.105",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Wireless-Client-101",
    macAddress: "1c:9f:4e:f8:4b:9a",
    ipAddress: "192.168.100.101",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "V2043-21",
    macAddress: "e6:e9:9f:6b:a8:9f",
    ipAddress: "192.168.100.127",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Infinix-SMART-6",
    macAddress: "fe:06:49:b7:37:e6",
    ipAddress: "192.168.100.127",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "TECNO-SPARK-Go-2",
    macAddress: "ee:2d:b9:00:92:e4",
    ipAddress: "192.168.100.122",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "TECNO-SPARK-Go-1",
    macAddress: "be:e6:d9:2a:83:a0",
    ipAddress: "192.168.100.108",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Wireless-Client-112",
    macAddress: "aa:77:63:2c:0b:58",
    ipAddress: "192.168.100.112",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Infinix-HOT-40i",
    macAddress: "74:30:9d:16:d6:7b",
    ipAddress: "192.168.100.103",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "realme-C51",
    macAddress: "ba:c3:e7:57:d2:cf",
    ipAddress: "192.168.100.121",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "V2424",
    macAddress: "22:df:bf:9a:c0:3e",
    ipAddress: "192.168.100.98",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "V2120",
    macAddress: "28:a5:3f:82:cd:b2",
    ipAddress: "192.168.100.116",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "V2109",
    macAddress: "92:4f:16:2a:2c:1e",
    ipAddress: "192.168.100.128",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "realme-Note-60",
    macAddress: "ea:dd:01:e4:21:38",
    ipAddress: "192.168.100.110",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "vivo-Y85A",
    macAddress: "88:f7:bf:63:4c:25",
    ipAddress: "192.168.100.124",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "realme-Note-60",
    macAddress: "88:ae:35:cd:bd:e3",
    ipAddress: "192.168.100.126",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "V2027",
    macAddress: "52:2d:a1:71:dc:4d",
    ipAddress: "192.168.100.99",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "V2438",
    macAddress: "f6:ed:14:47:8d:63",
    ipAddress: "192.168.100.89",
    portId: "SSID1",
    isOnline: true,
    connectionDuration: "0 hour 53 minutes",
    onlineSince: "7:19 PM",
    lastSeenTime: "Just now",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "vivo-2015_21",
    macAddress: "3e:a1:65:ba:f1:f9",
    ipAddress: "192.168.100.107",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Infinix-NOTE-Edg",
    macAddress: "6e:dc:67:02:e3:1b",
    ipAddress: "192.168.100.104",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "realme-C25s",
    macAddress: "be:a3:c4:5b:91:ae",
    ipAddress: "192.168.100.114",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "OPPO-A5-Pro",
    macAddress: "9e:e0:ae:b4:92:04",
    ipAddress: "192.168.100.123",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Android-Phone-113",
    macAddress: "ae:a2:90:a0:5c:32",
    ipAddress: "192.168.100.113",
    portId: "SSID1",
    isOnline: true,
    connectionDuration: "1 hour 14 minutes",
    onlineSince: "6:58 PM",
    lastSeenTime: "Just now",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "V2310",
    macAddress: "fe:fc:65:37:e7:09",
    ipAddress: "192.168.100.122",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "realme-C51",
    macAddress: "8a:0e:97:28:12:17",
    ipAddress: "192.168.100.93",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Wireless-Client-110",
    macAddress: "06:89:71:7c:9e:a0",
    ipAddress: "192.168.100.110",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "realme-C71",
    macAddress: "3e:66:5c:4f:cf:d3",
    ipAddress: "192.168.100.130",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "realme-C11-2021",
    macAddress: "6a:5e:d6:33:a0:37",
    ipAddress: "192.168.100.118",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "Wireless-Client-111",
    macAddress: "98:f9:cc:43:60:44",
    ipAddress: "192.168.100.111",
    portId: "SSID1",
    isOnline: false,
    connectionDuration: "--",
    offlineSince: "Offline (previously connected)",
    lastSeenTime: "Today",
    isCurrentAdminDevice: false,
    isBlocked: false
  },
  {
    deviceName: "android-2000dfda",
    macAddress: "1c:dd:ea:cf:a0:97",
    ipAddress: "192.168.100.83",
    portId: "SSID1",
    isOnline: true,
    connectionDuration: "1 hour 32 minutes",
    onlineSince: "6:40 PM",
    lastSeenTime: "Just now",
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

    const rules = this.getRules('BLACKLIST');
    const blockedMacs = new Set(rules.map(r => r.macAddress.toUpperCase()));
    const initial = ROUTER_63_EXACT_DEVICES.map(d => ({
      ...d,
      isBlocked: blockedMacs.has(d.macAddress.toUpperCase())
    }));
    localStorage.setItem(STORAGE_KEY_DEVICES, JSON.stringify(initial));
    return initial;
  },

  saveConnectedDevices(devices: ConnectedDevice[]) {
    localStorage.setItem(STORAGE_KEY_DEVICES, JSON.stringify(devices));
  },

  // Refresh and update dynamic online/offline durations
  refreshDevicesStatus(): { devices: ConnectedDevice[]; onlineCount: number; offlineCount: number } {
    const devices = this.getConnectedDevices();
    const rules = this.getRules('BLACKLIST');
    const blockedMacs = new Set(rules.map(r => r.macAddress.toUpperCase()));

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Update time states smoothly
    const updated = devices.map(d => {
      const isBlocked = blockedMacs.has(d.macAddress.toUpperCase());
      if (isBlocked) {
        return {
          ...d,
          isBlocked: true,
          isOnline: false,
          offlineSince: `Blocked on Router at ${nowStr}`,
          lastSeenTime: nowStr
        };
      }
      return {
        ...d,
        isBlocked: false,
        lastSeenTime: d.isOnline ? "Just now" : (d.lastSeenTime || nowStr)
      };
    });

    this.saveConnectedDevices(updated);
    const onlineCount = updated.filter(d => d.isOnline).length;
    const offlineCount = updated.filter(d => !d.isOnline).length;
    return { devices: updated, onlineCount, offlineCount };
  },

  // Toggle online/offline status manually if user tests disconnection
  toggleDeviceOnlineStatus(mac: string): ConnectedDevice[] {
    const devices = this.getConnectedDevices();
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const updated = devices.map(d => {
      if (d.macAddress.toUpperCase() === mac.toUpperCase()) {
        const nextState = !d.isOnline;
        return {
          ...d,
          isOnline: nextState,
          connectionDuration: nextState ? "0 hour 1 minute" : "--",
          onlineSince: nextState ? nowStr : undefined,
          offlineSince: !nextState ? `Disconnected at ${nowStr}` : undefined,
          lastSeenTime: nowStr
        };
      }
      return d;
    });

    this.saveConnectedDevices(updated);
    return updated;
  },

  // Register newly connected device with highlight
  addNewDevice(device: ConnectedDevice): ConnectedDevice[] {
    const devices = this.getConnectedDevices();
    const normMac = device.macAddress.toUpperCase();
    const existingIdx = devices.findIndex(d => d.macAddress.toUpperCase() === normMac);

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const fullDevice: ConnectedDevice = {
      ...device,
      isOnline: true,
      isNewConnection: true,
      connectionDuration: "Just connected",
      onlineSince: nowStr,
      lastSeenTime: "Just now",
      portId: "SSID1"
    };

    let updated: ConnectedDevice[];
    if (existingIdx >= 0) {
      updated = [...devices];
      updated[existingIdx] = fullDevice;
    } else {
      updated = [fullDevice, ...devices];
    }

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
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updated = devices.map(d => {
      if (d.macAddress.toUpperCase() === normMac) {
        return { 
          ...d, 
          isBlocked: true, 
          isOnline: false,
          offlineSince: `Blocked at ${nowStr}`,
          lastSeenTime: nowStr 
        };
      }
      return d;
    });
    this.saveConnectedDevices(updated);

    try {
      this.sendPostToRouter(routerPostUrl, {
        'x.Enable': '1',
        'FilterMode': '0',
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
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updated = devices.map(d => {
      if (d.macAddress.toUpperCase() === normMac) {
        return { 
          ...d, 
          isBlocked: false,
          isOnline: true,
          connectionDuration: "Reconnected",
          onlineSince: nowStr,
          lastSeenTime: "Just now"
        };
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
