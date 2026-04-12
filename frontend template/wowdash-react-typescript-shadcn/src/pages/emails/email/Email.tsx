import LazyWrapper from "@/components/LazyWrapper";
import Breadcrumb from "@/layouts/Breadcrumb";
import EmailHeader from "../components/EmailHeader";
import EmailList from "../components/EmailList";
import EmailSidebar from "../components/EmailSidebar";
import EmailSidebarOverlay from "../components/EmailSidebarOverlay";
import EmailSidebarToggleButton from "../components/EmailSidebarToggleButton";

const Email = () => {
    return (
        <>
            <Breadcrumb title="Email" text="Email" />

            <div className="grid grid-cols-1 xl:grid-cols-12 xl:gap-6 relative">
                <EmailSidebarOverlay />

                {/* Sidebar */}
                <div className="col-span-12 xl:col-span-4 2xl:col-span-3">
                    <LazyWrapper>
                        <EmailSidebar />
                    </LazyWrapper>
                </div>

                <div className="col-span-12 xl:col-span-8 2xl:col-span-9">
                    <LazyWrapper>
                        <EmailSidebarToggleButton />
                    </LazyWrapper>

                    <div className="card h-full !p-0 border-0 email-card">
                        <div className="card-header border-b border-neutral-200 dark:border-slate-700 bg-white dark:bg-[#273142] py-4 px-6">
                            <LazyWrapper>
                                <EmailHeader />
                            </LazyWrapper>
                        </div>
                        <div className="card-body p-0">
                            <LazyWrapper>
                                <EmailList />
                            </LazyWrapper>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default Email;