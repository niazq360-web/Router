import React, { useState } from 'react';
import { Wifi, Smartphone, Laptop, Tv, Shield, Ban, CheckCircle, RefreshCw } from 'lucide-react';
import { routerService } from '../services/routerService';
import { ConnectedDevice } from '../types';

export const DevicesPage: React.FC = () => {
  const [devices, setDevices] = useState<ConnectedDevice[]>(() => routerService.getConnectedDevices());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setDevices(routerService.getConnectedDevices());
      setIsRefreshing(false);
      setMsg("Connected devices refreshed from router station table.");
    }, 600);
  };

  const handleBlock = (dev: ConnectedDevice) => {
    routerService.addRule(dev.macAddress, dev.deviceName, 'BLACKLIST');
    setMsg(`Device ${dev.deviceName} (${dev.macAddress}) added to Blacklist.`);
  };

  const handleWhitelist = (dev: ConnectedDevice) => {
    routerService.addRule(dev.macAddress, dev.deviceName, 'WHITELIST');
    setMsg(`Device ${dev.deviceName} (${dev.macAddress}) added to Whitelist.`);
  };

  const getDeviceIcon = (dev: ConnectedDevice) => {
    if (dev.isCurrentAdminDevice) return <Smartphone size={22} color="#38bdf8" />;
    if (dev.deviceName.toLowerCase().includes('tv')) return <Tv size={22} color="#a78bfa" />;
    if (dev.deviceName.toLowerCase().includes('laptop')) return <Laptop size={22} color="#34d399" />;
    return <Wifi size={22} color="#94a3b8" />;
  };

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Connected Devices</h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#94a3b8' }}>
            {devices.length} devices discovered via Huawei HS8145C5 station table
          </p>
        </div>

        <button 
          onClick={handleRefresh}
          disabled={isRefreshing}
          style={{ padding: '8px 14px', background: '#1e293b', border: '1px solid #334155', color: '#fff', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <RefreshCw size={15} className={isRefreshing ? 'spin' : ''} /> Refresh
        </button>
      </div>

      {msg && (
        <div style={{ background: '#1e293b', border: '1px solid #0284c7', borderRadius: 12, padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
          <span>{msg}</span>
          <button onClick={() => setMsg(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {devices.map(device => (
          <div key={device.macAddress} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 14, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {getDeviceIcon(device)}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 15, fontWeight: 700 }}>{device.deviceName}</span>
                  {device.isCurrentAdminDevice && (
                    <span style={{ background: '#0369a1', color: '#e0f2fe', fontSize: 10, padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>
                      YOU (ADMIN)
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 13, color: '#94a3b8', fontFamily: 'monospace', marginTop: 2 }}>
                  MAC: {device.macAddress}
                </div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                  IP: {device.ipAddress} • Band: {device.wifiBand}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button 
                onClick={() => handleWhitelist(device)}
                style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', background: '#0f172a', border: '1px solid #334155', color: '#10b981', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                <CheckCircle size={14} /> Whitelist
              </button>
              <button 
                onClick={() => handleBlock(device)}
                disabled={device.isCurrentAdminDevice}
                style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', background: device.isCurrentAdminDevice ? '#1e293b' : '#451a1a', border: device.isCurrentAdminDevice ? '1px solid #334155' : '1px solid #ef4444', color: device.isCurrentAdminDevice ? '#64748b' : '#ef4444', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: device.isCurrentAdminDevice ? 'not-allowed' : 'pointer' }}>
                <Ban size={14} /> {device.isCurrentAdminDevice ? 'Protected' : 'Block'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
