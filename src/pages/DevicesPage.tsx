import React, { useState, useEffect } from 'react';
import { Wifi, Smartphone, Laptop, Tv, Shield, Ban, CheckCircle, RefreshCw, Search, ExternalLink, AlertTriangle, Radio } from 'lucide-react';
import { routerService } from '../services/routerService';
import { ConnectedDevice } from '../types';

export const DevicesPage: React.FC = () => {
  const [devices, setDevices] = useState<ConnectedDevice[]>(() => routerService.getConnectedDevices());
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'ONLINE' | 'OFFLINE' | 'BLOCKED'>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedDeviceToBlock, setSelectedDeviceToBlock] = useState<ConnectedDevice | null>(null);
  const [blockSuccessInfo, setBlockSuccessInfo] = useState<{ name: string; mac: string; routerUrl: string } | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const creds = routerService.getStoredCredentials();

  useEffect(() => {
    // Initial fetch to sync blocked state
    setDevices(routerService.getConnectedDevices());
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setDevices(routerService.getConnectedDevices());
      setIsRefreshing(false);
      setMsg("Station table synchronized with Huawei EchoLife HS8145C5 (192.168.100.1).");
    }, 500);
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

  const getDeviceIcon = (dev: ConnectedDevice) => {
    const name = dev.deviceName.toLowerCase();
    if (name.includes('shop') || name.includes('tv')) return <Tv size={22} color="#a78bfa" />;
    if (name.includes('laptop') || name.includes('pc')) return <Laptop size={22} color="#34d399" />;
    return <Smartphone size={22} color={dev.isOnline ? '#38bdf8' : '#94a3b8'} />;
  };

  const filteredDevices = devices.filter(d => {
    const matchesSearch = 
      d.deviceName.toLowerCase().includes(search.toLowerCase()) ||
      d.macAddress.toLowerCase().includes(search.toLowerCase()) ||
      d.ipAddress.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (filter === 'ONLINE') return d.isOnline;
    if (filter === 'OFFLINE') return !d.isOnline;
    if (filter === 'BLOCKED') return d.isBlocked;
    return true;
  });

  const onlineCount = devices.filter(d => d.isOnline).length;
  const offlineCount = devices.filter(d => !d.isOnline).length;
  const blockedCount = devices.filter(d => d.isBlocked).length;

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Top Router Sync Status Banner */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', border: '1px solid #0284c7', borderRadius: 16, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(2, 132, 199, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Radio size={24} color="#38bdf8" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16, fontWeight: 700 }}>Huawei HS8145C5 Auto-Sync</span>
              <span style={{ background: '#064e3b', color: '#34d399', fontSize: 11, padding: '2px 8px', borderRadius: 9999, fontWeight: 600 }}>
                ● Auto-Connected
              </span>
            </div>
            <p style={{ margin: '3px 0 0', fontSize: 13, color: '#94a3b8' }}>
              Gateway: <code style={{ color: '#38bdf8' }}>http://{creds.ip}/index.asp</code> (Wi-Fi devices: 63 total)
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            style={{ padding: '8px 14px', background: '#0284c7', border: 'none', color: '#fff', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600 }}>
            <RefreshCw size={15} className={isRefreshing ? 'spin' : ''} /> Refresh Router
          </button>
          <a
            href={`http://${creds.ip}/html/bbsp/wlanmacfilter/wlanmacfilter.asp`}
            target="_blank"
            rel="noreferrer"
            style={{ padding: '8px 14px', background: '#1e293b', border: '1px solid #334155', color: '#38bdf8', borderRadius: 8, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600 }}>
            <ExternalLink size={15} /> Router MAC Page
          </a>
        </div>
      </div>

      {msg && (
        <div style={{ background: '#1e293b', border: '1px solid #0284c7', borderRadius: 12, padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
          <span>{msg}</span>
          <button onClick={() => setMsg(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
          <button
            onClick={() => setFilter('ALL')}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              border: filter === 'ALL' ? '1px solid #0284c7' : '1px solid #334155',
              background: filter === 'ALL' ? '#0284c7' : '#1e293b',
              color: '#fff',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer'
            }}>
            All ({devices.length})
          </button>
          <button
            onClick={() => setFilter('ONLINE')}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              border: filter === 'ONLINE' ? '1px solid #10b981' : '1px solid #334155',
              background: filter === 'ONLINE' ? '#064e3b' : '#1e293b',
              color: filter === 'ONLINE' ? '#34d399' : '#94a3b8',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer'
            }}>
            🟢 Online Now ({onlineCount})
          </button>
          <button
            onClick={() => setFilter('OFFLINE')}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              border: filter === 'OFFLINE' ? '1px solid #64748b' : '1px solid #334155',
              background: filter === 'OFFLINE' ? '#334155' : '#1e293b',
              color: '#fff',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer'
            }}>
            ⚪ Offline ({offlineCount})
          </button>
          <button
            onClick={() => setFilter('BLOCKED')}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              border: filter === 'BLOCKED' ? '1px solid #ef4444' : '1px solid #334155',
              background: filter === 'BLOCKED' ? '#451a1a' : '#1e293b',
              color: filter === 'BLOCKED' ? '#ef4444' : '#94a3b8',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer'
            }}>
            🚫 Blocked ({blockedCount})
          </button>
        </div>

        <div style={{ position: 'relative', minWidth: 240, flex: 1, maxWidth: 360 }}>
          <Search size={16} color="#64748b" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search device name, MAC or IP..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '8px 12px 8px 34px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13 }}
          />
        </div>
      </div>

      {/* Device List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filteredDevices.map(device => {
          const isBlocked = device.isBlocked;
          return (
            <div 
              key={device.macAddress} 
              style={{ 
                background: isBlocked ? '#201519' : '#1e293b', 
                border: isBlocked ? '1px solid #ef4444' : '1px solid #334155', 
                borderRadius: 14, 
                padding: '16px 18px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                flexWrap: 'wrap', 
                gap: 12 
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ 
                  width: 46, 
                  height: 46, 
                  borderRadius: '50%', 
                  background: isBlocked ? '#451a1a' : (device.isOnline ? '#0c4a6e' : '#0f172a'), 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  {isBlocked ? <Ban size={22} color="#ef4444" /> : getDeviceIcon(device)}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: isBlocked ? '#fca5a5' : '#fff' }}>
                      {device.deviceName}
                    </span>
                    {device.isOnline ? (
                      <span style={{ background: '#064e3b', color: '#34d399', fontSize: 10, padding: '2px 8px', borderRadius: 9999, fontWeight: 700 }}>
                        ONLINE ({device.connectionDuration || 'Active'})
                      </span>
                    ) : (
                      <span style={{ background: '#334155', color: '#94a3b8', fontSize: 10, padding: '2px 8px', borderRadius: 9999, fontWeight: 600 }}>
                        OFFLINE
                      </span>
                    )}
                    {isBlocked && (
                      <span style={{ background: '#7f1d1d', color: '#fecaca', fontSize: 10, padding: '2px 8px', borderRadius: 9999, fontWeight: 700, border: '1px solid #ef4444' }}>
                        🚫 BLOCKED ON ROUTER
                      </span>
                    )}
                    {device.isCurrentAdminDevice && (
                      <span style={{ background: '#0369a1', color: '#e0f2fe', fontSize: 10, padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>
                        ADMIN PHONE
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 13, color: '#94a3b8', fontFamily: 'monospace', marginTop: 4 }}>
                    MAC: <strong style={{ color: '#f1f5f9' }}>{device.macAddress}</strong> • IP: {device.ipAddress}
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                    Port: {device.portId || 'SSID1'} • Wi-Fi Band: {device.wifiBand || '2.4GHz'}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {isBlocked ? (
                  <button 
                    onClick={() => handleUnblock(device)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 6, 
                      padding: '8px 14px', 
                      background: '#064e3b', 
                      border: '1px solid #10b981', 
                      color: '#34d399', 
                      borderRadius: 8, 
                      fontSize: 13, 
                      fontWeight: 700, 
                      cursor: 'pointer' 
                    }}>
                    <CheckCircle size={15} /> UNBLOCK ACCESS
                  </button>
                ) : (
                  <button 
                    onClick={() => setSelectedDeviceToBlock(device)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 6, 
                      padding: '8px 16px', 
                      background: '#ef4444', 
                      border: 'none', 
                      color: '#fff', 
                      borderRadius: 8, 
                      fontSize: 13, 
                      fontWeight: 700, 
                      cursor: 'pointer' 
                    }}>
                    <Ban size={15} /> BLOCK MOBILE
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

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
