import { useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Loader2, Lock, Mail } from "lucide-react";
import "../index.css";

const SupportPanel = lazy(() => import("../components/SupportPanel"));

export default function LoginPage() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login"); // "login" | "support"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ---------- Login ----------
  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5172/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Invalid login credentials!");

      sessionStorage.setItem("accessToken", data.accessToken);
      if (data.refreshToken) sessionStorage.setItem("refreshToken", data.refreshToken);
      navigate("/main");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">

      <div className="w-full max-w-md animate-fadeIn">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-md">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {mode === "login" ? "Welcome Back" : "Support Center"}
          </h1>
          <p className="text-gray-600 mt-1">
            {mode === "login"
              ? "Sign in to your account to continue"
              : "Contact us for help"}
          </p>
        </div>

        {mode === "login" && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 animate-fadeIn">

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>

                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    className="block w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>

                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    className="block w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && (
                <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading || !email || !password}
                className="w-full flex justify-center items-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg transition"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign In"}
              </button>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition"
                onClick={() => setMode("support")}
              >
                Support
              </button>
            </div>
          </div>
        )}

        {mode === "support" && (
          <Suspense fallback={<div className="text-center mt-4">Loading...</div>}>
            <SupportPanel onBack={() => setMode("login")} />
          </Suspense>
        )}

        <div className="mt-6 text-center text-sm text-gray-500">
          Protected by enterprise-grade security
        </div>
      </div>
    </div>
  );
}
