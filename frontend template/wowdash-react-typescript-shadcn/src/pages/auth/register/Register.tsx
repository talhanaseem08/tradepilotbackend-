import { AuthThemeControl } from "@/components/auth/AuthThemeControl"
import ThemeLogo from "@/components/shared/ThemeLogo"
import { AuthLeftPanel } from "../components/AuthLeftPanel"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { useIsSubmitting } from "@/context/isSubmittingContext"
import {
  getApiErrorMessage,
  registerRequest,
  setSessionToken,
  setSessionUserEmail,
  setSessionUserId,
} from "@/lib/auth"
import { Check, Circle, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import SocialLogin from "../components/SocialLogin"

import { Field, FieldError, FieldGroup } from "@/components/ui/field"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"

const passwordRules = {
  minLength: (value: string) => value.length >= 8,
  lowercase: (value: string) => /[a-z]/.test(value),
  uppercase: (value: string) => /[A-Z]/.test(value),
  number: (value: string) => /\d/.test(value),
  special: (value: string) => /[^A-Za-z0-9]/.test(value),
}

const passwordErrorMessage =
  "Use at least 8 characters, including uppercase, lowercase, a number, and a special character."

function getPasswordChecks(value: string) {
  return {
    minLength: passwordRules.minLength(value),
    lowercase: passwordRules.lowercase(value),
    uppercase: passwordRules.uppercase(value),
    number: passwordRules.number(value),
    special: passwordRules.special(value),
  }
}

const formSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z
    .string()
    .max(128, "Password is too long.")
    .refine((value) => passwordRules.minLength(value), {
      message: "Password is required",
    })
    .refine(
      (value) =>
        passwordRules.lowercase(value) &&
        passwordRules.uppercase(value) &&
        passwordRules.number(value) &&
        passwordRules.special(value),
      {
        message: passwordErrorMessage,
      }
    ),
})

const Register = () => {
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
  const passwordValue = form.watch("password") ?? ""
  const passwordChecks = getPasswordChecks(passwordValue)

  const handleRegister = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    setIsLoading(true)

    try {
      const result = await registerRequest(data.email.trim(), data.password)

      if (!result.ok) {
        toast.error(
          getApiErrorMessage(
            result.body,
            result.status === 400
              ? "Could not create account."
              : "Registration failed."
          )
        )
        return
      }

      setSessionToken(result.data.token)
      setSessionUserEmail(result.data.user.email)
      setSessionUserId(result.data.user.id)
      toast.success("Account created. Welcome to TradePilot.")
      navigate("/welcome", { replace: true })
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Registration failed.")
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
            <h4 className="mb-3">Welcome to TradePilot</h4>
            <p className="text-secondary-light mb-8 text-lg">
              Set up your workspace to build strategies, review backtests, and
              stay aligned with market sentiment.
            </p>
          </div>

          <form onSubmit={form.handleSubmit(handleRegister)}>
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
                        placeholder="Create a password"
                        autoComplete="new-password"
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
                    {passwordValue.length > 0 ? (
                      <div className="mt-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/40">
                        <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-neutral-500 uppercase dark:text-slate-400">
                          Password security
                        </p>
                        <div className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
                          <PasswordRequirement
                            met={passwordChecks.minLength}
                            label="8 Character minimum"
                          />
                          <PasswordRequirement
                            met={passwordChecks.special}
                            label="1 Special Character"
                          />
                          <PasswordRequirement
                            met={passwordChecks.lowercase}
                            label="1 Lowercase character"
                          />
                          <PasswordRequirement
                            met={passwordChecks.number}
                            label="1 Number"
                          />
                          <PasswordRequirement
                            met={passwordChecks.uppercase}
                            label="1 Uppercase character"
                          />
                        </div>
                      </div>
                    ) : null}
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <div className="flex items-start justify-between gap-2">
              <Checkbox
                id="createAccount"
                className="mt-1 h-4.5 w-4.5 border border-neutral-400"
                required
              />
              <label htmlFor="createAccount" className="text-sm">
                By creating an account, you agree to the{" "}
                <Link
                  to="#"
                  className="text-primary font-semibold hover:underline"
                >
                  Terms &amp; Conditions
                </Link>{" "}
                and{" "}
                <Link
                  to="#"
                  className="text-primary font-semibold hover:underline"
                >
                  Privacy Policy
                </Link>
                .
              </label>
            </div>

            <Button
              type="submit"
              className="mt-8 h-[52px] w-full rounded-lg text-sm"
              disabled={isSubmitting}
            >
              {isLoading && (
                <Loader2 className="mr-2 h-4.5 w-4.5 animate-spin" />
              )}
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>

            <div className="center-border-horizontal relative mt-8 text-center before:absolute before:start-0 before:top-1/2 before:h-[1px] before:w-full before:-translate-y-1/2 before:bg-neutral-300">
              <span className="bg-background relative z-[2] px-4">
                Or continue with
              </span>
            </div>
            <SocialLogin mode="signup" />

            <div className="mt-8 text-center text-sm">
              <p className="mb-0">
                Already have an account?{" "}
                <Link
                  to="/auth/login"
                  className="text-primary font-semibold hover:underline"
                >
                  Sign In
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

function PasswordRequirement({
  met,
  label,
}: {
  met: boolean
  label: string
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-sm",
        met ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"
      )}
    >
      {met ? (
        <Check className="h-4 w-4 shrink-0" />
      ) : (
        <Circle className="h-3 w-3 shrink-0 fill-current stroke-none" />
      )}
      <span>{label}</span>
    </div>
  )
}

export default Register
