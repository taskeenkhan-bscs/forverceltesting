import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const styles = `
  .sb-sidebar {
    width: 240px;
    min-width: 240px;
    height: 100vh;
    position: sticky;
    top: 0;
    background: #0f1117;
    display: flex;
    flex-direction: column;
    padding: 1.5rem 1rem;
    border-right: 1px solid rgba(255,255,255,0.06);
    overflow-y: auto;
    overflow-x: hidden;
  }

  .sb-logo {
    padding: 0 0.5rem;
    margin-bottom: 2rem;
  }
  .sb-logo-name {
    font-size: 20px;
    font-weight: 700;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
  }
  .sb-logo-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #6366f1;
    display: inline-block;
    flex-shrink: 0;
  }
  .sb-logo-sub {
    font-size: 11px;
    color: #4b5563;
    margin-top: 4px;
    padding-left: 16px;
  }

  .sb-section-label {
    font-size: 10px;
    font-weight: 700;
    color: #374151;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding: 0 0.75rem;
    margin: 0 0 6px;
  }

  .sb-nav {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-bottom: 1.5rem;
  }

  .sb-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 12px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 500;
    color: #6b7280;
    text-decoration: none;
    cursor: pointer;
    background: transparent;
    width: 100%;
    transition: background 0.15s, color 0.15s;
  }
  .sb-link:hover {
    background: rgba(255,255,255,0.05);
    color: #e5e7eb;
  }
  .sb-link.active {
    background: rgba(99,102,241,0.15);
    color: #a5b4fc;
  }

  .sb-link-icon {
    font-size: 16px;
    width: 20px;
    text-align: center;
    flex-shrink: 0;
    color: #4b5563;
    transition: color 0.15s;
  }
  .sb-link:hover .sb-link-icon { color: #9ca3af; }
  .sb-link.active .sb-link-icon { color: #818cf8; }

  .sb-link-label { flex: 1; }

  .sb-badge {
    background: rgba(99,102,241,0.2);
    color: #818cf8;
    font-size: 10px;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 99px;
    flex-shrink: 0;
  }

  .sb-divider {
    height: 1px;
    background: rgba(255,255,255,0.05);
    margin: 0.25rem 0.75rem 1rem;
  }

  .sb-user {
    margin-top: auto;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 12px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.06);
    cursor: pointer;
    transition: background 0.15s;
    text-decoration: none;
  }
  .sb-user:hover { background: rgba(255,255,255,0.07); }

  .sb-user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #6366f1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
    color: #fff;
    flex-shrink: 0;
  }

  .sb-user-info { flex: 1; min-width: 0; }
  .sb-user-name {
    font-size: 12px;
    font-weight: 600;
    color: #e5e7eb;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .sb-user-role {
    font-size: 11px;
    color: #4b5563;
    margin-top: 1px;
  }
  .sb-user-arrow {
    color: #374151;
    font-size: 18px;
    flex-shrink: 0;
    line-height: 1;
  }

  .sb-version {
    text-align: center;
    font-size: 10px;
    color: #1f2937;
    margin-top: 10px;
    letter-spacing: 0.05em;
  }

  @media (max-width: 768px) {
    .sb-sidebar {
      width: 60px;
      min-width: 60px;
      padding: 1.25rem 0.5rem;
      align-items: center;
    }
    .sb-logo-name { font-size: 0; gap: 0; }
    .sb-logo-dot  { width: 10px; height: 10px; margin: 0; }
    .sb-logo-sub  { display: none; }
    .sb-section-label { display: none; }
    .sb-link {
      justify-content: center;
      padding: 10px;
      width: 40px;
    }
    .sb-link-icon { width: auto; font-size: 17px; }
    .sb-link-label { display: none; }
    .sb-badge { display: none; }
    .sb-divider { width: 32px; }
    .sb-user { padding: 8px; justify-content: center; }
    .sb-user-info  { display: none; }
    .sb-user-arrow { display: none; }
    .sb-version { display: none; }
  }
`;

const NAV = [
  { icon: "⊞", label: "Dashboard",    href: "/",               badge: null },
  { icon: "◫", label: "All Projects",      href: "/projectlist",    badge: null },
  { icon: "+", label: "Add Project",   href: "/addproject",     badge: null },
  { icon: "👤", label: "Add Member",   href: "/createmember",   badge: null },
  { icon: "👥", label: "All Members",  href: "/Membershowpage", badge: null },
];

const BOTTOM_NAV = [
  { icon: "◎", label: "Settings", href: "/settings" },
];

export default function Sidebar() {
  const location = useLocation();
  const active = location.pathname; 

  console.log(import.meta.env.VITE_BACKEND_URL); 
  
  return (
    <>
      <style>{styles}</style>

      <aside className="sb-sidebar">

        {/* Logo */}
        <div className="sb-logo">
          <a href="/" className="sb-logo-name">
            <span className="sb-logo-dot"></span>
            TaskApp
          </a>
          <div className="sb-logo-sub">Manage your daily tasks</div>
        </div>

        {/* Main nav */}
        <p className="sb-section-label">Menu</p>
        <nav className="sb-nav">
          {NAV.map((item) => (
            <a
              key={item.href + item.label}
              href={item.href}
              className={"sb-link" + (active === item.href ? " active" : "")}
            >
              <span className="sb-link-icon">{item.icon}</span>
              <span className="sb-link-label">{item.label}</span>
              {item.badge && <span className="sb-badge">{item.badge}</span>}
            </a>
          ))}
        </nav>

        <div className="sb-divider"></div>

        {/* Bottom nav */}
        <p className="sb-section-label">Account</p>
        <nav className="sb-nav">
          {BOTTOM_NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={"sb-link" + (active === item.href ? " active" : "")}
            >
              <span className="sb-link-icon">{item.icon}</span>
              <span className="sb-link-label">{item.label}</span>
            </a>
          ))}
        </nav>

        {/* User card */}
        <div className="sb-user">
          <div className="sb-user-avatar">A</div>
          <div className="sb-user-info">
            <div className="sb-user-name">Admin</div>
            <div className="sb-user-role">Administrator</div>
          </div>
          <span className="sb-user-arrow">⋯</span>
        </div>

        <div className="sb-version">© 2026 TaskApp · v1.0</div>

      </aside>
    </>
  );
}