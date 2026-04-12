import LazyWrapper from "@/components/LazyWrapper";
import DefaultCardComponent from '@/components/shared/DefaultCardComponent';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Breadcrumb from "@/layouts/Breadcrumb";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Ellipsis, EllipsisVertical } from 'lucide-react';

const Dropdown = () => {
    return (
        <>
            <Breadcrumb title="Dropdown" text="Dropdown" />

            <LazyWrapper>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                    <DefaultCardComponent title="Basic Dropdown Primary">
                        <div className="flex flex-wrap items-center gap-3">
                            <div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="flex items-center gap-2 text-white bg-primary hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base px-5 py-4 text-center inline-flex items-center dark:bg-primary dark:hover:bg-blue-700 dark:focus:ring-blue-800 !shadow-none !ring-none focus:ring-none !ring-0">
                                        Default Action
                                        <ChevronDown className="w-5 h-5" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-[176px]">
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>Profile</DropdownMenuItem>
                                        <DropdownMenuItem>Billing</DropdownMenuItem>
                                        <DropdownMenuItem>Team</DropdownMenuItem>
                                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="!shadow-none !ring-none focus:ring-none !ring-0 text-primary focus:bg-primary hover:bg-blue-700 border border-primary hover:text-white focus:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base px-5 py-4 text-center inline-flex items-center dark:text-blue-400 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-800">
                                        Outline Action
                                        <ChevronDown className="w-5 h-5" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-[176px]">
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>Profile</DropdownMenuItem>
                                        <DropdownMenuItem>Billing</DropdownMenuItem>
                                        <DropdownMenuItem>Team</DropdownMenuItem>
                                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="!shadow-none !ring-none focus:ring-none !ring-0 bg-blue-50 hover:bg-primary focus:ring-4 focus:outline-none hover:text-white text-primary focus:ring-blue-300 font-medium rounded-lg text-base px-5 py-4 text-center inline-flex items-center dark:bg-primary/25 dark:text-blue-400 dark:hover:text-white dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                        Focus Action
                                        <ChevronDown className="w-5 h-5" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-[176px]">
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>Profile</DropdownMenuItem>
                                        <DropdownMenuItem>Billing</DropdownMenuItem>
                                        <DropdownMenuItem>Team</DropdownMenuItem>
                                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="!shadow-none !ring-none focus:ring-none !ring-0 hover:bg-primary focus:ring-4 focus:outline-none hover:text-white text-primary focus:ring-blue-300 font-medium rounded-lg text-base px-5 py-4 text-center inline-flex items-center dark:text-blue-400 dark:hover:text-white dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                        Default Action
                                        <ChevronDown className="w-5 h-5" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-[176px]">
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>Profile</DropdownMenuItem>
                                        <DropdownMenuItem>Billing</DropdownMenuItem>
                                        <DropdownMenuItem>Team</DropdownMenuItem>
                                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </DefaultCardComponent>

                    <DefaultCardComponent title="Droppop Primary">
                        <div className="flex flex-wrap items-center gap-3">
                            <div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="flex items-center gap-2 text-white bg-primary hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base px-5 py-4 text-center inline-flex items-center dark:bg-primary dark:hover:bg-blue-700 dark:focus:ring-blue-800 !shadow-none !ring-none focus:ring-none !ring-0">
                                        focus Action
                                        <ChevronUp className="w-5 h-5" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent side="top" align="center" className="w-[176px]">
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>Profile</DropdownMenuItem>
                                        <DropdownMenuItem>Billing</DropdownMenuItem>
                                        <DropdownMenuItem>Team</DropdownMenuItem>
                                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="!shadow-none !ring-none focus:ring-none !ring-0 text-primary focus:bg-primary hover:bg-blue-700 border border-primary hover:text-white focus:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base px-5 py-4 text-center inline-flex items-center dark:text-blue-400 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-800">
                                        Outline Action
                                        <ChevronUp className="w-5 h-5" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent side="top" align="center" className="w-[176px]">
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>Profile</DropdownMenuItem>
                                        <DropdownMenuItem>Billing</DropdownMenuItem>
                                        <DropdownMenuItem>Team</DropdownMenuItem>
                                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="!shadow-none !ring-none focus:ring-none !ring-0 bg-blue-50 hover:bg-primary focus:ring-4 focus:outline-none hover:text-white text-primary focus:ring-blue-300 font-medium rounded-lg text-base px-5 py-4 text-center inline-flex items-center dark:bg-primary/25 dark:text-blue-400 dark:hover:text-white dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                        Focus Action
                                        <ChevronUp className="w-5 h-5" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent side="top" align="center" className="w-[176px]">
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>Profile</DropdownMenuItem>
                                        <DropdownMenuItem>Billing</DropdownMenuItem>
                                        <DropdownMenuItem>Team</DropdownMenuItem>
                                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="!shadow-none !ring-none focus:ring-none !ring-0 hover:bg-primary focus:ring-4 focus:outline-none hover:text-white text-primary focus:ring-blue-300 font-medium rounded-lg text-base px-5 py-4 text-center inline-flex items-center dark:text-blue-400 dark:hover:text-white dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                        Focus Action
                                        <ChevronUp className="w-5 h-5" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent side="top" align="center" className="w-[176px]">
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>Profile</DropdownMenuItem>
                                        <DropdownMenuItem>Billing</DropdownMenuItem>
                                        <DropdownMenuItem>Team</DropdownMenuItem>
                                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </DefaultCardComponent>

                    <DefaultCardComponent title="Dropright yellow">
                        <div className="flex flex-wrap items-center gap-3">
                            <div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="flex items-center gap-2 text-white bg-yellow-600 hover:bg-yellow-700 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-base px-5 py-4 text-center inline-flex items-center dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800 !shadow-none !ring-none focus:ring-none !ring-0">
                                        Default Action
                                        <ChevronRight className="w-5 h-5" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent side="right" align="center" className="w-[176px]">
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>Profile</DropdownMenuItem>
                                        <DropdownMenuItem>Billing</DropdownMenuItem>
                                        <DropdownMenuItem>Team</DropdownMenuItem>
                                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="!shadow-none !ring-none focus:ring-none !ring-0 text-yellow-600 focus:bg-yellow-600 hover:bg-yellow-600 border border-yellow-600 hover:text-white focus:text-white focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-base px-5 py-4 text-center inline-flex items-center dark:text-yellow-400 dark:hover:text-white dark:focus:text-white dark:focus:ring-yellow-800">
                                        Outline Action
                                        <ChevronRight className="w-5 h-5" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent side="right" align="center" className="w-[176px]">
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>Profile</DropdownMenuItem>
                                        <DropdownMenuItem>Billing</DropdownMenuItem>
                                        <DropdownMenuItem>Team</DropdownMenuItem>
                                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="!shadow-none !ring-none focus:ring-none !ring-0 bg-yellow-50 hover:bg-yellow-600 focus:ring-4 focus:outline-none hover:text-white text-yellow-600 focus:ring-yellow-300 font-medium rounded-lg text-base px-5 py-4 text-center inline-flex items-center dark:bg-yellow-600/25 dark:text-yellow-400 dark:hover:text-white dark:hover:bg-yellow-700 dark:focus:ring-yellow-800">
                                        Foucs Action
                                        <ChevronRight className="w-5 h-5" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent side="right" align="center" className="w-[176px]">
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>Profile</DropdownMenuItem>
                                        <DropdownMenuItem>Billing</DropdownMenuItem>
                                        <DropdownMenuItem>Team</DropdownMenuItem>
                                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="!shadow-none !ring-none focus:ring-none !ring-0 hover:bg-yellow-600 focus:ring-4 focus:outline-none hover:text-white text-yellow-600 focus:ring-yellow-300 font-medium rounded-lg text-base px-5 py-4 text-center inline-flex items-center dark:text-yellow-400 dark:hover:text-white dark:hover:bg-yellow-700 dark:focus:ring-yellow-800">
                                        Foucs Action
                                        <ChevronRight className="w-5 h-5" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent side="right" align="center" className="w-[176px]">
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>Profile</DropdownMenuItem>
                                        <DropdownMenuItem>Billing</DropdownMenuItem>
                                        <DropdownMenuItem>Team</DropdownMenuItem>
                                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </DefaultCardComponent>

                    <DefaultCardComponent title="Dropleft yellow">
                        <div className="flex flex-wrap items-center gap-3">
                            <div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="flex items-center gap-2 text-white bg-yellow-600 hover:bg-yellow-700 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-base px-5 py-4 text-center inline-flex items-center dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800 !shadow-none !ring-none focus:ring-none !ring-0">
                                        <ChevronLeft className="w-5 h-5" />
                                        Default Action
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent side="left" align="center" className="w-[176px]">
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>Profile</DropdownMenuItem>
                                        <DropdownMenuItem>Billing</DropdownMenuItem>
                                        <DropdownMenuItem>Team</DropdownMenuItem>
                                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="!shadow-none !ring-none focus:ring-none !ring-0 text-yellow-600 focus:bg-yellow-600 hover:bg-yellow-600 border border-yellow-600 hover:text-white focus:text-white focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-base px-5 py-4 text-center inline-flex items-center dark:text-yellow-400 dark:hover:text-white dark:focus:text-white dark:focus:ring-yellow-800">
                                        <ChevronLeft className="w-5 h-5" />
                                        Outline Action
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent side="left" align="center" className="w-[176px]">
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>Profile</DropdownMenuItem>
                                        <DropdownMenuItem>Billing</DropdownMenuItem>
                                        <DropdownMenuItem>Team</DropdownMenuItem>
                                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="!shadow-none !ring-none focus:ring-none !ring-0 bg-yellow-50 hover:bg-yellow-600 focus:ring-4 focus:outline-none hover:text-white text-yellow-600 focus:ring-yellow-300 font-medium rounded-lg text-base px-5 py-4 text-center inline-flex items-center dark:bg-yellow-600/25 dark:text-yellow-400 dark:hover:text-white dark:hover:bg-yellow-700 dark:focus:ring-yellow-800">
                                        <ChevronLeft className="w-5 h-5" />
                                        Focus Action
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent side="left" align="center" className="w-[176px]">
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>Profile</DropdownMenuItem>
                                        <DropdownMenuItem>Billing</DropdownMenuItem>
                                        <DropdownMenuItem>Team</DropdownMenuItem>
                                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="!shadow-none !ring-none focus:ring-none !ring-0 hover:bg-yellow-600 focus:ring-4 focus:outline-none hover:text-white text-yellow-600 focus:ring-yellow-300 font-medium rounded-lg text-base px-5 py-4 text-center inline-flex items-center dark:text-yellow-400 dark:hover:text-white dark:hover:bg-yellow-700 dark:focus:ring-yellow-800">
                                        <ChevronLeft className="w-5 h-5" />
                                        Focus Action
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent side="left" align="center" className="w-[176px]">
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>Profile</DropdownMenuItem>
                                        <DropdownMenuItem>Billing</DropdownMenuItem>
                                        <DropdownMenuItem>Team</DropdownMenuItem>
                                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </DefaultCardComponent>

                    <DefaultCardComponent title="Placement">
                        <div className="flex flex-wrap items-center gap-3">
                            <div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="flex items-center gap-2 text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-base px-5 py-4 text-center inline-flex items-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 !shadow-none !ring-none focus:ring-none !ring-0">
                                        <ChevronLeft className="w-5 h-5" />
                                        Default Action
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent side="bottom" align="center" className="w-[176px]">
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>Profile</DropdownMenuItem>
                                        <DropdownMenuItem>Billing</DropdownMenuItem>
                                        <DropdownMenuItem>Team</DropdownMenuItem>
                                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="!shadow-none !ring-none focus:ring-none !ring-0 text-green-600 focus:bg-green-600 hover:bg-green-600 border border-green-600 hover:text-white focus:text-white focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-base px-5 py-4 text-center inline-flex items-center dark:text-green-400 dark:hover:text-white dark:focus:text-white dark:focus:ring-green-800">
                                        <ChevronLeft className="w-5 h-5" />
                                        Outline Action
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent side="bottom" align="center" className="w-[176px]">
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>Profile</DropdownMenuItem>
                                        <DropdownMenuItem>Billing</DropdownMenuItem>
                                        <DropdownMenuItem>Team</DropdownMenuItem>
                                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="!shadow-none !ring-none focus:ring-none !ring-0 bg-green-50 hover:bg-green-600 focus:ring-4 focus:outline-none hover:text-white text-green-600 focus:ring-green-300 font-medium rounded-lg text-base px-5 py-4 text-center inline-flex items-center dark:bg-green-600/25 dark:text-green-400 dark:hover:text-white dark:hover:bg-green-700 dark:focus:ring-green-800">
                                        <ChevronLeft className="w-5 h-5" />
                                        Focus Action
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent side="bottom" align="center" className="w-[176px]">
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>Profile</DropdownMenuItem>
                                        <DropdownMenuItem>Billing</DropdownMenuItem>
                                        <DropdownMenuItem>Team</DropdownMenuItem>
                                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </DefaultCardComponent>

                    <DefaultCardComponent title="Grouped Dropdown Buttons">
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex">
                                <button className="text-white bg-primary hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-s-lg text-base px-5 py-4 text-center inline-flex items-center dark:bg-primary dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
                                    1
                                </button>
                                <button className="text-white bg-primary hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-base px-5 py-4 text-center inline-flex items-center dark:bg-primary dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
                                    2
                                </button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="flex items-center gap-2 text-white bg-primary hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-e-lg text-base px-5 py-4 text-center inline-flex items-center dark:bg-primary dark:hover:bg-blue-700 dark:focus:ring-blue-800 !shadow-none !ring-none focus:ring-none !ring-0">
                                        Default Action
                                        <ChevronDown className="w-5 h-5" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent side="bottom" align="center" className="w-[176px]">
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>Profile</DropdownMenuItem>
                                        <DropdownMenuItem>Billing</DropdownMenuItem>
                                        <DropdownMenuItem>Team</DropdownMenuItem>
                                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div className="flex">
                                <button className="hover:bg-yellow-600 border hover:text-white border-yellow-600 text-yellow-600  focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-s-lg text-base px-5 py-4 text-center inline-flex items-center dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800" type="button">
                                    1
                                </button>
                                <button className="hover:bg-yellow-600 border border-x-0 hover:text-white border-yellow-600 text-yellow-600  focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium text-base px-5 py-4 text-center inline-flex items-center dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800" type="button">
                                    2
                                </button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="flex items-center gap-2 hover:bg-yellow-600 border hover:text-white border-yellow-600 text-yellow-600  focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-e-lg text-base px-5 py-4 text-center inline-flex items-center dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800 !shadow-none !ring-none focus:ring-none !ring-0">
                                        Default Action
                                        <ChevronDown className="w-5 h-5" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent side="bottom" align="center" className="w-[176px]">
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>Profile</DropdownMenuItem>
                                        <DropdownMenuItem>Billing</DropdownMenuItem>
                                        <DropdownMenuItem>Team</DropdownMenuItem>
                                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </DefaultCardComponent>

                    <DefaultCardComponent title="Custom Dropdown">
                        <div className="flex flex-wrap items-center gap-3 justify-between">
                            <div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="flex items-center gap-2 text-neutral-600 dark:text-white text-xl d-flex items-center justify-center w-10 h-10 ring-4 ring-transparent focus:ring-primary-300 rounded-lg">
                                        <EllipsisVertical className="w-5 h-5" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent side="top" align="center" className="w-[176px]">
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>Profile</DropdownMenuItem>
                                        <DropdownMenuItem>Billing</DropdownMenuItem>
                                        <DropdownMenuItem>Team</DropdownMenuItem>
                                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="flex items-center gap-2 text-neutral-600 dark:text-white text-xl d-flex items-center justify-center w-10 h-10 ring-4 ring-transparent focus:ring-primary-300 rounded-lg">
                                        <Ellipsis className="w-5 h-5" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent side="left" align="center" className="w-[176px]">
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>Profile</DropdownMenuItem>
                                        <DropdownMenuItem>Billing</DropdownMenuItem>
                                        <DropdownMenuItem>Team</DropdownMenuItem>
                                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="flex items-center gap-2 text-neutral-600 dark:text-white text-xl d-flex items-center justify-center w-10 h-10 ring-4 ring-transparent focus:ring-primary-300 rounded-lg">
                                        <EllipsisVertical className="w-5 h-5" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent side="bottom" align="center" className="w-[176px]">
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>Profile</DropdownMenuItem>
                                        <DropdownMenuItem>Billing</DropdownMenuItem>
                                        <DropdownMenuItem>Team</DropdownMenuItem>
                                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="flex items-center gap-2 text-neutral-600 dark:text-white text-xl d-flex items-center justify-center w-10 h-10 ring-4 ring-transparent focus:ring-primary-300 rounded-lg">
                                        <Ellipsis className="w-5 h-5" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent side="right" align="center" className="w-[176px]">
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>Profile</DropdownMenuItem>
                                        <DropdownMenuItem>Billing</DropdownMenuItem>
                                        <DropdownMenuItem>Team</DropdownMenuItem>
                                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </DefaultCardComponent>

                    <DefaultCardComponent title="Dropdown Sizes">
                        <div className="flex flex-wrap items-center gap-3">
                            <div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="flex items-center gap-2 text-white bg-primary hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base px-5 py-4 text-center inline-flex items-center dark:bg-primary dark:hover:bg-blue-700 dark:focus:ring-blue-800 !shadow-none !ring-none focus:ring-none !ring-0">
                                        Default Action
                                        <ChevronDown className="w-5 h-5" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-[176px]">
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>Profile</DropdownMenuItem>
                                        <DropdownMenuItem>Billing</DropdownMenuItem>
                                        <DropdownMenuItem>Team</DropdownMenuItem>
                                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="flex items-center gap-2 text-white bg-primary hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base px-5 py-3 text-center inline-flex items-center dark:bg-primary dark:hover:bg-blue-700 dark:focus:ring-blue-800 !shadow-none !ring-none focus:ring-none !ring-0">
                                        Default Action
                                        <ChevronDown className="w-5 h-5" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-[176px]">
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>Profile</DropdownMenuItem>
                                        <DropdownMenuItem>Billing</DropdownMenuItem>
                                        <DropdownMenuItem>Team</DropdownMenuItem>
                                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="flex items-center gap-2 text-white bg-primary hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base px-5 py-2 text-center inline-flex items-center dark:bg-primary dark:hover:bg-blue-700 dark:focus:ring-blue-800 !shadow-none !ring-none focus:ring-none !ring-0">
                                        Default Action
                                        <ChevronDown className="w-5 h-5" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-[176px]">
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>Profile</DropdownMenuItem>
                                        <DropdownMenuItem>Billing</DropdownMenuItem>
                                        <DropdownMenuItem>Team</DropdownMenuItem>
                                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                        </div>
                    </DefaultCardComponent>
                </div>
            </LazyWrapper>
        </>
    );
};

export default Dropdown;