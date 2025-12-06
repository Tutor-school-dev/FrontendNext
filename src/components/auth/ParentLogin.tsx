"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { GoogleLogin } from "@react-oauth/google";
import { useOTPRequest } from "@/hooks/useOTPRequest";
import { useOTPVerify } from "@/hooks/useOTPVerify";
import { useParentGoogleLogin } from "@/hooks/useParentGoogleLogin";
import { toast } from "sonner";

const ParentLogin = () => {
  const [step, setStep] = useState("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");

  const { requestOTP, loading: sendingOTP } = useOTPRequest();
  const { VerifyOTP, VerifyOTPLoading } = useOTPVerify();
  const { handleGoogleLogin, loading: googleLoading } = useParentGoogleLogin();

  const handleSendOtp = async () => {
    if (phoneNumber.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }
    
    const result = await requestOTP(phoneNumber, "parent", false);
    if (result.success) {
      setStep("otp");
      
      // Auto-fill OTP in staging environment
      const nodeEnv = process.env.NEXT_PUBLIC_NODE_ENV || process.env.NODE_ENV;
      if (nodeEnv === 'staging' && result.otp) {
        setTimeout(() => {
          setOtp(result.otp!);
          toast.success('OTP auto-filled for staging!', { duration: 3000 });
        }, 1500);
      }
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    
    // For parent login, set isSignup=false to use LOGIN
    await VerifyOTP(() => {}, phoneNumber, otp, "parent", false);
  };

  const handleFailure = (error: any) => {
    console.error("Google Login Failed:", error);
  };

  const handleChangePhoneNumber = () => {
    setStep("phone");
    setOtp("");
  };

  return (
    <div className="space-y-6">
      {step === "phone" ? (
        // Phone Number Step
        <>
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Parent Login/SignUp</h3>
              <p className="text-sm text-muted-foreground">
                Enter your phone number to continue
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter 10-digit number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                maxLength={10}
                required
              />
            </div>

            <Button
              onClick={handleSendOtp}
              className="w-full"
              disabled={sendingOTP || phoneNumber.length !== 10}
            >
              {sendingOTP ? "Sending OTP..." : "Send OTP"}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            {!googleLoading ? (
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => handleFailure("Google login failed")}
              />
            ) : (
              <Button disabled className="w-full">
                Signing in with Google...
              </Button>
            )}
          </div>
        </>
      ) : (
        // OTP Verification Step
        <>
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Enter OTP</h3>
              <p className="text-sm text-muted-foreground">
                Enter the OTP sent to your phone: {phoneNumber}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Enter OTP</Label>
              <div className="flex justify-center">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            <Button
              onClick={handleVerifyOtp}
              className="w-full"
              disabled={VerifyOTPLoading || otp.length !== 6}
            >
              {VerifyOTPLoading ? "Verifying..." : "Verify & Continue"}
            </Button>
            
            <Button
              variant="ghost"
              onClick={handleChangePhoneNumber}
              className="w-full"
            >
              Change Phone Number
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ParentLogin;