import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { Router, Terminal, Monitor, Wifi, Ban, ShieldCheck, Shield } from 'lucide-react';
import { CapabilitiesPage } from './pages/CapabilitiesPage';
import { ConsolePage } from './pages/ConsolePage';
import { DevicesPage } from './pages/DevicesPage';
import { BlacklistPage } from './pages/BlacklistPage';
import { WhitelistPage } from './pages/WhitelistPage';
import { SecurityPage } from './pages/SecurityPage';
import { routerService } from './services/routerService';

export const App: React.FC = () => {
  const creds = routerService.getStoredCredentials();

  const navItems = [
    { to: '/', label: 'Audit', icon: Terminal },
    { to: '/console', label: 'Console', icon: Monitor },
    { to: '/devices', label: 'Devices', icon: Wifi },
    { to: '/blacklist', label: 'Blacklist', icon: Ban },
    { to: '/whitelist', label: 'Whitelist', icon: ShieldCheck },
    { to: '/security', label: 'Security', icon: Shield }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header */}
      <header style={{ background: '#0f172a', borderBottom: '1px solid #1e293b', padding: '12px 20px', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Router size={20} color="#ffffff" />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>EchoLife HS8145C5</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#94a3b8' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
                <span>{creds.ip}</span>
              </div>
            </div>
          </div>

          <div style={{ fontSize: 12, color: '#94a3b8', background: '#1e293b', padding: '6px 12px', borderRadius: 9999 }}>
            User: <strong style={{ color: '#f1f5f9' }}>{creds.username}</strong>
          </div>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '6px 16px', overflowX: 'auto' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 6 }}>
          {navItems.map(item => {
            const IconComp = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 14px',
                  borderRadius: 8,
                  textDecoration: 'none',
                  fontSize: 13,
                  fontWeight: 600,
                  color: isActive ? '#ffffff' : '#94a3b8',
                  background: isActive ? '#0284c7' : 'transparent',
                  whiteSpace: 'nowrap'
                })}>
                <IconComp size={15} />
                {item.label}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '24px 16px', maxWidth: 1100, width: '100%', margin: '0 auto' }}>
        <Routes>
          <Route path="/" element={<CapabilitiesPage />} />
          <Route path="/console" element={<ConsolePage />} />
          <Route path="/devices" element={<DevicesPage />} />
          <Route path="/blacklist" element={<BlacklistPage />} />
          <Route path="/whitelist" element={<WhitelistPage />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="*" element={<CapabilitiesPage />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer style={{ background: '#0f172a', borderTop: '1px solid #1e293b', padding: '16px', textAlign: 'center', fontSize: 12, color: '#64748b' }}>
        Huawei EchoLife HS8145C5 Local ONT Management • GitHub Pages Deployment Ready
      </footer>
    </div>
  );
};
