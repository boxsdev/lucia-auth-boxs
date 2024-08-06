import { Google } from "arctic"

export const GoogleOAuthClient = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  process.env.NEXT_PUBLIC_URL + "/api/google/callback"
)
