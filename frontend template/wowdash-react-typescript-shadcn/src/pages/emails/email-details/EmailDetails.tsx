import UserList1 from "@/assets/images/user-list/user-list1.png";
import UserList2 from "@/assets/images/user-list/user-list2.png";
import LazyWrapper from "@/components/LazyWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Breadcrumb from "@/layouts/Breadcrumb";
import { Images, LinkIcon, MoveLeft, Printer, Send, Star, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import EmailSidebar from "../components/EmailSidebar";
import EmailSidebarOverlay from "../components/EmailSidebarOverlay";
import EmailSidebarToggleButton from "../components/EmailSidebarToggleButton";

const EmailDetails = () => {
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

                    <div className="card h-full p-0 email-card overflow-x-auto block border-0 !p-0">
                        <div className="min-w-[450px] flex flex-col justify-between h-full">
                            <div className="">
                                <div className="card-header border-b border-neutral-200 dark:border-neutral-600 bg-white dark:bg-[#273142] py-4 px-6 flex items-center gap-3 justify-between flex-wrap">
                                    <div className="flex items-center gap-2">
                                        <Link to="/email" className="!p-0 text-neutral-600 dark:text-white flex me-2 hover:text-primary">
                                            <MoveLeft />
                                        </Link>
                                        <h6 className="mb-0 text-lg">Kathryn Murphy</h6>
                                        <span className="bg-blue-100 dark:bg-primary/25 text-primary dark:text-blue-400 text-sm rounded px-2">Personal</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button className="text-neutral-600 dark:text-white flex cursor-pointer hover:text-primary">
                                            <Printer className="w-6 h-6" />
                                        </button>
                                        <button className="text-neutral-600 dark:text-white flex cursor-pointer hover:text-primary">
                                            <Star className="w-6 h-6" />
                                        </button>
                                        <button className="text-neutral-600 dark:text-white flex cursor-pointer hover:text-primary">
                                            <Trash2 className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>
                                <div className="card-body p-0">
                                    <div className="py-4 px-6 border-b border-neutral-200 dark:border-neutral-600">
                                        <div className="flex items-start gap-3">
                                            <img src={UserList1} alt="Thumb" width={10} height={10} className="w-10 h-10 rounded-full" />
                                            <div className="">
                                                <div className="flex items-center flex-wrap gap-2">
                                                    <h6 className="mb-0 text-lg">Kathryn Murphy</h6>
                                                    <span className="text-neutral-600 dark:text-white text-base">kathrynmurphy@gmail.com</span>
                                                </div>
                                                <div className="mt-5">
                                                    <p className="mb-4 text-neutral-600 dark:text-neutral-200">Hi William</p>
                                                    <p className="mb-4 text-neutral-600 dark:text-neutral-200">Just confirming that we transferred $63.86 to you via PayPal <Link to="mailto:info367@gmail.com" className="text-primary dark:text-primary underline">(info367@gmail.com)</Link> which you earned on the themewow Market since your last payout.</p>
                                                    <p className="mb-0 text-neutral-600 dark:text-neutral-200">Thank you for selling with us!</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="py-4 px-6 border-b border-neutral-200 dark:border-neutral-600">
                                        <div className="flex items-start gap-3">
                                            <img src={UserList2} alt="Thumb" width={10} height={10} className="w-10 h-10 rounded-full" />
                                            <div className="">
                                                <div className="flex items-center flex-wrap gap-2">
                                                    <h6 className="mb-0 text-lg">Subrata Sen</h6>
                                                    <span className="text-neutral-600 dark:text-white text-base">subratasen@gmail.com</span>
                                                </div>
                                                <div className="mt-5">
                                                    <p className="mb-0 text-neutral-600 dark:text-neutral-200">Awesome, thank you so much!</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer py-4 px-6 bg-white dark:bg-[#273142] border-t border-neutral-200 dark:border-neutral-600">
                                <form>
                                    <div className="flex items-center justify-between">
                                        <Textarea className="max-h-[80px] bg-transparent focus:ring-0 w-full p-0 rounded-lg border-0 py-2 ps-2 resize-none scroll-sm focus-visible:ring-0" id="message" name="message" placeholder="Write massage" />
                                        <div className="flex items-center gap-4 ms-4">
                                            <div className="">
                                                <Label htmlFor="attachment" className="text-neutral-600 text-xl dark:text-white cursor-pointer hover:text-primary">
                                                    <LinkIcon className="w-5 h-5" />
                                                </Label>
                                                <Input type="file" id="attachment" name="attachment" hidden />
                                            </div>
                                            <div className="">
                                                <Label htmlFor="gallery" className="text-neutral-600 text-xl dark:text-white cursor-pointer hover:text-primary">
                                                    <Images className="w-5 h-5" />
                                                </Label>
                                                <Input type="file" id="gallery" name="gallery" hidden />
                                            </div>
                                            <Button variant="default" type="submit">
                                                <Send className="w-4 h-4" />
                                                Send
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </>
    );
};

export default EmailDetails;