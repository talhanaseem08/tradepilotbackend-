import LazyWrapper from "@/components/LazyWrapper";
import { Card, CardContent } from "@/components/ui/card";
import Breadcrumb from "@/layouts/Breadcrumb";
import { useState } from "react";
import { toast } from 'react-toastify';

const Colors = () => {

    const [copied, setCopied] = useState(false);

    const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    // Utility to extract data-clipboard-text on click
    const handleBoxClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.currentTarget.querySelector("[data-clipboard-text]");
        if (target instanceof HTMLElement) {
            const textToCopy = target.getAttribute("data-clipboard-text");
            if (textToCopy) {
                handleCopy(textToCopy);
                toast.success(`${textToCopy} Class copied`);
            }
        }
    };

    return (
        <>
            <Breadcrumb title="Colors" text="Colors" />

            {copied && <span className="text-green-500 hidden">Copied!</span>}

            <LazyWrapper>
                <div className="row gy-4">
                    <div className="col-12">
                        <Card className="card border-0">
                            <CardContent className="card-body p-0">
                                {/* Shade Start */}
                                <div className="mb-8">
                                    <h6 className="text-base mb-6">Shades</h6>
                                    <div className="flex flex-wrap">
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer max-w-[150px] w-full bg-white relative p-7 grow border border-neutral-200 dark:border-neutral-600"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-neutral-600 block">
                                                    100
                                                </span>
                                                <span
                                                    className="font-medium text-base text-neutral-600 block"
                                                    data-clipboard-text="bg-white"
                                                >
                                                    #FFFFFF
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer max-w-[150px] w-full bg-neutral-900 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-white dark:text-white block">
                                                    100
                                                </span>
                                                <span
                                                    className="font-medium text-base text-white dark:text-white block"
                                                    data-clipboard-text="bg-neutral-900"
                                                >
                                                    #111827
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Shade End */}

                                {/* Neutral Start */}
                                <div className="mb-8">
                                    <h6 className="text-base mb-6">Neutral Color</h6>
                                    <div className="flex flex-wrap">
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-neutral-50 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-neutral-600 dark:text-neutral-600 block">
                                                    50
                                                </span>
                                                <span
                                                    className="font-medium text-base text-neutral-600 dark:text-neutral-600 block"
                                                    data-clipboard-text="bg-neutral-50 dark:bg-neutral-600"
                                                >
                                                    #FAFAFA
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-neutral-100 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-neutral-600 dark:text-neutral-600 block">
                                                    100
                                                </span>
                                                <span
                                                    className="font-medium text-base text-neutral-600 dark:text-neutral-600 block"
                                                    data-clipboard-text="bg-neutral-100"
                                                >
                                                    #F5F5F5
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-neutral-200 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-neutral-600 dark:text-neutral-600 block">
                                                    200
                                                </span>
                                                <span
                                                    className="font-medium text-base text-neutral-600 dark:text-neutral-600 block"
                                                    data-clipboard-text="bg-neutral-200"
                                                >
                                                    #E5E5E5
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-neutral-300 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-neutral-600 dark:text-neutral-600 block">
                                                    300
                                                </span>
                                                <span
                                                    className="font-medium text-base text-neutral-600 dark:text-neutral-600 block"
                                                    data-clipboard-text="bg-neutral-300"
                                                >
                                                    #D4D4D4
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-neutral-400 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-neutral-600 dark:text-neutral-600 d-bloc">
                                                    400
                                                </span>
                                                <span
                                                    className="font-medium text-base text-neutral-600 dark:text-neutral-600 block"
                                                    data-clipboard-text="bg-neutral-400"
                                                >
                                                    #A3A3A3
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-neutral-500 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-white dark:text-white block">
                                                    500
                                                </span>
                                                <span
                                                    className="font-medium text-base text-white dark:text-white block"
                                                    data-clipboard-text="bg-neutral-400"
                                                >
                                                    #737373
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-neutral-600 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-white dark:text-white block">
                                                    600
                                                </span>
                                                <span
                                                    className="font-medium text-base text-white dark:text-white block"
                                                    data-clipboard-text="bg-neutral-600"
                                                >
                                                    #525252
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-neutral-700 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-white dark:text-white block">
                                                    700
                                                </span>
                                                <span
                                                    className="font-medium text-base text-white dark:text-white block"
                                                    data-clipboard-text="bg-neutral-700"
                                                >
                                                    #404040
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-neutral-800 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-white dark:text-white block">
                                                    800
                                                </span>
                                                <span
                                                    className="font-medium text-base text-white dark:text-white block"
                                                    data-clipboard-text="bg-neutral-800"
                                                >
                                                    #262626
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-neutral-900 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-white dark:text-white block">
                                                    900
                                                </span>
                                                <span
                                                    className="font-medium text-base text-white dark:text-white block"
                                                    data-clipboard-text="bg-neutral-900"
                                                >
                                                    #171717
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Neutral End */}

                                {/* blue Start */}
                                <div className="mb-8">
                                    <h6 className="text-base mb-6">Blue Color</h6>
                                    <div className="flex flex-wrap">
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-blue-50 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-neutral-600 dark:text-neutral-600 block">
                                                    50
                                                </span>
                                                <span
                                                    className="font-medium text-base text-neutral-600 dark:text-neutral-600 block"
                                                    data-clipboard-text="bg-blue-50 dark:bg-primary"
                                                >
                                                    #FAFAFA
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-blue-100 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-neutral-600 dark:text-neutral-600 block">
                                                    100
                                                </span>
                                                <span
                                                    className="font-medium text-base text-neutral-600 dark:text-neutral-600 block"
                                                    data-clipboard-text="bg-blue-100"
                                                >
                                                    #F5F5F5
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-blue-200 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-neutral-600 dark:text-neutral-600 block">
                                                    200
                                                </span>
                                                <span
                                                    className="font-medium text-base text-neutral-600 dark:text-neutral-600 block"
                                                    data-clipboard-text="bg-blue-200"
                                                >
                                                    #E5E5E5
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-blue-300 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-neutral-600 dark:text-neutral-600 block">
                                                    300
                                                </span>
                                                <span
                                                    className="font-medium text-base text-neutral-600 dark:text-neutral-600 block"
                                                    data-clipboard-text="bg-blue-300"
                                                >
                                                    #D4D4D4
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-blue-400 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-neutral-600 dark:text-neutral-600 d-bloc">
                                                    400
                                                </span>
                                                <span
                                                    className="font-medium text-base text-neutral-600 dark:text-neutral-600 block"
                                                    data-clipboard-text="bg-blue-400"
                                                >
                                                    #A3A3A3
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-primary relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-white dark:text-white block">
                                                    500
                                                </span>
                                                <span
                                                    className="font-medium text-base text-white dark:text-white block"
                                                    data-clipboard-text="bg-blue-400"
                                                >
                                                    #737373
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-primary relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-white dark:text-white block">
                                                    600
                                                </span>
                                                <span
                                                    className="font-medium text-base text-white dark:text-white block"
                                                    data-clipboard-text="bg-primary"
                                                >
                                                    #525252
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-blue-700 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-white dark:text-white block">
                                                    700
                                                </span>
                                                <span
                                                    className="font-medium text-base text-white dark:text-white block"
                                                    data-clipboard-text="bg-blue-700"
                                                >
                                                    #404040
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-blue-800 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-white dark:text-white block">
                                                    800
                                                </span>
                                                <span
                                                    className="font-medium text-base text-white dark:text-white block"
                                                    data-clipboard-text="bg-blue-800"
                                                >
                                                    #262626
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-blue-900 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-white dark:text-white block">
                                                    900
                                                </span>
                                                <span
                                                    className="font-medium text-base text-white dark:text-white block"
                                                    data-clipboard-text="bg-blue-900"
                                                >
                                                    #171717
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* blue End */}

                                {/* Error Start */}
                                <div className="mb-8">
                                    <h6 className="text-base mb-6">Error Color</h6>
                                    <div className="flex flex-wrap">
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-red-50 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-neutral-600 dark:text-neutral-600 block">
                                                    50
                                                </span>
                                                <span
                                                    className="font-medium text-base text-neutral-600 dark:text-neutral-600 block"
                                                    data-clipboard-text="bg-red-50 dark:bg-red-600"
                                                >
                                                    #FAFAFA
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-red-100 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-neutral-600 dark:text-neutral-600 block">
                                                    100
                                                </span>
                                                <span
                                                    className="font-medium text-base text-neutral-600 dark:text-neutral-600 block"
                                                    data-clipboard-text="bg-red-100"
                                                >
                                                    #F5F5F5
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-red-200 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-neutral-600 dark:text-neutral-600 block">
                                                    200
                                                </span>
                                                <span
                                                    className="font-medium text-base text-neutral-600 dark:text-neutral-600 block"
                                                    data-clipboard-text="bg-red-200"
                                                >
                                                    #E5E5E5
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-red-300 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-neutral-600 dark:text-neutral-600 block">
                                                    300
                                                </span>
                                                <span
                                                    className="font-medium text-base text-neutral-600 dark:text-neutral-600 block"
                                                    data-clipboard-text="bg-red-300"
                                                >
                                                    #D4D4D4
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-red-400 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-neutral-600 dark:text-neutral-600 d-bloc">
                                                    400
                                                </span>
                                                <span
                                                    className="font-medium text-base text-neutral-600 dark:text-neutral-600 block"
                                                    data-clipboard-text="bg-red-400"
                                                >
                                                    #A3A3A3
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-red-500 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-white dark:text-white block">
                                                    500
                                                </span>
                                                <span
                                                    className="font-medium text-base text-white dark:text-white block"
                                                    data-clipboard-text="bg-red-400"
                                                >
                                                    #737373
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-red-600 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-white dark:text-white block">
                                                    600
                                                </span>
                                                <span
                                                    className="font-medium text-base text-white dark:text-white block"
                                                    data-clipboard-text="bg-red-600"
                                                >
                                                    #525252
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-red-700 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-white dark:text-white block">
                                                    700
                                                </span>
                                                <span
                                                    className="font-medium text-base text-white dark:text-white block"
                                                    data-clipboard-text="bg-red-700"
                                                >
                                                    #404040
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-red-800 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-white dark:text-white block">
                                                    800
                                                </span>
                                                <span
                                                    className="font-medium text-base text-white dark:text-white block"
                                                    data-clipboard-text="bg-red-800"
                                                >
                                                    #262626
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-red-900 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-white dark:text-white block">
                                                    900
                                                </span>
                                                <span
                                                    className="font-medium text-base text-white dark:text-white block"
                                                    data-clipboard-text="bg-red-900"
                                                >
                                                    #171717
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Error End */}

                                {/* green Start */}
                                <div className="mb-8">
                                    <h6 className="text-base mb-6">green Color</h6>
                                    <div className="flex flex-wrap">
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-green-50 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-neutral-600 dark:text-neutral-600 block">
                                                    50
                                                </span>
                                                <span
                                                    className="font-medium text-base text-neutral-600 dark:text-neutral-600 block"
                                                    data-clipboard-text="bg-green-50 dark:bg-green-600"
                                                >
                                                    #FAFAFA
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-green-100 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-neutral-600 dark:text-neutral-600 block">
                                                    100
                                                </span>
                                                <span
                                                    className="font-medium text-base text-neutral-600 dark:text-neutral-600 block"
                                                    data-clipboard-text="bg-green-100"
                                                >
                                                    #F5F5F5
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-green-200 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-neutral-600 dark:text-neutral-600 block">
                                                    200
                                                </span>
                                                <span
                                                    className="font-medium text-base text-neutral-600 dark:text-neutral-600 block"
                                                    data-clipboard-text="bg-green-200"
                                                >
                                                    #E5E5E5
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-green-300 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-neutral-600 dark:text-neutral-600 block">
                                                    300
                                                </span>
                                                <span
                                                    className="font-medium text-base text-neutral-600 dark:text-neutral-600 block"
                                                    data-clipboard-text="bg-green-300"
                                                >
                                                    #D4D4D4
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-green-400 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-neutral-600 dark:text-neutral-600 d-bloc">
                                                    400
                                                </span>
                                                <span
                                                    className="font-medium text-base text-neutral-600 dark:text-neutral-600 block"
                                                    data-clipboard-text="bg-green-400"
                                                >
                                                    #A3A3A3
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-green-500 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-white dark:text-white block">
                                                    500
                                                </span>
                                                <span
                                                    className="font-medium text-base text-white dark:text-white block"
                                                    data-clipboard-text="bg-green-400"
                                                >
                                                    #737373
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-green-600 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-white dark:text-white block">
                                                    600
                                                </span>
                                                <span
                                                    className="font-medium text-base text-white dark:text-white block"
                                                    data-clipboard-text="bg-green-600"
                                                >
                                                    #525252
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-green-700 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-white dark:text-white block">
                                                    700
                                                </span>
                                                <span
                                                    className="font-medium text-base text-white dark:text-white block"
                                                    data-clipboard-text="bg-green-700"
                                                >
                                                    #404040
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-green-800 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-white dark:text-white block">
                                                    800
                                                </span>
                                                <span
                                                    className="font-medium text-base text-white dark:text-white block"
                                                    data-clipboard-text="bg-green-800"
                                                >
                                                    #262626
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-green-900 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-white dark:text-white block">
                                                    900
                                                </span>
                                                <span
                                                    className="font-medium text-base text-white dark:text-white block"
                                                    data-clipboard-text="bg-green-900"
                                                >
                                                    #171717
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* green End */}

                                {/* yellow Start */}
                                <div className="mb-8">
                                    <h6 className="text-base mb-6"> Yellow Color</h6>
                                    <div className="flex flex-wrap">
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-yellow-50 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-neutral-600 dark:text-neutral-600 block">
                                                    50
                                                </span>
                                                <span
                                                    className="font-medium text-base text-neutral-600 dark:text-neutral-600 block"
                                                    data-clipboard-text="bg-yellow-50 dark:bg-yellow-600"
                                                >
                                                    #FAFAFA
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-yellow-100 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-neutral-600 dark:text-neutral-600 block">
                                                    100
                                                </span>
                                                <span
                                                    className="font-medium text-base text-neutral-600 dark:text-neutral-600 block"
                                                    data-clipboard-text="bg-yellow-100"
                                                >
                                                    #F5F5F5
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-yellow-200 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-neutral-600 dark:text-neutral-600 block">
                                                    200
                                                </span>
                                                <span
                                                    className="font-medium text-base text-neutral-600 dark:text-neutral-600 block"
                                                    data-clipboard-text="bg-yellow-200"
                                                >
                                                    #E5E5E5
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-yellow-300 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-neutral-600 dark:text-neutral-600 block">
                                                    300
                                                </span>
                                                <span
                                                    className="font-medium text-base text-neutral-600 dark:text-neutral-600 block"
                                                    data-clipboard-text="bg-yellow-300"
                                                >
                                                    #D4D4D4
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-yellow-400 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-neutral-600 dark:text-neutral-600 d-bloc">
                                                    400
                                                </span>
                                                <span
                                                    className="font-medium text-base text-neutral-600 dark:text-neutral-600 block"
                                                    data-clipboard-text="bg-yellow-400"
                                                >
                                                    #A3A3A3
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-yellow-500 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-white dark:text-white block">
                                                    500
                                                </span>
                                                <span
                                                    className="font-medium text-base text-white dark:text-white block"
                                                    data-clipboard-text="bg-yellow-400"
                                                >
                                                    #737373
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-yellow-600 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-white dark:text-white block">
                                                    600
                                                </span>
                                                <span
                                                    className="font-medium text-base text-white dark:text-white block"
                                                    data-clipboard-text="bg-yellow-600"
                                                >
                                                    #525252
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-yellow-700 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-white dark:text-white block">
                                                    700
                                                </span>
                                                <span
                                                    className="font-medium text-base text-white dark:text-white block"
                                                    data-clipboard-text="bg-yellow-700"
                                                >
                                                    #404040
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-yellow-800 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-white dark:text-white block">
                                                    800
                                                </span>
                                                <span
                                                    className="font-medium text-base text-white dark:text-white block"
                                                    data-clipboard-text="bg-yellow-800"
                                                >
                                                    #262626
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-yellow-900 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-white dark:text-white block">
                                                    900
                                                </span>
                                                <span
                                                    className="font-medium text-base text-white dark:text-white block"
                                                    data-clipboard-text="bg-yellow-900"
                                                >
                                                    #171717
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* yellow End */}

                                {/* cyan Start */}
                                <div className="mb-8">
                                    <h6 className="text-base mb-6"> Cyan Color</h6>
                                    <div className="flex flex-wrap">
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-cyan-50 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-neutral-600 dark:text-neutral-600 block">
                                                    50
                                                </span>
                                                <span
                                                    className="font-medium text-base text-cyan-neutral dark:text-neutral-600 block"
                                                    data-clipboard-text="bg-cyan-50 dark:bg-cyan-600"
                                                >
                                                    #FAFAFA
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-cyan-100 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-neutral-600 dark:text-neutral-600 block">
                                                    100
                                                </span>
                                                <span
                                                    className="font-medium text-base text-cyan-neutral dark:text-neutral-600 block"
                                                    data-clipboard-text="bg-cyan-100"
                                                >
                                                    #F5F5F5
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-cyan-200 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-neutral-600 dark:text-neutral-600 block">
                                                    200
                                                </span>
                                                <span
                                                    className="font-medium text-base text-cyan-neutral dark:text-neutral-600 block"
                                                    data-clipboard-text="bg-cyan-200"
                                                >
                                                    #E5E5E5
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-cyan-300 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-neutral-600 dark:text-neutral-600 block">
                                                    300
                                                </span>
                                                <span
                                                    className="font-medium text-base text-cyan-neutral dark:text-neutral-600 block"
                                                    data-clipboard-text="bg-cyan-300"
                                                >
                                                    #D4D4D4
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-cyan-400 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-neutral-600 dark:text-neutral-600 d-bloc">
                                                    400
                                                </span>
                                                <span
                                                    className="font-medium text-base text-cyan-neutral dark:text-neutral-600 block"
                                                    data-clipboard-text="bg-cyan-400"
                                                >
                                                    #A3A3A3
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-cyan-500 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-white dark:text-white block">
                                                    500
                                                </span>
                                                <span
                                                    className="font-medium text-base text-white dark:text-white block"
                                                    data-clipboard-text="bg-cyan-400"
                                                >
                                                    #737373
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-cyan-600 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-white dark:text-white block">
                                                    600
                                                </span>
                                                <span
                                                    className="font-medium text-base text-white dark:text-white block"
                                                    data-clipboard-text="bg-cyan-600"
                                                >
                                                    #525252
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-cyan-700 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-white dark:text-white block">
                                                    700
                                                </span>
                                                <span
                                                    className="font-medium text-base text-white dark:text-white block"
                                                    data-clipboard-text="bg-cyan-700"
                                                >
                                                    #404040
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-cyan-800 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-white dark:text-white block">
                                                    800
                                                </span>
                                                <span
                                                    className="font-medium text-base text-white dark:text-white block"
                                                    data-clipboard-text="bg-cyan-800"
                                                >
                                                    #262626
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleBoxClick}
                                            className="color-box h-[190px] cursor-pointer min-w-[120px] bg-cyan-900 relative p-7 grow"
                                        >
                                            <div className="absolute start-1/2 -translate-x-1/2 bottom-0 text-center mb-7">
                                                <span className="font-medium text-lg text-white dark:text-white block">
                                                    900
                                                </span>
                                                <span
                                                    className="font-medium text-base text-white dark:text-white block"
                                                    data-clipboard-text="bg-cyan-900"
                                                >
                                                    #171717
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* cyan End */}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </LazyWrapper>

        </>
    );
};

export default Colors;