import { AuthThemeControl } from "@/components/auth/AuthThemeControl"
import ThemeLogo from "@/components/shared/ThemeLogo"
import { AuthLeftPanel } from "../components/AuthLeftPanel"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useIsSubmitting } from "@/context/isSubmittingContext"
import { getApiErrorMessage, resetPasswordRequest } from "@/lib/auth"
import { Eye, EyeOff, Loader2, Lock } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "react-toastify"

import { Field, FieldError, FieldGroup } from "@/components/ui/field"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(128, "Password is too long."),
    confirm: z.string().min(1, "Confirm your password."),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match.",
    path: ["confirm"],
  })

const ResetPassword = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")?.trim() ?? ""
  const { isSubmitting, setIsSubmitting } = useIsSubmitting()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirm: "",
    },
  })

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!token) {
      toast.error("Missing reset token. Open the link from your email.")
      return
    }

    setIsSubmitting(true)
    try {
      const result = await resetPasswordRequest(token, data.password)

      if (!result.ok) {
        toast.error(
          getApiErrorMessage(
            result.body,
            "Could not reset password. Request a new link."
          )
        )
        return
      }

      toast.success(result.message)
      navigate("/auth/login", { replace: true })
    } catch {
      toast.error("Reset failed. Please try again.")
    } finally {
      setIsSubmitting(false)
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
              <h4 className="mb-3">Create a new password</h4>
              <p className="text-secondary-light mb-8 text-lg">
                {token
                  ? "Choose a new password to regain access to your TradePilot workspace."
                  : "This reset link is invalid or incomplete. Request a new one to continue."}
              </p>
            </div>

            {token ? (
              <form onSubmit={form.handleSubmit(handleSubmit)}>
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
                            placeholder="Enter your new password"
                            autoComplete="new-password"
                            className="!shadow-none !ring-0 h-14 rounded-xl border border-neutral-300 bg-neutral-100 ps-13 pe-12 focus:border-primary focus-visible:border-primary dark:border-slate-700 dark:bg-slate-800 dark:focus:border-primary"
                          />
                          <button
                            type="button"
                            className="text-secondary-light absolute end-4 top-1/2 z-10 inline-flex -translate-y-1/2 cursor-pointer"
                            onClick={() => setShowPassword((v) => !v)}
                            tabIndex={-1}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="confirm"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid} className={cn("gap-1")}>
                        <div className="icon-field relative">
                          <Lock className="absolute top-1/2 left-5 h-5 w-5 -translate-y-1/2 transform text-neutral-700 dark:text-neutral-200" />
                          <Input
                            {...field}
                            type={showConfirm ? "text" : "password"}
                            aria-invalid={fieldState.invalid}
                            disabled={isSubmitting}
                            placeholder="Confirm your new password"
                            autoComplete="new-password"
                            className="!shadow-none !ring-0 h-14 rounded-xl border border-neutral-300 bg-neutral-100 ps-13 pe-12 focus:border-primary focus-visible:border-primary dark:border-slate-700 dark:bg-slate-800 dark:focus:border-primary"
                          />
                          <button
                            type="button"
                            className="text-secondary-light absolute end-4 top-1/2 z-10 inline-flex -translate-y-1/2 cursor-pointer"
                            onClick={() => setShowConfirm((v) => !v)}
                            tabIndex={-1}
                            aria-label={showConfirm ? "Hide password" : "Show password"}
                          >
                            {showConfirm ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>

                <Button
                  type="submit"
                  className="mt-4 h-[52px] w-full rounded-lg text-sm"
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4.5 w-4.5 animate-spin" />
                  )}
                  {isSubmitting ? "Updating password..." : "Update Password"}
                </Button>

                <div className="mt-8 text-center text-sm">
                  <p className="mb-0">
                    <Link
                      to="/auth/login"
                      className="text-primary font-semibold hover:underline"
                    >
                      Back to Sign In
                    </Link>
                  </p>
                </div>
              </form>
            ) : (
              <div className="text-center text-sm">
                <Button asChild className="w-full rounded-lg">
                  <Link to="/auth/forgot-password">Request new reset link</Link>
                </Button>
                <p className="mt-6 mb-0">
                  <Link
                    to="/auth/login"
                    className="text-primary font-semibold hover:underline"
                  >
                    Back to Sign In
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

export default ResetPassword
