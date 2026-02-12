"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { motion } from "framer-motion"
import { X, Mail, User, Sparkles } from "lucide-react"
import { useUIStore } from "@radar/features"

function ModalPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const modalRoot = typeof document !== "undefined" ? document.getElementById("modal-root") : null
  if (!modalRoot) return null

  return createPortal(children, modalRoot)
}

interface WelcomeModalProps {
  isOpen: boolean
  onClose: () => void
  userDisplayName?: string | null
  userEmailConfirmed?: boolean
  labels?: {
    title: string
    description: string
    emailTitle: string
    emailDescription: string
    nicknameTitle: string
    nicknameDescription: string
    confirmButton: string
  }
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose,
  userDisplayName,
  userEmailConfirmed,
  labels,
}) => {
  if (!isOpen) return null

  const { openModal, closeModal } = useUIStore()
  const needsDisplayName = !userDisplayName || userDisplayName.trim() === ""
  const needsEmailConfirmation = !userEmailConfirmed
  const copy = {
    title: labels?.title ?? "",
    description: labels?.description ?? "",
    emailTitle: labels?.emailTitle ?? "",
    emailDescription: labels?.emailDescription ?? "",
    nicknameTitle: labels?.nicknameTitle ?? "",
    nicknameDescription: labels?.nicknameDescription ?? "",
    confirmButton: labels?.confirmButton ?? "",
  }

  useEffect(() => {
    document.body.style.overflow = "hidden"
    openModal()
    return () => {
      document.body.style.overflow = ""
      closeModal()
    }
  }, [openModal, closeModal])

  return (
    <ModalPortal>
      <motion.div
        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          transform: "none",
          willChange: "auto",
          position: "fixed",
          pointerEvents: "auto",
        }}
      >
        <motion.div
          className="bg-gradient-to-br from-[#0A0E12] to-[#0F2B33] rounded-3xl w-full max-w-md p-8 border border-[#00FFB3]/30"
          initial={{ y: 100, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/50 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00FFB3] to-[#1DE3F2] flex items-center justify-center mb-6">
              <Sparkles className="w-10 h-10 text-black" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-4">{copy.title}</h2>

            <p className="text-[#C5C5C5] mb-8 leading-relaxed">{copy.description}</p>

            <div className="w-full space-y-4 mb-8">
              {needsEmailConfirmation && (
                <div className="flex items-start gap-4 p-4 bg-[#1A1A1A]/50 rounded-xl border border-[#00FFB3]/20">
                  <div className="w-10 h-10 rounded-full bg-[#00FFB3]/20 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-[#00FFB3]" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-white font-semibold mb-1">{copy.emailTitle}</h3>
                    <p className="text-sm text-[#C5C5C5]">{copy.emailDescription}</p>
                  </div>
                </div>
              )}

              {needsDisplayName && (
                <div className="flex items-start gap-4 p-4 bg-[#1A1A1A]/50 rounded-xl border border-[#00FFB3]/20">
                  <div className="w-10 h-10 rounded-full bg-[#00FFB3]/20 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-[#00FFB3]" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-white font-semibold mb-1">{copy.nicknameTitle}</h3>
                    <p className="text-sm text-[#C5C5C5]">{copy.nicknameDescription}</p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="w-full h-14 rounded-full bg-gradient-to-r from-[#00FFB3] to-[#1DE3F2] text-black font-bold hover:shadow-lg transition-all duration-300 shadow-[#00FFB3]/30"
            >
              {copy.confirmButton}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </ModalPortal>
  )
}
