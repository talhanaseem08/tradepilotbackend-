import LazyWrapper from "@/components/LazyWrapper";
import Breadcrumb from "@/layouts/Breadcrumb";
import ClientFirebaseWrapper from "./ClientFirebaseWrapper";

const SettingsNotification = () => {
    return (
        <>
            <Breadcrumb title="Settings Notification" text="Settings Notification" />

            <LazyWrapper>
                <div className="rounded-xl border border-border bg-white dark:bg-[#273142] p-6 shadow-sm">
                    <ClientFirebaseWrapper />
                </div>
            </LazyWrapper>

        </>
    );
};

export default SettingsNotification;