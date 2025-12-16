"use client"

import { useState } from "react"
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from "react-native"
import { ArrowLeft, Settings, Eye, EyeOff, LogOut, Crown, Zap, Check, MapPin, Radio } from "lucide-react-native"
import { useAuthStore } from "@radar/features"
import { profileService, uploadService } from "@radar/api"
import { BottomNavNative } from "@radar/ui/navigation/bottom-nav.native"
import { useRouter } from "expo-router"
import * as ImagePicker from "expo-image-picker"

export default function ProfileScreen() {
  const { user, profile, setProfile, setUser, logout } = useAuthStore()
  const router = useRouter()

  const [displayName, setDisplayName] = useState(user?.displayName || "")
  const [firstName, setFirstName] = useState(user?.firstName || "")
  const [lastName, setLastName] = useState(user?.lastName || "")
  const [bio, setBio] = useState(profile?.bio || "")
  const [age, setAge] = useState(String(profile?.age || ""))
  const [country, setCountry] = useState(profile?.country || "")
  const [province, setProvince] = useState(profile?.province || "")
  const [interests, setInterests] = useState<string[]>(profile?.interests || [])

  const [showAge, setShowAge] = useState(profile?.showAge ?? true)
  const [showLocation, setShowLocation] = useState(profile?.showLocation ?? true)

  const [isSaving, setIsSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handlePhotoUpload = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== "granted") {
        Alert.alert("Permiso requerido", "Se necesita permiso para acceder a la galería")
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      })

      if (!result.canceled && result.assets[0]) {
        setUploading(true)

        const uri = result.assets[0].uri

        const imageResponse = await fetch(uri)
        const blob = await imageResponse.blob()

        const response = await uploadService.uploadImage(blob, result.assets[0].fileName!)

        await profileService.updateMyProfile({
          Profile: { photoUrl: response },
        })

        if (profile) {
          setProfile({ ...profile, photoUrl: response })
        }

        Alert.alert("Éxito", "Foto actualizada correctamente")
      }
    } catch (error) {
      console.error("[v0] Error uploading photo:", error)
      Alert.alert("Error", "No se pudo subir la foto")
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)

    try {
      const response = await profileService.updateMyProfile({
        Profile: {
          bio,
          age: Number(age),
          country,
          province,
          interests,
          showAge,
          showLocation,
        },
        User: {
          displayName,
          firstName,
          lastName,
        },
      })

      if (response?.data?.User) {
        setUser({ ...user, ...response.data.User as any })
      }
      if (response?.data) {
        setProfile({ ...profile, ...response.data.Profile as any })
      }

      Alert.alert("Éxito", "Perfil actualizado correctamente")
    } catch (error) {
      console.error("[v0] Error saving profile:", error)
      Alert.alert("Error", "No se pudo guardar el perfil")
    } finally {
      setIsSaving(false)
    }
  }

  const toggleInterest = (name: string) => {
    setInterests((prev) => (prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]))
  }

  const handleLogout = () => {
    logout()

    router.navigate("/")
  }

  const initialLetters = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase()

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <ArrowLeft size={22} color="white" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Mi Perfil</Text>

        <TouchableOpacity style={styles.headerBtn}>
          <Settings size={22} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        <View style={styles.avatarWrapper}>
          {profile?.photoUrl ? (
            <Image source={{ uri: profile.photoUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarFallbackText}>{initialLetters}</Text>
            </View>
          )}

          <TouchableOpacity onPress={handlePhotoUpload} disabled={uploading}>
            <Text style={styles.changePhoto}>{uploading ? "Subiendo..." : "Cambiar foto de perfil"}</Text>
          </TouchableOpacity>
        </View>

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

        <ProfileField label="País" value={country} onChange={setCountry} />

        <ProfileField
          label="Provincia"
          value={province}
          onChange={setProvince}
          privacy={{
            visible: showLocation,
            onToggle: () => setShowLocation(!showLocation),
          }}
        />

        <ProfileField label="Biografía" value={bio} onChange={setBio} multiline />

        <Text style={styles.sectionTitle}>Intereses</Text>
        <View style={styles.interestsGrid}>
          {["Música", "Café", "Arte", "Running", "Fotografía", "Viajes", "Cine", "Gaming", "Deportes", "Lectura"].map(
            (item) => {
              const active = interests.includes(item)
              return (
                <TouchableOpacity
                  key={item}
                  onPress={() => toggleInterest(item)}
                  style={[styles.interestBadge, active && styles.interestBadgeActive]}
                >
                  <Text style={[styles.interestText, active && styles.interestTextActive]}>{item}</Text>
                </TouchableOpacity>
              )
            },
          )}
        </View>

        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <LogOut size={20} color="#C5C5C5" />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity onPress={handleSave} style={styles.saveBtn} disabled={isSaving}>
          <Text style={styles.saveBtnText}>{isSaving ? "Guardando..." : "Guardar cambios"}</Text>
        </TouchableOpacity>
      </View>
      <BottomNavNative
        activeTab="profile"
        onTabChange={(tab) => {
          if (tab === "events") router.push("/events")
          else if (tab === "radar") router.push("/radar")
          else if (tab === "chats") router.push("/chats")
        }}
      />
    </View>
  )
}

function ProfileField({
  label,
  value,
  onChange,
  multiline,
  privacy,
  type = "default",
}: {
  label: string
  value: string
  multiline?: boolean
  type?: "default" | "numeric"
  onChange: (v: string) => void
  privacy?: {
    visible: boolean
    onToggle: () => void
  }
}) {
  return (
    <View style={{ marginBottom: 20 }}>
      <View style={styles.fieldHeader}>
        <Text style={styles.fieldLabel}>{label}</Text>

        {privacy && (
          <TouchableOpacity style={styles.privacyBtn} onPress={privacy.onToggle}>
            {privacy.visible ? <Eye size={18} color="#00FFB3" /> : <EyeOff size={18} color="#197387" />}
            <Text style={styles.privacyText}>{privacy.visible ? "Visible" : "Oculto"}</Text>
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
  )
}

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
})
