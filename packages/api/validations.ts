import { z } from "zod"

export const registerSchema = z
  .object({
    firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
})

export const profileSchema = z.object({
  bio: z.string().max(500, "La biografía no puede exceder 500 caracteres").optional(),
  age: z.number().min(18, "Debes ser mayor de 18 años").max(120).optional(),
  country: z.string().optional(),
  province: z.string().optional(),
  photoUrl: z.string().url("URL inválida").optional(),
  interests: z.array(z.string()).optional(),
  showAge: z.boolean().default(true),
  showLocation: z.boolean().default(true),
  distanceRadius: z.number().min(100).max(10000).default(1000),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ProfileInput = z.infer<typeof profileSchema>

export const eventSchema = z
  .object({
    title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
    description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
    category: z.string(),
    location: z.string().min(3, "La ubicación es requerida"),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    startDate: z.string().refine((date) => new Date(date) > new Date(), {
      message: "La fecha de inicio debe ser futura",
    }),
    endDate: z.string(),
    isPublic: z.boolean().default(true),
    maxAttendees: z.number().min(1, "Debe haber al menos 1 asistente").default(50),
    price: z.number().min(0, "El precio no puede ser negativo").default(0),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "La fecha de fin debe ser posterior a la fecha de inicio",
    path: ["endDate"],
  })

export type EventInput = z.infer<typeof eventSchema>
