import { NavLink } from 'react-router-dom';
import { useAuth, ROLE_COLOR, ROLE_LABEL } from '../context/AuthContext';
import type { UserRole } from '../types';

interface NavItem {
  path: string;
  label: string;
  roles: UserRole[];
}

const NAV_ITEMS: NavItem[] = [
  { path: '/dashboard',                    label: '🏠 Dashboard',               roles: ['government','manufacturer','pharmacy','doctor','citizen'] },
  // Participants
  { path: '/participants/government',      label: '🏛 Government',              roles: ['government'] },
  { path: '/participants/manufacturer',    label: '🏭 Manufacturers',           roles: ['government','manufacturer'] },
  { path: '/participants/pharmacy',        label: '💊 Pharmacies',              roles: ['government','pharmacy'] },
  { path: '/participants/doctor',          label: '🩺 Doctors',                 roles: ['government','doctor'] },
  { path: '/participants/citizen',         label: '👤 Citizens',                roles: ['government','doctor','pharmacy'] },
  // Assets
  { path: '/assets/medicine-type',         label: '📋 Medicine Types',          roles: ['government','manufacturer','pharmacy','doctor','citizen'] },
  { path: '/assets/license',              label: '📄 Licenses',                roles: ['government','manufacturer'] },
  { path: '/assets/medicine',             label: '💉 Medicines',               roles: ['government','manufacturer','pharmacy'] },
  { path: '/assets/order',                label: '📦 Orders',                  roles: ['government','manufacturer','pharmacy'] },
  { path: '/assets/prescription',         label: '📝 Prescriptions',           roles: ['government','doctor','pharmacy','citizen'] },
  // Transactions
  { path: '/transactions/government',      label: '⚡ Gov Transactions',        roles: ['government'] },
  { path: '/transactions/manufacturer',    label: '⚡ Mfg Transactions',        roles: ['manufacturer'] },
  { path: '/transactions/pharmacy',        label: '⚡ Pharmacy Transactions',   roles: ['pharmacy'] },
  { path: '/transactions/doctor',          label: '⚡ Doctor Transactions',     roles: ['doctor'] },
  // Queries
  { path: '/queries',                      label: '🔍 Queries',                 roles: ['government','manufacturer','pharmacy','doctor','citizen'] },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  if (!user) return null;

  const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(user.role));

  return (
    <aside className="sidebar">
      <div className="sidebar-profile">
        <div
          className="sidebar-avatar"
          style={{ background: ROLE_COLOR[user.role] }}
        >
          {user.name[0]}
        </div>
        <div>
          <div className="sidebar-name">{user.name}</div>
          <div className="sidebar-role" style={{ color: ROLE_COLOR[user.role] }}>
            {ROLE_LABEL[user.role]}
          </div>
          <div className="sidebar-id">ID: {user.id}</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {visibleItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button className="btn-logout" onClick={logout}>
        Sign Out
      </button>
    </aside>
  );
}
