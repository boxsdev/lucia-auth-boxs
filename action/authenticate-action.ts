"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { SignInSchemaType, SignUpSchemaType } from "@/schema"
import { generateCodeVerifier, generateState } from "arctic"
import { Argon2id } from "oslo/password"

import { GoogleOAuthClient } from "@/lib/google-oauth"
import { lucia } from "@/lib/lucia"
import { prisma } from "@/lib/prisma"

export const signUpAction = async (values: SignUpSchemaType) => {
  try {
    // if user already exists, throw an error
    const existingUser = await prisma.user.findUnique({
      where: {
        email: values.email,
      },
    })

    if (existingUser) {
      return {
        success: false,
        error: "user already exists",
      }
    }

    // hash password using argon2id
    const hashedPassword = await new Argon2id().hash(values.password)

    // if user does not exist, create a new user
    const user = await prisma.user.create({
      data: {
        name: values.name,
        email: values.email,
        hashedPassword,
      },
    })

    // create a new session
    const session = await lucia.createSession(user.id, {})
    // create a new session cookie
    const sessionCookie = await lucia.createSessionCookie(session.id)
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    )

    return {
      success: true,
    }
  } catch (error) {
    return { error: "something went wrong", success: false }
  }
}

export const signInAction = async (values: SignInSchemaType) => {
  const user = await prisma.user.findUnique({
    where: {
      email: values.email,
    },
  })

  // if user does not exist, throw an error
  if (!user || !user.hashedPassword) {
    return {
      success: false,
      error: "invalid credentials",
    }
  }

  // verify password
  const passwordMatch = await new Argon2id().verify(
    user.hashedPassword,
    values.password
  )

  if (!passwordMatch) {
    return {
      success: false,
      error: "invalid credentials",
    }
  }

  // successfully signed in
  const session = await lucia.createSession(user.id, {})
  // create a new session cookie
  const sessionCookie = await lucia.createSessionCookie(session.id)
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  )

  return {
    success: true,
  }
}

export const LogOut = async () => {
  const sessionCookie = await lucia.createBlankSessionCookie()
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  )

  return redirect("/authenticate")
}

export const getGoogleContsentUrl = async () => {
  try {
    const state = generateState()
    const codeVerifier = generateCodeVerifier()

    cookies().set("state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    })

    cookies().set("codeVerifier", codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    })

    const authUrl = await GoogleOAuthClient.createAuthorizationURL(
      state,
      codeVerifier,
      {
        scopes: ["profile", "email"],
      }
    )

    return {
      success: true,
      url: authUrl.toString(),
    }
  } catch (error) {
    return {
      success: false,
      error: "something went wrong",
    }
  }
}
