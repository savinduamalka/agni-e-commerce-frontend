
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Separator } from "../../components/ui/separator";
import { toast } from "sonner";

// Route export for framework routing
export const route = { path: "/verify", component: VerifyEmailPage };

export default function VerifyEmailPage({ email }: { email?: string }) {
  const [resending, setResending] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const userEmail = email || (typeof window !== "undefined" ? window.localStorage.getItem("verifyEmail") : "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (otp.length !== 6 || !/^[0-9]{6}$/.test(otp)) {
      toast.error("Please enter the 6-digit code sent to your email.");
      return;
    }
    setLoading(true);
    try {
      // Call backend to verify OTP
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Verification failed");
      toast.success(data?.message || "Email verified successfully!");
      // TODO: navigate to dashboard or sign in, optionally store token: data.token
    } catch (err: any) {
      toast.error(err?.message || "Invalid code. Please try again.");
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
      {/* Right side - Verify Email Form */}
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
          {/* Header */}
          <div className="space-y-2 mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">Verify your email</h1>
            <p className="text-sm text-gray-600">
              We've sent a 6-digit verification code to <span className="font-semibold text-orange-600">{userEmail}</span>.<br />
              Please check your email and enter the code below to verify your account.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="otp" className="text-sm font-medium text-gray-700">Verification Code</label>
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                minLength={6}
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="Enter 6-digit code"
                className="h-12 text-center text-lg tracking-widest font-mono rounded-3xl border-gray-200 px-4 focus:border-orange-400 focus:ring-0"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-black hover:bg-gray-800 text-white rounded-3xl font-medium text-base transition-colors"
            >
              {loading ? "Verifying..." : "Verify"}
            </Button>
            {/* Divider */}
            <div className="relative my-6">
              <Separator className="bg-gray-200" />
              <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-sm text-gray-500">
                or
              </span>
            </div>
            <div className="space-y-3 text-center">
              <span className="text-xs text-gray-500">
                Didn't receive the code? Check your spam folder or{' '}
                <button
                  type="button"
                  className="text-orange-600 font-medium cursor-pointer underline disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={resending || !userEmail}
                  onClick={async () => {
                    if (!userEmail) return toast.error('No email found.');
                    setResending(true);
                    try {
                      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/request-email-verification`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: userEmail }),
                      });
                      const data = await res.json();
                      if (!res.ok) throw new Error(data?.message || 'Failed to resend code');
                      toast.success('Verification code resent to your email!');
                    } catch (err: any) {
                      toast.error(err?.message || 'Could not resend code.');
                    } finally {
                      setResending(false);
                    }
                  }}
                >
                  {resending ? 'Resending...' : 'resend'}
                </button>.
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
