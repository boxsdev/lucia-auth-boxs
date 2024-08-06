import { getGoogleContsentUrl } from "@/action/authenticate-action"
import { toast } from "sonner"

import { Button } from "../ui/button"

type Props = {
  children: React.ReactNode
}

const GoogleSigninButton = ({ children }: Props) => {
  const onClick = async () => {
    const res = await getGoogleContsentUrl()
    if (res.url) {
      window.location.href = res.url
    } else {
      toast.error(res.error)
    }
  }

  return (
    <Button
      variant={"outline"}
      size={"lg"}
      className="w-full"
      onClick={onClick}
    >
      {children}
    </Button>
  )
}

export default GoogleSigninButton
