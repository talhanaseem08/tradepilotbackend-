import CardImg1 from "@/assets/images/card-component/card-img1.png";
import CardImg2 from "@/assets/images/card-component/card-img2.png";
import CardImg3 from "@/assets/images/card-component/card-img3.png";
import CardImg4 from "@/assets/images/card-component/card-img4.png";
import CardOverlayImg1 from "@/assets/images/card-component/card-overlay-img1.png";
import HorizontalCardImg1 from "@/assets/images/card-component/horizontal-card-img1.png";
import HorizontalCardImg2 from "@/assets/images/card-component/horizontal-card-img2.png";
import HorizontalCardImg3 from "@/assets/images/card-component/horizontal-card-img3.png";
import HorizontalCardImg4 from "@/assets/images/card-component/horizontal-card-img4.png";
import LazyWrapper from "@/components/LazyWrapper";
import { Button } from "@/components/ui/button";
import Breadcrumb from "@/layouts/Breadcrumb";
import { cn } from "@/lib/utils";
import { BriefcaseBusiness, ChevronRight, Code, Medal, Monitor, UserPlus, X } from "lucide-react";
import { Link } from "react-router-dom";

const CardPage = () => {
    return (
        <>
            <Breadcrumb title="CardPage" text="CardPage" />

            <LazyWrapper>
                <div className="">

                    <div className="mb-10">
                        <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 gap-6">
                            <div className="card h-full rounded-xl overflow-hidden !p-0 border-0">
                                <img src={CardImg1} className="w-full" height={226} alt="Thumb" />
                                <div className="card-body p-4">
                                    <h5 className="card-title text-lg text-neutral-600 dark:text-neutral-200
                        mb-1.5">This is Card title</h5>
                                    <p className="dark:text-white card-text text-neutral-600 mb-4">We quickly learn to fear and thus automatically avo id potentially stressful situations of all kinds, including the most common of all .</p>
                                    <Link to="#" className="btn text-primary dark:text-primary hover:underline px-0 py-2.5 inline-flex items-center gap-2">
                                        Read More
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                            <div className="card h-full rounded-xl overflow-hidden !p-0 border-0">
                                <img src={CardImg2} className="w-full" height={226} alt="Thumb" />
                                <div className="card-body p-4 text-center">
                                    <h5 className="card-title text-lg text-neutral-600 dark:text-neutral-200
                        mb-1.5">This is Card title</h5>
                                    <p className="dark:text-white card-text text-neutral-600 mb-4">We quickly learn to fear and thus automatically avo id potentially stressful situations of all kinds, including the most common of all .</p>
                                    <Button
                                        type="button"
                                        className={cn(
                                            "h-[46px] bg-primary hover:bg-primary text-white rounded-lg px-5 py-[11px] inline-flex items-center gap-3"
                                        )}
                                    >
                                        Read More
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="card h-full rounded-xl overflow-hidden !p-0 border-0">
                                <img src={CardImg3} className="w-full" height={226} alt="Thumb" />
                                <div className="card-body p-4 text-end">
                                    <h5 className="card-title text-lg text-neutral-600 dark:text-neutral-200
                        mb-1.5">This is Card title</h5>
                                    <p className="dark:text-white card-text text-neutral-600 mb-4">We quickly learn to fear and thus automatically avo id potentially stressful situations of all kinds, including the most common of all .</p>
                                    <div className="flex flex-wrap items-center justify-end gap-3">
                                        <Button
                                            type="button"
                                            className={cn(
                                                "h-[46px] bg-blue-100 dark:bg-primary/25 dark:hover:bg-primary hover:bg-primary text-primary hover:text-white rounded-lg px-5 py-[11px]  flex items-center gap-3"
                                            )}
                                        >
                                            Read More
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            type="button"
                                            className={cn(
                                                "h-[46px] bg-yellow-100 dark:bg-yellow-600/25 dark:hover:bg-yellow-600 hover:bg-yellow-600 text-yellow-600 hover:text-white rounded-lg px-5 py-[11px]  flex items-center gap-3"
                                            )}
                                        >
                                            Read More
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="card h-full rounded-xl overflow-hidden !p-0 border-0">
                                <img src={CardImg4} className="w-full" height={226} alt="Thumb" />
                                <div className="card-body p-4 text-center">
                                    <h5 className="card-title text-lg text-neutral-600 dark:text-neutral-200
                        mb-1.5">This is Card title</h5>
                                    <p className="dark:text-white card-text text-neutral-600 mb-4">We quickly learn to fear and thus automatically avo id potentially stressful situations of all kinds, including the most common of all .</p>
                                    <Button
                                        type="button"
                                        className={cn(
                                            "h-[46px] w-[46px] bg-primary hover:bg-primary text-white rounded-lg px-5 py-[11px] inline-flex items-center justify-center"
                                        )}
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-10">
                        <h6 className="mb-6">Card Text &amp; icon </h6>
                        <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 gap-6">
                            <div className="card h-full rounded-xl overflow-hidden !p-0 border-0">
                                <div className="card-body p-6">
                                    <div className="w-[64px] h-[64px] inline-flex items-center justify-center bg-purple-200 dark:bg-purple-600/25 dark:text-purple-500 text-purple-600 mb-4 rounded-xl">
                                        <Medal className="h-8 w-8 mb-0" />
                                    </div>
                                    <h6 className="mb-2">Brand Identity</h6>
                                    <p className="dark:text-white card-text mb-2 text-neutral-500 dark:text-neutral-300">Random Text gateway to the Origin al the Works Platform, &amp; your unique block chain gateway identity.</p>
                                    <Link to="#" className="btn text-purple-600 dark:text-purple-500 hover:underline px-0 py-2.5 inline-flex items-center gap-2">
                                        Read More
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                            <div className="card h-full rounded-xl overflow-hidden !p-0 border-0 text-center">
                                <div className="card-body p-6">
                                    <div className="w-[64px] h-[64px] inline-flex items-center justify-center bg-blue-100 dark:bg-primary/25 dark:text-primary text-primary mb-4 rounded-xl">
                                        <Monitor className="h-8 w-8 mb-0" />
                                    </div>
                                    <h6 className="mb-2">UI/UX Designer</h6>
                                    <p className="dark:text-white card-text mb-2 text-neutral-500 dark:text-neutral-300">Random Text gateway to the Origin al the Works Platform, &amp; your unique block chain gateway identity.</p>
                                    <Link to="#" className="btn text-primary dark:text-primary hover:underline px-0 py-2.5 inline-flex items-center gap-2">
                                        Read More
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                            <div className="card h-full rounded-xl overflow-hidden !p-0 border-0 text-end">
                                <div className="card-body p-6">
                                    <div className="w-[64px] h-[64px] inline-flex items-center justify-center bg-green-100 dark:bg-green-600/25 dark:text-green-500 text-green-600 mb-4 rounded-xl">
                                        <BriefcaseBusiness className="h-8 w-8 mb-0" />
                                    </div>
                                    <h6 className="mb-2">Business Strategy</h6>
                                    <p className="dark:text-white card-text mb-2 text-neutral-500 dark:text-neutral-300">Random Text gateway to the Origin al the Works Platform, &amp; your unique block chain gateway identity.</p>
                                    <Link to="#" className="btn text-green-600 dark:text-green-500 hover:underline px-0 py-2.5 inline-flex items-center gap-2">
                                        Read More
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                            <div className="card h-full rounded-xl overflow-hidden !p-0 border-0 text-center">
                                <div className="card-body p-6">
                                    <div className="w-[64px] h-[64px] inline-flex items-center justify-center bg-red-100 dark:bg-red-600/25 dark:text-red-500 text-red-600 mb-4 rounded-xl">
                                        <Code className="h-8 w-8 mb-0" />
                                    </div>
                                    <h6 className="mb-2">Business Strategy</h6>
                                    <p className="dark:text-white card-text mb-2 text-neutral-500 dark:text-neutral-300">Random Text gateway to the Origin al the Works Platform, &amp; your unique block chain gateway identity.</p>
                                    <Link to="#" className="btn text-red-600 dark:text-red-500 hover:underline px-0 py-2.5 inline-flex items-center gap-2">
                                        Read More
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-10">
                        <h6 className="mb-6">Card With image &amp; Overlays </h6>
                        <div className="grid grid-cols-1 sm:grid-cols-6 xl:grid-cols-3 gap-6">
                            <div className="card h-full rounded-xl border-0 overflow-hidden relative !p-0 overflow-hidden">
                                <div className="card-body p-0 before:block before:absolute before:inset-0 before:z-[1] before:bg-[linear-gradient(180deg,_rgba(0,_0,_0,_0)_0%,_rgba(0,_0,_0,_0.25)_22%,_rgba(0,_0,_0,_0.69)_57.92%,_rgba(0,_0,_0,_0.7)_100%)] bottom-0 start-0 relative w-full h-[468px]">
                                    <img src={CardOverlayImg1} alt="Thumbnail" className="object-cover w-full h-full" />
                                    <div className="absolute start-0 bottom-0 p-6 z-1">
                                        <h5 className="card-title text-white dark:text-neutral-200 text-lg mb-1.5">This is Card title</h5>
                                        <p className="dark:text-white card-text text-white">We quickly learn to fear and thus automatically avo id potentially stressful situations of all kinds, including the most common of all</p>
                                        <Link to="#" className="btn text-primary dark:text-primary hover:underline px-0 py-2.5 inline-flex items-center gap-2">
                                            Read More
                                            <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="card h-full rounded-xl border-0 overflow-hidden relative !p-0 overflow-hidden">
                                <div className="card-body p-0 before:block before:absolute before:inset-0 before:z-[1] before:bg-[linear-gradient(180deg,_rgba(0,_0,_0,_0)_0%,_rgba(0,_0,_0,_0.25)_22%,_rgba(0,_0,_0,_0.69)_57.92%,_rgba(0,_0,_0,_0.7)_100%)] top-0 start-0 relative w-full h-[468px]">
                                    <img src={CardOverlayImg1} alt="Thumbnail" className="object-cover w-full h-full" />
                                    <div className="absolute start-0 top-0 p-6 z-1 text-center">
                                        <h5 className="card-title text-white dark:text-neutral-200 text-lg mb-1.5">This is Card title</h5>
                                        <p className="dark:text-white card-text text-white">We quickly learn to fear and thus automatically avo id potentially stressful situations of all kinds, including the most common of all</p>
                                        <Link to="#" className="btn text-primary dark:text-primary hover:underline px-0 py-2.5 inline-flex items-center gap-2">
                                            Read More
                                            <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="card h-full rounded-xl border-0 overflow-hidden relative !p-0 overflow-hidden">
                                <div className="card-body p-0 before:block before:absolute before:inset-0 before:z-[1] before:bg-[linear-gradient(180deg,_rgba(0,_0,_0,_0)_0%,_rgba(0,_0,_0,_0.25)_22%,_rgba(0,_0,_0,_0.69)_57.92%,_rgba(0,_0,_0,_0.7)_100%)] bottom-0 start-0 relative w-full h-[468px]">
                                    <img src={CardOverlayImg1} alt="Thumbnail" className="object-cover w-full h-full" />
                                    <div className="absolute start-0 bottom-0 p-6 z-1 text-end">
                                        <h5 className="card-title text-white dark:text-neutral-200 text-lg mb-1.5">This is Card title</h5>
                                        <p className="dark:text-white card-text text-white">We quickly learn to fear and thus automatically avo id potentially stressful situations of all kinds, including the most common of all</p>
                                        <Link to="#" className="btn text-primary dark:text-primary hover:underline px-0 py-2.5 inline-flex items-center gap-2">
                                            Read More
                                            <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-10">
                        <h6 className="mb-6">Card Header &amp; Footer</h6>
                        <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-3 gap-6">
                            <div className="card rounded-xl h-full border-0 !p-0 overflow-hidden">
                                <div className="card-header py-4 px-6 bg-transparent flex items-center gap-1 justify-between border-b">
                                    <h6 className="text-lg mb-0">Hi, Will Mart</h6>
                                    <Button variant="link" className="!p-0">
                                        <X className="!w-6 !h-6" />
                                    </Button>
                                </div>
                                <div className="card-body py-4 px-6">
                                    <h6 className="card-title text-neutral-600 dark:text-neutral-200 mb-2 text-lg">How to learn UI /UX Design</h6>
                                    <p className="dark:text-white card-text text-neutral-600 mb-0">Intrinsically incubate intuitive opportunities and real-time potentialities for change for interoperable meta-itself
                                        the viewer's attention from the layout</p>
                                </div>
                                <div className="card-footer text-center bg-transparent border-t border-neutral-200 dark:border-neutral-600 pt-4 px-6">
                                    <Link to="#" className="btn text-primary dark:text-primary hover:underline px-0 py-2.5 inline-flex items-center gap-2">
                                        Read More
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                            <div className="card rounded-xl h-full border-0 !p-0 overflow-hidden">
                                <div className="card-body py-4 px-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <UserPlus className="w-6" />
                                        <h6 className="text-lg mb-0">How to learn UI /UX Design</h6>
                                    </div>
                                    <p className="dark:text-white card-text text-neutral-600 mb-4">Intrinsically incubate intuitive opportunities and real-time potentialities for change for interoperable meta-itself the viewer's attention from the layout</p>
                                    <p className="dark:text-white card-text text-neutral-600 mb-0">Intrinsically incubate intuitive opportunities and real-time potentialities for change for interoperable </p>
                                    <Link to="#" className="btn text-primary dark:text-primary hover:underline px-0 py-2.5 inline-flex items-center gap-2">
                                        View All
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                            <div className="card rounded-xl h-full border-0 !p-0 overflow-hidden">
                                <div className="card-header py-4 px-6 bg-transparent flex items-center gap-1 justify-between border-b">
                                    <div>
                                        <h6 className="text-lg mb-0">How can I help your</h6>
                                        <span className="text-sm">Awesome Support</span>
                                    </div>
                                    <a href="#" className="text-primary dark:text-primary hover:underline">View All</a>
                                </div>
                                <div className="card-body py-4 px-6">
                                    <p className="dark:text-white card-text text-neutral-600 mb-4">Intrinsically incubate intuitive opportunities and real-time potentialities for change for interoperable meta-itself the viewer's attention from the layout</p>
                                    <p className="dark:text-white card-text text-neutral-600 mb-0">Intrinsically incubate intuitive opportunities and real-time potentialities for change for interoperable </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-10">
                        <h6 className="mb-6">Horizontal Card</h6>
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            <div className="card rounded-xl overflow-hidden !p-0 border-0 flex flex-nowrap sm:flex-row flex-col">
                                <div className="flex shrink-0">
                                    <img src={HorizontalCardImg1} className="h-full w-full object-fit-cover" alt="Thumbnail" />
                                </div>
                                <div className="card-body p-4 grow">
                                    <h5 className="card-title text-lg text-neutral-900 dark:text-neutral-200 mb-1.5">This is Card title</h5>
                                    <p className="dark:text-white card-text text-neutral-600 mb-4">We quickly learn to fear and thus automatically avo id potentially stressful situations of all kinds, including the most common of all .</p>
                                    <Link to="#" className="btn text-primary dark:text-primary hover:underline px-0 py-2.5 inline-flex items-center gap-2">
                                        Read More
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                            <div className="card rounded-xl overflow-hidden !p-0 border-0 flex flex-nowrap sm:flex-row-reverse flex-col">
                                <div className="flex shrink-0">
                                    <img src={HorizontalCardImg2} className="h-full w-full object-fit-cover" alt="Thumbnail" />
                                </div>
                                <div className="card-body p-4 grow">
                                    <h5 className="card-title text-lg text-neutral-900 dark:text-neutral-200 mb-1.5">This is Card title</h5>
                                    <p className="dark:text-white card-text text-neutral-600 mb-4">We quickly learn to fear and thus automatically avo id potentially stressful situations of all kinds, including the most common of all .</p>
                                    <Link to="#" className="btn text-primary dark:text-primary hover:underline px-0 py-2.5 inline-flex items-center gap-2">
                                        Read More
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                            <div className="card rounded-xl overflow-hidden !p-0 border-0 flex flex-nowrap sm:flex-row flex-col">
                                <div className="flex shrink-0">
                                    <img src={HorizontalCardImg3} className="h-full w-full object-fit-cover" alt="Thumbnail" />
                                </div>
                                <div className="card-body p-4 grow">
                                    <h5 className="card-title text-lg text-neutral-900 dark:text-neutral-200 mb-1.5">This is Card title</h5>
                                    <p className="dark:text-white card-text text-neutral-600 mb-4">We quickly learn to fear and thus automatically avo id potentially stressful situations of all kinds, including the most common of all .</p>
                                    <Link to="#" className="btn text-primary dark:text-primary hover:underline px-0 py-2.5 inline-flex items-center gap-2">
                                        Read More
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                            <div className="card rounded-xl overflow-hidden !p-0 border-0 h-full flex items-center sm:flex-row-reverse flex-col">
                                <div className="flex shrink-0 w-170-px h-full">
                                    <img src={HorizontalCardImg4} className="h-full w-full object-fit-cover" alt="Thumbnail" />
                                </div>
                                <div className="card-body p-4 grow">
                                    <h5 className="card-title text-lg text-neutral-900 dark:text-neutral-200 mb-1.5">This is Card title</h5>
                                    <p className="dark:text-white card-text text-neutral-600 mb-4">We quickly learn to fear and thus automatically avo id potentially stressful situations of all kinds, including the most common of all .</p>
                                    <Link to="#" className="btn text-primary dark:text-primary hover:underline px-0 py-2.5 inline-flex items-center gap-2">
                                        Read More
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="">
                        <h6 className="mb-6">Card With Background Color</h6>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                            <div className="card h-full rounded-xl border-0 overflow-hidden !p-0 !bg-purple-600/10">
                                <div className="card-body p-6">
                                    <div className="w-[64px] h-[64px] inline-flex items-center justify-center bg-purple-600 text-white mb-4 rounded-xl">
                                        <Medal className="h-8 w-8 mb-0" />
                                    </div>
                                    <h6 className="mb-2">Brand Identity</h6>
                                    <p className="dark:text-white card-text mb-2 text-neutral-500 dark:text-neutral-300">Random Text gateway to the Origin al the Works Platform, &amp; your unique block chain gateway identity.</p>
                                    <Link to="#" className="btn text-purple-600 dark:text-purple-500 hover:underline px-0 py-2.5 inline-flex items-center gap-2">
                                        Read More
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                            <div className="card h-full rounded-xl border-0 overflow-hidden !p-0 !bg-primary/10 text-center">
                                <div className="card-body p-6">
                                    <div className="w-[64px] h-[64px] inline-flex items-center justify-center bg-primary text-white mb-4 rounded-xl">
                                        <Monitor className="h-8 w-8 mb-0" />
                                    </div>
                                    <h6 className="mb-2">UI/UX Designer</h6>
                                    <p className="dark:text-white card-text mb-2 text-neutral-500 dark:text-neutral-300">Random Text gateway to the Origin al the Works Platform, &amp; your unique block chain gateway identity.</p>
                                    <Link to="#" className="btn text-primary dark:text-primary hover:underline px-0 py-2.5 inline-flex items-center gap-2">
                                        Read More
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                            <div className="card h-full rounded-xl border-0 overflow-hidden !p-0 !bg-green-600/10 text-end">
                                <div className="card-body p-6">
                                    <div className="w-[64px] h-[64px] inline-flex items-center justify-center bg-green-600 text-white mb-4 rounded-xl">
                                        <BriefcaseBusiness className="h-8 w-8 mb-0" />
                                    </div>
                                    <h6 className="mb-2">Business Strategy</h6>
                                    <p className="dark:text-white card-text mb-2 text-neutral-500 dark:text-neutral-300">Random Text gateway to the Origin al the Works Platform, &amp; your unique block chain gateway identity.</p>
                                    <Link to="#" className="btn text-green-600 dark:text-green-500 hover:underline px-0 py-2.5 inline-flex items-center gap-2">
                                        Read More
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                            <div className="card h-full rounded-xl border-0 overflow-hidden !p-0 !bg-red-600/10 text-center">
                                <div className="card-body p-6">
                                    <div className="w-[64px] h-[64px] inline-flex items-center justify-center bg-red-600 text-white mb-4 rounded-xl">
                                        <Code className="h-8 w-8 mb-0" />
                                    </div>
                                    <h6 className="mb-2">Business Strategy</h6>
                                    <p className="dark:text-white card-text mb-2 text-neutral-500 dark:text-neutral-300">Random Text gateway to the Origin al the Works Platform, &amp; your unique block chain gateway identity.</p>
                                    <Link to="#" className="btn text-red-600 dark:text-red-500 hover:underline px-0 py-2.5 inline-flex items-center gap-2">
                                        Read More
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </LazyWrapper>

        </>
    );
};

export default CardPage;