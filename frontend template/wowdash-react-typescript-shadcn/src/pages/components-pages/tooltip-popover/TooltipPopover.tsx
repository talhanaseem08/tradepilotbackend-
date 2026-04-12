import LazyWrapper from "@/components/LazyWrapper";
import DefaultCardComponent from "@/components/shared/DefaultCardComponent";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import Breadcrumb from "@/layouts/Breadcrumb";
import { CircleHelp } from "lucide-react";

const TooltipPopover = () => {
    return (
        <>
            <Breadcrumb title="TooltipPopover" text="TooltipPopover" />

            <LazyWrapper>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <DefaultCardComponent title="Default Tooltip">
                        <div className="flex flex-wrap items-center gap-3">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button type="button" className="h-[46px] bg-purple-600/10 hover:bg-purple-600/25 text-purple-600 dark:text-purple-400 rounded-lg px-8 py-[11px]">
                                            Secondary
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Tooltip Secondary</p>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button type="button" className="h-[46px] bg-green-600/10 hover:bg-green-600/25 text-green-600 dark:text-green-400 rounded-lg px-8 py-[11px]">
                                            Success
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Tooltip Success</p>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button type="button" className="h-[46px] bg-cyan-600/10 hover:bg-cyan-600/25 text-cyan-600 dark:text-cyan-400 rounded-lg px-8 py-[11px]">
                                            Info
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Tooltip Info</p>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button type="button" className="h-[46px] bg-yellow-600/10 hover:bg-yellow-600/25 text-yellow-600 dark:text-yellow-400 rounded-lg px-8 py-[11px]">
                                            Warning
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Tooltip Warning</p>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button type="button" className="h-[46px] bg-red-600/10 hover:bg-red-600/25 text-red-600 dark:text-red-400 rounded-lg px-8 py-[11px]">
                                            Danger
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Tooltip Danger</p>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button type="button" className="h-[46px] bg-slate-600/10 hover:bg-slate-600/25 text-neutral-600 dark:text-neutral-400 rounded-lg px-8 py-[11px]">
                                            Dark
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Tooltip Dark</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </DefaultCardComponent>

                    <DefaultCardComponent title="Default Position">
                        <div className="flex flex-wrap items-center gap-3">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button type="button" className="h-[46px] btn border border-neutral-400 bg-transparent text-neutral-600 dark:text-neutral-200 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg px-8 py-[11px]">
                                            Tooltip On Top
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" align="center">
                                        <p>Tooltip On Top</p>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button type="button" className="h-[46px] btn border border-neutral-400 bg-transparent text-neutral-600 dark:text-neutral-200 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg px-8 py-[11px]">
                                            Tooltip On Right
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" align="center">
                                        <p>Tooltip On Right</p>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button type="button" className="h-[46px] btn border border-neutral-400 bg-transparent text-neutral-600 dark:text-neutral-200 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg px-8 py-[11px]">
                                            Tooltip On Left
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="left" align="center">
                                        <p>Tooltip On Left</p>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button type="button" className="h-[46px] btn border border-neutral-400 bg-transparent text-neutral-600 dark:text-neutral-200 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg px-8 py-[11px]">
                                            Tooltip On bottom
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom" align="center">
                                        <p>Tooltip On bottom</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </DefaultCardComponent>

                    <DefaultCardComponent title="Tooltip Animation">
                        <div className="flex flex-wrap items-center gap-3">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button type="button" className="h-[46px] btn border bg-transparent border-purple-600 hover:bg-purple-600/10 text-purple-600 dark:text-purple-400 rounded-lg px-8 py-[11px]">
                                            Secondary
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Tooltip Secondary</p>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button type="button" className="h-[46px] btn border bg-transparent border-green-600 hover:bg-green-600/10 text-green-600 dark:text-green-400 rounded-lg px-8 py-[11px]">
                                            Success
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Tooltip Success</p>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button type="button" className="h-[46px] btn border bg-transparent border-cyan-600 hover:bg-cyan-600/10 text-cyan-600 dark:text-cyan-400 rounded-lg px-8 py-[11px]">
                                            Info
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Tooltip Info</p>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button type="button" className="h-[46px] btn border bg-transparent border-yellow-600 hover:bg-yellow-600/10 text-yellow-600 dark:text-yellow-400 rounded-lg px-8 py-[11px]">
                                            Warning
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Tooltip Warning</p>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button type="button" className="h-[46px] btn border bg-transparent border-red-600 hover:bg-red-600/10 text-red-600 dark:text-red-400 rounded-lg px-8 py-[11px]">
                                            Danger
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Tooltip Danger</p>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button type="button" className="h-[46px] btn border bg-transparent border-neutral-600 hover:bg-slate-600/10 text-neutral-600 dark:text-neutral-400 rounded-lg px-8 py-[11px]">
                                            Dark
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Tooltip Dark</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </DefaultCardComponent>

                    <DefaultCardComponent title="Tooltip Popover Positions">
                        <div className="flex flex-wrap items-center gap-3">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button type="button" className="h-[46px] btn bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-8 py-[11px]">
                                            Secondary
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="tooltip-arrow-white max-w-[255px] bg-white border border-gray-200 rounded-lg dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800 shadow-lg">
                                        <div className="px-3 py-2 w-full">
                                            <h6 className="font-semibold text-lg mb-1 text-gray-900 dark:text-white">Title Secondary</h6>
                                            <p className="text-neutral-900 dark:text-white">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button type="button" className="h-[46px] btn bg-green-600 hover:bg-green-700 text-white rounded-lg px-8 py-[11px]">
                                            Success
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="tooltip-arrow-white max-w-[255px] bg-white border border-gray-200 rounded-lg dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800 shadow-lg">
                                        <div className="px-3 py-2 w-full">
                                            <h6 className="font-semibold text-lg mb-1 text-gray-900 dark:text-white">Title Success</h6>
                                            <p className="text-neutral-900 dark:text-white">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button type="button" className="h-[46px] btn bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg px-8 py-[11px]">
                                            Info
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="tooltip-arrow-white max-w-[255px] bg-white border border-gray-200 rounded-lg dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800 shadow-lg">
                                        <div className="px-3 py-2 w-full">
                                            <h6 className="font-semibold text-lg mb-1 text-gray-900 dark:text-white">Title Info</h6>
                                            <p className="text-neutral-900 dark:text-white">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button type="button" className="h-[46px] btn bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg px-8 py-[11px]">
                                            Warning
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="tooltip-arrow-white max-w-[255px] bg-white border border-gray-200 rounded-lg dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800 shadow-lg">
                                        <div className="px-3 py-2 w-full">
                                            <h6 className="font-semibold text-lg mb-1 text-gray-900 dark:text-white">Title Warning</h6>
                                            <p className="text-neutral-900 dark:text-white">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button type="button" className="h-[46px] btn bg-red-600 hover:bg-red-700 text-white rounded-lg px-8 py-[11px]">
                                            Danger
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="tooltip-arrow-white max-w-[255px] bg-white border border-gray-200 rounded-lg dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800 shadow-lg">
                                        <div className="px-3 py-2 w-full">
                                            <h6 className="font-semibold text-lg mb-1 text-gray-900 dark:text-white">Title Danger</h6>
                                            <p className="text-neutral-900 dark:text-white">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button type="button" className="h-[46px] btn bg-slate-600 hover:bg-slate-700 text-white rounded-lg px-8 py-[11px]">
                                            Dark
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="tooltip-arrow-white max-w-[255px] bg-white border border-gray-200 rounded-lg dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800 shadow-lg">
                                        <div className="px-3 py-2 w-full">
                                            <h6 className="font-semibold text-lg mb-1 text-gray-900 dark:text-white">Title Dark</h6>
                                            <p className="text-neutral-900 dark:text-white">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </DefaultCardComponent>

                    <DefaultCardComponent title="Tooltip Text popup">
                        <TooltipProvider>
                            <div className="flex flex-wrap items-center gap-3">
                                <ul className="list-decimal ps-5">
                                    <li className="text-neutral-500 dark:text-neutral-300">
                                        This is tooltip text
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button type="button" variant="link" className="text-primary !p-0 ms-1">
                                                    popup
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent side="right" className="tooltip-arrow-hidden max-w-[255px] bg-white border border-primary rounded-lg dark:text-blue-400 dark:border-primary dark:bg-[#1e2939] shadow-lg">
                                                <div className="px-3 py-2 w-full">
                                                    <h6 className="font-semibold text-lg mb-1 text-gray-900 dark:text-white">Title Secondary</h6>
                                                    <p className="text-neutral-900 dark:text-white">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    </li>
                                    <li className="text-neutral-500 dark:text-neutral-300">
                                        This is tooltip text
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button type="button" variant="link" className="text-primary !p-0 ms-1">
                                                    popup
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent side="right" className="tooltip-arrow-hidden max-w-[255px] bg-white border border-primary rounded-lg dark:text-blue-400 dark:border-primary dark:bg-[#1e2939] shadow-lg">
                                                <div className="px-3 py-2 w-full">
                                                    <h6 className="font-semibold text-lg mb-1 text-gray-900 dark:text-white">Title Secondary</h6>
                                                    <p className="text-neutral-900 dark:text-white">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    </li>
                                    <li className="text-neutral-500 dark:text-neutral-300">
                                        This is tooltip text
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button type="button" variant="link" className="text-primary !p-0 ms-1">
                                                    popup
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent side="right" className="tooltip-arrow-hidden max-w-[255px] bg-white border border-primary rounded-lg dark:text-blue-400 dark:border-primary dark:bg-[#1e2939] shadow-lg">
                                                <div className="px-3 py-2 w-full">
                                                    <h6 className="font-semibold text-lg mb-1 text-gray-900 dark:text-white">Title Secondary</h6>
                                                    <p className="text-neutral-900 dark:text-white">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    </li>
                                    <li className="text-neutral-500 dark:text-neutral-300">
                                        This is tooltip text
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button type="button" variant="link" className="text-primary !p-0 ms-1">
                                                    popup
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent side="right" className="tooltip-arrow-hidden max-w-[255px] bg-white border border-primary rounded-lg dark:text-blue-400 dark:border-primary dark:bg-[#1e2939] shadow-lg">
                                                <div className="px-3 py-2 w-full">
                                                    <h6 className="font-semibold text-lg mb-1 text-gray-900 dark:text-white">Title Secondary</h6>
                                                    <p className="text-neutral-900 dark:text-white">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    </li>
                                    <li className="text-neutral-500 dark:text-neutral-300">
                                        This is tooltip text
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button type="button" variant="link" className="text-primary !p-0 ms-1">
                                                    popup
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent className="tooltip-arrow-hidden max-w-[255px] bg-white border border-primary rounded-lg dark:text-blue-400 dark:border-primary dark:bg-[#1e2939] shadow-lg">
                                                <div className="px-3 py-2 w-full">
                                                    <h6 className="font-semibold text-lg mb-1 text-gray-900 dark:text-white">Title Secondary</h6>
                                                    <p className="text-neutral-900 dark:text-white">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    </li>
                                </ul>
                            </div>
                        </TooltipProvider>
                    </DefaultCardComponent>

                    <DefaultCardComponent title="Tooltip Text with icon popup">
                        <TooltipProvider>
                            <div className="flex flex-wrap items-center gap-3">
                                <ul className="list-decimal ps-5">
                                    <li className="text-neutral-500 dark:text-neutral-300">
                                        This is tooltip text
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button type="button" variant="link" className="text-neutral-900 dark:text-white !p-0 ms-1">
                                                    <CircleHelp />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent side="right" className="tooltip-arrow-hidden max-w-[255px] bg-primary text-white border border-primary rounded-lg dark:text-blue-400 dark:border-primary dark:bg-primary shadow-lg">
                                                <div className="px-3 py-2 w-full">
                                                    <h6 className="font-semibold text-lg mb-1 text-white dark:text-white">Title Secondary</h6>
                                                    <p className="text-neutral-900 text-white dark:text-white">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    </li>
                                    <li className="text-neutral-500 dark:text-neutral-300">
                                        This is tooltip text
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button type="button" variant="link" className="text-neutral-900 dark:text-white !p-0 ms-1">
                                                    <CircleHelp />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent side="right" className="tooltip-arrow-hidden max-w-[255px] bg-primary text-white border border-primary rounded-lg dark:text-blue-400 dark:border-primary dark:bg-primary shadow-lg">
                                                <div className="px-3 py-2 w-full">
                                                    <h6 className="font-semibold text-lg mb-1 text-white dark:text-white">Title Secondary</h6>
                                                    <p className="text-neutral-900 text-white dark:text-white">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    </li>
                                    <li className="text-neutral-500 dark:text-neutral-300">
                                        This is tooltip text
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button type="button" variant="link" className="text-neutral-900 dark:text-white !p-0 ms-1">
                                                    <CircleHelp />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent side="right" className="tooltip-arrow-hidden max-w-[255px] bg-primary text-white border border-primary rounded-lg dark:text-blue-400 dark:border-primary dark:bg-primary shadow-lg">
                                                <div className="px-3 py-2 w-full">
                                                    <h6 className="font-semibold text-lg mb-1 text-white dark:text-white">Title Secondary</h6>
                                                    <p className="text-neutral-900 text-white dark:text-white">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    </li>
                                    <li className="text-neutral-500 dark:text-neutral-300">
                                        This is tooltip text
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button type="button" variant="link" className="text-neutral-900 dark:text-white !p-0 ms-1">
                                                    <CircleHelp />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent side="right" className="tooltip-arrow-hidden max-w-[255px] bg-primary text-white border border-primary rounded-lg dark:text-blue-400 dark:border-primary dark:bg-primary shadow-lg">
                                                <div className="px-3 py-2 w-full">
                                                    <h6 className="font-semibold text-lg mb-1 text-white dark:text-white">Title Secondary</h6>
                                                    <p className="text-neutral-900 text-white dark:text-white">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    </li>
                                    <li className="text-neutral-500 dark:text-neutral-300">
                                        This is tooltip text
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button type="button" variant="link" className="text-neutral-900 dark:text-white !p-0 ms-1">
                                                    <CircleHelp />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent side="right" className="tooltip-arrow-hidden max-w-[255px] bg-primary text-white border border-primary rounded-lg dark:text-blue-400 dark:border-primary dark:bg-primary shadow-lg">
                                                <div className="px-3 py-2 w-full">
                                                    <h6 className="font-semibold text-lg mb-1 text-white dark:text-white">Title Secondary</h6>
                                                    <p className="text-neutral-900 text-white dark:text-white">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    </li>
                                </ul>
                            </div>
                        </TooltipProvider>
                    </DefaultCardComponent>
                </div>
            </LazyWrapper>

        </>
    );
};

export default TooltipPopover;