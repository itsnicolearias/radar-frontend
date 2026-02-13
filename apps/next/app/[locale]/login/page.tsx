"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button, Input, Label } from "@radar/ui";
import { authService } from "@radar/api";
import { useAuthStore } from "@radar/features";
import { type LoginInput, loginSchema } from "../../../../../packages/api/validations";

export default function LoginPage() {
  const t = useTranslations("auth.login");
  const common = useTranslations("auth.common");
  const locale = useLocale();
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [formData, setFormData] = useState<LoginInput>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof LoginInput, string>>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = loginSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof LoginInput, string>> = {};
      validation.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof LoginInput] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.login(formData);
      setAuth(response.data.user, null, response.data.token);
      router.push("/radar");
    } catch (error: any) {
      setErrors({ email: error.response?.data?.message || t("errors.default") });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-[#00FFB3]/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 min-h-screen px-6 py-8 flex flex-col">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-[#C5C5C5] hover:text-[#00FFB3] transition-all duration-300"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{common("back")}</span>
        </Link>

        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold text-white">{t("title")}</h1>
              <p className="text-[#C5C5C5]">{t("subtitle")}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  {common("email")}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={common("emailPlaceholder")}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-12 bg-[#1A1A1A] border border-[#1DE3F2]/30 rounded-2xl text-white placeholder-[#C5C5C5]/40 focus:border-[#00FFB3] focus:outline-none transition-all"
                />
                {errors.email && <p className="text-sm text-[#FF005C]">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  {common("password")}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={common("passwordPlaceholder")}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="h-12 bg-[#1A1A1A] border border-[#1DE3F2]/30 rounded-2xl text-white placeholder-[#C5C5C5]/40 focus:border-[#00FFB3] focus:outline-none transition-all pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C5C5C5] hover:text-[#00FFB3] transition-colors"
                    aria-label={showPassword ? common("hidePassword") : common("showPassword")}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-[#FF005C]">{errors.password}</p>}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] text-black rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-[#00FFB3]/50 active:scale-95"
              >
                {isLoading ? t("submitting") : t("submit")}
              </Button>
            </form>

            <div className="space-y-3">
              <p className="text-center text-sm text-[#C5C5C5]">
                {t("noAccount")}{" "}
                <Link
                  href={`/${locale}/register`}
                  className="text-[#00FFB3] hover:text-[#1DE3F2] underline font-semibold transition-colors"
                >
                  {t("goRegister")}
                </Link>
              </p>
              <div className="flex items-center justify-center gap-4 text-xs text-[#C5C5C5]">
                <Link href={`/${locale}/privacy-policy`} className="hover:text-[#00FFB3] transition-colors">
                  {common("privacy")}
                </Link>
                <span>-</span>
                <Link href={`/${locale}/terms-conditions`} className="hover:text-[#00FFB3] transition-colors">
                  {common("terms")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
