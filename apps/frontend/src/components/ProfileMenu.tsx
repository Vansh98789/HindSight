import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

type User = {
  name: string;
  email: string;
};

const menuItems = [
  { label: "Profile", path: "/dashboard/profile" },
  { label: "Change Password", path: "/dashboard/change-password" },
  { label: "My Decision", path: "/dashboard/myDecision" },
  { label: "Analytics", path: "/dashboard/analytics" },
];

export default function ProfileMenu() {
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/api/auth/me");
        setUser(res.data.user);
      } catch (error) {
        console.log("Failed to fetch user info");
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const initials = useMemo(() => {
    if (!user?.name) return "U";

    return user.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [user]);

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
      navigate("/login");
    } catch (error) {
      console.log("Logout failed");
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex items-center gap-3 rounded-2xl border px-3 py-2 transition-all duration-200 ${
          open
            ? "border-indigo-400/20 bg-indigo-500/10 shadow-lg shadow-indigo-500/10"
            : "border-white/10 bg-white/5 hover:bg-white/10"
        }`}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 text-sm font-semibold text-white shadow-md shadow-indigo-500/20">
          {initials}
        </div>

        <div className="hidden min-w-[120px] text-left md:block">
          <p className="truncate text-sm font-medium text-white">
            {user?.name || "User"}
          </p>
          <p className="truncate text-xs text-slate-400">
            {user?.email || "Loading..."}
          </p>
        </div>

      </button>

      {open && (
        <div className="absolute right-0 z-[100] mt-3 w-80 overflow-hidden rounded-[28px] border border-white/10 bg-[#101115]/95 shadow-2xl shadow-black/50 backdrop-blur-2xl">
          <div className="border-b border-white/8 bg-[linear-gradient(180deg,rgba(99,102,241,0.12)_0%,rgba(16,17,21,0.1)_100%)] px-5 py-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 text-base font-semibold text-white shadow-lg shadow-indigo-500/20">
                {initials}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {user?.name || "User"}
                </p>
                <p className="mt-1 truncate text-xs text-slate-400">
                  {user?.email || "Loading..."}
                </p>
              </div>
            </div>
          </div>

          <div className="p-3">
            <div className="mb-2 px-2">
              <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
                Account
              </p>
            </div>

            <div className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    setOpen(false);
                    navigate(item.path);
                  }}
                  className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm text-slate-200 transition hover:bg-white/5"
                >
                  <span>{item.label}</span>
                  <span className="text-slate-500">›</span>
                </button>
              ))}
            </div>

            <div className="my-3 border-t border-white/8" />

            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm text-red-300 transition hover:bg-red-500/10"
            >
              <span>Logout</span>
              <span className="text-red-400/70">↗</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
