"use client"

import { useRouter } from "next/navigation"
import { signInAction } from "@/action/authenticate-action"
import { SignInSchema, SignInSchemaType } from "@/schema/index"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { FaGoogle } from "react-icons/fa"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import GoogleSigninButton from "@/components/global/google-sign-in"

function SignInForm() {
  const router = useRouter()

  const form = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: SignInSchemaType) {
    const result = await signInAction(values)

    if (result.success) {
      toast.success("signed in successfully")
      router.push("/dashboard")
    } else {
      toast.error(result.error)
    }
  }

  return (
    <Card className="min-w-[500px]">
      <CardHeader>
        <CardTitle>welcome back!</CardTitle>
        <CardDescription>sign in to your account to continue.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      {...field}
                      placeholder="enter your email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      placeholder="enter your password..."
                      autoComplete="current-password"
                      onChange={(e) => {
                        e.target.value = e.target.value.trim()
                        field.onChange(e)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <GoogleSigninButton>
          <FaGoogle className="mr-2 h-4 w-4" />
          continue with google
        </GoogleSigninButton>
      </CardFooter>
    </Card>
  )
}

export default SignInForm
