"use client"

import { redirect } from "next/navigation"

export default function Page() {
  // Redirect to login page by default
  redirect("/login")
}
