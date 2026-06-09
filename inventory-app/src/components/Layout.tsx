import { Outlet, NavLink } from 'react-router-dom'

const nav = [
  { to: '/', label: 'Dashboard', icon: '◈' },
  { to: '/builders', label: 'Builders', icon: '◉' },
  { to: '/properties', label: 'Properties', icon: '▣' },
]

export default function Layout() {
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>PropVoice</h1>
          <p>Inventory Management</p>
        </div>
        <nav className="sidebar-nav">
          {nav.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              <span className="nav-icon">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          Real-Estate-Voice-Agent &middot; v1.0
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}
