import React, { useState } from 'react';
import { Ban, Plus, Trash2, ShieldAlert } from 'lucide-react';
import { routerService, MAC_REGEX } from '../services/routerService';
import { MacFilterRule } from '../types';

export const BlacklistPage: React.FC = () => {
  const [rules, setRules] = useState<MacFilterRule[]>(() => routerService.getRules('BLACKLIST'));
  const [showAdd, setShowAdd] = useState(false);
  const [newMac, setNewMac] = useState('');
  const [newName, setNewName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMac = newMac.trim().toUpperCase();
    if (!MAC_REGEX.test(cleanMac)) {
      setError('Invalid MAC address format. Expected: AA:BB:CC:DD:EE:FF');
      return;
    }

    routerService.addRule(cleanMac, newName, 'BLACKLIST');
    setRules(routerService.getRules('BLACKLIST'));
    setNewMac('');
    setNewName('');
    setShowAdd(false);
    setError(null);
  };

  const handleRemove = (mac: string) => {
    routerService.removeRule(mac, 'BLACKLIST');
    setRules(routerService.getRules('BLACKLIST'));
  };

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Router Blacklist</h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#94a3b8' }}>
            {rules.length} MAC addresses blocked from connecting to your Wi-Fi
          </p>
        </div>

        <button 
          onClick={() => setShowAdd(true)}
          style={{ padding: '8px 16px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600 }}>
          <Plus size={16} /> Add MAC to Blacklist
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} style={{ background: '#1e293b', border: '1px solid #ef4444', borderRadius: 14, padding: 18 }}>
          <h3 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 600, color: '#ef4444' }}>Add Blocked MAC Address</h3>
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
              placeholder="Device Label (Optional)" 
              value={newName} 
              onChange={e => setNewName(e.target.value)}
              style={{ flex: 1, minWidth: 160, padding: '8px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#fff' }}
            />
            <button type="submit" style={{ padding: '8px 16px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>
              Confirm Block
            </button>
            <button type="button" onClick={() => setShowAdd(false)} style={{ padding: '8px 12px', background: '#334155', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {rules.length === 0 ? (
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 14, padding: 40, textAlign: 'center' }}>
          <Ban size={48} color="#64748b" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Blacklist is Empty</h3>
          <p style={{ margin: '4px 0 16px', fontSize: 13, color: '#94a3b8' }}>
            No devices are currently restricted on the Huawei EchoLife ONT.
          </p>
          <button onClick={() => setShowAdd(true)} style={{ padding: '8px 16px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>
            Add Device
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {rules.map(rule => (
            <div key={rule.macAddress} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#451a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Ban size={18} color="#ef4444" />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{rule.deviceName}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'monospace' }}>{rule.macAddress}</div>
                  <div style={{ fontSize: 11, color: '#10b981', marginTop: 2 }}>{rule.statusMessage}</div>
                </div>
              </div>

              <button 
                onClick={() => handleRemove(rule.macAddress)}
                title="Unblock"
                style={{ padding: '6px 10px', background: '#0f172a', border: '1px solid #ef4444', color: '#ef4444', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                <Trash2 size={14} /> Unblock
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
