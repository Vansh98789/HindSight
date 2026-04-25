import { useNavigate } from "react-router-dom";
import img from "../../assets/Gemini_Generated_Image.png";
import NavBar1 from "../../components/NavBar1";

const highlights = [
  "Capture what you believed before memory edits it",
  "Review decisions when outcomes are actually visible",
  "Spot patterns in confidence, emotion, and bias",
];



export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#07070a] text-white">
      <div className="relative min-h-screen overflow-hidden">
        <div
    className="absolute inset-0 bg-cover bg-center"
    style={{ backgroundImage: `url(${img})` }}
        />
  <div className="absolute inset-0 bg-black/58" />
  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,7,10,0.32)_0%,rgba(6,7,10,0.62)_45%,rgba(6,7,10,0.92)_100%)]" />
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.18),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.10),transparent_22%)]" />


        <div className="relative z-10">
          <NavBar1 />

          <main className="mx-auto flex min-h-[calc(100vh-84px)] max-w-7xl items-center px-6 pb-16 pt-10 sm:px-8 lg:px-10">
            <div className="grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <section className="max-w-4xl">
                <div className="mb-5 inline-flex items-center rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-slate-200 backdrop-blur-md">
                  Decision journal for your future self
                </div>

                <h1 className="text-5xl font-semibold leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-8xl">
                  Stop trusting memory.
                  <br />
                  Start tracking judgment.
                </h1>

                <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">
                  HindSight helps you capture major decisions in the moment, review
                  them later, and uncover the patterns shaping your life.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => navigate("/signup")}
                    className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-[#0b0b12] transition hover:bg-slate-200"
                  >
                    Start journaling
                  </button>

                  <button
                    onClick={() => navigate("/login")}
                    className="rounded-2xl border border-white/15 bg-white/8 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/14"
                  >
                    I already have an account
                  </button>
                </div>

                <div className="mt-10 grid gap-3 sm:grid-cols-3">
                  {highlights.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm leading-6 text-slate-200 backdrop-blur-sm"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </section>

             <section className="lg:pl-6">
  <div className="rounded-[32px] border border-white/10 bg-white/6 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
    <div className="rounded-[26px] border border-white/8 bg-[#0d1016]/85 p-6">
      <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
        Bias Preview
      </p>

      <h2 className="mt-4 max-w-sm text-2xl font-semibold leading-tight text-white">
        Your confidence is high. Your outcomes are trying to tell a different story.
      </h2>

      <div className="mt-8 space-y-6">
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-slate-400">Confidence</span>
            <span className="font-medium text-white">8.4/10</span>
          </div>
          <div className="h-2 rounded-full bg-white/6">
            <div className="h-2 w-[84%] rounded-full bg-indigo-500" />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-slate-400">Outcome</span>
            <span className="font-medium text-white">5.9/10</span>
          </div>
          <div className="h-2 rounded-full bg-white/6">
            <div className="h-2 w-[59%] rounded-full bg-cyan-400" />
          </div>
        </div>

        <div className="border-t border-white/8 pt-5">
          <p className="text-sm leading-7 text-slate-300">
            HindSight helps you notice the gap between what felt true in the moment
            and what reality revealed later.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>


            </div>
          </main>
        </div>
      </div>

      <section className="border-t border-white/8 bg-[#09090d]">
        <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-10">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-white/8 bg-[#111116] p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                What it tracks
              </p>
              <p className="mt-3 text-xl font-semibold text-white">
                Decisions, confidence, emotion, and outcomes
              </p>
            </div>

            <div className="rounded-3xl border border-white/8 bg-[#111116] p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                What it reveals
              </p>
              <p className="mt-3 text-xl font-semibold text-white">
                Biases, blind spots, and judgment patterns
              </p>
            </div>

            <div className="rounded-3xl border border-white/8 bg-[#111116] p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                Why it matters
              </p>
              <p className="mt-3 text-xl font-semibold text-white">
                Better decisions come from visible thinking
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
