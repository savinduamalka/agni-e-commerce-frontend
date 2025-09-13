import React, { useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

interface GoogleLoginButtonProps {
  onSuccess?: (token: string) => void;
  onError?: (error: any) => void;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  onSuccess,
  onError,
}) => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <GoogleLogin
      onSuccess={async (credentialResponse) => {
        if (!credentialResponse.credential) {
          toast.error("Google login failed: No credential returned.");
          onError?.("No credential returned");
          return;
        }
        try {
          // Send credential (JWT) to backend
          const res = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/users/login/google`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ idToken: credentialResponse.credential }),
            }
          );
          const data = await res.json();
          if (!res.ok) throw new Error(data?.message || "Google login failed");

          login(data.token);
          toast.success(data?.message || "Google login successful");
          onSuccess?.(data.token);
        } catch (err: any) {
          toast.error(err?.message || "Google login failed");
          onError?.(err);
        }
      }}
      onError={() => {
        toast.error("Google login failed");
        onError?.("Google login failed");
      }}
      width="100%"
      theme="outline"
      size="large"
      text="signin_with"
      shape="rectangular"
      logo_alignment="left"
      locale="en"
    />
  );
};

export default GoogleLoginButton;
