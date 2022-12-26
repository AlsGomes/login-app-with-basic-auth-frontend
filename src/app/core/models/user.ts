import { Permission } from "./permission"

export interface User {
    id?: number
    name?: string
    email?: string
    password?: string
    confirmationPassword?: string
    createdAt?: Date
    lastUpdated?: Date
    permissions?: Permission[]
}