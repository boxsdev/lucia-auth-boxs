import { redirect } from "next/navigation"

import { getUser } from "@/lib/lucia"
import { Button } from "@/components/ui/button"
import SignOutButton from "@/components/global/sign-out-button"

async function DashboardPage() {
  const user = await getUser()

  if (!user) {
    redirect("/authenticate")
  }

  return (
    <div>
      <p>Hello, {JSON.stringify(user.email)}</p>
      <SignOutButton>
        <Button>Sign Out</Button>
      </SignOutButton>
    </div>
  )
}

export default DashboardPage
