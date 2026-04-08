import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const navigate=useNavigate()
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

      const res = await axios.post(
        "http://localhost:3000/api/auth/register",
        form,
        { withCredentials: true }
      );

      alert(res.data.message);

      // reset form
      setForm({
        name: "",
        email: "",
        password: ""
      });
      navigate("/login")

    } catch (err:any) {
      alert(err.response?.data?.msg || "Signup failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

        <h2 className="text-2xl font-bold text-center mb-6">
           Signup
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

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
                   text-white shadow-md   w-[24rem]
                   hover:shadow-xl hover:scale-105
                   transition-all duration-300"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?
          <span className="text-blue-600 cursor-pointer ml-1">
            <Link to="/login">Log In</Link>
          </span>
        </p>

      </div>

    </div>
  );
}