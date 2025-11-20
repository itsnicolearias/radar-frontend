import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { ArrowLeft, Settings, Eye, EyeOff, LogOut, Crown, Zap, Check, MapPin, Radio } from "lucide-react-native";
import { useAuthStore } from "@radar/features";
import { profileService } from "@radar/api";

export default function ProfileScreen() {
  const { user, profile } = useAuthStore();

  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [age, setAge] = useState(String(profile?.age || ""));
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

  const toggleInterest = (name: string) => {
    setInterests((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    );
  };

  const initialLetters =
    `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn}>
          <ArrowLeft size={22} color="white" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Mi Perfil</Text>

        <TouchableOpacity style={styles.headerBtn}>
          <Settings size={22} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        
        {/* AVATAR */}
        <View style={styles.avatarWrapper}>
          {profile?.photoUrl ? (
            <Image source={{ uri: profile.photoUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarFallbackText}>{initialLetters}</Text>
            </View>
          )}

          <TouchableOpacity>
            <Text style={styles.changePhoto}>Cambiar foto de perfil</Text>
          </TouchableOpacity>
        </View>

        {/* PLAN CARD */}
        <View style={styles.planCard}>
          <View style={styles.planRow}>
            <View style={styles.planLeft}>
              <Zap size={20} color="#00FFB3" />
              <Text style={styles.planTitle}>Plan Free</Text>
            </View>
          </View>

          <View style={styles.planBenefit}>
            <MapPin size={16} color="#C5C5C5" />
            <Text style={styles.planBenefitText}>Radio del radar: 10 km</Text>
          </View>

          <View style={styles.planBenefit}>
            <Radio size={16} color="#C5C5C5" />
            <Text style={styles.planBenefitText}>Señales: 1 cada 24h</Text>
          </View>

          <View style={styles.planBenefit}>
            <Check size={16} color="#C5C5C5" />
            <Text style={styles.planBenefitText}>Ver últimos 3 visitantes</Text>
          </View>

          <TouchableOpacity style={styles.upgradeBtn}>
            <Crown size={18} color="white" />
            <Text style={styles.upgradeBtnText}>Actualizar a Premium</Text>
          </TouchableOpacity>
        </View>

        {/* PROFILE FIELDS */}
        <ProfileField label="Nombre visible" value={displayName} onChange={setDisplayName} />
        <ProfileField label="Nombre" value={firstName} onChange={setFirstName} />
        <ProfileField label="Apellido" value={lastName} onChange={setLastName} />

        <ProfileField
          label="Edad"
          value={age}
          onChange={setAge}
          type="numeric"
          privacy={{
            visible: showAge,
            onToggle: () => setShowAge(!showAge),
          }}
        />

        <ProfileField
          label="País"
          value={country}
          onChange={setCountry}
        />

        <ProfileField
          label="Provincia"
          value={province}
          onChange={setProvince}
          privacy={{
            visible: showLocation,
            onToggle: () => setShowLocation(!showLocation),
          }}
        />

        <ProfileField
          label="Biografía"
          value={bio}
          onChange={setBio}
          multiline
        />

        {/* INTERESTS */}
        <Text style={styles.sectionTitle}>Intereses</Text>
        <View style={styles.interestsGrid}>
          {[
            "Música", "Café", "Arte", "Running",
            "Fotografía", "Viajes", "Cine", "Gaming",
            "Deportes", "Lectura"
          ].map((item) => {
            const active = interests.includes(item);
            return (
              <TouchableOpacity
                key={item}
                onPress={() => toggleInterest(item)}
                style={[
                  styles.interestBadge,
                  active && styles.interestBadgeActive,
                ]}
              >
                <Text style={[
                  styles.interestText,
                  active && styles.interestTextActive
                ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* LOGOUT */}
        <TouchableOpacity style={styles.logoutBtn}>
          <LogOut size={20} color="#C5C5C5" />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* SAVE BUTTON */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>
            {isSaving ? "Guardando..." : "Guardar cambios"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* -------------------------
      COMPONENTE FIELD
-------------------------- */
function ProfileField({
  label,
  value,
  onChange,
  multiline,
  privacy,
  type = "default",
}: {
  label: string;
  value: string;
  multiline?: boolean;
  type?: "default" | "numeric";
  onChange: (v: string) => void;
  privacy?: {
    visible: boolean;
    onToggle: () => void;
  };
}) {
  return (
    <View style={{ marginBottom: 20 }}>
      <View style={styles.fieldHeader}>
        <Text style={styles.fieldLabel}>{label}</Text>

        {privacy && (
          <TouchableOpacity style={styles.privacyBtn} onPress={privacy.onToggle}>
            {privacy.visible ? (
              <Eye size={18} color="#00FFB3" />
            ) : (
              <EyeOff size={18} color="#197387" />
            )}
            <Text style={styles.privacyText}>
              {privacy.visible ? "Visible" : "Oculto"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={label}
        multiline={multiline}
        keyboardType={type === "numeric" ? "numeric" : "default"}
        style={[styles.input, multiline && styles.inputMultiline]}
        placeholderTextColor="#7f7f7f"
      />
    </View>
  );
}

/* -------------------------
        ESTILOS
-------------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },

  header: {
    paddingTop: 50,
    paddingBottom: 18,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "rgba(0,255,179,0.2)",
    backgroundColor: "rgba(26,26,26,0.4)",
  },

  headerBtn: {
    width: 42,
    height: 42,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(0,255,179,0.3)",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#101010",
  },

  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },

  avatarWrapper: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },

  avatar: {
    width: 96,
    height: 96,
    borderRadius: 999,
    borderWidth: 3,
    borderColor: "#00FFB3",
  },

  avatarFallback: {
    width: 96,
    height: 96,
    borderRadius: 999,
    backgroundColor: "#0A0E12",
    borderWidth: 3,
    borderColor: "#00FFB3",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarFallbackText: {
    color: "white",
    fontSize: 32,
    fontWeight: "700",
  },

  changePhoto: {
    marginTop: 8,
    color: "#00FFB3",
    fontSize: 14,
  },

  /* PLAN CARD */
  planCard: {
    backgroundColor: "rgba(26,26,26,0.6)",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(0,255,179,0.3)",
    marginBottom: 20,
  },

  planRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  planLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  planTitle: {
    color: "white",
    fontSize: 18,
  },

  planBenefit: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },

  planBenefitText: {
    color: "#C5C5C5",
    fontSize: 14,
  },

  upgradeBtn: {
    marginTop: 12,
    height: 44,
    backgroundColor: "#197387",
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  upgradeBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  /* PROFILE FIELDS */

  fieldHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
    alignItems: "center",
  },

  fieldLabel: {
    color: "white",
    fontSize: 14,
  },

  input: {
    backgroundColor: "rgba(10,10,10,0.7)",
    borderWidth: 1,
    borderColor: "rgba(0,255,179,0.3)",
    borderRadius: 16,
    padding: 14,
    color: "white",
    fontSize: 15,
  },

  inputMultiline: {
    height: 100,
    textAlignVertical: "top",
  },

  privacyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  privacyText: {
    color: "#00FFB3",
    fontSize: 12,
  },

  /* INTERESTS */
  sectionTitle: {
    color: "white",
    fontSize: 16,
    marginBottom: 10,
  },

  interestsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },

  interestBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#197387",
    backgroundColor: "rgba(10,14,18,0.6)",
  },

  interestBadgeActive: {
    backgroundColor: "#197387",
  },

  interestText: {
    color: "#C5C5C5",
  },

  interestTextActive: {
    color: "white",
  },

  /* LOGOUT */

  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#197387",
    backgroundColor: "rgba(10,14,18,0.6)",
    paddingVertical: 14,
    justifyContent: "center",
    borderRadius: 20,
    marginBottom: 30,
  },

  logoutText: {
    color: "#C5C5C5",
    fontSize: 16,
  },

  /* FOOTER */
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: "rgba(0,255,179,0.2)",
    backgroundColor: "rgba(15,43,51,0.8)",
  },

  saveBtn: {
    backgroundColor: "#197387",
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },

  saveBtnText: {
    color: "white",
    fontSize: 17,
    fontWeight: "600",
  },
});
