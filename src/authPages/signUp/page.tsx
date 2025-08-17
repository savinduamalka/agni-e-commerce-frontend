import { Eye, EyeOff, ArrowLeft, Image } from "lucide-react";
import { useState } from "react";
import "../../styles/design-tokens.css";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Separator } from "../../components/ui/separator";
import GoogleLoginButton from "../../components/ui/google-login";
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

// Route export for framework routing
export const route = { path: "/signUp", component: SignUpPage };
export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    if (!email.includes("@")) return "Please enter a valid email.";
    if (!firstName.trim()) return "First name is required.";
    if (!lastName.trim()) return "Last name is required.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      toast.error(v);
      return;
    }
    setLoading(true);
    try {
      // call backend signup endpoint
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName, lastName, password, avatar }),
      })

      const data = await (async () => {
        const txt = await res.text()
        try { return JSON.parse(txt) } catch { return { message: txt } }
      })()

      if (!res.ok) {
        const msg = data?.message || data?.error || 'Sign up failed';
        throw new Error(msg);
      }

      // success
      toast.success(data?.message || 'Account created successfully');
      // Send request to backend to send verification code
      try {
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/request-email-verification`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
      } catch {}
      // Store email for verify page and navigate
      window.localStorage.setItem('verifyEmail', email);
      navigate('/verify');
    } catch (err: any) {
      toast.error(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 via-red-600 to-red-700 flex">
      {/* Left side - Fire Wallpaper */}
      <div className="hidden lg:flex lg:w-[60%] items-center justify-center relative overflow-hidden">
        {/* Fire gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-orange-500 to-yellow-400"></div>
        {/* Fire effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
        {/* Animated fire particles */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          {/* Large flame shapes */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-64 bg-gradient-to-t from-red-500 via-orange-400 to-yellow-300 rounded-full opacity-80 blur-sm animate-pulse"></div>
          <div className="absolute bottom-8 left-1/3 w-24 h-48 bg-gradient-to-t from-red-600 via-orange-500 to-yellow-400 rounded-full opacity-70 blur-sm animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-8 right-1/3 w-20 h-40 bg-gradient-to-t from-red-700 via-orange-600 to-yellow-500 rounded-full opacity-60 blur-sm animate-pulse" style={{ animationDelay: '1s' }}></div>
          {/* Floating embers */}
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-yellow-400 rounded-full opacity-80 animate-bounce"></div>
          <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-orange-400 rounded-full opacity-70 animate-bounce" style={{ animationDelay: '0.3s' }}></div>
          <div className="absolute top-1/2 left-1/5 w-2 h-2 bg-red-400 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0.7s' }}></div>
          <div className="absolute bottom-1/3 right-1/5 w-3 h-3 bg-yellow-500 rounded-full opacity-75 animate-bounce" style={{ animationDelay: '1.2s' }}></div>
          {/* Central fire pillar */}
          <div className="relative">
            <div className="w-40 h-80 bg-gradient-to-t from-red-600 via-orange-400 to-yellow-200 rounded-full opacity-90 blur-md"></div>
            <div className="absolute inset-0 w-32 h-72 bg-gradient-to-t from-red-500 via-orange-300 to-yellow-100 rounded-full opacity-80 blur-sm mx-auto mt-4"></div>
            <div className="absolute inset-0 w-24 h-64 bg-gradient-to-t from-red-400 via-orange-200 to-yellow-50 rounded-full opacity-70 mx-auto mt-8"></div>
          </div>
          {/* Glowing base */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-32 bg-gradient-radial from-orange-400/60 via-red-500/40 to-transparent rounded-full blur-2xl"></div>
        </div>
      </div>
      {/* Right side - Sign Up Form */}
      <div className="flex-1 lg:flex-none lg:w-[40%] bg-white flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-sm">
          {/* Elegant Welcome Caption */}
          <div className="flex flex-col items-center mb-6">
            <span
              className="text-3xl lg:text-4xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-600 to-yellow-400 drop-shadow-lg text-center"
              style={{ letterSpacing: '0.04em' }}
            >
              AGNI Online Store
            </span>
          </div>
          {/* Back button - mobile only */}
          <Button 
            variant="ghost"
            className="lg:hidden mb-6 p-0 h-auto font-normal text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
          </Button>
          {/* Header */}
          <div className="space-y-2 mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">Sign up</h1>
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <a href="/signIn" className="font-medium text-gray-900 underline hover:no-underline">
                Sign in
              </a>
            </p>
          </div>
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Avatar */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Avatar</label>
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <img
                    src={avatar || 'https://ui-avatars.com/api/?name=Avatar&background=FF9800&color=fff'}
                    alt="Avatar preview"
                    className="w-20 h-20 rounded-full object-cover border-2 border-orange-200 shadow-md cursor-pointer transition-all duration-200 group-hover:brightness-90"
                    onClick={() => document.getElementById('avatar-input')?.click()}
                  />
                  <button
                    type="button"
                    className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-orange-100 transition-colors"
                    style={{ zIndex: 2 }}
                    onClick={() => document.getElementById('avatar-input')?.click()}
                    aria-label="Change avatar"
                  >
                    <Image className="w-5 h-5 text-orange-500" />
                  </button>
                  <input
                    id="avatar-input"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          setAvatar(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
                <span className="mt-2 text-xs text-gray-500">Click avatar to select image</span>
              </div>
            </div>
            {/* First Name & Last Name (horizontal) */}
            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name</label>
                <Input
                  id="firstName"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="h-12 rounded-3xl border-gray-200 px-4 text-base focus:border-orange-400 focus:ring-0"
                />
              </div>
              <div className="flex-1 space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</label>
                <Input
                  id="lastName"
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="h-12 rounded-3xl border-gray-200 px-4 text-base focus:border-orange-400 focus:ring-0"
                />
              </div>
            </div>
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-3xl border-gray-200 px-4 text-base focus:border-orange-400 focus:ring-0"
              />
            </div>
            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-3xl border-gray-200 px-4 pr-12 text-base focus:border-orange-400 focus:ring-0"
                />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-red-500 lg:text-red-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-orange-500 lg:text-orange-600" />
                  )}
                </Button>
              </div>
            </div>
            {/* Sign Up Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-black hover:bg-gray-800 text-white rounded-3xl font-medium text-base transition-colors"
            >
              {loading ? "Signing up..." : "Sign up"}
            </Button>
            {/* Divider */}
            <div className="relative my-6">
              <Separator className="bg-gray-200" />
              <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-sm text-gray-500">
                or
              </span>
            </div>
            {/* Social Login Buttons */}
            <div className="space-y-3">
              <GoogleLoginButton />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
