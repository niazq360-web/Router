export type CapabilityStatus = 'SUPPORTED' | 'NOT_SUPPORTED' | 'UNKNOWN';

export type AuthStatus = 
  | 'NOT_TESTED'
  | 'SUCCESS'
  | 'FAILED_BAD_CREDENTIALS'
  | 'FAILED_TIMEOUT'
  | 'FAILED_UNREACHABLE';

export interface RouterCapabilityReport {
  routerModel: string;
  firmwareVersion: string;
  authStatus: AuthStatus;
  macFilteringCapability: CapabilityStatus;
  connectedDeviceCapability: CapabilityStatus;
  // 9-point checklist
  canAuthenticate: CapabilityStatus;
  canReadConnectedDevices: CapabilityStatus;
  canReadMacFilter: CapabilityStatus;
  canAddBlacklist: CapabilityStatus;
  canRemoveBlacklist: CapabilityStatus;
  canReadWhitelist: CapabilityStatus;
  canAddWhitelist: CapabilityStatus;
  canRemoveWhitelist: CapabilityStatus;
  canToggleFilterMode: CapabilityStatus;
  rawDiagnostics: string;
  timestamp: number;
}

export interface ConnectedDevice {
  macAddress: string;
  ipAddress: string;
  deviceName: string;
  isOnline: boolean;
  wifiBand: string;
  rssi?: number;
  isCurrentAdminDevice?: boolean;
}

export interface MacFilterRule {
  id: string;
  macAddress: string;
  deviceName: string;
  ruleType: 'BLACKLIST' | 'WHITELIST';
  isSyncedToRouter: boolean;
  routerConfirmed: boolean;
  statusMessage: string;
  updatedAt: number;
}

export interface RouterCredentials {
  ip: string;
  username: string;
  password: string;
  hasSaved: boolean;
}
