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
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-indigo-500/15 via-slate-900 to-cyan-900/20 p-8 shadow-2xl shadow-black/30">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
              Account Security
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Change your password
            </h1>
            <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
              Keep your account secure by updating your password when needed. A
              stronger password protects your decisions, reviews, and long-term
              judgment history.
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          <section className="rounded-[32px] border border-white/10 bg-[#111114] p-6 shadow-xl shadow-black/20">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-white">Update Password</h2>
              <p className="mt-2 text-sm text-slate-400">
                Enter your current password and choose a new one you haven’t used elsewhere.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="rounded-[28px] border border-white/8 bg-[#16161c] p-5">
                <label className="mb-3 block text-xs uppercase tracking-[0.22em] text-slate-500">
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

              <div className="rounded-[28px] border border-white/8 bg-[#16161c] p-5">
                <label className="mb-3 block text-xs uppercase tracking-[0.22em] text-slate-500">
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

              <div className="rounded-[28px] border border-white/8 bg-[#16161c] p-5">
                <label className="mb-3 block text-xs uppercase tracking-[0.22em] text-slate-500">
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
        </div>
      </div>
    </div>
  );
}
