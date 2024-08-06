import { cookies } from "next/headers"
import { PrismaAdapter } from "@lucia-auth/adapter-prisma"
import { Lucia } from "lucia"

import { prisma } from "./prisma"

const adapter = new PrismaAdapter(prisma.session, prisma.user)

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    name: "boxs-auth-cookie",
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
})

export const getUser = async () => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value || null

  if (!sessionId) {
    return null
  }

  const { user, session } = await lucia.validateSession(sessionId)
  try {
    if (session && session.fresh) {
      // refreshing their session cookie
      const sessionCookie = await lucia.createSessionCookie(sessionId)
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      )
    }

    if (!session) {
      // deleting their session cookie
      const sessionCookie = await lucia.createBlankSessionCookie()
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      )
    }
  } catch (error) {}

  const dbUser = await prisma.user.findUnique({
    where: {
      id: user?.id,
    },
    select: {
      name: true,
      email: true,
    },
  })
  return dbUser
}
