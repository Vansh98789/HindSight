import { useEffect, useMemo, useState } from "react";
import api from "../../lib/api";

type SummaryData = {
  totalDecisions: number;
  totalReviewed: number;
  pendingReviews: number;
  avgConfidence: number;
  avgOutcome: number;
  biasGap: number;
};

type BiasExample = {
  title: string;
  confidence: number;
  outcome: number;
};

type BiasItem = {
  name: string;
  description: string;
  examples: BiasExample[];
};

type BiasReportData = {
  unlocked: boolean;
  reviewedCount: number;
  required?: number;
  topBiases?: BiasItem[];
};

type CategoryItem = {
  name: string;
  avgConfidence: number;
  avgOutcome: number;
  gap: number;
};

type EmotionItem = {
  state: string;
  avgOutcome: number;
  count: number;
};

export default function Analytics() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [biasReport, setBiasReport] = useState<BiasReportData | null>(null);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [emotions, setEmotions] = useState<EmotionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [summaryRes, biasRes, categoryRes, emotionRes] = await Promise.all([
          api.get("/api/analytics/summary"),
          api.get("/api/analytics/bias-report"),
          api.get("/api/analytics/category"),
          api.get("/api/analytics/emotion"),
        ]);

        setSummary(summaryRes.data.data);
        setBiasReport(biasRes.data.data);
        setCategories(categoryRes.data.data?.categories || []);
        setEmotions(emotionRes.data.data?.emotions || []);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const analyticsUnlocked = biasReport?.unlocked ?? false;

  const strongestCategoryGap = useMemo(() => {
    if (categories.length === 0) return null;
    return [...categories].sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap))[0];
  }, [categories]);

  const bestEmotion = useMemo(() => {
    if (emotions.length === 0) return null;
    return [...emotions].sort((a, b) => b.avgOutcome - a.avgOutcome)[0];
  }, [emotions]);

  const getGapTone = (gap: number) => {
    if (gap > 1.5) return "text-red-300";
    if (gap > 0.5) return "text-amber-300";
    if (gap >= -0.5) return "text-cyan-300";
    return "text-emerald-300";
  };

  const getBarWidth = (value: number, max = 10) => {
    return `${Math.max(8, (value / max) * 100)}%`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] px-6 py-10 text-white">
        <div className="mx-auto max-w-6xl rounded-3xl border border-white/10 bg-[#111114] p-8">
          <p className="text-lg text-slate-300">Loading analytics...</p>
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
        <div className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/15 via-slate-900 to-cyan-900/20 p-8 shadow-2xl shadow-black/30">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-violet-200">
              Judgment Analytics
            </div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              See how your confidence compares with reality
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              This page turns your decisions and reviews into patterns. The goal is not
              to judge yourself harshly. It is to notice how you think.
            </p>
          </div>
        </div>

        {summary && (
          <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-white/10 bg-[#111114] p-6 shadow-xl shadow-black/20">
              <p className="text-sm text-slate-400">Average Confidence</p>
              <h2 className="mt-2 text-3xl font-semibold">{summary.avgConfidence}/10</h2>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#111114] p-6 shadow-xl shadow-black/20">
              <p className="text-sm text-slate-400">Average Outcome</p>
              <h2 className="mt-2 text-3xl font-semibold">{summary.avgOutcome}/10</h2>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#111114] p-6 shadow-xl shadow-black/20">
              <p className="text-sm text-slate-400">Bias Gap</p>
              <h2 className={`mt-2 text-3xl font-semibold ${getGapTone(summary.biasGap)}`}>
                {summary.biasGap > 0 ? "+" : ""}
                {summary.biasGap}
              </h2>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#111114] p-6 shadow-xl shadow-black/20">
              <p className="text-sm text-slate-400">Pending Reviews</p>
              <h2 className="mt-2 text-3xl font-semibold">{summary.pendingReviews}</h2>
            </div>
          </div>
        )}

        {!analyticsUnlocked ? (
          <div className="rounded-3xl border border-amber-400/20 bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-8 shadow-xl shadow-black/20">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold text-white">Analytics are still locked</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                You need at least 5 completed reviews before the deeper bias insights unlock.
                That gives the system enough signal to show meaningful patterns.
              </p>

              <div className="mt-6 flex flex-wrap gap-4">
                <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4">
                  <p className="text-sm text-slate-400">Completed Reviews</p>
                  <p className="mt-1 text-2xl font-semibold text-white">
                    {biasReport?.reviewedCount ?? 0}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4">
                  <p className="text-sm text-slate-400">Required</p>
                  <p className="mt-1 text-2xl font-semibold text-white">
                    {biasReport?.required ?? 5}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <section className="rounded-3xl border border-white/10 bg-[#111114] p-6 shadow-xl shadow-black/20">
                <div className="mb-5">
                  <h2 className="text-xl font-semibold text-white">Category Breakdown</h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Compare confidence and actual outcomes across decision categories.
                  </p>
                </div>

                <div className="space-y-5">
                  {categories.length === 0 ? (
                    <p className="text-sm text-slate-400">No category data yet.</p>
                  ) : (
                    categories.map((category) => (
                      <div
                        key={category.name}
                        className="rounded-2xl border border-white/8 bg-[#16161c] p-4"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-white">{category.name}</h3>
                          <span className={`text-sm font-medium ${getGapTone(category.gap)}`}>
                            Gap {category.gap > 0 ? "+" : ""}
                            {category.gap}
                          </span>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <div className="mb-1 flex justify-between text-xs text-slate-400">
                              <span>Confidence</span>
                              <span>{category.avgConfidence}/10</span>
                            </div>
                            <div className="h-2 rounded-full bg-white/5">
                              <div
                                className="h-2 rounded-full bg-indigo-500"
                                style={{ width: getBarWidth(category.avgConfidence) }}
                              />
                            </div>
                          </div>

                          <div>
                            <div className="mb-1 flex justify-between text-xs text-slate-400">
                              <span>Outcome</span>
                              <span>{category.avgOutcome}/10</span>
                            </div>
                            <div className="h-2 rounded-full bg-white/5">
                              <div
                                className="h-2 rounded-full bg-cyan-500"
                                style={{ width: getBarWidth(category.avgOutcome) }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>

              <section className="rounded-3xl border border-white/10 bg-[#111114] p-6 shadow-xl shadow-black/20">
                <div className="mb-5">
                  <h2 className="text-xl font-semibold text-white">Emotional Correlation</h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Which emotional states are linked with stronger or weaker outcomes?
                  </p>
                </div>

                <div className="space-y-4">
                  {emotions.length === 0 ? (
                    <p className="text-sm text-slate-400">No emotion data yet.</p>
                  ) : (
                    emotions.map((emotion) => (
                      <div
                        key={emotion.state}
                        className="rounded-2xl border border-white/8 bg-[#16161c] p-4"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-sm font-semibold text-white">{emotion.state}</span>
                          <span className="text-sm text-slate-300">
                            {emotion.avgOutcome}/10
                          </span>
                        </div>

                        <div className="h-2 rounded-full bg-white/5">
                          <div
                            className="h-2 rounded-full bg-violet-500"
                            style={{ width: getBarWidth(emotion.avgOutcome) }}
                          />
                        </div>

                        <p className="mt-2 text-xs text-slate-500">
                          Based on {emotion.count} reviewed decision
                          {emotion.count > 1 ? "s" : ""}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>

            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <section className="rounded-3xl border border-white/10 bg-[#111114] p-6 shadow-xl shadow-black/20">
                <div className="mb-5">
                  <h2 className="text-xl font-semibold text-white">Top Detected Biases</h2>
                  <p className="mt-1 text-sm text-slate-400">
                    These are the strongest patterns currently showing up in your data.
                  </p>
                </div>

                <div className="space-y-4">
                  {biasReport?.topBiases?.length ? (
                    biasReport.topBiases.map((bias) => (
                      <div
                        key={bias.name}
                        className="rounded-2xl border border-white/8 bg-[#16161c] p-5"
                      >
                        <h3 className="text-base font-semibold text-white">{bias.name}</h3>
                        <p className="mt-2 text-sm leading-7 text-slate-300">
                          {bias.description}
                        </p>

                        {bias.examples?.length > 0 && (
                          <div className="mt-4 space-y-2">
                            {bias.examples.map((example, index) => (
                              <div
                                key={`${bias.name}-${index}`}
                                className="rounded-xl border border-white/6 bg-[#1b1b21] p-3"
                              >
                                <p className="text-sm font-medium text-slate-200">
                                  {example.title}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                  Confidence {example.confidence}/10, Outcome {example.outcome}/10
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400">
                      No strong bias patterns detected yet.
                    </p>
                  )}
                </div>
              </section>

              <section className="space-y-6">
                <div className="rounded-3xl border border-white/10 bg-[#111114] p-6 shadow-xl shadow-black/20">
                  <h2 className="text-xl font-semibold text-white">Insight Snapshot</h2>
                  <div className="mt-5 space-y-4">
                    <div className="rounded-2xl border border-white/8 bg-[#16161c] p-4">
                      <p className="text-sm text-slate-400">Strongest Category Gap</p>
                      <p className="mt-2 text-base font-medium text-white">
                        {strongestCategoryGap
                          ? `${strongestCategoryGap.name} (${strongestCategoryGap.gap > 0 ? "+" : ""}${strongestCategoryGap.gap})`
                          : "Not enough data yet"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/8 bg-[#16161c] p-4">
                      <p className="text-sm text-slate-400">Best Emotional State</p>
                      <p className="mt-2 text-base font-medium text-white">
                        {bestEmotion
                          ? `${bestEmotion.state} (${bestEmotion.avgOutcome}/10)`
                          : "Not enough data yet"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/8 bg-[#16161c] p-4">
                      <p className="text-sm text-slate-400">Reviewed Decisions</p>
                      <p className="mt-2 text-base font-medium text-white">
                        {summary?.totalReviewed ?? 0} out of {summary?.totalDecisions ?? 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-violet-400/15 bg-gradient-to-br from-violet-500/10 to-cyan-500/10 p-6 shadow-xl shadow-black/20">
                  <h3 className="text-lg font-semibold text-white">How to read this page</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    If confidence stays much higher than outcomes, you may be overestimating
                    your judgment. If certain emotions or categories keep dragging outcomes
                    down, that is a blind spot worth watching.
                  </p>
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
