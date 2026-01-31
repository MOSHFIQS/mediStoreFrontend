import { sessionService } from "@/service/token.service"
import { NextResponse } from "next/server"

export async function GET() {
     const user = await sessionService.getUserFromToken()
     return NextResponse.json(user)
}
