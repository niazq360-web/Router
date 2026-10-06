import React, { useState } from 'react';
import { Router, Shield, Key, Lock, Eye, EyeOff, RefreshCw, Save, CheckCircle, XCircle, AlertCircle, Trash2, Terminal } from 'lucide-react';
import { routerService } from '../services/routerService';
import { RouterCapabilityReport, RouterCredentials } from '../types';

export const CapabilitiesPage: React.FC = () => {
  const [creds, setCreds] = useState<RouterCredentials>(() => routerService.getStoredCredentials());
  const [report, setReport] = useState<RouterCapabilityReport | null>(() => routerService.getLatestReport());
  const [showPassword, setShowPassword] = useState(false);
  const [isProbing, setIsProbing] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [showLogs, setShowLogs] = useState(false);

  const handleTestConnection = async () => {
    setIsProbing(true);
    setStatusMsg(null);
    try {
      const res = await routerService.probeRouterCapabilities(creds.ip, creds.username, creds.password);
      setReport(res);
      setStatusMsg(`Connected to ${res.routerModel} successfully!`);
    } catch (e: any) {
      setStatusMsg(`Connection failed: ${e.message}`);
    } finally {
      setIsProbing(false);
    }
  };

  const handleSaveCreds = () => {
    routerService.saveCredentials(creds);
    setCreds({ ...creds, hasSaved: true });
    setStatusMsg('Credentials saved securely.');
  };

  const handleClearCreds = () => {
    routerService.clearCredentials();
    setCreds({ ip: '192.168.100.1', username: 'telecomadmin', password: '', hasSaved: false });
    setStatusMsg('Cleared saved credentials.');
  };

  const renderBadge = (status: 'SUPPORTED' | 'NOT_SUPPORTED' | 'UNKNOWN') => {
    if (status === 'SUPPORTED') {
      return <span className="badge badge-success"><CheckCircle size={12} style={{ marginRight: 4 }} /> SUPPORTED</span>;
    }
    if (status === 'NOT_SUPPORTED') {
      return <span className="badge badge-error"><XCircle size={12} style={{ marginRight: 4 }} /> NOT SUPPORTED</span>;
    }
    return <span className="badge badge-warning"><AlertCircle size={12} style={{ marginRight: 4 }} /> UNKNOWN</span>;
  };

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Model Recognition Banner */}
      <div style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', borderRadius: 16, padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ background: 'rgba(255,255,255,0.2)', padding: 12, borderRadius: 12 }}>
          <Router size={32} color="#ffffff" />
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Huawei EchoLife HS8145C5</h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#e0f2fe' }}>
            Recognized Web Interface: Home Page • One-Click Diagnosis • System Information • Advanced
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, fontSize: 12, color: '#bae6fd' }}>
            <Shield size={14} color="#6ee7b7" /> Local Subnet Management • Zero External Cloud Telemetry
          </div>
        </div>
      </div>

      {statusMsg && (
        <div style={{ background: '#1e293b', border: '1px solid #0284c7', borderRadius: 12, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 14 }}>{statusMsg}</span>
          <button onClick={() => setStatusMsg(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      {/* Settings Card */}
      <div style={{ background: '#1e293b', borderRadius: 16, padding: 24, border: '1px solid #334155' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}>Router Local Management Settings</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Router IP */}
          <div>
            <label style={{ fontSize: 13, color: '#94a3b8', display: 'block', marginBottom: 6 }}>Router IP</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <button 
                onClick={() => setCreds({ ...creds, ip: '192.168.100.1' })}
                style={{ padding: '4px 10px', fontSize: 12, borderRadius: 6, border: '1px solid #475569', background: creds.ip === '192.168.100.1' ? '#0284c7' : '#0f172a', color: '#fff', cursor: 'pointer' }}>
                192.168.100.1 (Detected in screenshot)
              </button>
              <button 
                onClick={() => setCreds({ ...creds, ip: '192.168.1.1' })}
                style={{ padding: '4px 10px', fontSize: 12, borderRadius: 6, border: '1px solid #475569', background: creds.ip === '192.168.1.1' ? '#0284c7' : '#0f172a', color: '#fff', cursor: 'pointer' }}>
                192.168.1.1
              </button>
            </div>
            <input 
              type="text" 
              value={creds.ip} 
              onChange={e => setCreds({ ...creds, ip: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 14 }}
            />
          </div>

          {/* Username */}
          <div>
            <label style={{ fontSize: 13, color: '#94a3b8', display: 'block', marginBottom: 6 }}>Administrator Username</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <button 
                onClick={() => setCreds({ ...creds, username: 'telecomadmin' })}
                style={{ padding: '4px 10px', fontSize: 12, borderRadius: 6, border: '1px solid #475569', background: creds.username === 'telecomadmin' ? '#0284c7' : '#0f172a', color: '#fff', cursor: 'pointer' }}>
                telecomadmin (Admin in screenshot)
              </button>
              <button 
                onClick={() => setCreds({ ...creds, username: 'admin' })}
                style={{ padding: '4px 10px', fontSize: 12, borderRadius: 6, border: '1px solid #475569', background: creds.username === 'admin' ? '#0284c7' : '#0f172a', color: '#fff', cursor: 'pointer' }}>
                admin
              </button>
            </div>
            <input 
              type="text" 
              value={creds.username} 
              onChange={e => setCreds({ ...creds, username: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 14 }}
            />
          </div>

          {/* Password */}
          <div>
            <label style={{ fontSize: 13, color: '#94a3b8', display: 'block', marginBottom: 6 }}>Administrator Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={creds.password} 
                onChange={e => setCreds({ ...creds, password: e.target.value })}
                placeholder="Enter password securely"
                style={{ width: '100%', padding: '10px 40px 10px 12px', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 14 }}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <span style={{ fontSize: 11, color: '#64748b', display: 'block', marginTop: 4 }}>
              Stored locally on your device with Web Crypto AES encryption. Never sent to external servers.
            </span>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button 
              onClick={handleTestConnection}
              disabled={isProbing}
              style={{ flex: 2, padding: '12px 20px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <RefreshCw size={18} className={isProbing ? 'spin' : ''} />
              {isProbing ? 'Probing...' : 'TEST ROUTER CONNECTION'}
            </button>
            <button 
              onClick={handleSaveCreds}
              style={{ flex: 1, padding: '12px', background: '#334155', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Save size={16} /> Save
            </button>
            {creds.hasSaved && (
              <button 
                onClick={handleClearCreds}
                title="Clear Credentials"
                style={{ padding: '12px 14px', background: '#451a1a', color: '#ef4444', border: '1px solid #ef4444', borderRadius: 8, cursor: 'pointer' }}>
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Detection Overview */}
      <div style={{ background: '#1e293b', borderRadius: 16, padding: 24, border: '1px solid #334155' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}>Real Connection & Capability Status</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
          <div style={{ background: '#0f172a', padding: 14, borderRadius: 10 }}>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>Router Model</div>
            <div style={{ fontSize: 15, fontWeight: 700, marginTop: 4 }}>{report?.routerModel || 'Not Tested'}</div>
          </div>
          <div style={{ background: '#0f172a', padding: 14, borderRadius: 10 }}>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>Firmware Version</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>{report?.firmwareVersion || 'Unknown'}</div>
          </div>
          <div style={{ background: '#0f172a', padding: 14, borderRadius: 10 }}>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>Authentication Status</div>
            <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4, color: report?.authStatus === 'SUCCESS' ? '#10b981' : '#f59e0b' }}>
              {report?.authStatus || 'NOT TESTED'}
            </div>
          </div>
          <div style={{ background: '#0f172a', padding: 14, borderRadius: 10 }}>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>MAC Filtering Capability</div>
            <div style={{ marginTop: 6 }}>{renderBadge(report?.macFilteringCapability || 'UNKNOWN')}</div>
          </div>
          <div style={{ background: '#0f172a', padding: 14, borderRadius: 10 }}>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>Connected Device Capability</div>
            <div style={{ marginTop: 6 }}>{renderBadge(report?.connectedDeviceCapability || 'UNKNOWN')}</div>
          </div>
        </div>
      </div>

      {/* 9-Point Capability Checklist */}
      <div style={{ background: '#1e293b', borderRadius: 16, padding: 24, border: '1px solid #334155' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>HS8145C5 Firmware Capability Audit</h3>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#94a3b8' }}>Real protocol verification points</p>
          </div>
          <span style={{ fontSize: 12, color: '#0284c7', fontWeight: 600 }}>9 Checklist Points</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { idx: 1, name: "Authenticate an administrator", status: report?.canAuthenticate || 'UNKNOWN' },
            { idx: 2, name: "Read connected Wi-Fi devices", status: report?.canReadConnectedDevices || 'UNKNOWN' },
            { idx: 3, name: "Read MAC filtering configuration", status: report?.canReadMacFilter || 'UNKNOWN' },
            { idx: 4, name: "Add a MAC address to blacklist", status: report?.canAddBlacklist || 'UNKNOWN' },
            { idx: 5, name: "Remove a MAC address from blacklist", status: report?.canRemoveBlacklist || 'UNKNOWN' },
            { idx: 6, name: "Read whitelist configuration", status: report?.canReadWhitelist || 'UNKNOWN' },
            { idx: 7, name: "Add a MAC address to whitelist", status: report?.canAddWhitelist || 'UNKNOWN' },
            { idx: 8, name: "Remove a MAC address from whitelist", status: report?.canRemoveWhitelist || 'UNKNOWN' },
            { idx: 9, name: "Enable/disable MAC filtering mode", status: report?.canToggleFilterMode || 'UNKNOWN' }
          ].map(item => (
            <div key={item.idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#0f172a', borderRadius: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#1e293b', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
                  {item.idx}
                </span>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{item.name}</span>
              </div>
              {renderBadge(item.status as any)}
            </div>
          ))}
        </div>
      </div>

      {/* Raw Diagnostics */}
      <div style={{ background: '#1e293b', borderRadius: 16, padding: 20, border: '1px solid #334155' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => setShowLogs(!showLogs)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Terminal size={18} color="#0284c7" />
            <span style={{ fontSize: 15, fontWeight: 600 }}>Raw HTTP Diagnostics & Probing Log</span>
          </div>
          <button style={{ background: 'none', border: 'none', color: '#0284c7', cursor: 'pointer', fontSize: 13 }}>
            {showLogs ? 'Hide' : 'Show Logs'}
          </button>
        </div>
        {showLogs && (
          <pre style={{ marginTop: 14, background: '#0f172a', color: '#38bdf8', padding: 14, borderRadius: 8, fontSize: 12, overflowX: 'auto', fontFamily: 'monospace' }}>
            {report?.rawDiagnostics || 'No probe logs recorded yet. Click [TEST ROUTER CONNECTION] above.'}
          </pre>
        )}
      </div>
    </div>
  );
};
