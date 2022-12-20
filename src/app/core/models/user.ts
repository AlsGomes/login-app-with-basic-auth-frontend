import { Permission } from "./permission"

export interface User {
    id?: string
    name?: string
    email?: string
    password?: string
    confirmationPassword?: string
    createdAt?: Date
    updatedAt?: Date
    permissions?: Permission[]
}