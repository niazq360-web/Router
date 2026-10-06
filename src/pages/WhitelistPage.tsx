import React, { useState } from 'react';
import { ShieldCheck, Plus, Trash2, AlertTriangle, Lock } from 'lucide-react';
import { routerService, MAC_REGEX } from '../services/routerService';
import { MacFilterRule } from '../types';

export const WhitelistPage: React.FC = () => {
  const [rules, setRules] = useState<MacFilterRule[]>(() => routerService.getRules('WHITELIST'));
  const [whitelistMode, setWhitelistMode] = useState(false);
  const [showSafetyDialog, setShowSafetyDialog] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newMac, setNewMac] = useState('');
  const [newName, setNewName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const adminMac = "B4:F1:DA:8A:23:4C";

  const handleToggleMode = () => {
    if (!whitelistMode) {
      setShowSafetyDialog(true);
    } else {
      setWhitelistMode(false);
    }
  };

  const confirmEnableMode = () => {
    setWhitelistMode(true);
    setShowSafetyDialog(false);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMac = newMac.trim().toUpperCase();
    if (!MAC_REGEX.test(cleanMac)) {
      setError('Invalid MAC address format. Expected: AA:BB:CC:DD:EE:FF');
      return;
    }

    routerService.addRule(cleanMac, newName, 'WHITELIST');
    setRules(routerService.getRules('WHITELIST'));
    setNewMac('');
    setNewName('');
    setShowAdd(false);
    setError(null);
  };

  const handleRemove = (mac: string) => {
    if (mac === adminMac) {
      alert("Safety restriction: Cannot remove the administrator device from the whitelist.");
      return;
    }
    routerService.removeRule(mac, 'WHITELIST');
    setRules(routerService.getRules('WHITELIST'));
  };

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Whitelist Mode Toggle Card */}
      <div style={{ background: whitelistMode ? '#0284c7' : '#1e293b', border: '1px solid #334155', borderRadius: 16, padding: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={24} color="#fff" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Allow-Only-Selected-Devices Mode</h3>
            <p style={{ margin: '2px 0 0', fontSize: 13, color: whitelistMode ? '#e0f2fe' : '#94a3b8' }}>
              {whitelistMode ? 'ACTIVE: Only authorized whitelist devices can connect' : 'DISABLED: Standard Wi-Fi access enabled'}
            </p>
          </div>
        </div>

        <button 
          onClick={handleToggleMode}
          style={{ padding: '8px 18px', background: whitelistMode ? '#fff' : '#0284c7', color: whitelistMode ? '#0284c7' : '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
          {whitelistMode ? 'Disable Mode' : 'Enable Whitelist Mode'}
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Authorized Whitelist Devices</h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#94a3b8' }}>
            {rules.length} approved MAC addresses
          </p>
        </div>

        <button 
          onClick={() => setShowAdd(true)}
          style={{ padding: '8px 16px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600 }}>
          <Plus size={16} /> Add MAC to Whitelist
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} style={{ background: '#1e293b', border: '1px solid #0284c7', borderRadius: 14, padding: 18 }}>
          <h3 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 600, color: '#0284c7' }}>Authorize MAC Address</h3>
          {error && <div style={{ color: '#ef4444', fontSize: 12, marginBottom: 8 }}>{error}</div>}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <input 
              type="text" 
              placeholder="MAC (e.g. AA:BB:CC:DD:EE:FF)" 
              value={newMac} 
              onChange={e => setNewMac(e.target.value)}
              style={{ flex: 1, minWidth: 200, padding: '8px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#fff' }}
              required
            />
            <input 
              type="text" 
              placeholder="Device Label (e.g. Work Phone)" 
              value={newName} 
              onChange={e => setNewName(e.target.value)}
              style={{ flex: 1, minWidth: 160, padding: '8px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#fff' }}
            />
            <button type="submit" style={{ padding: '8px 16px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>
              Authorize MAC
            </button>
            <button type="button" onClick={() => setShowAdd(false)} style={{ padding: '8px 12px', background: '#334155', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {rules.length === 0 ? (
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 14, padding: 40, textAlign: 'center' }}>
          <ShieldCheck size={48} color="#64748b" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Whitelist is Empty</h3>
          <p style={{ margin: '4px 0 16px', fontSize: 13, color: '#94a3b8' }}>
            Add approved devices before turning on Allow-Only-Selected-Devices mode.
          </p>
          <button onClick={() => setShowAdd(true)} style={{ padding: '8px 16px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>
            Add Device
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {rules.map(rule => {
            const isAdmin = rule.macAddress === adminMac;
            return (
              <div key={rule.macAddress} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: isAdmin ? '#0284c7' : '#064e3b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isAdmin ? <Lock size={18} color="#fff" /> : <ShieldCheck size={18} color="#34d399" />}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{rule.deviceName}</span>
                      {isAdmin && (
                        <span style={{ background: '#0284c7', color: '#fff', fontSize: 10, padding: '1px 6px', borderRadius: 4, fontWeight: 700 }}>
                          ADMIN PROTECTED
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'monospace' }}>{rule.macAddress}</div>
                    <div style={{ fontSize: 11, color: '#10b981', marginTop: 2 }}>{rule.statusMessage}</div>
                  </div>
                </div>

                {!isAdmin && (
                  <button 
                    onClick={() => handleRemove(rule.macAddress)}
                    title="Remove from Whitelist"
                    style={{ padding: '6px 10px', background: '#0f172a', border: '1px solid #334155', color: '#94a3b8', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                    <Trash2 size={14} /> Remove
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Safety Modal */}
      {showSafetyDialog && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 100 }}>
          <div style={{ background: '#1e293b', border: '2px solid #ef4444', borderRadius: 16, padding: 24, maxWidth: 500, width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#ef4444', marginBottom: 12 }}>
              <AlertTriangle size={24} />
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>CRITICAL SAFETY WARNING</h3>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.5, color: '#cbd5e1' }}>
              Enabling Whitelist Mode immediately disconnects all devices on the Huawei EchoLife HS8145C5 that are not explicitly on this list.
            </p>
            <div style={{ background: '#0f172a', padding: 12, borderRadius: 8, margin: '12px 0', fontSize: 13 }}>
              <strong>Admin Safeguard Active:</strong> Administrator MAC (<code>{adminMac}</code>) is permanently preserved and cannot be disconnected.
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
              <button onClick={() => setShowSafetyDialog(false)} style={{ padding: '8px 16px', background: '#334155', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={confirmEnableMode} style={{ padding: '8px 16px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
                Confirm & Enable Whitelist
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
