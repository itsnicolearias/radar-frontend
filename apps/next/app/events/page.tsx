"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { EventCard, EventCategoryFilter, BottomNav } from "@radar/ui";
import { useEventsStore, useAuthStore } from "@radar/features";
import { eventService } from "@radar/api";
import { motion, AnimatePresence } from "framer-motion";
import type { IEventResponse } from "@radar/types";

export default function EventsPage() {
  const t = useTranslations("eventsPage");
  const nav = useTranslations("dashboard.bottomNav");
  const locale = useLocale();
  const router = useRouter();
  const { events, setEvents, toggleInterest, selectedCategory, setSelectedCategory, setLoading, removeEvent } = useEventsStore();
  const { user } = useAuthStore();
  const [showMyEvents, setShowMyEvents] = useState(false);
  const [editingEvent, setEditingEvent] = useState<IEventResponse | null>(null);
  const [alertMessage, setAlertMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const categories = useMemo(
    () => [t("categories.all"), t("categories.music"), t("categories.food"), t("categories.art"), t("categories.sports"), t("categories.social")],
    [t],
  );

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await eventService.getAllEvents();
        setEvents(response.rows);
      } catch (error) {
        console.error("[events] Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [setEvents, setLoading]);

  const handleInterestClick = async (eventId: string, isInterested: boolean) => {
    try {
      if (isInterested) {
        await eventService.unmarkInterest(eventId);
      } else {
        await eventService.markInterest(eventId);
      }
      toggleInterest(eventId, user!.userId);
    } catch (error) {
      console.error("[events] Error toggling interest:", error);
    }
  };

  const filteredEvents = events.filter((event) => {
    if (showMyEvents && event.userId !== user?.userId) return false;
    if (selectedCategory && selectedCategory !== categories[0] && event.category !== selectedCategory) return false;
    return true;
  });

  const handleTabChange = (tab: "radar" | "chats" | "events" | "profile") => {
    router.push(`/${tab === "radar" ? "radar" : tab}`);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm(t("confirmDelete"))) return;

    try {
      await eventService.deleteEvent(eventId);
      removeEvent(eventId);
      setAlertMessage({ type: "success", text: t("alerts.deleted") });
      setTimeout(() => setAlertMessage(null), 3000);
    } catch (error) {
      console.error("[events] Error deleting event:", error);
      setAlertMessage({ type: "error", text: t("alerts.deleteError") });
      setTimeout(() => setAlertMessage(null), 3000);
    }
  };

  const handleEditEvent = (event: IEventResponse) => {
    setEditingEvent(event);
  };

  const handleSaveEdit = async () => {
    if (!editingEvent) return;

    try {
      const updated = await eventService.updateEvent(editingEvent.eventId, {
        title: editingEvent.title,
        description: editingEvent.description,
        location: editingEvent.location,
        price: editingEvent.price,
      });

      setEvents(events.map((e) => (e.eventId === updated.eventId ? updated : e)));
      setEditingEvent(null);
      setAlertMessage({ type: "success", text: t("alerts.updated") });
      setTimeout(() => setAlertMessage(null), 3000);
    } catch (error) {
      console.error("[events] Error updating event:", error);
      setAlertMessage({ type: "error", text: t("alerts.updateError") });
      setTimeout(() => setAlertMessage(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-black pb-24 flex flex-col">
      <div className="absolute inset-0 bg-gradient-radial from-[#00FFB3]/5 via-transparent to-transparent pointer-events-none" />

      {alertMessage && (
        <div
          className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-lg backdrop-blur-lg ${
            alertMessage.type === "success" ? "bg-[#00FFB3]/20 border border-[#00FFB3] text-[#00FFB3]" : "bg-[#FF005C]/20 border border-[#FF005C] text-[#FF005C]"
          }`}
        >
          {alertMessage.text}
        </div>
      )}

      <header className="relative z-10 bg-black/90 backdrop-blur-lg px-6 py-4 pt-12 top-0 border-b border-[#00FFB3]/10 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl lg:text-3xl font-bold text-white">{t("title")}</h1>
            <button
              onClick={() => router.push("/events/create")}
              className="p-2 lg:p-3 bg-[#00FFB3] rounded-full hover:bg-[#00FFB3]/90 transition-all shadow-lg shadow-[#00FFB3]/30"
            >
              <Plus className="w-6 h-6 text-black" />
            </button>
          </div>

          <EventCategoryFilter categories={categories.slice(1)} selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />

          <div className="mt-4">
            <button
              onClick={() => setShowMyEvents(!showMyEvents)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                showMyEvents ? "bg-[#FF005C] text-white shadow-lg shadow-[#FF005C]/30" : "bg-[#1A1A1A] text-[#C5C5C5] border border-[#1DE3F2]/30"
              }`}
            >
              {showMyEvents ? t("showingMyEvents") : t("myEvents")}
            </button>
          </div>
        </div>
      </header>

      <div className="relative flex-1 px-6 py-6 overflow-y-auto lg:px-12">
        <div className="max-w-7xl mx-auto">
          {filteredEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-[#C5C5C5] text-lg">{t("emptyTitle")}</p>
              <p className="text-[#8B8B8B] text-sm mt-2">{t("emptySubtitle")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
              {filteredEvents.map((event) => {
                const isInterested = event?.InterestedUsers?.some((u) => u.userId === user?.userId);
                const isOwner = event.userId === user?.userId;
                return (
                  <div key={event.eventId} className="relative group">
                    <EventCard
                      title={event.title}
                      description={event.description}
                      location={event.location}
                      startDate={event.startDate}
                      attendeesCount={event?.InterestedUsers?.length}
                      price={event.price}
                      distance={event.distance}
                      category={event.category}
                      isInterested={isInterested}
                      isBoosted={false}
                      locale={locale === "en" ? "en-US" : "es-AR"}
                      labels={{
                        today: t("card.today"),
                        tomorrow: t("card.tomorrow"),
                        interested: t("card.interested"),
                        notInterested: t("card.notInterested"),
                        boosted: t("card.boosted"),
                      }}
                      onInterestClick={() => handleInterestClick(event.eventId, isInterested || false)}
                      onClick={() => router.push(`/events/${event.eventId}`)}
                    />
                    {isOwner && (
                      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditEvent(event);
                          }}
                          className="p-2 bg-[#00FFB3] rounded-full hover:scale-110 transition-transform shadow-lg"
                        >
                          <Edit className="w-4 h-4 text-black" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteEvent(event.eventId);
                          }}
                          className="p-2 bg-[#FF005C] rounded-full hover:scale-110 transition-transform shadow-lg"
                        >
                          <Trash2 className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {editingEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setEditingEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-[#1A1A1A] rounded-2xl p-6 w-full max-w-md border border-[#00FFB3]/30"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">{t("edit.title")}</h2>
                <button onClick={() => setEditingEvent(null)} className="w-8 h-8 bg-[#0D0D0D] rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                  <X className="w-4 h-4 text-[#C5C5C5]" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white mb-2">{t("edit.fields.title")}</label>
                  <input
                    type="text"
                    value={editingEvent.title}
                    onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0D0D0D] border border-[#00FFB3]/30 rounded-lg text-white focus:outline-none focus:border-[#00FFB3]"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white mb-2">{t("edit.fields.description")}</label>
                  <textarea
                    value={editingEvent.description}
                    onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0D0D0D] border border-[#00FFB3]/30 rounded-lg text-white focus:outline-none focus:border-[#00FFB3] h-24 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white mb-2">{t("edit.fields.location")}</label>
                  <input
                    type="text"
                    value={editingEvent.location}
                    onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0D0D0D] border border-[#00FFB3]/30 rounded-lg text-white focus:outline-none focus:border-[#00FFB3]"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white mb-2">{t("edit.fields.price")}</label>
                  <input
                    type="number"
                    value={editingEvent.price}
                    onChange={(e) => setEditingEvent({ ...editingEvent, price: Number(e.target.value) })}
                    className="w-full px-4 py-2 bg-[#0D0D0D] border border-[#00FFB3]/30 rounded-lg text-white focus:outline-none focus:border-[#00FFB3]"
                  />
                </div>

                <button
                  onClick={handleSaveEdit}
                  className="w-full h-12 bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] text-black font-semibold rounded-lg hover:scale-105 transition-transform"
                >
                  {t("edit.saveChanges")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav
        activeTab="events"
        onTabChange={handleTabChange}
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
