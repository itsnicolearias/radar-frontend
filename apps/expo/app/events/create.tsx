"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native"
import { useRouter } from "expo-router"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { useEventsStore, useGeolocation } from "@radar/features"
import { eventService } from "@radar/api"
import { EventInput } from "../../../../packages/api/validations"

export default function CreateEventScreen() {
  const router = useRouter()
  const { addEvent } = useEventsStore()
  const { latitude, longitude } = useGeolocation()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EventInput>({
    //resolver: zodResolver(eventSchema),
    defaultValues: {
      latitude: latitude || 0,
      longitude: longitude || 0,
      isPublic: true,
      category: "",
      price: 0,
    },
  })

  const onSubmit = async (data: EventInput) => {
    setIsSubmitting(true)
    try {
      const newEvent = await eventService.createEvent({
        ...data,
        latitude: latitude || data.latitude,
        longitude: longitude || data.longitude,
      })
      addEvent(newEvent)
      Alert.alert("Éxito", "Evento creado correctamente", [
        {
          text: "OK",
          onPress: () => router.push("/events"),
        },
      ])
    } catch (error) {
      console.error("[v0] Error creating event:", error)
      Alert.alert("Error", "No se pudo crear el evento")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Crear Evento</Text>
        </View>
      </View>

      {/* Form */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Title */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Título *</Text>
            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Nombre del evento"
                  placeholderTextColor="#5A6E7A"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.title && <Text style={styles.errorText}>{errors.title.message}</Text>}
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descripción *</Text>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Describe tu evento..."
                  placeholderTextColor="#5A6E7A"
                  multiline
                  numberOfLines={4}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.description && <Text style={styles.errorText}>{errors.description.message}</Text>}
          </View>

          {/* Location */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ubicación *</Text>
            <Controller
              control={control}
              name="location"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Dirección o lugar"
                  placeholderTextColor="#5A6E7A"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.location && <Text style={styles.errorText}>{errors.location.message}</Text>}
          </View>

          {/* Category 
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Categoría *</Text>
            <Controller
              control={control}
              name="category"
              render={({ field: { onChange, value } }) => (
                <View style={styles.categoryContainer}>
                  {["Música", "Gastronomía", "Arte", "Deportes", "Social"].map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[styles.categoryOption, value === cat && styles.categoryOptionActive]}
                      onPress={() => onChange(cat)}
                    >
                      <Text style={[styles.categoryOptionText, value === cat && styles.categoryOptionTextActive]}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            />
            {errors.category && <Text style={styles.errorText}>{errors.category.message}</Text>} 
          </View> 
          */}


          {/* Category */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Categoría *</Text>
            <Controller
              control={control}
              name="category"
              render={({ field: { onChange, value } }) => (
                <View style={styles.categoryContainer}>
                  {[
                    "social",
                    "deportes",
                    "música",
                    "arte",
                    "gastronomía",
                    "educación",
                    "tecnología",
                    "otro",
                  ].map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[styles.categoryOption, value === cat && styles.categoryOptionActive]}
                      onPress={() => onChange(cat)}
                    >
                      <Text style={[styles.categoryOptionText, value === cat && styles.categoryOptionTextActive]}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            />
            {errors.category && <Text style={styles.errorText}>{errors.category.message}</Text>}
          </View>

          {/* Price */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Precio ($)</Text>
            <Controller
              control={control}
              name="price"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor="#5A6E7A"
                  keyboardType="numeric"
                  onBlur={onBlur}
                  onChangeText={(text) => onChange(Number.parseFloat(text) || 0)}
                  value={value?.toString()}
                />
              )}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>{isSubmitting ? "Creando..." : "Crear Evento"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E2A3E",
  },
  header: {
    backgroundColor: "#0E2A3E",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 255, 179, 0.2)",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 24,
    color: "#FFFFFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 24,
    gap: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#1A3A4F",
    borderWidth: 1,
    borderColor: "rgba(0, 255, 179, 0.2)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#FFFFFF",
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  errorText: {
    fontSize: 12,
    color: "#FF4FD8",
    marginTop: 4,
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#1A3A4F",
    borderWidth: 1,
    borderColor: "rgba(0, 255, 179, 0.2)",
  },
  categoryOptionActive: {
    backgroundColor: "#00FFB3",
    borderColor: "#00FFB3",
  },
  categoryOptionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#94A3B8",
  },
  categoryOptionTextActive: {
    color: "#0E2A3E",
  },
  submitButton: {
    backgroundColor: "#00FFB3",
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 16,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0E2A3E",
  },
})
