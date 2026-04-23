import { useRef, useState } from "react";
import api from "../../lib/api";

const emotionalStates = ["CALM", "ANXIOUS", "EXCITED", "PRESSURED"];
const categories = ["FINANCIAL", "HEALTH", "RELATIONSHIP", "LIFE", "CAREER"];
const stakes = ["LOW", "MEDIUM", "HIGH", "IRREVERSIBLE"];

type DateInputWithPicker = HTMLInputElement & {
  showPicker?: () => void;
};

export default function CreateDecision() {
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

  const [loading, setLoading] = useState(false);
  const dateInputRef = useRef<DateInputWithPicker | null>(null);

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
    setLoading(true);

    try {
      const cleanedOptions = form.options.map((opt) => opt.trim()).filter(Boolean);

      const payload = {
        ...form,
        options: cleanedOptions,
      };

      const res = await api.post("/api/decision/create", payload);
      alert(res.data.msg);

      setForm({
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
    } catch (err: any) {
      alert(err.response?.data?.msg || "Failed to create decision");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#09090b] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-600/20 via-slate-900 to-purple-900/20 p-8 shadow-2xl shadow-black/30">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-indigo-200">
              Decision Journal
            </div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Capture the decision before hindsight edits the story
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Write down what you knew, what you felt, and why you chose what you chose.
              Later, this becomes the raw material for better judgment.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <section className="space-y-6 rounded-3xl border border-white/10 bg-[#111114] p-6 shadow-xl shadow-black/20">
            <div>
              <h2 className="text-xl font-semibold text-white">Decision Details</h2>
              <p className="mt-1 text-sm text-slate-400">
                Focus on what actually mattered at the time of the choice.
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
                  placeholder="Example: Should I accept the internship offer?"
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
                  placeholder="What was happening? What constraints, risks, deadlines, or tradeoffs existed?"
                  className="w-full rounded-2xl border border-white/10 bg-[#18181d] px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-medium text-slate-300">
                    Options You Considered
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
                        placeholder={`Option ${index + 1}`}
                        required
                        className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
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
                  placeholder="Why did this option feel right at the time?"
                  className="w-full rounded-2xl border border-white/10 bg-[#18181d] px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-[#111114] p-6 shadow-xl shadow-black/20">
              <h2 className="text-xl font-semibold text-white">Context Signals</h2>
              <p className="mt-1 text-sm text-slate-400">
                These details help you analyze patterns later.
              </p>

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
                  <div className="mt-2 flex justify-between text-xs text-slate-500">
                    <span>Low certainty</span>
                    <span>High certainty</span>
                  </div>
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
                      aria-label="Open calendar"
                      title="Open calendar"
                    >
                      📅
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    Pick the day when you want to revisit this decision.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-indigo-400/15 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-6 shadow-xl shadow-black/20">
              <h3 className="text-lg font-semibold text-white">Before You Save</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                <li>Write the decision as if you had to defend it later.</li>
                <li>Be honest about what emotions were influencing you.</li>
                <li>Use a review date that gives the outcome time to reveal itself.</li>
              </ul>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full rounded-2xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Saving..." : "Save Decision"}
              </button>
            </section>
          </aside>
        </form>
      </div>
    </div>
  );
}
