"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { useEventsStore, useGeolocation } from "@radar/features";
import { eventService } from "@radar/api";
import type { EventInput } from "@radar/api/validations";

export default function CreateEventPage() {
  const t = useTranslations("eventsPage.create");
  const router = useRouter();
  const { addEvent } = useEventsStore();
  const { latitude, longitude } = useGeolocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<EventInput>({
    defaultValues: {
      latitude: latitude || 0,
      longitude: longitude || 0,
      isPublic: true,
      maxAttendees: 50,
      price: 0,
    },
  });

  const startDate = watch("startDate");

  const onSubmit = async (data: EventInput) => {
    if (new Date(data.endDate) <= new Date(data.startDate)) {
      alert(t("validationEndDate"));
      return;
    }

    setIsSubmitting(true);
    try {
      const newEvent = await eventService.createEvent({
        ...data,
        latitude: latitude || data.latitude,
        longitude: longitude || data.longitude,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
      });
      addEvent(newEvent);
      router.push("/events");
    } catch (error) {
      console.error("[events-create] Error creating event:", error);
      alert(t("errorCreate"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E2A3E] pb-8">
      <header className="bg-[#0E2A3E] px-6 py-4 pt-12 border-b border-[#00FFB3]/20">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-2xl font-bold text-white">{t("title")}</h1>
        </div>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-6 space-y-4">
        <div>
          <label className="block text-white text-sm font-medium mb-2">{t("fields.title")}</label>
          <input
            {...register("title")}
            className="w-full px-4 py-3 bg-[#1A3A4F] text-white rounded-xl border border-[#00FFB3]/20 focus:border-[#00FFB3] outline-none"
            placeholder={t("placeholders.title")}
          />
          {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-white text-sm font-medium mb-2">{t("fields.description")}</label>
          <textarea
            {...register("description")}
            rows={4}
            className="w-full px-4 py-3 bg-[#1A3A4F] text-white rounded-xl border border-[#00FFB3]/20 focus:border-[#00FFB3] outline-none resize-none"
            placeholder={t("placeholders.description")}
          />
          {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>}
        </div>

        <div>
          <label className="block text-white text-sm font-medium mb-2">{t("fields.location")}</label>
          <input
            {...register("location")}
            className="w-full px-4 py-3 bg-[#1A3A4F] text-white rounded-xl border border-[#00FFB3]/20 focus:border-[#00FFB3] outline-none"
            placeholder={t("placeholders.location")}
          />
          {errors.location && <p className="text-red-400 text-sm mt-1">{errors.location.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">{t("fields.startDate")}</label>
            <input
              {...register("startDate", { required: t("errors.startDateRequired") })}
              type="datetime-local"
              className="w-full px-4 py-3 bg-[#1A3A4F] text-white rounded-xl border border-[#00FFB3]/20 focus:border-[#00FFB3] outline-none"
            />
            {errors.startDate && <p className="text-red-400 text-sm mt-1">{errors.startDate.message}</p>}
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">{t("fields.endDate")}</label>
            <input
              {...register("endDate", { required: t("errors.endDateRequired") })}
              type="datetime-local"
              min={startDate}
              className="w-full px-4 py-3 bg-[#1A3A4F] text-white rounded-xl border border-[#00FFB3]/20 focus:border-[#00FFB3] outline-none"
            />
            {errors.endDate && <p className="text-red-400 text-sm mt-1">{errors.endDate.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">{t("fields.maxAttendees")}</label>
            <input
              {...register("maxAttendees", { valueAsNumber: true })}
              type="number"
              className="w-full px-4 py-3 bg-[#1A3A4F] text-white rounded-xl border border-[#00FFB3]/20 focus:border-[#00FFB3] outline-none"
              placeholder="50"
            />
            {errors.maxAttendees && <p className="text-red-400 text-sm mt-1">{errors.maxAttendees.message}</p>}
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">{t("fields.price")}</label>
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
            {t("fields.isPublic")}
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-[#00FFB3] text-[#0E2A3E] rounded-full font-semibold hover:bg-[#00FFB3]/90 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? t("submitting") : t("submit")}
        </button>
      </form>
    </div>
  );
}
