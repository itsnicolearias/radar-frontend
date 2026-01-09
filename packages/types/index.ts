export interface IUser {
  userId: string
  firstName: string
  lastName: string
  email: string
  displayName: string | null
  birthDate: Date | null
  isVerified: boolean
  invisibleMode?: boolean
  isVisible?: boolean
  lastLatitude?: number | null
  lastLongitude?: number | null
  lastSeenAt?: Date | null
  createdAt?: string
  updatedAt?: string
  Profile?: IProfile
}

export interface IAuthResponse {
  success: boolean
  data: {
    token: string
    user: IUser
  }
}

export interface IResendVerificationEmailResponse {
  message: string
}

export interface IVerifyEmailResponse {
  message: string
  user: IUser
}

export interface IDeleteConnectionResponse {
  message: string
}

export interface IConversation {
  conversationId: string
  user: Partial<IRadarUser>
  lastMessage: ILastMessage
  unreadCount: number
}

export interface IMessageResponse {
  messageId: string
  senderId: string
  receiverId: string
  content: string
  isRead: boolean
  createdAt: Date
  updatedAt: Date
  Sender: Partial<IRadarUser>
  Receiver: Partial<IRadarUser>
  Signal?: IRadarSignal | null
}

export interface IMarkAsReadResponse {
  message: string
}

export interface IUnreadMessagesResponse {
  count: number
}

export interface INotificationResponse {
  notificationId: string
  userId: string
  type: "MESSAGE" | "CONNECTION_REQUEST" | "CONNECTION_ACCEPTED"
  message: string
  isRead: boolean
  createdAt: Date
  updatedAt: Date
}

export interface IMarkNotificationsAsReadResponse {
  message: string
}

export interface IUnreadNotificationCountResponse {
  count: number
}

export interface IDeleteNotificationResponse {
  message: string
}

export interface UpdateProfileApi {
  User: Partial<IUser>
  Profile?: Partial<IProfile>
}

export interface UpdateProfileResponse {
  success: boolean
  data?: UpdateProfileApi
}
export interface IProfile {
  profileId?: string
  userId?: string
  photoUrl: string | null
  bio: string | null
  location?: string | null
  website?: string | null
  birthDate?: Date | null
  gender?: string | null
  pronouns?: string | null
  height?: number | null
  zodiac?: string | null
  education?: string | null
  work?: string | null
  interests: string[] | null
  createdAt?: Date
  updatedAt?: Date
  User?: IUser
  age?: number | null
  province?: string
  country?: string
  showAge?: boolean
  showLocation?: boolean
}

export interface IProfileResponse extends IProfile {
  profileId: string
  userId: string
  createdAt: Date
  updatedAt: Date
  User: IUser
}

export interface IDeleteProfileResponse {
  message: string
}

export interface IRadarSignal {
  signalId: string
  senderId: string
  note?: string
  createdAt: Date
  updatedAt: Date
  distance: number
  Sender: IRadarUser
}

export interface IRadarNearbyResponse {
  users: IRadarUser[]
  events: any[]
  signals: IRadarSignal[]
}

export interface IUserResponse extends IUser {
  Profile: IProfile
}

export interface IUpdateUserResponse {
  userId: string
  firstName: string
  lastName: string
  email: string
  displayName: string | null
  birthDate: Date | null
  invisibleMode: boolean
  isVisible: boolean
}

export interface IUpdateLocationResponse {
  userId: string
  latitude: number | null
  longitude: number | null
  lastSeenAt: Date
}

export interface IToggleVisibilityResponse {
  userId: string
  isVisible: boolean
}

export interface IConnectionResponse {
  connectionId: string
  senderId: string
  receiverId: string
  status: "pending" | "accepted" | "rejected"
  createdAt: Date
  updatedAt: Date
  Sender: Partial<IRadarUser>
  Receiver: Partial<IRadarUser>
}

export interface IDeleteConnectionResponse {
  message: string
}

export interface ILastMessage {
  content: string
  createdAt: Date
  isRead: boolean
  senderId: string
}

export interface IConversationsResponse {
  conversations: IConversation[]
  total: number
}

export interface IProfileViewResponse {
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
    Profile: Partial<IProfile>
  }
}

export interface IRadarUser {
  userId: string
  firstName: string
  lastName: string
  email: string
  displayName: string | null
  birthDate: Date | null
  isVerified: boolean
  lastLatitude: number | null
  lastLongitude: number | null
  lastSeenAt: Date | null
  distance: number
  Profile: {
    photoUrl: string | null
    bio: string | null
    age: number | null
    interests: string[] | null
    province?: string
    country?: string
    showAge: boolean
    showLocation: boolean
  }
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
  category?: string
  InterestedUsers?: IUser[]
}

export interface IEventCreatePayload {
  title?: string
  description?: string
  location?: string
  latitude?: number
  longitude?: number
  startDate?: string
  endDate?: string
  isPublic?: boolean
  maxAttendees?: number
  price?: number
}

export interface IEventsListResponse {
  rows: IEventResponse[]
  count: number
}

export type SocketEvents = {
  "update-location": { latitude: number; longitude: number }
  "send-message": { receiverId: string; content: string }
  "connection-request": { receiverId: string }
  "connection-accepted": { connectionId: string }
  typing: { receiverId: string }
  "stop-typing": { receiverId: string }
  "location-updated": { userId: string; latitude: number; longitude: number }
  "new-message": IMessageResponse
  "new-connection-request": IConnectionResponse
  "connection-request-accepted": IConnectionResponse
  "user-typing": { userId: string }
  "user-stopped-typing": { userId: string }
}
