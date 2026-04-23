import { useEffect, useMemo, useState } from "react";
import api from "../../lib/api";

type Decision = {
  id: string;
  title: string;
  description: string;
  options: string[];
  choiceMade: string;
  reasoning: string;
  confidencelvl: number;
  emotionalState: string;
  category: string;
  stake: string;
  reviewDate: string;
  createdAt: string;
};

export default function MyDecision() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDecisions = async () => {
      try {
        const res = await api.get("/api/decision/all");
        setDecisions(res.data.decision || []);
      } catch (err: any) {
        setError(err.response?.data?.msg || "Failed to load decisions");
      } finally {
        setLoading(false);
      }
    };

    fetchDecisions();
  }, []);

  const stats = useMemo(() => {
    const total = decisions.length;
    const highStake = decisions.filter((d) =>
      ["HIGH", "IRREVERSIBLE"].includes(d.stake)
    ).length;
    const avgConfidence =
      total > 0
        ? (
            decisions.reduce((sum, d) => sum + d.confidencelvl, 0) / total
          ).toFixed(1)
        : "0.0";

    return { total, highStake, avgConfidence };
  }, [decisions]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getDaysLeft = (date: string) => {
    const today = new Date();
    const review = new Date(date);

    today.setHours(0, 0, 0, 0);
    review.setHours(0, 0, 0, 0);

    const diff = Math.ceil(
      (review.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diff < 0) return "Review overdue";
    if (diff === 0) return "Review today";
    if (diff === 1) return "Review tomorrow";
    return `${diff} days left`;
  };

  const getStakeStyle = (stake: string) => {
    switch (stake) {
      case "LOW":
        return "bg-emerald-500/15 text-emerald-200 border-emerald-400/20";
      case "MEDIUM":
        return "bg-amber-500/15 text-amber-200 border-amber-400/20";
      case "HIGH":
        return "bg-orange-500/15 text-orange-200 border-orange-400/20";
      case "IRREVERSIBLE":
        return "bg-red-500/15 text-red-200 border-red-400/20";
      default:
        return "bg-white/10 text-slate-200 border-white/10";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] px-6 py-10 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-3xl border border-white/10 bg-[#111114] p-8">
            <p className="text-slate-300 text-lg">Loading your decisions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#09090b] px-6 py-10 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-3xl border border-red-400/20 bg-red-500/10 p-8">
            <h2 className="text-xl font-semibold text-red-200">Something went wrong</h2>
            <p className="mt-2 text-sm text-red-100/80">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-indigo-900/20 p-8 shadow-2xl shadow-black/30">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-cyan-200">
              Decision Archive
            </div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Review the decisions your past self committed to
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Every entry here is a snapshot of how you thought in the moment.
              This is where your judgment starts becoming visible.
            </p>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-[#111114] p-6 shadow-xl shadow-black/20">
            <p className="text-sm text-slate-400">Total Decisions</p>
            <h2 className="mt-2 text-3xl font-semibold">{stats.total}</h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#111114] p-6 shadow-xl shadow-black/20">
            <p className="text-sm text-slate-400">High-Stakes Choices</p>
            <h2 className="mt-2 text-3xl font-semibold">{stats.highStake}</h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#111114] p-6 shadow-xl shadow-black/20">
            <p className="text-sm text-slate-400">Average Confidence</p>
            <h2 className="mt-2 text-3xl font-semibold">{stats.avgConfidence}/10</h2>
          </div>
        </div>

        {decisions.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/10 bg-[#111114] p-10 text-center">
            <h2 className="text-2xl font-semibold text-white">No decisions yet</h2>
            <p className="mt-3 text-sm text-slate-400">
              Your journal is empty right now. Start by creating your first decision entry.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {decisions.map((decision) => (
              <article
                key={decision.id}
                className="rounded-3xl border border-white/10 bg-[#111114] p-6 shadow-xl shadow-black/20 transition hover:border-indigo-400/20 hover:bg-[#15151a]"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-3xl">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
                        {decision.category}
                      </span>
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-medium ${getStakeStyle(
                          decision.stake
                        )}`}
                      >
                        {decision.stake}
                      </span>
                      <span className="rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-200">
                        Confidence {decision.confidencelvl}/10
                      </span>
                    </div>

                    <h2 className="text-2xl font-semibold text-white">
                      {decision.title}
                    </h2>

                    <p className="mt-3 text-sm leading-7 text-slate-400">
                      {decision.description}
                    </p>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/8 bg-[#16161c] p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                          Choice Made
                        </p>
                        <p className="mt-2 text-sm font-medium text-slate-200">
                          {decision.choiceMade}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/8 bg-[#16161c] p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                          Emotional State
                        </p>
                        <p className="mt-2 text-sm font-medium text-slate-200">
                          {decision.emotionalState}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full max-w-sm rounded-2xl border border-white/8 bg-[#16161c] p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Review Schedule
                    </p>

                    <div className="mt-4 space-y-4">
                      <div>
                        <p className="text-sm text-slate-400">Review Date</p>
                        <p className="mt-1 text-base font-medium text-white">
                          {formatDate(decision.reviewDate)}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-slate-400">Status</p>
                        <p className="mt-1 text-base font-medium text-cyan-200">
                          {getDaysLeft(decision.reviewDate)}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-slate-400">Created On</p>
                        <p className="mt-1 text-base font-medium text-slate-200">
                          {formatDate(decision.createdAt)}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="mt-6 w-full rounded-2xl border border-indigo-400/20 bg-indigo-500/10 px-4 py-3 text-sm font-semibold text-indigo-200 transition hover:bg-indigo-500/20"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
