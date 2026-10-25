"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  CheckCircle,
  CreditCard,
  MailCheck,
  RefreshCw,
  Send,
  ShieldCheck,
  Upload,
  User,
  X,
  ScanFace,
  ClipboardCheck,
} from "lucide-react";
import { ShieldLogo } from "@/components/shield-logo";

export default function RegisterWizardPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [name, setName] = useState("Juan Dela Cruz");
  const [email, setEmail] = useState("juan@email.com");
  const [mobile, setMobile] = useState("+63 917 123 4567");
  const [birthdate, setBirthdate] = useState("1995-04-12");
  const [gender, setGender] = useState("Male");
  const [idType, setIdType] = useState("PhilSys ID (Philippine National ID)");

  // OTP State
  const [otp, setOtp] = useState(["8", "4", "2", "1", "9", "0"]);

  // Camera & Image Capture State
  const [selfieData, setSelfieData] = useState<string | null>(null);
  const [idFrontData, setIdFrontData] = useState<string | null>(null);
  const [idBackData, setIdBackData] = useState<string | null>(null);
  const [selfieActive, setSelfieActive] = useState(false);
  const [livenessPassed, setLivenessPassed] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Camera start simulation
  function startSelfieCamera() {
    setSelfieActive(true);
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: "user" } })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(() => {
        // Fallback for environments without physical camera attached
      });
  }

  function captureSelfie() {
    setSelfieActive(false);
    // Simulated selfie data URL
    const demoSelfie =
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'><rect width='200' height='200' fill='%23151E20'/><circle cx='100' cy='80' r='40' fill='%235DE0B0'/><path d='M40 170 C40 130 160 130 160 170 Z' fill='%235DE0B0'/></svg>";
    setSelfieData(demoSelfie);
    setLivenessPassed(true);
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, target: "front" | "back") {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (target === "front") setIdFrontData(event.target?.result as string);
        else setIdBackData(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleOtpChange(index: number, val: string) {
    const updated = [...otp];
    updated[index] = val;
    setOtp(updated);
  }

  async function submitApplication() {
    await fetch("/api/verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        mobile,
        birthdate,
        gender,
        idType,
        selfie: selfieData,
        idfront: idFrontData,
        idback: idBackData,
        livenessOk: livenessPassed,
      }),
    });

    router.push("/overview");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 lg:p-12 bg-bg text-ptext">
      <div className="w-full max-w-lg">
        <Link href="/" className="text-xs text-stext hover:text-ptext mb-6 inline-flex items-center gap-1.5 transition">
          <ArrowLeft size={14} /> Back to home
        </Link>

        <div className="flex items-center gap-2.5 mb-6">
          <ShieldLogo size={36} />
          <span className="text-xl font-bold">SpendGuard</span>
        </div>

        <div className="seg mb-6">
          <Link href="/auth/login" className="text-stext text-xs px-3 py-1.5 hover:text-ptext">
            Sign in
          </Link>
          <button type="button" className="active">
            Create account
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-1">Create your account</h2>
        <p className="text-stext text-sm mb-5">Join SpendGuard — your money, your limits, your control.</p>

        {/* Step Indicator */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className={`flex-1 h-1.5 rounded-full ${step >= 1 ? "bg-accent" : "bg-line"}`} />
          <div className={`flex-1 h-1.5 rounded-full ${step >= 2 ? "bg-accent" : "bg-line"}`} />
          <div className={`flex-1 h-1.5 rounded-full ${step >= 3 ? "bg-accent" : "bg-line"}`} />
          <div className={`flex-1 h-1.5 rounded-full ${step >= 4 ? "bg-accent" : "bg-line"}`} />
        </div>
        <div className="flex justify-between text-[11px] text-stext mb-6">
          <span>Step {step} of 4</span>
          <span className="text-accent font-medium">
            {step === 1
              ? "Account details"
              : step === 2
              ? "Contact verification"
              : step === 3
              ? "Identity verification"
              : "Review & submit"}
          </span>
        </div>

        {/* STEP 1: Account Details */}
        {step === 1 && (
          <div className="space-y-4 fade-up">
            <div>
              <label className="field-label">Full legal name *</label>
              <input
                className="input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Juan Dela Cruz"
                required
              />
            </div>
            <div>
              <label className="field-label">Email *</label>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                required
              />
            </div>
            <div>
              <label className="field-label">Mobile number *</label>
              <input
                className="input"
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="+63 9XX XXX XXXX"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="field-label">Birthdate *</label>
                <input
                  className="input"
                  type="date"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="field-label">Gender *</label>
                <select className="input" value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Non-binary</option>
                  <option>Prefer not to say</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="field-label">Password</label>
                <input className="input" type="password" placeholder="••••••••" defaultValue="secret123" />
              </div>
              <div>
                <label className="field-label">Confirm password</label>
                <input className="input" type="password" placeholder="••••••••" defaultValue="secret123" />
              </div>
            </div>
            <label className="flex items-start gap-2.5 text-xs text-stext cursor-pointer">
              <input type="checkbox" defaultChecked className="mt-0.5 accent-accent" />
              <span>
                I accept the <span className="text-accent hover:underline">Privacy Notice</span> and{" "}
                <span className="text-accent hover:underline">Terms of Service</span>.
              </span>
            </label>
            <button
              type="button"
              className="btn btn-accent w-full justify-center text-sm py-3"
              onClick={() => setStep(2)}
            >
              Continue <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* STEP 2: Email & Mobile Verification */}
        {step === 2 && (
          <div className="space-y-4 fade-up">
            <div className="text-center py-2">
              <div
                className="w-14 h-14 rounded-full mx-auto flex items-center justify-center mb-3"
                style={{ background: "rgba(93,224,176,.12)" }}
              >
                <MailCheck size={26} color="#5DE0B0" />
              </div>
              <h3 className="font-bold text-lg mb-1">Verify your contact</h3>
              <p className="text-stext text-sm">Enter the 6-digit code sent to {mobile} and {email}</p>
            </div>

            <div className="flex justify-center gap-2 my-4">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  className="input text-center font-bold text-lg w-12 p-0"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                />
              ))}
            </div>

            <div className="text-center text-xs text-stext">
              <span>Didn&apos;t get it? </span>
              <button type="button" className="text-accent hover:underline bg-transparent border-0 cursor-pointer">
                Resend code
              </button>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                className="btn btn-ghost flex-1 justify-center text-xs"
                onClick={() => setStep(1)}
              >
                <ArrowLeft size={14} /> Back
              </button>
              <button
                type="button"
                className="btn btn-accent flex-1 justify-center text-xs"
                onClick={() => setStep(3)}
              >
                Continue <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Identity Verification (Selfie + ID) */}
        {step === 3 && (
          <div className="space-y-4 fade-up">
            <div
              className="p-3.5 rounded-xl text-xs text-stext flex gap-2.5"
              style={{ background: "rgba(93,224,176,.05)", border: "1px solid rgba(93,224,176,.2)" }}
            >
              <ShieldCheck size={18} color="#5DE0B0" className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-accent mb-0.5">Identity verification required</p>
                <p>
                  Take a selfie and photos of your government ID. Verified on-chain via SpendGuard moderation queue.
                </p>
              </div>
            </div>

            <div>
              <label className="field-label">ID Type</label>
              <select className="input" value={idType} onChange={(e) => setIdType(e.target.value)}>
                <option>PhilSys ID (Philippine National ID)</option>
                <option>Driver&apos;s License</option>
                <option>Passport</option>
                <option>UMID</option>
                <option>SSS ID</option>
              </select>
            </div>

            {/* Selfie Capture Box */}
            <div className="card p-4">
              <label className="field-label mb-2">Selfie Photo (with liveness check)</label>
              {selfieData ? (
                <div className="p-4 rounded-xl flex items-center justify-between" style={{ background: "#0F1618" }}>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} color="#5DE0B0" />
                    <span className="text-xs font-semibold">Selfie captured & liveness verified</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelfieData(null);
                      setLivenessPassed(false);
                    }}
                    className="text-xs text-stext hover:text-ptext"
                  >
                    Retake
                  </button>
                </div>
              ) : selfieActive ? (
                <div className="relative aspect-video rounded-xl overflow-hidden mb-2" style={{ background: "#0F1618" }}>
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div
                      className="w-32 h-44 rounded-full border-2 border-dashed"
                      style={{ borderColor: "rgba(93,224,176,.5)" }}
                    />
                  </div>
                  <button
                    type="button"
                    className="btn btn-accent absolute bottom-3 left-1/2 -translate-x-1/2 text-xs"
                    onClick={captureSelfie}
                  >
                    Capture Photo
                  </button>
                </div>
              ) : (
                <div
                  className="aspect-video rounded-xl flex flex-col items-center justify-center gap-2 mb-2"
                  style={{ background: "#0F1618", border: "1px dashed #1F2A2D" }}
                >
                  <User size={24} color="#5DE0B0" />
                  <p className="text-xs text-stext">No selfie captured yet</p>
                  <button type="button" className="btn btn-soft text-xs" onClick={startSelfieCamera}>
                    <Camera size={14} /> Open camera
                  </button>
                </div>
              )}
            </div>

            {/* ID Front Upload Box */}
            <div className="card p-4">
              <label className="field-label mb-2">ID Front Photo</label>
              {idFrontData ? (
                <div className="p-3 rounded-xl flex items-center justify-between" style={{ background: "#0F1618" }}>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} color="#5DE0B0" />
                    <span className="text-xs font-semibold">ID front captured</span>
                  </div>
                  <button type="button" onClick={() => setIdFrontData(null)} className="text-xs text-stext hover:text-ptext">
                    Retake
                  </button>
                </div>
              ) : (
                <label className="btn btn-ghost w-full justify-center text-xs cursor-pointer py-3">
                  <Upload size={14} /> Upload or capture ID front
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, "front")}
                  />
                </label>
              )}
            </div>

            {/* Liveness Indicator */}
            {livenessPassed && (
              <div
                className="p-3 rounded-xl text-xs flex items-center gap-2"
                style={{ background: "rgba(93,224,176,.08)", border: "1px solid rgba(93,224,176,.22)" }}
              >
                <ScanFace size={16} color="#5DE0B0" />
                <div>
                  <span className="font-semibold text-accent">Liveness check passed.</span> Face verified.
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                className="btn btn-ghost flex-1 justify-center text-xs"
                onClick={() => setStep(2)}
              >
                <ArrowLeft size={14} /> Back
              </button>
              <button
                type="button"
                className="btn btn-accent flex-1 justify-center text-xs"
                onClick={() => {
                  if (!selfieData) {
                    captureSelfie();
                  }
                  if (!idFrontData) {
                    setIdFrontData(
                      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'><rect width='300' height='200' fill='%231A2428'/><text x='150' y='100' font-family='sans-serif' font-size='16' fill='%235DE0B0' text-anchor='middle'>PhilSys ID Front</text></svg>",
                    );
                  }
                  setStep(4);
                }}
              >
                Review details <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Review & Submit */}
        {step === 4 && (
          <div className="space-y-4 fade-up">
            <div className="text-center py-2">
              <div
                className="w-14 h-14 rounded-full mx-auto flex items-center justify-center mb-3"
                style={{ background: "rgba(93,224,176,.12)" }}
              >
                <ClipboardCheck size={26} color="#5DE0B0" />
              </div>
              <h3 className="font-bold text-lg mb-1">Review & submit</h3>
              <p className="text-stext text-sm">Confirm your application details before submission.</p>
            </div>

            <div className="card p-4 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-stext">Full name</span>
                <span className="font-medium">{name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stext">Email</span>
                <span className="font-medium">{email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stext">Mobile</span>
                <span className="font-medium">{mobile}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stext">Birthdate</span>
                <span className="font-medium">{birthdate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stext">Gender</span>
                <span className="font-medium">{gender}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stext">ID type</span>
                <span className="font-medium">{idType.split(" (")[0]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stext">Selfie</span>
                <span className="badge b-ok">Captured</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stext">Liveness check</span>
                <span className="badge b-ok">Passed</span>
              </div>
            </div>

            <div
              className="p-3.5 rounded-xl text-xs text-stext"
              style={{ background: "rgba(245,158,11,.05)", border: "1px solid rgba(245,158,11,.2)" }}
            >
              <p className="font-semibold text-warn mb-1">What happens next?</p>
              <p>
                Your application will be verified by a SpendGuard officer. You can immediately access your account
                dashboard and test the 1 XLM Stellar split payment.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                className="btn btn-ghost flex-1 justify-center text-xs"
                onClick={() => setStep(3)}
              >
                <ArrowLeft size={14} /> Back
              </button>
              <button
                type="button"
                className="btn btn-accent flex-1 justify-center text-xs"
                onClick={submitApplication}
              >
                <Send size={14} /> Submit application
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
