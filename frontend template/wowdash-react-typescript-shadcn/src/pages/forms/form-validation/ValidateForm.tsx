import DefaultCardComponent from "@/components/shared/DefaultCardComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { formSchema, type FormSchemaType } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React from 'react';
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import { formAction } from './actions';

const ValidateForm = () => {

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = (data: FormSchemaType, event?: React.BaseSyntheticEvent) => {
        console.log(`Registered users is: ${data}`);
        event?.preventDefault();
        toast.success("Form submitted successfully!");
        reset();
    };

    return (
        <form action={formAction} onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-12 gap-5">
                <div className="xl:col-span-6 col-span-12">
                    <DefaultCardComponent title="Vertical Input Form">
                        <div className="flex flex-col gap-4">
                            {/* First Name */}
                            <div>
                                <Label htmlFor="firstName" className="mb-2">
                                    First Name
                                </Label>
                                <Input id="firstName" className='h-12 px-4' placeholder="First Name" {...register("firstName")} />
                                {errors.firstName && (
                                    <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                                )}
                            </div>

                            {/* Last Name */}
                            <div>
                                <Label htmlFor="lastName" className="mb-2">
                                    Last Name
                                </Label>
                                <Input id="lastName" className='h-12 px-4' placeholder="Last Name" {...register("lastName")} />
                                {errors.lastName && (
                                    <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <Label htmlFor="email" className="mb-2">
                                    Email
                                </Label>
                                <Input id="email" className='h-12 px-4' type="email" placeholder="Enter Email" {...register("email")} />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                                )}
                            </div>

                            {/* Phone */}
                            <div>
                                <Label htmlFor="phone" className="mb-2">
                                    Phone
                                </Label>
                                <Input id="phone" className='h-12 px-4' type="tel" placeholder="+1 (555) 000-0000" {...register("phone")} />
                                {errors.phone && (
                                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <Label htmlFor="password" className="mb-2">
                                    Password
                                </Label>
                                <Input id="password" className='h-12 px-4' type="password" placeholder="******" {...register("password")} />
                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                                )}
                            </div>

                            <div>
                                <Button type="submit" className={cn("h-12 px-8")}>
                                    Submit
                                </Button>
                            </div>
                        </div>
                    </DefaultCardComponent>
                </div>
            </div>
        </form>
    );
};

export default ValidateForm;