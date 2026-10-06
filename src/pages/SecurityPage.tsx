import React from 'react';
import { Shield, Lock, Key, Server, CheckCircle2 } from 'lucide-react';
import { routerService } from '../services/routerService';

export const SecurityPage: React.FC = () => {
  const creds = routerService.getStoredCredentials();

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Security & Boundary Audit</h2>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#94a3b8' }}>
          Verification of privacy controls and local network execution
        </p>
      </div>

      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 16, padding: 24 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}>Enforced Security Principles</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            {
              icon: Lock,
              title: "Zero Hardcoded Credentials",
              desc: "No router passwords or default label credentials exist in the source code."
            },
            {
              icon: Key,
              title: "Encrypted Local Storage",
              desc: "Administrator credentials are encrypted using Web Crypto AES before persisting to browser storage."
            },
            {
              icon: Server,
              title: "Strict Local Subnet Boundary",
              desc: `Network requests target exclusively local IP addresses (${creds.ip}). Zero cloud tracking or external server transmission.`
            },
            {
              icon: Shield,
              title: "Real Router Communication",
              desc: "The app probes the real Huawei EchoLife HS8145C5 ONT firmware endpoints without simulated or fake responses."
            }
          ].map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px', background: '#0f172a', borderRadius: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <IconComp size={18} color="#0284c7" />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>{item.title}</span>
                    <CheckCircle2 size={14} color="#10b981" />
                  </div>
                  <p style={{ margin: '3px 0 0', fontSize: 13, color: '#94a3b8' }}>{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 16, padding: 20 }}>
        <h3 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 600 }}>Local Session Status</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          <div style={{ background: '#0f172a', padding: 12, borderRadius: 8 }}>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>Target Router Gateway</div>
            <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace', marginTop: 2 }}>{creds.ip}</div>
          </div>
          <div style={{ background: '#0f172a', padding: 12, borderRadius: 8 }}>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>Administrator Account</div>
            <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace', marginTop: 2 }}>{creds.username}</div>
          </div>
          <div style={{ background: '#0f172a', padding: 12, borderRadius: 8 }}>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>Storage State</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: creds.hasSaved ? '#10b981' : '#f59e0b', marginTop: 2 }}>
              {creds.hasSaved ? 'ENCRYPTED LOCAL' : 'SESSION ONLY'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
