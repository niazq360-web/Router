import React, { useState, useEffect } from 'react';
import { Smartphone, Laptop, Tv, Ban, CheckCircle, RefreshCw, Search, ExternalLink, AlertTriangle, Radio, UserPlus, BellRing, Clock, Wifi, Power } from 'lucide-react';
import { routerService } from '../services/routerService';
import { ConnectedDevice } from '../types';

export const DevicesPage: React.FC = () => {
  const [devices, setDevices] = useState<ConnectedDevice[]>(() => routerService.getConnectedDevices());
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'SPLIT' | 'ONLINE_ONLY' | 'OFFLINE_ONLY' | 'NEW_ONLY' | 'BLOCKED_ONLY'>('SPLIT');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [newDeviceAlert, setNewDeviceAlert] = useState<string | null>(null);
  
  // Add new device modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDevName, setNewDevName] = useState('');
  const [newDevMac, setNewDevMac] = useState('');
  const [newDevIp, setNewDevIp] = useState('');
  
  // Block action state
  const [selectedDeviceToBlock, setSelectedDeviceToBlock] = useState<ConnectedDevice | null>(null);
  const [blockSuccessInfo, setBlockSuccessInfo] = useState<{ name: string; mac: string; routerUrl: string } | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const creds = routerService.getStoredCredentials();

  useEffect(() => {
    setDevices(routerService.getConnectedDevices());
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const res = routerService.refreshDevicesStatus();
      setDevices(res.devices);
      setIsRefreshing(false);
      setMsg(`Station list refreshed: ${res.onlineCount} Online, ${res.offlineCount} Offline (Total 63).`);
    }, 600);
  };

  const handleToggleOnline = (dev: ConnectedDevice) => {
    const updated = routerService.toggleDeviceOnlineStatus(dev.macAddress);
    setDevices(updated);
    const target = updated.find(d => d.macAddress === dev.macAddress);
    if (target?.isOnline) {
      setMsg(`🟢 ${dev.deviceName} ab ONLINE ho gaya hai (Time: ${target.onlineSince}).`);
    } else {
      setMsg(`⚪ ${dev.deviceName} ab OFFLINE ho gaya hai (Time: ${target?.offlineSince}).`);
    }
  };

  const handleConfirmBlock = async () => {
    if (!selectedDeviceToBlock) return;
    const dev = selectedDeviceToBlock;
    const res = await routerService.blockDeviceOnRouter(dev.macAddress, dev.deviceName, creds.ip);
    setDevices(routerService.getConnectedDevices());
    setSelectedDeviceToBlock(null);
    setBlockSuccessInfo({
      name: dev.deviceName,
      mac: dev.macAddress,
      routerUrl: res.routerUrl
    });
  };

  const handleUnblock = async (dev: ConnectedDevice) => {
    await routerService.unblockDeviceOnRouter(dev.macAddress, creds.ip);
    setDevices(routerService.getConnectedDevices());
    setMsg(`Device ${dev.deviceName} (${dev.macAddress}) unblocked on Huawei router.`);
  };

  const handleAddNewDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDevMac.trim()) return;
    const cleanMac = newDevMac.trim().toUpperCase();
    const cleanIp = newDevIp.trim() || `192.168.100.${Math.floor(Math.random() * 80) + 160}`;
    const cleanName = newDevName.trim() || `New-Mobile-${cleanMac.slice(-5)}`;

    const newDev: ConnectedDevice = {
      deviceName: cleanName,
      macAddress: cleanMac,
      ipAddress: cleanIp,
      portId: "SSID1",
      isOnline: true,
      isNewConnection: true,
      connectionDuration: "0 hour 1 minute",
      wifiBand: "2.4GHz",
      isCurrentAdminDevice: false,
      isBlocked: false
    };

    const updated = routerService.addNewDevice(newDev);
    setDevices(updated);
    setShowAddModal(false);
    setNewDevName('');
    setNewDevMac('');
    setNewDevIp('');
    setNewDeviceAlert(`🔔 Naya device connect ho gaya: ${cleanName} (${cleanMac}) - "New Connections" mein show ho raha hai!`);
  };

  const getDeviceIcon = (dev: ConnectedDevice) => {
    const name = dev.deviceName.toLowerCase();
    if (name.includes('shop') || name.includes('tv')) return <Tv size={20} color="#a78bfa" />;
    if (name.includes('laptop') || name.includes('pc') || name.includes('sas')) return <Laptop size={20} color="#34d399" />;
    return <Smartphone size={20} color={dev.isOnline ? '#38bdf8' : '#94a3b8'} />;
  };

  const filteredDevices = devices.filter(d => {
    const term = search.toLowerCase();
    return (
      d.deviceName.toLowerCase().includes(term) ||
      d.macAddress.toLowerCase().includes(term) ||
      d.ipAddress.toLowerCase().includes(term)
    );
  });

  const onlineDevices = filteredDevices.filter(d => d.isOnline);
  const offlineDevices = filteredDevices.filter(d => !d.isOnline);
  const newConnections = filteredDevices.filter(d => d.isNewConnection);
  const blockedDevices = filteredDevices.filter(d => d.isBlocked);

  const renderDeviceCard = (device: ConnectedDevice) => {
    const isBlocked = device.isBlocked;
    return (
      <div 
        key={device.macAddress} 
        style={{ 
          background: isBlocked ? '#201519' : (device.isOnline ? '#162338' : '#1e293b'), 
          border: isBlocked ? '1px solid #ef4444' : (device.isOnline ? '1px solid #0284c7' : '1px solid #334155'), 
          borderRadius: 14, 
          padding: '14px 16px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: 12 
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ 
            width: 44, 
            height: 44, 
            borderRadius: '50%', 
            background: isBlocked ? '#451a1a' : (device.isOnline ? '#0369a1' : '#0f172a'), 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexShrink: 0
          }}>
            {isBlocked ? <Ban size={20} color="#ef4444" /> : getDeviceIcon(device)}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: isBlocked ? '#fca5a5' : '#fff' }}>
                {device.deviceName}
              </span>
              
              {device.isNewConnection && (
                <span style={{ background: '#0284c7', color: '#fff', fontSize: 10, padding: '2px 8px', borderRadius: 9999, fontWeight: 700, animation: 'pulse 2s infinite' }}>
                  🆕 NEW CONNECTION
                </span>
              )}

              {device.isOnline ? (
                <span style={{ background: '#064e3b', color: '#34d399', fontSize: 10, padding: '2px 8px', borderRadius: 9999, fontWeight: 700 }}>
                  ● ONLINE ({device.connectionDuration || 'Active'})
                </span>
              ) : (
                <span style={{ background: '#334155', color: '#94a3b8', fontSize: 10, padding: '2px 8px', borderRadius: 9999, fontWeight: 600 }}>
                  OFFLINE
                </span>
              )}

              {isBlocked && (
                <span style={{ background: '#7f1d1d', color: '#fecaca', fontSize: 10, padding: '2px 8px', borderRadius: 9999, fontWeight: 700, border: '1px solid #ef4444' }}>
                  🚫 BLOCKED
                </span>
              )}

              {device.isCurrentAdminDevice && (
                <span style={{ background: '#0284c7', color: '#fff', fontSize: 10, padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>
                  ADMIN PHONE
                </span>
              )}
            </div>

            <div style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'monospace', marginTop: 3 }}>
              MAC: <strong style={{ color: '#f1f5f9' }}>{device.macAddress}</strong> • IP: {device.ipAddress}
            </div>

            {/* Time Indicator - Exact duration/time online or offline */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, marginTop: 4 }}>
              <Clock size={12} color={device.isOnline ? '#34d399' : '#94a3b8'} />
              {device.isOnline ? (
                <span style={{ color: '#6ee7b7' }}>
                  Online Time: <strong>{device.connectionDuration}</strong> {device.onlineSince ? `(Connected at ${device.onlineSince})` : ''}
                </span>
              ) : (
                <span style={{ color: '#94a3b8' }}>
                  Status: <strong>{device.offlineSince || 'Offline (previously connected)'}</strong> • Last seen: {device.lastSeenTime || 'Today'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Quick Toggle State (Simulate Disconnect/Reconnect) */}
          <button
            onClick={() => handleToggleOnline(device)}
            title={device.isOnline ? "Simulate Disconnection (Mark Offline)" : "Simulate Connection (Mark Online)"}
            style={{
              padding: '6px 10px',
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: 8,
              color: device.isOnline ? '#34d399' : '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 11
            }}>
            <Power size={13} color={device.isOnline ? '#34d399' : '#64748b'} />
            {device.isOnline ? 'Go Offline' : 'Go Online'}
          </button>

          {isBlocked ? (
            <button 
              onClick={() => handleUnblock(device)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 6, 
                padding: '6px 14px', 
                background: '#064e3b', 
                border: '1px solid #10b981', 
                color: '#34d399', 
                borderRadius: 8, 
                fontSize: 12, 
                fontWeight: 700, 
                cursor: 'pointer' 
              }}>
              <CheckCircle size={14} /> UNBLOCK
            </button>
          ) : (
            <button 
              onClick={() => setSelectedDeviceToBlock(device)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 6, 
                padding: '6px 14px', 
                background: '#ef4444', 
                border: 'none', 
                color: '#fff', 
                borderRadius: 8, 
                fontSize: 12, 
                fontWeight: 700, 
                cursor: 'pointer' 
              }}>
              <Ban size={14} /> BLOCK MOBILE
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Top Banner with 63 Devices Count & Refresh Indicator */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', border: '1px solid #0284c7', borderRadius: 16, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 46, height: 46, borderRadius: 12, background: 'rgba(2, 132, 199, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Radio size={26} color="#38bdf8" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 17, fontWeight: 700 }}>Huawei HS8145C5 (Wi-Fi 63 Devices)</span>
              <span style={{ background: '#0284c7', color: '#fff', fontSize: 11, padding: '2px 8px', borderRadius: 9999, fontWeight: 700 }}>
                {devices.length} Total
              </span>
              <span style={{ background: '#064e3b', color: '#34d399', fontSize: 11, padding: '2px 8px', borderRadius: 9999, fontWeight: 700 }}>
                {onlineDevices.length} Online Now
              </span>
              <span style={{ background: '#334155', color: '#cbd5e1', fontSize: 11, padding: '2px 8px', borderRadius: 9999, fontWeight: 600 }}>
                {offlineDevices.length} Offline
              </span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#94a3b8' }}>
              Router website ke 63 devices ka live status • Online aur Offline alag alag show ho rahe hain
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button 
            onClick={() => setShowAddModal(true)}
            style={{ padding: '8px 14px', background: '#10b981', border: 'none', color: '#fff', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600 }}>
            <UserPlus size={15} /> + New Device
          </button>
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            style={{ padding: '8px 14px', background: '#0284c7', border: 'none', color: '#fff', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600 }}>
            <RefreshCw size={15} className={isRefreshing ? 'spin' : ''} /> REFRESH DEVICES
          </button>
        </div>
      </div>

      {newDeviceAlert && (
        <div style={{ background: '#064e3b', border: '1px solid #10b981', color: '#ecfdf5', borderRadius: 12, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BellRing size={18} color="#34d399" />
            <span>{newDeviceAlert}</span>
          </div>
          <button onClick={() => setNewDeviceAlert(null)} style={{ background: 'none', border: 'none', color: '#ecfdf5', cursor: 'pointer', fontSize: 14 }}>✕</button>
        </div>
      )}

      {msg && (
        <div style={{ background: '#1e293b', border: '1px solid #0284c7', borderRadius: 12, padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
          <span>{msg}</span>
          <button onClick={() => setMsg(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      {/* Filter and View Modes */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
          <button
            onClick={() => setViewMode('SPLIT')}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              border: viewMode === 'SPLIT' ? '1px solid #0284c7' : '1px solid #334155',
              background: viewMode === 'SPLIT' ? '#0284c7' : '#1e293b',
              color: '#fff',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer'
            }}>
            📋 Alag Alag View (Online & Offline)
          </button>
          <button
            onClick={() => setViewMode('ONLINE_ONLY')}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              border: viewMode === 'ONLINE_ONLY' ? '1px solid #10b981' : '1px solid #334155',
              background: viewMode === 'ONLINE_ONLY' ? '#064e3b' : '#1e293b',
              color: viewMode === 'ONLINE_ONLY' ? '#34d399' : '#94a3b8',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer'
            }}>
            🟢 Online ({onlineDevices.length})
          </button>
          <button
            onClick={() => setViewMode('OFFLINE_ONLY')}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              border: viewMode === 'OFFLINE_ONLY' ? '1px solid #64748b' : '1px solid #334155',
              background: viewMode === 'OFFLINE_ONLY' ? '#334155' : '#1e293b',
              color: '#fff',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer'
            }}>
            ⚪ Offline ({offlineDevices.length})
          </button>
          {newConnections.length > 0 && (
            <button
              onClick={() => setViewMode('NEW_ONLY')}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                border: viewMode === 'NEW_ONLY' ? '1px solid #38bdf8' : '1px solid #0369a1',
                background: viewMode === 'NEW_ONLY' ? '#0284c7' : '#0c4a6e',
                color: '#fff',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer'
              }}>
              🆕 New Connections ({newConnections.length})
            </button>
          )}
          <button
            onClick={() => setViewMode('BLOCKED_ONLY')}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              border: viewMode === 'BLOCKED_ONLY' ? '1px solid #ef4444' : '1px solid #334155',
              background: viewMode === 'BLOCKED_ONLY' ? '#451a1a' : '#1e293b',
              color: viewMode === 'BLOCKED_ONLY' ? '#ef4444' : '#94a3b8',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer'
            }}>
            🚫 Blocked ({blockedDevices.length})
          </button>
        </div>

        <div style={{ position: 'relative', minWidth: 240, flex: 1, maxWidth: 360 }}>
          <Search size={16} color="#64748b" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search 63 devices by name, MAC, IP..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '8px 12px 8px 34px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13 }}
          />
        </div>
      </div>

      {/* Main Devices Display */}
      {viewMode === 'SPLIT' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Section 1: New Connections (If any) */}
          {newConnections.length > 0 && (
            <div style={{ background: '#082f49', border: '1px solid #0284c7', borderRadius: 16, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#38bdf8' }} />
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#38bdf8' }}>
                  🆕 RECENTLY CONNECTED DEVICES ({newConnections.length})
                </h3>
                <span style={{ fontSize: 12, color: '#bae6fd' }}>• Naye devices jo abhi connect huye hain</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {newConnections.map(renderDeviceCard)}
              </div>
            </div>
          )}

          {/* Section 2: Online Devices */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#34d399' }}>
                🟢 ONLINE MOBILES & DEVICES ({onlineDevices.length})
              </h3>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>• Is waqt live internet chala rahe hain (Time duration show ho raha hai)</span>
            </div>

            {onlineDevices.length === 0 ? (
              <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 18, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                Koi online device search se match nahi hui.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {onlineDevices.map(renderDeviceCard)}
              </div>
            )}
          </div>

          {/* Section 3: Offline Devices */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#64748b' }} />
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#cbd5e1' }}>
                ⚪ OFFLINE / PREVIOUSLY CONNECTED DEVICES ({offlineDevices.length})
              </h3>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>• Router website history (Pehle connect ho chuke hain, disconnect time show ho raha hai)</span>
            </div>

            {offlineDevices.length === 0 ? (
              <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 18, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                Koi offline device search se match nahi hui.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {offlineDevices.map(renderDeviceCard)}
              </div>
            )}
          </div>
        </div>
      )}

      {viewMode === 'ONLINE_ONLY' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#34d399', marginBottom: 4 }}>
            🟢 Sirf Active Online Devices ({onlineDevices.length})
          </div>
          {onlineDevices.map(renderDeviceCard)}
        </div>
      )}

      {viewMode === 'OFFLINE_ONLY' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>
            ⚪ Sirf Offline Devices ({offlineDevices.length})
          </div>
          {offlineDevices.map(renderDeviceCard)}
        </div>
      )}

      {viewMode === 'NEW_ONLY' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#38bdf8', marginBottom: 4 }}>
            🆕 Naye Connect Hone Wale Devices ({newConnections.length})
          </div>
          {newConnections.map(renderDeviceCard)}
        </div>
      )}

      {viewMode === 'BLOCKED_ONLY' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#ef4444', marginBottom: 4 }}>
            🚫 Router Blacklist Par Blocked Devices ({blockedDevices.length})
          </div>
          {blockedDevices.length === 0 ? (
            <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 30, textAlign: 'center', color: '#94a3b8' }}>
              Abhi koi device block nahi hai.
            </div>
          ) : (
            blockedDevices.map(renderDeviceCard)
          )}
        </div>
      )}

      {/* Modal: Add New Device */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 100 }}>
          <form onSubmit={handleAddNewDevice} style={{ background: '#1e293b', border: '2px solid #10b981', borderRadius: 16, padding: 24, maxWidth: 480, width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#10b981', marginBottom: 14 }}>
              <UserPlus size={24} />
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Naya Device Add / Connect Karein</h3>
            </div>
            <p style={{ fontSize: 13, color: '#cbd5e1', margin: '0 0 16px' }}>
              Koi bhi naya mobile ya device jo router se connect ho, uski detail yahan enter karein (Yeh foran Online aur "New Connection" mein show hoga):
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 18 }}>
              <div>
                <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Device Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. New-Vivo-Phone ya Guest-Mobile"
                  value={newDevName} 
                  onChange={e => setNewDevName(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13 }}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>MAC Address</label>
                <input 
                  type="text" 
                  placeholder="e.g. AA:BB:CC:DD:EE:FF"
                  value={newDevMac} 
                  onChange={e => setNewDevMac(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13 }}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>IP Address (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. 192.168.100.155"
                  value={newDevIp} 
                  onChange={e => setNewDevIp(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13 }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button 
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{ padding: '8px 16px', background: '#334155', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                Cancel
              </button>
              <button 
                type="submit"
                style={{ padding: '8px 18px', background: '#10b981', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
                Add to Router List
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Confirmation Modal to Block Device */}
      {selectedDeviceToBlock && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 100 }}>
          <div style={{ background: '#1e293b', border: '2px solid #ef4444', borderRadius: 16, padding: 24, maxWidth: 500, width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#ef4444', marginBottom: 12 }}>
              <AlertTriangle size={24} />
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Confirm Block on Huawei Router</h3>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.5, color: '#cbd5e1', margin: '0 0 12px' }}>
              Are you sure you want to block this mobile from your router website?
            </p>
            <div style={{ background: '#0f172a', padding: 14, borderRadius: 10, marginBottom: 16, border: '1px solid #334155' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{selectedDeviceToBlock.deviceName}</div>
              <div style={{ fontSize: 13, color: '#94a3b8', fontFamily: 'monospace', marginTop: 4 }}>MAC: {selectedDeviceToBlock.macAddress}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>IP: {selectedDeviceToBlock.ipAddress} • SSID1</div>
            </div>
            <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 16px' }}>
              Yeh device Huawei HS8145C5 ke WLAN MAC Filter Blacklist mein add ho jayegi aur iska internet band ho jayega.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button 
                onClick={() => setSelectedDeviceToBlock(null)}
                style={{ padding: '8px 16px', background: '#334155', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                Cancel
              </button>
              <button 
                onClick={handleConfirmBlock}
                style={{ padding: '8px 18px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
                Yes, Block on Router
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Block Success & Router Verification Modal */}
      {blockSuccessInfo && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 100 }}>
          <div style={{ background: '#1e293b', border: '2px solid #10b981', borderRadius: 16, padding: 24, maxWidth: 520, width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#10b981', marginBottom: 12 }}>
              <CheckCircle size={26} />
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Mobile Blocked on Huawei Router!</h3>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.5, color: '#cbd5e1', margin: '0 0 12px' }}>
              <strong>{blockSuccessInfo.name}</strong> (<code>{blockSuccessInfo.mac}</code>) has been blocked from Huawei EchoLife HS8145C5.
            </p>
            <div style={{ background: '#0f172a', padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 13, color: '#38bdf8' }}>
              ✓ Command sent to: <code>http://{creds.ip}/html/bbsp/wlanmacfilter/wlanmacfilter.cgi</code><br/>
              ✓ Added to WLAN MAC Filter Blacklist (SSID1).
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <a
                href={blockSuccessInfo.routerUrl}
                target="_blank"
                rel="noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: '#0284c7', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
                <ExternalLink size={15} /> Verify on Router Webpage
              </a>
              <button 
                onClick={() => setBlockSuccessInfo(null)}
                style={{ padding: '8px 16px', background: '#334155', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
