import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

export default function Pending() {
  const navigate = useNavigate();

  const [pendingDecisions, setPendingDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPendingDecisions = async () => {
      try {
        const res = await api.get("/api/decision/pending");
        setPendingDecisions(res.data.decision || []);
      } catch (err: any) {
        setError(err.response?.data?.msg || "Failed to load pending decisions");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingDecisions();
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getUrgencyText = (date: string) => {
    const today = new Date();
    const review = new Date(date);

    today.setHours(0, 0, 0, 0);
    review.setHours(0, 0, 0, 0);

    const diff = Math.ceil(
      (review.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diff < 0) return "Overdue";
    if (diff === 0) return "Review today";
    if (diff === 1) return "Review tomorrow";
    return `${diff} days left`;
  };

  const getUrgencyStyle = (date: string) => {
    const today = new Date();
    const review = new Date(date);

    today.setHours(0, 0, 0, 0);
    review.setHours(0, 0, 0, 0);

    const diff = Math.ceil(
      (review.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diff < 0) {
      return "border-red-400/20 bg-red-500/10 text-red-200";
    }
    if (diff === 0) {
      return "border-amber-400/20 bg-amber-500/10 text-amber-200";
    }
    return "border-cyan-400/20 bg-cyan-500/10 text-cyan-200";
  };

  const highPriorityCount = pendingDecisions.filter(
    (decision) => decision.stake === "HIGH" || decision.stake === "IRREVERSIBLE"
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] px-6 py-10 text-white">
        <div className="mx-auto max-w-6xl rounded-3xl border border-white/10 bg-[#111114] p-8">
          <p className="text-lg text-slate-300">Loading pending reviews...</p>
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
        <div className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-amber-500/10 via-slate-900 to-rose-900/20 p-8 shadow-2xl shadow-black/30">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-amber-200">
              Review Queue
            </div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Decisions waiting for your future judgment
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              This is where your decision journal becomes useful. Review what actually
              happened and compare it with how certain you felt at the time.
            </p>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-[#111114] p-6 shadow-xl shadow-black/20">
            <p className="text-sm text-slate-400">Pending Reviews</p>
            <h2 className="mt-2 text-3xl font-semibold">{pendingDecisions.length}</h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#111114] p-6 shadow-xl shadow-black/20">
            <p className="text-sm text-slate-400">High Priority Reviews</p>
            <h2 className="mt-2 text-3xl font-semibold">{highPriorityCount}</h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#111114] p-6 shadow-xl shadow-black/20">
            <p className="text-sm text-slate-400">Focus</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-200">
              Reflect before memory softens the details
            </h2>
          </div>
        </div>

        {pendingDecisions.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/10 bg-[#111114] p-10 text-center">
            <h2 className="text-2xl font-semibold text-white">No pending reviews</h2>
            <p className="mt-3 text-sm text-slate-400">
              Nothing is due right now. Once review dates arrive, they will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {pendingDecisions.map((decision) => (
              <article
                key={decision.id}
                className="rounded-3xl border border-white/10 bg-[#111114] p-6 shadow-xl shadow-black/20 transition hover:border-amber-400/20 hover:bg-[#15151a]"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-3xl">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
                        {decision.category}
                      </span>
                      <span className="rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-200">
                        Confidence {decision.confidencelvl}/10
                      </span>
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-medium ${getUrgencyStyle(
                          decision.reviewDate
                        )}`}
                      >
                        {getUrgencyText(decision.reviewDate)}
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
                          Stake Level
                        </p>
                        <p className="mt-2 text-sm font-medium text-slate-200">
                          {decision.stake}
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
                        <p className="text-sm text-slate-400">Emotional State</p>
                        <p className="mt-1 text-base font-medium text-slate-200">
                          {decision.emotionalState}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(`/dashboard/review/${decision.id}`)}
                      className="mt-6 w-full rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-sm font-semibold text-amber-200 transition hover:bg-amber-500/20"
                    >
                      Write Review
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
