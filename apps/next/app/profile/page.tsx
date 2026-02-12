"use client";

import { useState } from "react";
import { ArrowLeft, Settings, LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@radar/features";
import PlanCard from "@radar/ui/components/plan-card";
import ProfileField from "@radar/ui/components/profile-field";
import InterestsSelector from "@radar/ui/components/interest-selector";
import AvatarBlock from "@radar/ui/components/avatar-block";
import { profileService } from "@radar/api";
import { BottomNav } from "@radar/ui";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const t = useTranslations("profilePage");
  const nav = useTranslations("dashboard.bottomNav");
  const { user, profile, setProfile, setUser, logout } = useAuthStore();
  const router = useRouter();

  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [age, setAge] = useState(profile?.age || "");
  const [country, setCountry] = useState(profile?.country || "");
  const [province, setProvince] = useState(profile?.province || "");
  const [interests, setInterests] = useState<string[]>(profile?.interests || []);

  const [showAge, setShowAge] = useState(profile?.showAge ?? true);
  const [showLocation, setShowLocation] = useState(profile?.showLocation ?? true);
  const [isSaving, setIsSaving] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handlePhotoUpload = async (photoUrl: string) => {
    try {
      await profileService.updateMyProfile({
        Profile: { photoUrl },
      });
      if (profile) {
        setProfile({ ...profile, photoUrl });
      }
    } catch (error) {
      console.error("[profile] Error updating photo:", error);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleSave = async () => {
    setIsSaving(true);
    setAlertMessage(null);

    try {
      const profilePayload: any = {
        bio,
        country,
        province,
        interests,
        showAge,
        showLocation,
      };

      if (age !== "" && age !== undefined) {
        profilePayload.age = Number(age);
      }

      const response = await profileService.updateMyProfile({
        Profile: profilePayload,
        User: {
          displayName,
          firstName,
          lastName,
        },
      });

      if (response?.data?.User) {
        setUser({ ...user, ...(response.data.User as any) });
      }
      if (response?.data) {
        setProfile({ ...profile, ...response.data.Profile });
      }

      setAlertMessage({ type: "success", text: t("alerts.saved") });
      setTimeout(() => setAlertMessage(null), 3000);
    } catch (error) {
      console.error("[profile] Error saving profile:", error);
      setAlertMessage({ type: "error", text: t("alerts.saveError") });
      setTimeout(() => setAlertMessage(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const interestOptions = t.raw("interestOptions") as string[];

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 0%, rgba(0,255,179,0.06) 0%, transparent 60%)",
        }}
      />

      {alertMessage && (
        <div
          className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-lg backdrop-blur-lg ${
            alertMessage.type === "success" ? "bg-[#00FFB3]/20 border border-[#00FFB3] text-[#00FFB3]" : "bg-[#FF005C]/20 border border-[#FF005C] text-[#FF005C]"
          }`}
        >
          {alertMessage.text}
        </div>
      )}

      <div className="bg-[#1A1A1A]/40 backdrop-blur-xl p-6 pb-8 border-b border-[#00FFB3]/20 relative z-10">
        <div className="flex items-center justify-between">
          <a href="/radar" className="w-10 h-10 rounded-full border border-[#00FFB3]/30 flex items-center justify-center bg-[#101010] hover:scale-110 transition">
            <ArrowLeft className="w-5 h-5 text-white" />
          </a>

          <h2 className="text-white text-center flex-1 -ml-10">{t("title")}</h2>

          <div className="w-10 h-10 rounded-full border border-[#00FFB3]/30 flex items-center justify-center bg-[#101010]">
            <Settings className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10 scrollbar-hide">
        <AvatarBlock src={profile?.photoUrl} initials={`${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`} onUpload={handlePhotoUpload} />

        <PlanCard
          texts={{
            title: t("plan.title"),
            radarRangeLabel: t("plan.radarRange"),
            radarRangeValue: t("plan.radarRangeValue"),
            signalsLabel: t("plan.signals"),
            signalsValue: t("plan.signalsValue"),
            visitors: t("plan.visitors"),
          }}
        />

        <div className="space-y-6 animate-slide-up">
          <ProfileField label={t("fields.displayName")} value={displayName} onChange={setDisplayName} />
          <ProfileField label={t("fields.firstName")} value={firstName} onChange={setFirstName} />
          <ProfileField label={t("fields.lastName")} value={lastName} onChange={setLastName} />

          <ProfileField
            label={t("fields.age")}
            value={String(age)}
            onChange={setAge}
            privacy={{
              visible: showAge,
              onToggle: () => setShowAge(!showAge),
            }}
            privacyLabels={{ visible: t("privacy.visible"), hidden: t("privacy.hidden") }}
            type="number"
          />

          <ProfileField label={t("fields.country")} value={country} onChange={setCountry} />

          <ProfileField
            label={t("fields.province")}
            value={province}
            onChange={setProvince}
            privacy={{
              visible: showLocation,
              onToggle: () => setShowLocation(!showLocation),
            }}
            privacyLabels={{ visible: t("privacy.visible"), hidden: t("privacy.hidden") }}
            type="text"
          />

          <ProfileField label={t("fields.bio")} value={bio} onChange={setBio} multiline />
        </div>

        <InterestsSelector
          selected={interests}
          label={t("fields.interests")}
          options={interestOptions}
          onToggle={(name) => {
            setInterests((prev) => (prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]));
          }}
        />

        <div className="pt-4 border-t border-[#197387]/20">
          <button
            onClick={handleLogout}
            className="w-full h-12 rounded-full bg-[#0A0E12]/50 border border-[#197387]/30 hover:bg-[#0A0E12]/80 text-[#C5C5C5] hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            {t("logout")}
          </button>
        </div>
      </div>

      <div className="p-6 bg-[#0F2B33]/80 backdrop-blur-xl border-t border-[#197387]/20">
        <button disabled={isSaving} onClick={handleSave} className="w-full h-14 rounded-full bg-linear-to-r from-[#197387] to-[#15657a] text-white hover:shadow-lg transition-all">
          {isSaving ? t("saving") : t("save")}
        </button>
      </div>
      <BottomNav
        activeTab="profile"
        onTabChange={(tab) => router.push(`/${tab === "profile" ? "profile" : tab}`)}
        labels={{
          radar: nav("radar"),
          chats: nav("chats"),
          events: nav("events"),
          profile: nav("profile"),
        }}
      />
    </div>
  );
}
