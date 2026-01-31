"use server"

import { authService } from "@/service/auth.service"

export const getSession = async () => {
     return await authService.getMe()
}