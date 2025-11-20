"use client";

import { useState } from "react";
import { ArrowLeft, Settings, LogOut } from "lucide-react";
import { useAuthStore } from "@radar/features";
import PlanCard from "@radar/ui/components/plan-card";
import ProfileField from "@radar/ui/components/profile-field";
import InterestsSelector from "@radar/ui/components/interest-selector";
import AvatarBlock from "@radar/ui/components/avatar-block";
import { profileService } from "@radar/api";

export default function ProfilePage() {
  const { user, profile } = useAuthStore();

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

  const handleSave = async () => {
    setIsSaving(true);

    await profileService.updateMyProfile({
      displayName,
      firstName,
      lastName,
      bio,
      age,
      country,
      province,
      interests,
      showAge,
      showLocation,
    });

    setIsSaving(false);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">

      {/* Radial background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(0,255,179,0.06) 0%, transparent 60%)",
        }}
      />

      {/* Header */}
      <div className="bg-[#1A1A1A]/40 backdrop-blur-xl p-6 pb-8 border-b border-[#00FFB3]/20 relative z-10">
        <div className="flex items-center justify-between">
          <a
            href="/radar"
            className="w-10 h-10 rounded-full border border-[#00FFB3]/30 flex items-center justify-center bg-[#101010] hover:scale-110 transition"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </a>

          <h2 className="text-white text-center flex-1 -ml-10">Mi Perfil</h2>

          <div className="w-10 h-10 rounded-full border border-[#00FFB3]/30 flex items-center justify-center bg-[#101010]">
            <Settings className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10 scrollbar-hide">

        {/* Avatar Block */}
        <AvatarBlock
          src={profile?.photoUrl}
          initials={`${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`}
        />

        {/* Plan Card */}
        <PlanCard />

        {/* FORM FIELDS */}
        <div className="space-y-6 animate-slide-up">

          <ProfileField
            label="Nombre visible"
            value={displayName}
            onChange={setDisplayName}
          />

          <ProfileField
            label="Nombre"
            value={firstName}
            onChange={setFirstName}
          />

          <ProfileField
            label="Apellido"
            value={lastName}
            onChange={setLastName}
          />

          {/* Edad con privacy */}
          <ProfileField
            label="Edad"
            value={String(age)}
            onChange={setAge}
            privacy={{
              visible: showAge,
              onToggle: () => setShowAge(!showAge),
            }}
            type="number"
          />

          <ProfileField
            label="País"
            value={country}
            onChange={setCountry}
          />

          {/* Provincia con privacy */}
          <ProfileField
            label="Provincia"
            value={province}
            onChange={setProvince}
            privacy={{
              visible: showLocation,
              onToggle: () => setShowLocation(!showLocation),
            }}
            type="text"
          />

          {/* BIO */}
          <ProfileField
            label="Biografía"
            value={bio}
            onChange={setBio}
            multiline
          />

        </div>

        {/* Intereses */}
        <InterestsSelector
          selected={interests}
          onToggle={(name) => {
            setInterests((prev) =>
              prev.includes(name)
                ? prev.filter((i) => i !== name)
                : [...prev, name]
            );
          }}
        />

        {/* Logout */}
        <div className="pt-4 border-t border-[#197387]/20">
          <button className="w-full h-12 rounded-full bg-[#0A0E12]/50 border border-[#197387]/30 hover:bg-[#0A0E12]/80 text-[#C5C5C5] hover:text-white transition-all duration-300 flex items-center justify-center gap-2">
            <LogOut className="w-5 h-5" />
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="p-6 bg-[#0F2B33]/80 backdrop-blur-xl border-t border-[#197387]/20">
        <button
          disabled={isSaving}
          onClick={handleSave}
          className="w-full h-14 rounded-full bg-gradient-to-r from-[#197387] to-[#15657a] text-white hover:shadow-lg transition-all"
        >
          {isSaving ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}
