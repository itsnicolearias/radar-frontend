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

export interface Event {
  eventId: string
  title: string
  description?: string
  location?: string
  latitude?: number
  longitude?: number
  startDate: string
  endDate?: string
  isPublic: boolean
  maxAttendees?: number
  price?: number
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface NearbyUser {
  user: User
  profile: Profile
  distance: number
}

export interface Chat {
  userId: string
  user: User
  profile: Profile
  lastMessage?: Message
  unreadCount: number
}

export type SocketEvents = {
  "update-location": { latitude: number; longitude: number }
  "send-message": { receiverId: string; content: string }
  "connection-request": { receiverId: string }
  "connection-accepted": { connectionId: string }
  typing: { receiverId: string }
  "stop-typing": { receiverId: string }
  "location-updated": { userId: string; latitude: number; longitude: number }
  "new-message": Message
  "new-connection-request": Connection
  "connection-request-accepted": Connection
  "user-typing": { userId: string }
  "user-stopped-typing": { userId: string }
}
