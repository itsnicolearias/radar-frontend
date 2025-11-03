export interface User {
  userId: string
  firstName: string
  lastName: string
  email: string
  isVerified: boolean
  invisibleMode: boolean
  lastLatitude?: number
  lastLongitude?: number
  lastSeenAt?: string
  createdAt: string
  updatedAt: string
}

export interface Profile {
  profileId: string
  userId: string
  bio?: string
  age?: number
  country?: string
  province?: string
  photoUrl?: string
  interests?: string[]
  showAge: boolean
  showLocation: boolean
  distanceRadius: number
  createdAt: string
  updatedAt: string
}

export interface Connection {
  connectionId: string
  senderId: string
  receiverId: string
  status: "pending" | "accepted" | "rejected"
  createdAt: string
  updatedAt: string
}

export interface Message {
  messageId: string
  senderId: string
  receiverId: string
  content: string
  isRead: boolean
  createdAt: string
}

export interface Notification {
  notificationId: string
  userId: string
  type: "message" | "connection_request" | "connection_accept"
  message: string
  isRead: boolean
  createdAt: string
}

export interface AuthResponse {
  token: string
  user: User
  profile?: Profile
}
