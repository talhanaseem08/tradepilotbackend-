import LazyWrapper from "@/components/LazyWrapper";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import Breadcrumb from "@/layouts/Breadcrumb";
import React from "react";

const NotificationAlert = () => {
    return (
        <>
            <Breadcrumb title="Notification Alert" text="Notification Alert" />

            <LazyWrapper>
                <div>
                    <div className="card rounded-xl border border-border bg-background shadow-sm p-6">
                        <div className="card-body p-0">
                            <form>
                                <NotificationSection
                                    title="Mail Notification Messages"
                                    label="Admin New Order Message"
                                    placeholder="You have a new order."
                                    name="mail_message"
                                    switchName="mail_switch"
                                />

                                <NotificationSection
                                    title="SMS Notification Messages"
                                    label="Admin New Order Message"
                                    placeholder="You have a new order."
                                    name="sms_message"
                                    switchName="sms_switch"
                                />

                                <NotificationSection
                                    title="Push Notification Messages"
                                    label="Admin New Order Message"
                                    placeholder="You have a new order."
                                    name="push_message"
                                    switchName="push_switch"
                                />

                                <div className="flex items-center flex-wrap justify-center gap-4 mt-8">
                                    <Button
                                        type="reset"
                                        className="h-[48px] border border-red-600 bg-transparent hover:bg-red-600/20 text-red-600 text-base px-14 py-[11px] rounded-lg"
                                    >
                                        Reset
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="h-[48px] text-base px-14 py-3 rounded-lg"
                                    >
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </LazyWrapper>

        </>
    );
};

export default NotificationAlert;

interface NotificationSectionProps {
    title: string;
    label: string;
    placeholder?: string;
    name: string;
    switchName: string;
}

const NotificationSection: React.FC<NotificationSectionProps> = ({
    title,
    label,
    placeholder,
    name,
    switchName,
}) => {
    const switchId = title.replace(/\s+/g, "-").toLowerCase();

    return (
        <div className="mb-6">
            <h6 className="text-lg font-semibold mb-3">{title}</h6>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <Label className="text-base font-medium">{label}</Label>
                <div className="flex items-center flex-wrap space-x-2">
                    <input
                        type="checkbox"
                        id={switchId}
                        name={switchName}
                        className="sr-only peer"
                    />
                    <Switch id={switchId} />
                    <Label htmlFor={switchId} className="text-sm">
                        On
                    </Label>
                </div>
            </div>
            <Textarea
                name={name}
                placeholder={placeholder}
                className="border border-neutral-300 px-5 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-12 !rounded-lg !shadow-none !ring-0 !h-[80px] !w-full"
            />
        </div>
    );
};