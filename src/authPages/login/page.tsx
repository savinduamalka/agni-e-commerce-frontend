import React, { useState } from "react";
import "../../styles/design-tokens.css";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Button from "../../components/ui/button";
import Input from "../../components/ui/input";
import Card from "../../components/ui/card";
import GoogleLoginButton from "../../components/ui/google-login";
import { toast } from 'sonner'
import logo from "../../assets/logo.png";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    if (!email.includes("@")) return "Please enter a valid email.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      toast.error(v);
      return;
    }
    setLoading(true);
    try {
      // call backend login endpoint
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await (async () => {
        const txt = await res.text()
        try { return JSON.parse(txt) } catch { return { message: txt } }
      })()

      if (!res.ok) {
        const msg = data?.message || data?.error || 'Invalid credentials'
        throw new Error(msg)
      }

      // success
      toast.success(data?.message || 'Signed in successfully')
      console.log('Signed in:', data)
      // TODO: navigate to dashboard or set auth state
    } catch (err: any) {
      toast.error(err?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(180deg,var(--color-secondary), #e9f0f7)" }}
    >
      <Card className="w-full max-w-md">
        <header className="mb-6 text-center">
          <img
            src={logo}
            alt="Agni Online Store Logo"
            className="mx-auto mb-4 h-16 w-auto"
            style={{ maxWidth: '120px', height: 'auto' }}
          />
          <h1 className="text-3xl font-semibold">Welcome back</h1>
          <p className="text-sm mt-1 text-slate-500">Sign in to continue to Agni Online Store</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm">
            <span className="text-xs font-medium">Email</span>
            <div className="mt-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Mail size={16} />
              </span>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
          </label>

          <label className="block text-sm">
            <span className="text-xs font-medium">Password</span>
            <div className="mt-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock size={16} />
              </span>
              <Input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          <div className="flex items-center justify-between text-sm">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" className="rounded border-slate-200" />
              <span className="text-slate-600">Remember me</span>
            </label>
            <a className="text-slate-600 hover:underline" href="#">
              Forgot password?
            </a>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Signing in..." : "Sign in"}
          </Button>

          {/* Mobile button */}
          <div className="mt-2 flex justify-center w-full lg:hidden">
            <div className="w-full max-w-xs">
              <GoogleLoginButton
                onSuccess={(token) => {
                  // TODO: set auth state, navigate, etc.
                  console.log('Google token:', token);
                }}
                onError={(err) => {
                  console.error('Google login error:', err);
                }}
              />
            </div>
          </div>
          {/* Desktop button */}
          <div className="mt-2 flex justify-center w-full hidden lg:flex">
            <div className="w-full">
              <GoogleLoginButton
                onSuccess={(token) => {
                  // TODO: set auth state, navigate, etc.
                  console.log('Google token:', token);
                }}
                onError={(err) => {
                  console.error('Google login error:', err);
                }}
              />
            </div>
          </div>
        </form>

        <footer className="mt-6 text-center text-sm text-slate-600">
          Don’t have an account? <a className="text-slate-800 font-medium hover:underline" href="#">Create one</a>
        </footer>
      </Card>
    </div>
  );
}
