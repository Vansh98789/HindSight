import { NavLink, useNavigate } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";

const links = [
  { to: "myDecision", label: "My Decision" },
  { to: "pending", label: "Pending" },
  { to: "createDecision", label: "Create Decision" },
  { to: "analytics", label: "Analytics" },
];

const NavBar2 = () => {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-30 border-b border-white/8 bg-[#0b0c10]/85 backdrop-blur-xl">

      <div className="flex w-full items-center justify-between px-6 py-4 sm:px-8 lg:px-10">
        <button
          onClick={() => navigate("/dashboard/myDecision")}
          className="text-left"
        >
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Hind<span className="text-indigo-400">sight</span>
          </h1>
          <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-slate-500">
            Decision Intelligence
          </p>
        </button>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 rounded-2xl border border-white/8 bg-white/4 p-1 md:flex">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-indigo-500/15 text-indigo-200"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          <ProfileMenu />
        </div>
      </div>
    </nav>
  );
};

export default NavBar2;
