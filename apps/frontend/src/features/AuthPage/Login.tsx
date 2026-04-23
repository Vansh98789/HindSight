import { useState } from "react";
import api from "../../lib/api";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const navigate=useNavigate();
  const handleChange = (e:any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setLoading(true);

    try {

      const res = await api.post("/api/auth/login", form);


      alert(res.data.message);
      navigate("/dashboard")

    } catch (err:any) {
      alert(err.response?.data?.msg || "Login failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

        <h2 className="text-2xl font-bold text-center mb-6">
           Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 text-sm font-semibold rounded-lg
                   bg-gradient-to-r from-indigo-500 to-purple-600
                   text-white shadow-md w-[24rem]
                   hover:shadow-xl hover:scale-105
                   transition-all duration-300"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

        </form>

        <p className="text-sm text-center mt-4">
          Don't have an account?
          <span className="text-blue-600 cursor-pointer ml-1">
            <Link to="/signup">Sign up</Link>
            
          </span>
        </p>

      </div>

    </div>
  );
}