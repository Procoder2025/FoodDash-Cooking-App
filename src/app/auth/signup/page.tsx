"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, type UserRole } from "@/context/AuthContext";
import { validateEmail, validatePhone, validateName } from "@/utils/emailValidator";
import { UserPlus, Mail, Lock, Phone, User, ChefHat, ShoppingBag, MapPin, AlertCircle, CheckCircle, Shield, Eye, EyeOff, Bike } from "lucide-react";
import { Suspense } from "react";

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signup } = useAuth();
  const [role, setRole] = useState<UserRole>("customer");

  // Pre-select role from URL query param
  useEffect(() => {
    const r = searchParams.get("role");
    if (r === "cooker") setRole("cooker");
    if (r === "delivery") setRole("delivery");
  }, [searchParams]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "", kitchenName: "", speciality: "", address: "", vehicleType: "Bike", vehicleNumber: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (f: string, v: string) => {
    setForm((p) => ({ ...p, [f]: v }));
    // Clear error for this field
    setErrors((p) => ({ ...p, [f]: "" }));
  };

  // Real-time validation on blur
  const validateField = (field: string) => {
    if (field === "name") {
      const r = validateName(form.name);
      if (!r.valid) setErrors((p) => ({ ...p, name: r.reason }));
    } else if (field === "email") {
      const r = validateEmail(form.email);
      if (!r.valid) setErrors((p) => ({ ...p, email: r.reason }));
    } else if (field === "phone" && form.phone) {
      const r = validatePhone(form.phone);
      if (!r.valid) setErrors((p) => ({ ...p, phone: r.reason }));
    } else if (field === "password") {
      if (form.password.length < 6) setErrors((p) => ({ ...p, password: "Password must be at least 6 characters" }));
    } else if (field === "confirmPassword") {
      if (form.confirmPassword && form.password !== form.confirmPassword) setErrors((p) => ({ ...p, confirmPassword: "Passwords don't match" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError("");
    setErrors({});

    // Validate all fields
    const nameCheck = validateName(form.name);
    const emailCheck = validateEmail(form.email);
    const phoneCheck = form.phone ? validatePhone(form.phone) : { valid: true, reason: "" };
    const newErrors: Record<string, string> = {};

    if (!nameCheck.valid) newErrors.name = nameCheck.reason;
    if (!emailCheck.valid) newErrors.email = emailCheck.reason;
    if (!phoneCheck.valid) newErrors.phone = phoneCheck.reason;
    if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords don't match";
    if (role === "cooker" && !form.kitchenName.trim()) newErrors.kitchenName = "Kitchen name is required";
    if (role === "delivery" && !form.vehicleNumber.trim()) newErrors.vehicleNumber = "Vehicle number is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    const result = await signup({ ...form, role });
    setLoading(false);

    if (result === true) {
      setSuccess(true);
      setTimeout(() => {
        router.push(role === "cooker" ? "/dashboard/cooker" : role === "delivery" ? "/dashboard/delivery" : "/browse");
      }, 2000);
    } else {
      setGlobalError(result || "Signup failed. Please try again.");
    }
  };

  const inputStyle: React.CSSProperties = { width: "100%", padding: "13px 14px 13px 42px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 12, fontSize: 14, outline: "none" };
  const errorInputStyle: React.CSSProperties = { ...inputStyle, border: "1px solid #fca5a5", background: "#fef2f2" };

  if (success) {
    return (
      <div style={{ width: "100%", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", background: "#f9fafb" }}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: "center", maxWidth: 400 }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
            <CheckCircle size={72} color="#16a34a" style={{ margin: "0 auto 20px" }} />
          </motion.div>
          <h2 style={{ fontSize: 26, fontWeight: 900, marginBottom: 8 }}>Account Created!</h2>
          <p style={{ color: "#6b7280", fontSize: 15, marginBottom: 8 }}>
            Your {role === "cooker" ? "Home Chef" : role === "delivery" ? "Delivery Partner" : "Customer"} account has been created successfully.
          </p>
          <p style={{ color: "#16a34a", fontWeight: 600, fontSize: 14 }}>
            Redirecting to {role === "cooker" ? "your Kitchen Dashboard" : role === "delivery" ? "your Delivery Dashboard" : "Browse Food"}...
          </p>
          <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2.5 }}
            style={{ height: 4, background: "#16a34a", borderRadius: 4, marginTop: 20 }} />
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", background: "#f9fafb" }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ width: "100%", maxWidth: 520 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}
            style={{ width: 64, height: 64, background: "linear-gradient(135deg, #16a34a, #15803d)", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
            <UserPlus size={28} color="#fff" />
          </motion.div>
          <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 6 }}>Create Account</h1>
          <p style={{ color: "#6b7280", fontSize: 15 }}>Join FoodDash as a home chef or food lover</p>
        </div>

        {/* Security Badge */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 20, fontSize: 12, color: "#6b7280" }}>
          <Shield size={14} color="#16a34a" /> Spam & fraud emails are automatically blocked
        </div>

        <div style={{ background: "#fff", borderRadius: 20, padding: 28, border: "1px solid #e5e7eb", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
          {/* Role Selection */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 22 }}>
            {[
              { id: "customer" as UserRole, label: "Customer", icon: ShoppingBag, desc: "Browse & order food", color: "#3b82f6" },
              { id: "cooker" as UserRole, label: "Home Chef", icon: ChefHat, desc: "Cook & sell food", color: "#16a34a" },
              { id: "delivery" as UserRole, label: "Delivery Partner", icon: Bike, desc: "Earn as a rider", color: "#f59e0b" },
            ].map((r) => (
              <motion.button key={r.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => setRole(r.id)} type="button"
                style={{
                  padding: 16, borderRadius: 14, border: role === r.id ? `2px solid ${r.color}` : "2px solid #e5e7eb",
                  background: role === r.id ? `${r.color}08` : "#fff",
                  cursor: "pointer", textAlign: "center", transition: "all 0.2s",
                }}>
                <r.icon size={26} color={role === r.id ? r.color : "#9ca3af"} style={{ margin: "0 auto 6px" }} />
                <p style={{ fontSize: 13, fontWeight: 700, color: role === r.id ? r.color : "#374151" }}>{r.label}</p>
                <p style={{ fontSize: 10, color: "#9ca3af", marginTop: 2 }}>{r.desc}</p>
              </motion.button>
            ))}
          </div>

          {globalError && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              style={{ display: "flex", alignItems: "center", gap: 8, background: "#fef2f2", color: "#dc2626", padding: "12px 16px", borderRadius: 10, fontSize: 13, marginBottom: 18 }}>
              <AlertCircle size={16} /> {globalError}
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Name & Phone */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Full Name *</label>
                <div style={{ position: "relative" }}>
                  <User size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                  <input type="text" required value={form.name} onChange={(e) => update("name", e.target.value)} onBlur={() => validateField("name")}
                    placeholder="Your real name" style={errors.name ? errorInputStyle : inputStyle} />
                </div>
                <AnimatePresence>{errors.name && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ color: "#dc2626", fontSize: 11, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}><AlertCircle size={11} /> {errors.name}</motion.p>}</AnimatePresence>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Phone *</label>
                <div style={{ position: "relative" }}>
                  <Phone size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                  <input type="tel" required value={form.phone} onChange={(e) => update("phone", e.target.value)} onBlur={() => validateField("phone")}
                    placeholder="+91 98765 43210" style={errors.phone ? errorInputStyle : inputStyle} />
                </div>
                <AnimatePresence>{errors.phone && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ color: "#dc2626", fontSize: 11, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}><AlertCircle size={11} /> {errors.phone}</motion.p>}</AnimatePresence>
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Email *</label>
              <div style={{ position: "relative" }}>
                <Mail size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                <input type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} onBlur={() => validateField("email")}
                  placeholder="your.real.email@gmail.com" style={errors.email ? errorInputStyle : inputStyle} />
              </div>
              <AnimatePresence>{errors.email && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ color: "#dc2626", fontSize: 11, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}><AlertCircle size={11} /> {errors.email}</motion.p>}</AnimatePresence>
            </div>

            {/* Password */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Password *</label>
                <div style={{ position: "relative" }}>
                  <Lock size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                  <input type={showPass ? "text" : "password"} required value={form.password} onChange={(e) => update("password", e.target.value)} onBlur={() => validateField("password")}
                    placeholder="Min 6 chars" style={errors.password ? errorInputStyle : inputStyle} />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <AnimatePresence>{errors.password && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ color: "#dc2626", fontSize: 11, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}><AlertCircle size={11} /> {errors.password}</motion.p>}</AnimatePresence>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Confirm Password *</label>
                <div style={{ position: "relative" }}>
                  <Lock size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                  <input type="password" required value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} onBlur={() => validateField("confirmPassword")}
                    placeholder="Repeat password" style={errors.confirmPassword ? errorInputStyle : inputStyle} />
                </div>
                <AnimatePresence>{errors.confirmPassword && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ color: "#dc2626", fontSize: 11, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}><AlertCircle size={11} /> {errors.confirmPassword}</motion.p>}</AnimatePresence>
              </div>
            </div>

            {/* Address */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Address / Location</label>
              <div style={{ position: "relative" }}>
                <MapPin size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                <input type="text" value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="Your area, city" style={inputStyle} />
              </div>
            </div>

            {/* Cooker fields */}
            <AnimatePresence>
              {role === "cooker" && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Kitchen Name *</label>
                      <input type="text" value={form.kitchenName} onChange={(e) => update("kitchenName", e.target.value)} placeholder="e.g. Amma's Kitchen" style={errors.kitchenName ? { ...inputStyle, paddingLeft: 14, border: "1px solid #fca5a5", background: "#fef2f2" } : { ...inputStyle, paddingLeft: 14 }} />
                      <AnimatePresence>{errors.kitchenName && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ color: "#dc2626", fontSize: 11, marginTop: 4 }}>{errors.kitchenName}</motion.p>}</AnimatePresence>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Speciality</label>
                      <input type="text" value={form.speciality} onChange={(e) => update("speciality", e.target.value)} placeholder="e.g. South Indian" style={{ ...inputStyle, paddingLeft: 14 }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {role === "delivery" && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Vehicle Type *</label>
                      <select value={form.vehicleType} onChange={(e) => update("vehicleType", e.target.value)} style={{ ...inputStyle, paddingLeft: 14 }}>
                        <option>Bike</option>
                        <option>Bicycle</option>
                        <option>Scooter</option>
                        <option>Car</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Vehicle Number *</label>
                      <input type="text" value={form.vehicleNumber} onChange={(e) => update("vehicleNumber", e.target.value)} placeholder="TN 36 AB 1234" style={errors.vehicleNumber ? { ...inputStyle, paddingLeft: 14, border: "1px solid #fca5a5", background: "#fef2f2" } : { ...inputStyle, paddingLeft: 14 }} />
                      <AnimatePresence>{errors.vehicleNumber && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ color: "#dc2626", fontSize: 11, marginTop: 4 }}>{errors.vehicleNumber}</motion.p>}</AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} style={{
              width: "100%", padding: "14px", borderRadius: 12, background: "#16a34a", color: "#fff",
              border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer", marginTop: 10,
              boxShadow: "0 4px 15px rgba(22,163,74,0.3)", opacity: loading ? 0.7 : 1,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
              {loading ? "⏳ Creating Account..." : <><UserPlus size={18} /> Create {role === "cooker" ? "Chef" : role === "delivery" ? "Rider" : "Customer"} Account</>}
            </motion.button>
          </form>

          <p style={{ textAlign: "center", marginTop: 18, fontSize: 14, color: "#6b7280" }}>
            Already have an account? <Link href="/auth/login" style={{ color: "#16a34a", fontWeight: 700 }}>Login</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", padding: "80px 20px", color: "#6b7280" }}>Loading...</div>}>
      <SignupContent />
    </Suspense>
  );
}
