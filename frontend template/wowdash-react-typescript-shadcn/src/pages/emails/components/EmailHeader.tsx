import SearchBox from "@/components/shared/SearchBox";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronLeft, ChevronRight, EllipsisVertical, MailOpen, RotateCw, Trash2 } from "lucide-react";

const EmailHeader = () => {
    return (
        <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <div className="flex items-center">
                    <Checkbox
                        className="border border-neutral-500 w-4 h-4"
                    />
                    <div className="">
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <ChevronDown className="w-5 h-5 fill-black dark:fill-white stroke-none" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>All</DropdownMenuItem>
                                <DropdownMenuItem>None</DropdownMenuItem>
                                <DropdownMenuItem>Read</DropdownMenuItem>
                                <DropdownMenuItem>Unread</DropdownMenuItem>
                                <DropdownMenuItem>Starred</DropdownMenuItem>
                                <DropdownMenuItem>Unstarred</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <Button variant="link" className="!p-0 bg-transparent text-neutral-800 dark:text-white flex">
                    <Trash2 className="w-5 h-5" />
                </Button>
                <Button variant="link" className="!p-0 bg-transparent text-neutral-800 dark:text-white flex">
                    <RotateCw className="w-5 h-5" />
                </Button>

                <div className="">
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <EllipsisVertical className="w-5 h-5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>
                                <div className="px-4 py-2 rounded text-neutral-500 dark:text-neutral-300 text-hover-neutral-900 flex items-center text-start gap-2.5">
                                    <MailOpen className="w-5 h-5" />
                                    Mark all as read
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <p className="ms-10 mt-2 text-neutral-500 mb-0 dark:text-white">
                                    Select messages to see more actions
                                </p>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <SearchBox />
            </div>
            <div className="flex items-center gap-3">
                <span className="text-neutral-500 dark:text-neutral-300 line-height-1">1-12 of 1,253</span>
                <nav>
                    <ul className="pagination flex items-center gap-2">
                        <li className="page-item">
                            <Button variant="link" className="page-link flex bg-white dark:bg-slate-700 border text-neutral-500 dark:text-neutral-300 text-xl">
                                <ChevronLeft className="w-4" />
                            </Button>
                        </li>
                        <li className="page-item">
                            <Button variant="link" className="page-link flex bg-white dark:bg-slate-700 border text-neutral-500 dark:text-neutral-300 text-xl">
                                <ChevronRight className="w-4" />
                            </Button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default EmailHeader;