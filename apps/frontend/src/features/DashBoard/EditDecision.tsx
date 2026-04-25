import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../lib/api";

const emotionalStates = ["CALM", "ANXIOUS", "EXCITED", "PRESSURED"];
const categories = ["FINANCIAL", "HEALTH", "RELATIONSHIP", "LIFE", "CAREER"];
const stakes = ["LOW", "MEDIUM", "HIGH", "IRREVERSIBLE"];

type DateInputWithPicker = HTMLInputElement & {
  showPicker?: () => void;
};

export default function EditDecision() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dateInputRef = useRef<DateInputWithPicker | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    options: ["", ""],
    choiceMade: "",
    reasoning: "",
    confidencelvl: 5,
    emotionalState: "CALM",
    category: "LIFE",
    stake: "MEDIUM",
    reviewDate: "",
  });

  const [loadingDecision, setLoadingDecision] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDecision = async () => {
      try {
        const res = await api.get(`/api/decision/${id}`);
        const decision = res.data.decision;

        setForm({
          title: decision.title || "",
          description: decision.description || "",
          options: decision.options?.length ? decision.options : ["", ""],
          choiceMade: decision.choiceMade || "",
          reasoning: decision.reasoning || "",
          confidencelvl: decision.confidencelvl || 5,
          emotionalState: decision.emotionalState || "CALM",
          category: decision.category || "LIFE",
          stake: decision.stake || "MEDIUM",
          reviewDate: decision.reviewDate
            ? new Date(decision.reviewDate).toISOString().split("T")[0]
            : "",
        });
      } catch (err: any) {
        setError(err.response?.data?.msg || "Failed to load decision");
      } finally {
        setLoadingDecision(false);
      }
    };

    if (id) fetchDecision();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "confidencelvl" ? Number(value) : value,
    }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...form.options];
    updatedOptions[index] = value;

    setForm((prev) => ({
      ...prev,
      options: updatedOptions,
    }));
  };

  const addOption = () => {
    setForm((prev) => ({
      ...prev,
      options: [...prev.options, ""],
    }));
  };

  const removeOption = (index: number) => {
    if (form.options.length <= 2) return;

    const updatedOptions = form.options.filter((_, i) => i !== index);

    setForm((prev) => ({
      ...prev,
      options: updatedOptions,
      choiceMade: prev.choiceMade === prev.options[index] ? "" : prev.choiceMade,
    }));
  };

  const openDatePicker = () => {
    if (dateInputRef.current?.showPicker) {
      dateInputRef.current.showPicker();
    } else {
      dateInputRef.current?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const cleanedOptions = form.options.map((opt) => opt.trim()).filter(Boolean);

      const payload = {
        ...form,
        options: cleanedOptions,
      };

      await api.put(`/api/decision/${id}`, payload);
      alert("Decision updated successfully");
      navigate(`/dashboard/decision/${id}`);
    } catch (err: any) {
      alert(err.response?.data?.msg || "Failed to update decision");
    } finally {
      setSaving(false);
    }
  };

  if (loadingDecision) {
    return (
      <div className="min-h-screen bg-[#09090b] px-6 py-10 text-white">
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-[#111114] p-8">
          <p className="text-lg text-slate-300">Loading decision...</p>
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

  return (
    <div className="min-h-screen bg-[#09090b] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/15 via-slate-900 to-cyan-900/20 p-8 shadow-2xl shadow-black/30">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-indigo-200">
              Edit Decision
            </div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Refine the decision record while the context is still clear
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Update only what genuinely needs correction. The goal is clarity, not rewriting history.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <section className="space-y-6 rounded-3xl border border-white/10 bg-[#111114] p-6 shadow-xl shadow-black/20">
            <div>
              <h2 className="text-xl font-semibold text-white">Decision Details</h2>
              <p className="mt-1 text-sm text-slate-400">
                Keep the record as accurate to the original situation as possible.
              </p>
            </div>

            <div className="grid gap-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Decision Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-[#18181d] px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Situation Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full rounded-2xl border border-white/10 bg-[#18181d] px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-medium text-slate-300">
                    Options Considered
                  </label>
                  <button
                    type="button"
                    onClick={addOption}
                    className="rounded-xl border border-indigo-400/20 bg-indigo-500/10 px-3 py-2 text-xs font-medium text-indigo-200 transition hover:bg-indigo-500/20"
                  >
                    Add Option
                  </button>
                </div>

                <div className="space-y-3">
                  {form.options.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 rounded-2xl border border-white/8 bg-[#15151a] p-3"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-xs text-slate-400">
                        {index + 1}
                      </div>

                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        required
                        className="flex-1 bg-transparent text-sm text-white outline-none"
                      />

                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-200 transition hover:bg-red-500/20"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Choice Made
                </label>
                <select
                  name="choiceMade"
                  value={form.choiceMade}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-[#18181d] px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="">Select chosen option</option>
                  {form.options
                    .filter((option) => option.trim() !== "")
                    .map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Reasoning
                </label>
                <textarea
                  name="reasoning"
                  value={form.reasoning}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full rounded-2xl border border-white/10 bg-[#18181d] px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-[#111114] p-6 shadow-xl shadow-black/20">
              <h2 className="text-xl font-semibold text-white">Context Signals</h2>

              <div className="mt-6 space-y-5">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-sm font-medium text-slate-300">
                      Confidence Level
                    </label>
                    <span className="rounded-full bg-indigo-500/15 px-3 py-1 text-xs font-semibold text-indigo-200">
                      {form.confidencelvl}/10
                    </span>
                  </div>
                  <input
                    type="range"
                    name="confidencelvl"
                    min="1"
                    max="10"
                    value={form.confidencelvl}
                    onChange={handleChange}
                    className="w-full accent-indigo-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Emotional State
                  </label>
                  <select
                    name="emotionalState"
                    value={form.emotionalState}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-[#18181d] px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                  >
                    {emotionalStates.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Category
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-[#18181d] px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Stake Level
                  </label>
                  <select
                    name="stake"
                    value={form.stake}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-[#18181d] px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                  >
                    {stakes.map((stake) => (
                      <option key={stake} value={stake}>
                        {stake}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Review Date
                  </label>
                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#18181d] px-4 py-3">
                    <input
                      ref={dateInputRef}
                      type="date"
                      name="reviewDate"
                      value={form.reviewDate}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent text-sm text-white outline-none"
                    />
                    <button
                      type="button"
                      onClick={openDatePicker}
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-lg leading-none text-slate-200 transition hover:bg-white/10"
                    >
                      📅
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-indigo-400/15 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 p-6 shadow-xl shadow-black/20">
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-2xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving ? "Saving Changes..." : "Save Changes"}
              </button>
            </section>
          </aside>
        </form>
      </div>
    </div>
  );
}
