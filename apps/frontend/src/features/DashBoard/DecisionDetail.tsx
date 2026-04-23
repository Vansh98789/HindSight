import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

export default function DecisionDetail() {
  const { id } = useParams();
  const [decision, setDecision] = useState<Decision | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDecision = async () => {
      try {
        const res = await api.get(`/api/decision/${id}`);
        setDecision(res.data.decision);
      } catch (err: any) {
        setError(err.response?.data?.msg || "Failed to load decision details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDecision();
    }
  }, [id]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
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
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-[#111114] p-8">
          <p className="text-lg text-slate-300">Loading decision details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#09090b] px-6 py-10 text-white">
        <div className="mx-auto max-w-5xl rounded-3xl border border-red-400/20 bg-red-500/10 p-8">
          <h2 className="text-xl font-semibold text-red-200">Something went wrong</h2>
          <p className="mt-2 text-sm text-red-100/80">{error}</p>
        </div>
      </div>
    );
  }

  if (!decision) {
    return (
      <div className="min-h-screen bg-[#09090b] px-6 py-10 text-white">
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-[#111114] p-8">
          <p className="text-lg text-slate-300">Decision not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/15 via-slate-900 to-cyan-900/20 p-8 shadow-2xl shadow-black/30">
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

          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            {decision.title}
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
            {decision.description}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <section className="space-y-6 rounded-3xl border border-white/10 bg-[#111114] p-6 shadow-xl shadow-black/20">
            <div>
              <h2 className="text-xl font-semibold text-white">Decision Breakdown</h2>
              <p className="mt-1 text-sm text-slate-400">
                This is the exact thinking snapshot captured at the time.
              </p>
            </div>

            <div className="rounded-2xl border border-white/8 bg-[#16161c] p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Choice Made
              </p>
              <p className="mt-2 text-base font-medium text-white">
                {decision.choiceMade}
              </p>
            </div>

            <div className="rounded-2xl border border-white/8 bg-[#16161c] p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Reasoning
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                {decision.reasoning}
              </p>
            </div>

            <div className="rounded-2xl border border-white/8 bg-[#16161c] p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Options Considered
              </p>

              <div className="mt-4 grid gap-3">
                {decision.options.map((option, index) => (
                  <div
                    key={index}
                    className={`rounded-2xl border p-4 text-sm ${
                      option === decision.choiceMade
                        ? "border-indigo-400/20 bg-indigo-500/10 text-indigo-100"
                        : "border-white/8 bg-[#1a1a20] text-slate-300"
                    }`}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-[#111114] p-6 shadow-xl shadow-black/20">
              <h2 className="text-xl font-semibold text-white">Context Signals</h2>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-white/8 bg-[#16161c] p-4">
                  <p className="text-sm text-slate-400">Emotional State</p>
                  <p className="mt-1 font-medium text-white">
                    {decision.emotionalState}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/8 bg-[#16161c] p-4">
                  <p className="text-sm text-slate-400">Review Date</p>
                  <p className="mt-1 font-medium text-white">
                    {formatDate(decision.reviewDate)}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/8 bg-[#16161c] p-4">
                  <p className="text-sm text-slate-400">Created On</p>
                  <p className="mt-1 font-medium text-white">
                    {formatDate(decision.createdAt)}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-cyan-400/15 bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 p-6 shadow-xl shadow-black/20">
              <h3 className="text-lg font-semibold text-white">Why This Page Matters</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Good decision-making improves when you can inspect your past logic clearly,
                not just remember the outcome.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
