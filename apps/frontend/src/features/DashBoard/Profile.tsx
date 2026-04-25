import { useEffect, useMemo, useState } from "react";
import api from "../../lib/api";

type User = {
  name: string;
  email: string;
};

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/api/auth/me");
        setUser(res.data.user);
      } catch (err: any) {
        setError(err.response?.data?.msg || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] px-6 py-10 text-white">
        <div className="mx-auto max-w-6xl rounded-3xl border border-white/10 bg-[#111114] p-8">
          <p className="text-lg text-slate-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#09090b] px-6 py-10 text-white">
        <div className="mx-auto max-w-6xl rounded-3xl border border-red-400/20 bg-red-500/10 p-8">
          <h2 className="text-xl font-semibold text-red-200">Something went wrong</h2>
          <p className="mt-2 text-sm text-red-100/80">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/15 via-slate-900 to-cyan-900/20 p-8 shadow-2xl shadow-black/30">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-500 text-2xl font-semibold text-white shadow-lg shadow-indigo-500/20">
                {initials}
              </div>

              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-slate-400">
                  Profile
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  {user?.name}
                </h1>
                <p className="mt-2 text-sm text-slate-300">{user?.email}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/8 px-5 py-4 backdrop-blur-md">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Account status
              </p>
              <p className="mt-2 text-sm font-medium text-emerald-300">
                Active
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <section className="rounded-3xl border border-white/10 bg-[#111114] p-6 shadow-xl shadow-black/20">
            <h2 className="text-xl font-semibold text-white">Account Details</h2>
            <p className="mt-1 text-sm text-slate-400">
              Basic identity information connected to your account.
            </p>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-white/8 bg-[#16161c] p-5">
                <p className="text-sm text-slate-400">Full Name</p>
                <p className="mt-2 text-base font-medium text-white">
                  {user?.name}
                </p>
              </div>

              <div className="rounded-2xl border border-white/8 bg-[#16161c] p-5">
                <p className="text-sm text-slate-400">Email Address</p>
                <p className="mt-2 text-base font-medium text-white">
                  {user?.email}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
