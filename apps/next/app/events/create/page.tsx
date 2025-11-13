"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { useEventsStore, useGeolocation } from "@radar/features"
import { eventService } from "@radar/api"
import { EventInput, eventSchema } from "@radar/api/validations"

export default function CreateEventPage() {
  const router = useRouter()
  const { addEvent } = useEventsStore()
  const { latitude, longitude } = useGeolocation()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventInput>({
    //resolver: zodResolver(eventSchema),
    defaultValues: {
      latitude: latitude || 0,
      longitude: longitude || 0,
      isPublic: true,
      maxAttendees: 50,
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
      router.push("/events")
    } catch (error) {
      console.error("[v0] Error creating event:", error)
      alert("Error al crear evento")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0E2A3E] pb-8">
      {/* Header */}
      <header className="bg-[#0E2A3E] px-6 py-4 pt-12 border-b border-[#00FFB3]/20">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-2xl font-bold text-white">Crear Evento</h1>
        </div>
      </header>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-6 space-y-4">
        <div>
          <label className="block text-white text-sm font-medium mb-2">Título *</label>
          <input
            {...register("title")}
            className="w-full px-4 py-3 bg-[#1A3A4F] text-white rounded-xl border border-[#00FFB3]/20 focus:border-[#00FFB3] outline-none"
            placeholder="Nombre del evento"
          />
          {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-white text-sm font-medium mb-2">Descripción *</label>
          <textarea
            {...register("description")}
            rows={4}
            className="w-full px-4 py-3 bg-[#1A3A4F] text-white rounded-xl border border-[#00FFB3]/20 focus:border-[#00FFB3] outline-none resize-none"
            placeholder="Describe tu evento..."
          />
          {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>}
        </div>

        <div>
          <label className="block text-white text-sm font-medium mb-2">Ubicación *</label>
          <input
            {...register("location")}
            className="w-full px-4 py-3 bg-[#1A3A4F] text-white rounded-xl border border-[#00FFB3]/20 focus:border-[#00FFB3] outline-none"
            placeholder="Dirección o lugar"
          />
          {errors.location && <p className="text-red-400 text-sm mt-1">{errors.location.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">Fecha inicio *</label>
            <input
              {...register("startDate")}
              type="datetime-local"
              className="w-full px-4 py-3 bg-[#1A3A4F] text-white rounded-xl border border-[#00FFB3]/20 focus:border-[#00FFB3] outline-none"
            />
            {errors.startDate && <p className="text-red-400 text-sm mt-1">{errors.startDate.message}</p>}
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">Fecha fin *</label>
            <input
              {...register("endDate")}
              type="datetime-local"
              className="w-full px-4 py-3 bg-[#1A3A4F] text-white rounded-xl border border-[#00FFB3]/20 focus:border-[#00FFB3] outline-none"
            />
            {errors.endDate && <p className="text-red-400 text-sm mt-1">{errors.endDate.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">Asistentes máx.</label>
            <input
              {...register("maxAttendees", { valueAsNumber: true })}
              type="number"
              className="w-full px-4 py-3 bg-[#1A3A4F] text-white rounded-xl border border-[#00FFB3]/20 focus:border-[#00FFB3] outline-none"
              placeholder="50"
            />
            {errors.maxAttendees && <p className="text-red-400 text-sm mt-1">{errors.maxAttendees.message}</p>}
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">Precio ($)</label>
            <input
              {...register("price", { valueAsNumber: true })}
              type="number"
              className="w-full px-4 py-3 bg-[#1A3A4F] text-white rounded-xl border border-[#00FFB3]/20 focus:border-[#00FFB3] outline-none"
              placeholder="0"
            />
            {errors.price && <p className="text-red-400 text-sm mt-1">{errors.price.message}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input {...register("isPublic")} type="checkbox" id="isPublic" className="w-5 h-5" />
          <label htmlFor="isPublic" className="text-white text-sm">
            Evento público
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-[#00FFB3] text-[#0E2A3E] rounded-full font-semibold hover:bg-[#00FFB3]/90 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Creando..." : "Crear Evento"}
        </button>
      </form>
    </div>
  )
}