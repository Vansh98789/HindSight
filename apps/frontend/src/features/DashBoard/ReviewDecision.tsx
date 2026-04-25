import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

export default function ReviewDecision() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [decision, setDecision] = useState<Decision | null>(null);
  const [loadingDecision, setLoadingDecision] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    outcome: 5,
    reflection: "",
    reasoningGoodOrNot: true,
  });

  useEffect(() => {
    const fetchDecision = async () => {
      try {
        const res = await api.get(`/api/decision/${id}`);
        setDecision(res.data.decision);
      } catch (err: any) {
        setError(err.response?.data?.msg || "Failed to load decision for review");
      } finally {
        setLoadingDecision(false);
      }
    };

    if (id) {
      fetchDecision();
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "radio") {
      setForm((prev) => ({
        ...prev,
        [name]: value === "true",
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: name === "outcome" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await api.post(`/api/reviews/${id}`, form);
      alert(res.data.message || "Review submitted successfully");
      navigate("/dashboard/pending");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loadingDecision) {
    return (
      <div className="min-h-screen bg-[#09090b] px-6 py-10 text-white">
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-[#111114] p-8">
          <p className="text-lg text-slate-300">Loading decision for review...</p>
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
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/10 via-slate-900 to-cyan-900/20 p-8 shadow-2xl shadow-black/30">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-emerald-200">
              Review Decision
            </div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Compare your past confidence with the actual outcome
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              This is where the app becomes useful. The review gives meaning to the
              original decision and helps future analytics become smarter.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <section className="rounded-3xl border border-white/10 bg-[#111114] p-6 shadow-xl shadow-black/20">
            <h2 className="text-xl font-semibold text-white">Original Decision</h2>
            <p className="mt-1 text-sm text-slate-400">
              Revisit what you thought when you made the call.
            </p>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-white/8 bg-[#16161c] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Title</p>
                <p className="mt-2 text-base font-medium text-white">{decision.title}</p>
              </div>

              <div className="rounded-2xl border border-white/8 bg-[#16161c] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Choice Made</p>
                <p className="mt-2 text-base font-medium text-white">{decision.choiceMade}</p>
              </div>

              <div className="rounded-2xl border border-white/8 bg-[#16161c] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Reasoning</p>
                <p className="mt-2 text-sm leading-7 text-slate-300">{decision.reasoning}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/8 bg-[#16161c] p-4">
                  <p className="text-sm text-slate-400">Confidence</p>
                  <p className="mt-1 font-medium text-white">{decision.confidencelvl}/10</p>
                </div>

                <div className="rounded-2xl border border-white/8 bg-[#16161c] p-4">
                  <p className="text-sm text-slate-400">Review Date</p>
                  <p className="mt-1 font-medium text-white">{formatDate(decision.reviewDate)}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-[#111114] p-6 shadow-xl shadow-black/20">
            <h2 className="text-xl font-semibold text-white">Your Review</h2>
            <p className="mt-1 text-sm text-slate-400">
              Be honest. The quality of insight depends on the quality of reflection.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-medium text-slate-300">
                    Outcome Score
                  </label>
                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-200">
                    {form.outcome}/10
                  </span>
                </div>
                <input
                  type="range"
                  name="outcome"
                  min="1"
                  max="10"
                  value={form.outcome}
                  onChange={handleChange}
                  className="w-full accent-emerald-500"
                />
                <div className="mt-2 flex justify-between text-xs text-slate-500">
                  <span>Poor outcome</span>
                  <span>Excellent outcome</span>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Reflection
                </label>
                <textarea
                  name="reflection"
                  value={form.reflection}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="What happened after the decision? What turned out well, what didn’t, and what do you now think about it?"
                  className="w-full rounded-2xl border border-white/10 bg-[#18181d] px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium text-slate-300">
                  Was your reasoning sound?
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-[#18181d] px-4 py-4 text-sm text-white">
                    <input
                      type="radio"
                      name="reasoningGoodOrNot"
                      value="true"
                      checked={form.reasoningGoodOrNot === true}
                      onChange={handleChange}
                    />
                    Yes, the reasoning was mostly sound
                  </label>

                  <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-[#18181d] px-4 py-4 text-sm text-white">
                    <input
                      type="radio"
                      name="reasoningGoodOrNot"
                      value="false"
                      checked={form.reasoningGoodOrNot === false}
                      onChange={handleChange}
                    />
                    No, the reasoning was flawed
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-2xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Submitting Review..." : "Submit Review"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
