import { redirect } from "next/navigation"

import { getUser } from "@/lib/lucia"
import TabSwitcher from "@/components/global/tab-switcher"
import SignInForm from "@/app/authenticate/sign-in-form"
import SignUpForm from "@/app/authenticate/sign-up-form"

const Authenticate = async () => {
  const user = await getUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="relative flex h-screen w-full bg-background">
      <div className="absolute left-1/2 top-1/2 max-w-3xl -translate-x-1/2 -translate-y-1/2">
        <TabSwitcher SignInTab={<SignInForm />} SignUpTab={<SignUpForm />} />
      </div>
    </div>
  )
}

export default Authenticate
