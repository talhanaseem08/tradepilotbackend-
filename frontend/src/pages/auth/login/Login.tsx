import { AuthThemeControl } from "@/components/auth/AuthThemeControl"
import ThemeLogo from "@/components/shared/ThemeLogo"
import { AuthLeftPanel } from "../components/AuthLeftPanel"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { useIsSubmitting } from "@/context/isSubmittingContext"
import {
  fetchAppEntryStatus,
  getApiErrorMessage,
  loginRequest,
  setAuthenticatedSession,
} from "@/lib/auth"
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import SocialLogin from "../components/SocialLogin"

import { Field, FieldError, FieldGroup } from "@/components/ui/field"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z
    .string()
    .min(1, "Enter your password.")
    .max(128, "Password is too long."),
})

const Login = () => {
  const navigate = useNavigate()
  const { isSubmitting, setIsSubmitting } = useIsSubmitting()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const handleLogin = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    setIsLoading(true)

    try {
      const result = await loginRequest(data.email.trim(), data.password)

      if (!result.ok) {
        toast.error(
          getApiErrorMessage(
            result.body,
            result.status === 401
              ? "Invalid email or password."
              : "Could not sign in."
          )
        )
        return
      }

      setAuthenticatedSession(result.data.token, result.data.user)
      toast.success("Signed in successfully.")
      const entry = await fetchAppEntryStatus()
      navigate(
        entry.ok ? entry.data.nextPath : "/dashboard",
        { replace: true }
      )
    } catch {
      toast.error("Sign-in failed. Please try again.")
    } finally {
      setIsSubmitting(false)
      setIsLoading(false)
    }
  }

  return (
    <>
      <AuthThemeControl />
      <section className="bg-background text-foreground flex min-h-[100vh] flex-wrap lg:flex">
      <div className="hidden lg:block lg:w-1/2">
        <AuthLeftPanel />
      </div>
      <div className="flex flex-col justify-center px-6 py-8 lg:w-1/2">
        <div className="mx-auto w-full lg:max-w-[464px]">
          <div>
            <Link to="/dashboard" className="mb-2.5 inline-block max-w-[180px]">
              <ThemeLogo className="h-[42px] max-w-[180px]" />
            </Link>
            <h4 className="mb-3">Sign in to TradePilot</h4>
            <p className="text-secondary-light mb-8 text-lg">
              A smarter trading workspace designed to help traders become
              profitable.
            </p>
          </div>

          <form onSubmit={form.handleSubmit(handleLogin)}>
            <FieldGroup className="mb-4">
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className={cn("gap-1")}>
                    <div className="icon-field relative">
                      <Mail className="absolute top-1/2 left-5 h-5 w-5 -translate-y-1/2 transform text-neutral-700 dark:text-neutral-200" />
                      <Input
                        {...field}
                        type="email"
                        aria-invalid={fieldState.invalid}
                        disabled={isSubmitting}
                        placeholder="Enter your email"
                        autoComplete="email"
                        className="!shadow-none !ring-0 h-14 rounded-xl border border-neutral-300 bg-neutral-100 ps-13 pe-12 focus:border-primary focus-visible:border-primary dark:border-slate-700 dark:bg-slate-800 dark:focus:border-primary"
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <FieldGroup className="mb-4">
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className={cn("gap-1")}>
                    <div className="icon-field relative">
                      <Lock className="absolute top-1/2 left-5 h-5 w-5 -translate-y-1/2 transform text-neutral-700 dark:text-neutral-200" />
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        aria-invalid={fieldState.invalid}
                        disabled={isSubmitting}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        className="!shadow-none !ring-0 h-14 rounded-xl border border-neutral-300 bg-neutral-100 ps-13 pe-12 focus:border-primary focus-visible:border-primary dark:border-slate-700 dark:bg-slate-800 dark:focus:border-primary"
                      />
                      <Button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-1/2 right-4 h-[unset] -translate-y-1/2 transform !bg-transparent !p-0 text-muted-foreground hover:bg-transparent"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  className="h-4.5 w-4.5 border border-neutral-400"
                />
                <label htmlFor="remember" className="text-sm">
                  Remember me
                </label>
              </div>
              <Link
                to="/auth/forgot-password"
                className="text-primary text-sm font-medium hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="mt-8 h-[52px] w-full rounded-lg text-sm"
              disabled={isSubmitting}
            >
              {isLoading && (
                <Loader2 className="mr-2 h-4.5 w-4.5 animate-spin" />
              )}
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="center-border-horizontal relative mt-8 text-center before:absolute before:start-0 before:top-1/2 before:h-[1px] before:w-full before:-translate-y-1/2 before:bg-neutral-300">
              <span className="bg-background relative z-[2] px-4">
                Or continue with
              </span>
            </div>
            <SocialLogin />

            <div className="mt-8 text-center text-sm">
              <p className="mb-0">
                Don&apos;t have an account?{" "}
                <Link
                  to="/auth/register"
                  className="text-primary font-semibold hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
    </>
  )
}

export default Login
