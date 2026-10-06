import React, { useState } from 'react';
import { Home, Activity, Info, Filter, Wifi, ExternalLink, RefreshCw } from 'lucide-react';
import { routerService } from '../services/routerService';

export const ConsolePage: React.FC = () => {
  const creds = routerService.getStoredCredentials();
  const baseUrl = `http://${creds.ip.trim()}`;
  const [currentPath, setCurrentPath] = useState('/index.asp');

  const shortcuts = [
    { name: 'Home Page', path: '/index.asp', icon: Home },
    { name: 'One-Click Diagnosis', path: '/html/bbsp/maintenance/diagnose.asp', icon: Activity },
    { name: 'System Information', path: '/html/bbsp/systeminfo/deviceinfo.asp', icon: Info },
    { name: 'WLAN MAC Filter', path: '/html/bbsp/wlanmacfilter/wlanmacfilter.asp', icon: Filter },
    { name: 'User Devices', path: '/html/bbsp/userdevinfo/userdevinfo.asp', icon: Wifi }
  ];

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Top Console Bar */}
      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 16, padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#0284c7' }} />
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>HS8145C5 Web Console</h2>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#94a3b8' }}>
              Target Gateway: <code style={{ color: '#38bdf8' }}>{baseUrl}{currentPath}</code>
            </p>
          </div>

          <a 
            href={`${baseUrl}${currentPath}`} 
            target="_blank" 
            rel="noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: '#0284c7', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
            <ExternalLink size={16} /> Open in Gateway Browser
          </a>
        </div>

        {/* Shortcuts matching the screenshot */}
        <div style={{ display: 'flex', gap: 8, marginTop: 14, overflowX: 'auto', paddingBottom: 4 }}>
          {shortcuts.map(s => {
            const IconComp = s.icon;
            const isSelected = currentPath === s.path;
            return (
              <button
                key={s.path}
                onClick={() => setCurrentPath(s.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: isSelected ? '1px solid #0284c7' : '1px solid #334155',
                  background: isSelected ? '#0284c7' : '#0f172a',
                  color: isSelected ? '#fff' : '#cbd5e1',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}>
                <IconComp size={14} />
                {s.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Frame Container */}
      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 16, overflow: 'hidden', height: 650, display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: '#0f172a', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155' }}>
          <span style={{ fontSize: 13, color: '#94a3b8', fontFamily: 'monospace' }}>{baseUrl}{currentPath}</span>
          <button 
            onClick={() => {
              const f = document.getElementById('router-frame') as HTMLIFrameElement;
              if (f) f.src = f.src;
            }}
            style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
            <RefreshCw size={14} /> Reload
          </button>
        </div>

        <iframe 
          id="router-frame"
          src={`${baseUrl}${currentPath}`}
          title="Huawei HS8145C5 Console"
          style={{ width: '100%', height: '100%', border: 'none', background: '#ffffff' }}
          sandbox="allow-same-origin allow-scripts allow-forms"
        />
      </div>

      <div style={{ background: '#0f172a', padding: 12, borderRadius: 10, fontSize: 12, color: '#64748b', textAlign: 'center' }}>
        Note: Modern browsers block HTTP iframes when hosted on HTTPS (Mixed Content policy). If your browser prevents embedding, click <strong>"Open in Gateway Browser"</strong> above to manage the ONT directly.
      </div>
    </div>
  );
};
