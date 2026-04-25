import { useState } from "react";
import api from "../../lib/api";

export default function ChangePassword() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      alert("New password and confirm password do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await api.put("/api/auth/change-password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      alert(res.data.message || "Password changed successfully");

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/15 via-slate-900 to-cyan-900/20 p-8 shadow-2xl shadow-black/30">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.22em] text-slate-400">
              Account Security
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Change your password
            </h1>
            <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
              Keep your account secure by updating your password whenever needed.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <section className="rounded-3xl border border-white/10 bg-[#111114] p-6 shadow-xl shadow-black/20">
            <h2 className="text-xl font-semibold text-white">Update Password</h2>
            <p className="mt-1 text-sm text-slate-400">
              Enter your current password and choose a new one.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={form.currentPassword}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-[#18181d] px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-[#18181d] px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-[#18181d] px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </section>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-[#111114] p-6 shadow-xl shadow-black/20">
              <h2 className="text-xl font-semibold text-white">Security Tips</h2>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
                <li>Use a password you do not reuse anywhere else.</li>
                <li>Prefer a longer password over a shorter complex one.</li>
                <li>Change it immediately if you think it has been exposed.</li>
              </ul>
            </section>

            <section className="rounded-3xl border border-amber-400/15 bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-6 shadow-xl shadow-black/20">
              <h3 className="text-lg font-semibold text-white">Backend required</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                This page expects a backend route like
                <span className="mx-1 font-medium text-amber-200">
                  PUT /api/auth/change-password
                </span>
                to actually update the password.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
