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

export interface ApiResponseConections {
  success: boolean
  data: Connection[]
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
  success: boolean
  data: {
    token: string
    user: {
      userId: string
      firstName: string
      lastName: string
      email: string
      isVerified: boolean
      displayName: string | null
      birthDate: Date | null
    }
  }
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
  distance: string
}

export interface IEventResponse {
  eventId: string
  userId: string
  title: string
  description: string
  location: string
  latitude: number
  longitude: number
  startDate: string
  endDate: string
  isPublic: boolean
  maxAttendees: number
  price: number
  createdAt: string
  updatedAt: string
  distance?: number
  attendeesCount?: number
  isInterested?: boolean
  category?: string
}

export interface IEventCreatePayload {
  title: string
  description: string
  location: string
  latitude: number
  longitude: number
  startDate: string
  endDate: string
  isPublic: boolean
  maxAttendees: number
  price: number
}

export interface IEventsListResponse {
  rows: IEventResponse[]
  count: number
}

export interface ISignal {
  signalId: string
  senderId: string
  note: string | null
  createdAt: string
  updatedAt: string
  distance: number
  Sender: NearbyUser
}

export interface ISignalResponse {
  success: boolean
  data: ISignal
}

export interface IProfileView {
  profileViewId: string
  viewerId: string
  viewedId: string
  createdAt: Date
  updatedAt: Date
  Viewer: {
    userId: string
    firstName: string
    lastName: string
    displayName: string | null
    photoUrl?: string
  }
}

export interface IProfileViewResponse {
  success: boolean
  data: IProfileView[]
}

export interface NearbyUser {
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
   Profile: Profile
    distance: number 

  
}

export interface IRadarResponse {
  success: boolean;
  data: {
    users: NearbyUser[]
    events: Event[]
    signals: ISignal[]
  }
}

export interface RecentChats {
  user: NearbyUser
  lastMessage: Message
  unreadCount: number
  conversationId: string
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
