import { useNavigate } from "react-router-dom";

const NavBar1 = () => {
  const navigate = useNavigate();

  return (
    <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5 sm:px-8 lg:px-10">
      <button
        onClick={() => navigate("/")}
        className="text-left text-3xl font-semibold tracking-tight text-white"
      >
        Hind<span className="text-indigo-400">sight</span>
      </button>

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/login")}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 backdrop-blur-md transition hover:bg-white/10"
        >
          Login
        </button>

        <button
          onClick={() => navigate("/signup")}
          className="rounded-2xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
        >
          Sign Up
        </button>
      </div>
    </nav>
  );
};

export default NavBar1;
