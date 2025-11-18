import React, { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native"
import { useRouter } from "expo-router"
import { ArrowLeft, Camera } from "lucide-react-native"
import { useAuthStore } from "@radar/features"

export default function ProfileScreen() {
  const router = useRouter()
  const { user, profile } = useAuthStore()

  const [isEditing, setIsEditing] = useState(false)

  // Local editable state (no persistence here; wire to your API/store on save)
  const [bio, setBio] = useState(profile?.bio ?? "")
  const [age, setAge] = useState(profile?.age ? String(profile.age) : "")
  const [country, setCountry] = useState(profile?.country ?? "")
  const [province, setProvince] = useState(profile?.province ?? "")

  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/radar")} style={styles.backButton}>
          <ArrowLeft color="#FFFFFF" />
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
          <Text style={styles.editText}>{isEditing ? "Cancelar" : "Editar"}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile photo */}
        <View style={styles.photoSection}>
          <View style={styles.photoWrapper}>
            {profile?.photoUrl ? (
              <Image source={{ uri: profile.photoUrl }} style={styles.photo} />
            ) : (
              <View style={[styles.photo, styles.photoPlaceholder]}>
                <Text style={styles.initials}>{initials}</Text>
              </View>
            )}
            {isEditing && (
              <TouchableOpacity style={styles.cameraButton}>
                <Camera color="#000" size={16} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.nameBlock}>
            <Text style={styles.name}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Bio */}
          <View style={styles.formItem}>
            <Text style={styles.label}>Biografía</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              value={bio}
              onChangeText={setBio}
              placeholder="Contanos sobre vos..."
              placeholderTextColor="#C5C5C580"
              editable={isEditing}
              multiline
            />
          </View>

          {/* Age + Country */}
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Edad</Text>
              <TextInput
                style={styles.input}
                value={age}
                onChangeText={setAge}
                placeholder="25"
                placeholderTextColor="#C5C5C580"
                editable={isEditing}
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.col}>
              <Text style={styles.label}>País</Text>
              <TextInput
                style={styles.input}
                value={country}
                onChangeText={setCountry}
                placeholder="Argentina"
                placeholderTextColor="#C5C5C580"
                editable={isEditing}
              />
            </View>
          </View>

          {/* Province */}
          <View style={styles.formItem}>
            <Text style={styles.label}>Provincia</Text>
            <TextInput
              style={styles.input}
              value={province}
              onChangeText={setProvince}
              placeholder="Buenos Aires"
              placeholderTextColor="#C5C5C580"
              editable={isEditing}
            />
          </View>

          {isEditing && (
            <TouchableOpacity style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Guardar cambios</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: "#0a0e27",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 255, 179, 0.2)",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  backText: {
    color: "#C5C5C5",
    marginLeft: 8,
  },
  editText: {
    color: "#00FFB3",
    fontWeight: "600",
  },
  content: {
    padding: 16,
  },
  photoSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  photoWrapper: {
    position: "relative",
  },
  photo: {
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 2,
    borderColor: "#00FFB333",
  },
  photoPlaceholder: {
    backgroundColor: "#1A1A1A",
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "700",
  },
  cameraButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#00FFB3",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#00FFB3",
    shadowOpacity: 0.5,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  nameBlock: {
    marginTop: 12,
    alignItems: "center",
  },
  name: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  email: {
    color: "#C5C5C5",
    marginTop: 4,
  },
  form: {
    backgroundColor: "#0a0e27",
    borderWidth: 1,
    borderColor: "rgba(29, 227, 242, 0.2)",
    borderRadius: 16,
    padding: 16,
  },
  formItem: {
    marginBottom: 16,
  },
  label: {
    color: "#FFFFFF",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#1A1A1A",
    borderWidth: 1,
    borderColor: "rgba(29, 227, 242, 0.3)",
    borderRadius: 12,
    color: "#FFFFFF",
    paddingHorizontal: 12,
    height: 44,
  },
  textarea: {
    height: 96,
    paddingTop: 12,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  col: {
    flex: 1,
  },
  saveButton: {
    marginTop: 8,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#00FFB3",
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: "#000",
    fontWeight: "700",
  },
})
