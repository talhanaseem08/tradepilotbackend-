import { AuthThemeControl } from "@/components/auth/AuthThemeControl";
import ThemeLogo from "@/components/shared/ThemeLogo";
import { AuthLeftPanel } from "../components/AuthLeftPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsSubmitting } from "@/context/isSubmittingContext";
import { forgotPasswordRequest, formatApiFailure } from "@/lib/auth";
import { Loader2, Mail } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

import {
    Field,
    FieldError,
    FieldGroup
} from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";


const formSchema = z.object({
    email: z.string().email("Enter a valid email address."),
});


const ForgotPassword = () => {
    const navigate = useNavigate();
    const { isSubmitting, setIsSubmitting } = useIsSubmitting();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });


    const handleResetPassword = async (data: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);

        try {
            const result = await forgotPasswordRequest(data.email.trim());

            if (!result.ok) {
                toast.error(
                    formatApiFailure(
                        result.body,
                        result.status,
                        result.status === 503
                            ? "Could not send email. Configure SMTP on the gateway or try again later."
                            : "Could not request password reset"
                    )
                );
                return;
            }

            toast.success(result.message);
            if (result.devHint) {
                toast.info(result.devHint, { autoClose: 20000 });
            }
            navigate("/auth/login", { replace: true });
        } finally {
            setIsSubmitting(false);
            form.reset();
        }
    };

    return (
        <>
        <AuthThemeControl />
        <section className="bg-background text-foreground lg:flex flex-wrap min-h-[100vh]">
            <div className="hidden lg:block lg:w-1/2">
                <AuthLeftPanel />
            </div>
            <div className="lg:w-1/2 py-8 px-6 flex flex-col justify-center">
                <div className="lg:max-w-[464px] mx-auto w-full">
                    <div>
                        <Link to="/dashboard" className="mb-2.5 max-w-[290px] inline-block">
                            <ThemeLogo />
                        </Link>
                        <h4 className="mb-3"> Forgot Password </h4>
                        <p className="mb-8 text-secondary-light text-lg">Enter the email address associated with your account and we will send you a link to reset your password.</p>
                    </div>



                    <form action="#" onSubmit={form.handleSubmit(handleResetPassword)}>
                        <FieldGroup className="mb-4">
                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className={cn('gap-1')}>
                                        <div className="icon-field relative">
                                            <Mail className="absolute start-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-700 dark:text-neutral-200" />
                                            <Input
                                                {...field}
                                                type="email"
                                                aria-invalid={fieldState.invalid}
                                                disabled={isSubmitting}
                                                placeholder="Email"
                                                name="email"
                                                autoComplete="email"
                                                className="ps-13 pe-12 h-14 rounded-xl bg-neutral-100 dark:bg-slate-800 border border-neutral-300 dark:border-slate-700 focus:border-primary dark:focus:border-primary focus-visible:border-primary !shadow-none !ring-0"
                                            />
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
                            className="w-full rounded-lg h-[52px] text-sm mt-4"
                            disabled={isSubmitting}
                        >
                            {isSubmitting && <Loader2 className="animate-spin h-4.5 w-4.5 mr-2" />}
                            {isSubmitting ? "Sending Recovery Email..." : "Send Recovery Email"}
                        </Button>

                        <div className="mt-8 text-center text-sm">
                            <p className="mb-0"> Remembered your password? {" "} <Link to="/auth/login" className="text-primary font-semibold hover:underline">Back to Sign In</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </section>
        </>
    );
};

export default ForgotPassword;