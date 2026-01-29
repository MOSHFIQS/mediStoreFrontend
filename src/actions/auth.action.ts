"use server"

import { authService, SignInPayload, SignUpPayload } from "@/service/auth.service";

export const signUp = async (payload: SignUpPayload) => {
     return await authService.signUp(payload);
};
export const signIn = async (payload: SignInPayload) => {
     return await authService.signIn(payload);
};