import { NavLink } from 'react-router-dom';

const links = [
  { to: 'myDecision', label: 'My Decision' },
  { to: 'pending', label: 'Pending Decision' },
  { to: 'createDecision', label: 'Create Decision' },
  { to: 'analytics', label: 'Analytics' },
];

const NavBar2 = () => {
  return (
    <nav className="w-full px-8 py-4 flex items-center justify-between border-b border-gray-800 bg-black">

      {/* Left — App Name */}
      <h1 className="text-2xl font-bold text-white tracking-tight">
        Hind<span className="text-indigo-500">sight</span>
      </h1>

      {/* Right — Links */}
      <div className="flex items-center gap-6">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `text-sm transition-colors duration-200 ${
                isActive
                  ? 'text-indigo-400'
                  : 'text-gray-400 hover:text-white'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </div>

    </nav>
  );
};

export default NavBar2;