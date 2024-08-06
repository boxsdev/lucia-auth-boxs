"use client"

import { LogOut } from "@/action/authenticate-action"

import { Button } from "../ui/button"

type Props = {
  children: React.ReactNode
}

const SignOutButton = ({ children }: Props) => {
  return (
    <span
      onClick={() => {
        LogOut()
      }}
      className="cursor-pointer"
    >
      {children}
    </span>
  )
}

export default SignOutButton
