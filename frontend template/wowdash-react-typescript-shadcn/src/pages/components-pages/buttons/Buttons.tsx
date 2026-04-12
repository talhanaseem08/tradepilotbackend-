import LazyWrapper from "@/components/LazyWrapper";
import DefaultCardComponent from "@/components/shared/DefaultCardComponent";
import { Button } from "@/components/ui/button";
import Breadcrumb from "@/layouts/Breadcrumb";
import { cn } from "@/lib/utils";
import { ArrowDownSquare, ArrowLeftSquare, ArrowRightSquare, ArrowUpSquare } from 'lucide-react';

const Buttons = () => {
    return (
        <>
            <Breadcrumb title="Buttons" text="Buttons" />

            <LazyWrapper>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <DefaultCardComponent title="Default Buttons">
                        <div className="flex flex-wrap items-center gap-3">
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-primary hover:bg-blue-700 text-white rounded-lg px-5 py-[11px]"
                                )}
                            >
                                Primary
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-5 py-[11px]"
                                )}
                            >
                                Secondary
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-green-600 hover:bg-green-700 text-white rounded-lg px-5 py-[11px]"
                                )}
                            >
                                Success
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg px-5 py-[11px]"
                                )}
                            >
                                Info
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg px-5 py-[11px]"
                                )}
                            >
                                Warning
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-red-600 hover:bg-red-700 text-white rounded-lg px-5 py-[11px]"
                                )}
                            >
                                Danger
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-neutral-900 hover:bg-neutral-700 text-white text-base rounded-lg px-5 py-[11px]"
                                )}
                            >
                                Dark
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] hover:text-primary text-neutral-500 dark:text-neutral-300 text-decoration-none rounded-lg px-5 py-[11px]"
                                )}
                                variant="link"
                            >
                                Link
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-light-100 hover:bg-neutral-200 dark:bg-neutral-600 dark:hover:bg-neutral-500 text-dark rounded-lg px-5 py-[11px]"
                                )}
                            >
                                Light
                            </Button>
                        </div>
                    </DefaultCardComponent>

                    <DefaultCardComponent title="Outline Buttons">
                        <div className="flex flex-wrap items-center gap-3">
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-transparent border border-primary text-primary hover:bg-primary hover:text-white rounded-lg px-5 py-[11px]"
                                )}
                            >
                                Primary
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-transparent border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white rounded-lg px-5 py-[11px]"
                                )}
                            >
                                Secondary
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-transparent border border-green-600 text-green-600 hover:bg-green-600 hover:text-white rounded-lg px-5 py-[11px]"
                                )}
                            >
                                Success
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-transparent border border-cyan-600 text-cyan-600 hover:bg-cyan-600 hover:text-white rounded-lg px-5 py-[11px]"
                                )}
                            >
                                Info
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-transparent border border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white rounded-lg px-5 py-[11px]"
                                )}
                            >
                                Warning
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-transparent border border-red-600 text-red-600 hover:bg-red-600 hover:text-white rounded-lg px-5 py-[11px]"
                                )}
                            >
                                Danger
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-transparent border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white rounded-lg px-5 py-[11px]"
                                )}
                            >
                                Dark
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-transparent hover:text-primary text-neutral-500 dark:text-neutral-300 text-decoration-none rounded-lg px-5 py-[11px]"
                                )}
                                variant="link"
                            >
                                Link
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-transparent border border-neutral-200 text-neutral-500 hover:bg-neutral-200 text-dark rounded-lg px-5 py-[11px]"
                                )}
                            >
                                Light
                            </Button>
                        </div>
                    </DefaultCardComponent>

                    <DefaultCardComponent title="Rounded Buttons">
                        <div className="flex flex-wrap items-center gap-3">
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-primary hover:bg-blue-700 text-white rounded-full px-5 py-[11px]"
                                )}
                            >
                                Primary
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-purple-600 hover:bg-purple-700 text-white rounded-full px-5 py-[11px]"
                                )}
                            >
                                Secondary
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-green-600 hover:bg-green-700 text-white rounded-full px-5 py-[11px]"
                                )}
                            >
                                Success
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-cyan-600 hover:bg-cyan-700 text-white rounded-full px-5 py-[11px]"
                                )}
                            >
                                Info
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-yellow-500 hover:bg-yellow-600 text-white rounded-full px-5 py-[11px]"
                                )}
                            >
                                Warning
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-red-600 hover:bg-red-700 text-white rounded-full px-5 py-[11px]"
                                )}
                            >
                                Danger
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-neutral-900 hover:bg-neutral-700 text-white text-base rounded-full px-5 py-[11px]"
                                )}
                            >
                                Dark
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] hover:text-primary text-neutral-500 dark:text-neutral-300 text-decoration-none rounded-full px-5 py-[11px]"
                                )}
                                variant="link"
                            >
                                Link
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-light-100 hover:bg-neutral-200 dark:bg-neutral-600 dark:hover:bg-neutral-500 text-dark rounded-full px-5 py-[11px]"
                                )}
                            >
                                Light
                            </Button>
                        </div>
                    </DefaultCardComponent>

                    <DefaultCardComponent title="Rounded Buttons">
                        <div className="flex flex-wrap items-center gap-3">
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-transparent border border-primary text-primary hover:bg-primary hover:text-white rounded-full px-5 py-[11px]"
                                )}
                            >
                                Primary
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-transparent border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white rounded-full px-5 py-[11px]"
                                )}
                            >
                                Secondary
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-transparent border border-green-600 text-green-600 hover:bg-green-600 hover:text-white rounded-full px-5 py-[11px]"
                                )}
                            >
                                Success
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-transparent border border-cyan-600 text-cyan-600 hover:bg-cyan-600 hover:text-white rounded-full px-5 py-[11px]"
                                )}
                            >
                                Info
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-transparent border border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white rounded-full px-5 py-[11px]"
                                )}
                            >
                                Warning
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-transparent border border-red-600 text-red-600 hover:bg-red-600 hover:text-white rounded-full px-5 py-[11px]"
                                )}
                            >
                                Danger
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-transparent border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white rounded-full px-5 py-[11px]"
                                )}
                            >
                                Dark
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-transparent hover:text-primary text-neutral-500 dark:text-neutral-300 text-decoration-none rounded-full px-5 py-[11px]"
                                )}
                                variant="link"
                            >
                                Link
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-transparent border border-neutral-200 text-neutral-500 hover:bg-neutral-200 text-dark rounded-full px-5 py-[11px]"
                                )}
                            >
                                Light
                            </Button>
                        </div>
                    </DefaultCardComponent>

                    <DefaultCardComponent title="Soft Buttons">
                        <div className="flex flex-wrap items-center gap-3">
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-blue-100 dark:bg-primary/25 dark:hover:bg-primary hover:bg-primary text-primary hover:text-white rounded-full px-5 py-[11px]"
                                )}
                            >
                                Primary
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-purple-100 dark:bg-purple-600/25 dark:hover:bg-purple-600 hover:bg-purple-600 text-purple-600 hover:text-white rounded-full px-5 py-[11px]"
                                )}
                            >
                                Secondary
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-green-100 dark:bg-green-600/25 dark:hover:bg-green-600 hover:bg-green-600 text-green-600 hover:text-white rounded-full px-5 py-[11px]"
                                )}
                            >
                                Success
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-cyan-100 dark:bg-cyan-600/25 dark:hover:bg-cyan-600 hover:bg-cyan-600 text-cyan-600 hover:text-white rounded-full px-5 py-[11px]"
                                )}
                            >
                                Info
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-yellow-100 dark:bg-yellow-500/25 dark:hover:bg-yellow-500 hover:bg-yellow-500 text-yellow-600 hover:text-white rounded-full px-5 py-[11px]"
                                )}
                            >
                                Warning
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-red-100 dark:bg-red-600/25 dark:hover:bg-red-600 hover:bg-red-600 text-red-600 hover:text-white rounded-full px-5 py-[11px]"
                                )}
                            >
                                Danger
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-neutral-100 dark:bg-neutral-600/50 dark:hover:bg-neutral-600 hover:bg-neutral-600 text-neutral-500 hover:text-white text-base rounded-full px-5 py-[11px]"
                                )}
                            >
                                Dark
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] hover:text-primary text-neutral-500 dark:text-neutral-300 text-decoration-none rounded-full px-5 py-[11px]"
                                )}
                                variant="link"
                            >
                                Link
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-light-100 dark:bg-light-600/25 hover:bg-neutral-200 dark:bg-neutral-600 dark:hover:bg-neutral-500 text-dark rounded-full px-5 py-[11px]"
                                )}
                            >
                                Light
                            </Button>
                        </div>
                    </DefaultCardComponent>

                    <DefaultCardComponent title="Text Buttons">
                        <div className="flex flex-wrap items-center gap-3">
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-transparent hover:bg-transparent text-primary rounded-full px-5 py-[11px]"
                                )}
                            >
                                Primary
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-transparent hover:bg-transparent text-purple-600 rounded-full px-5 py-[11px]"
                                )}
                            >
                                Secondary
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-transparent hover:bg-transparent text-green-600 rounded-full px-5 py-[11px]"
                                )}
                            >
                                Success
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-transparent hover:bg-transparent text-cyan-600 rounded-full px-5 py-[11px]"
                                )}
                            >
                                Info
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-transparent hover:bg-transparent text-yellow-600 rounded-full px-5 py-[11px]"
                                )}
                            >
                                Warning
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-transparent hover:bg-transparent text-red-600 rounded-full px-5 py-[11px]"
                                )}
                            >
                                Danger
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-transparent hover:bg-transparent text-neutral-600 text-base rounded-full px-5 py-[11px]"
                                )}
                            >
                                Dark
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-transparent hover:bg-transparent hover:text-primary text-neutral-500 dark:text-neutral-300 text-decoration-none rounded-full px-5 py-[11px]"
                                )}
                                variant="link"
                            >
                                Link
                            </Button>
                            <Button
                                type="button"
                                className={cn("h-[46px] bg-transparent hover:bg-transparent text-dark rounded-full px-5 py-[11px]")}
                            >
                                Light
                            </Button>
                        </div>
                    </DefaultCardComponent>

                    <DefaultCardComponent title="Buttons with Label">
                        <div className="flex flex-wrap items-center gap-3">
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] btn-blue-600 rounded-lg px-5 py-[11px] flex items-center gap-2"
                                )}
                            >
                                <ArrowLeftSquare className="text-xl" /> Left Icon
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-transparent border border-primary text-primary hover:bg-primary hover:text-white rounded-lg px-5 py-[11px] flex items-center gap-2"
                                )}
                            >
                                <ArrowLeftSquare className="text-xl" /> Left Icon
                            </Button>

                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-green-600 hover:bg-green-700 text-white rounded-lg px-5 py-[11px] flex items-center gap-2"
                                )}
                            >
                                Right Icon
                                <ArrowRightSquare className="text-xl" />
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-transparent border border-green-600 text-green-600 hover:bg-green-600 hover:text-white rounded-lg px-5 py-[11px] flex items-center gap-2"
                                )}
                            >
                                Right Icon
                                <ArrowRightSquare className="text-xl" />
                            </Button>

                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-yellow-500 hover:bg-yellow-600 text-white w-[60px] h-[50px] flex items-center justify-center gap-2"
                                )}
                            >
                                <ArrowUpSquare className="text-xl" />
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] border bg-transparent border-primary text-primary hover:bg-primary hover:text-white w-[60px] h-[50px] flex items-center justify-center gap-2"
                                )}
                            >
                                <ArrowDownSquare className="text-xl" />
                            </Button>
                        </div>
                    </DefaultCardComponent>

                    <DefaultCardComponent title=" Buttons with Label Round">
                        <div className="flex flex-wrap items-center gap-3">
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] btn-blue-600 rounded-full px-5 py-[11px] flex items-center gap-2"
                                )}
                            >
                                <ArrowLeftSquare className="text-xl" /> Left Icon
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-transparent border border-primary text-primary hover:bg-primary hover:text-white rounded-full px-5 py-[11px] flex items-center gap-2"
                                )}
                            >
                                <ArrowLeftSquare className="text-xl" /> Left Icon
                            </Button>

                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-green-600 hover:bg-green-700 text-white rounded-full px-5 py-[11px] flex items-center gap-2"
                                )}
                            >
                                Right Icon
                                <ArrowRightSquare className="text-xl" />
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-transparent border border-green-600 text-green-600 hover:bg-green-600 hover:text-white rounded-full px-5 py-[11px] flex items-center gap-2"
                                )}
                            >
                                Right Icon
                                <ArrowRightSquare className="text-xl" />
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-yellow-500 hover:bg-yellow-600 text-white rounded-full w-[60px] h-[50px] flex items-center justify-center gap-2"
                                )}
                            >
                                <ArrowUpSquare className="text-xl" />
                            </Button>
                            <Button
                                type="button"
                                className={cn(
                                    "h-[46px] bg-transparent border border-primary text-primary hover:bg-primary hover:text-white rounded-full w-[60px] h-[50px] flex items-center justify-center gap-2"
                                )}
                            >
                                <ArrowDownSquare className="text-xl" />
                            </Button>
                        </div>
                    </DefaultCardComponent>

                    <DefaultCardComponent title="Buttons Sizes">5        </DefaultCardComponent>

                    <DefaultCardComponent title="Custom Button">
                        <Button
                            type="button"
                            className={cn("h-[46px] btn-blue-600 rounded-lg px-5 py-[11px]")}
                        >
                            Custom Button
                        </Button>
                    </DefaultCardComponent>
                </div>
            </LazyWrapper>

        </>
    );
};

export default Buttons;