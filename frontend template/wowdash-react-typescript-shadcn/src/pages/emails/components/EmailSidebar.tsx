import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CirclePlus, Mail, Pencil, Send, Star, Trash2, TriangleAlert } from 'lucide-react';
import { Link } from "react-router-dom";

const EmailSidebar = () => {

    return (
        <div className={cn("email-sidebar card h-full border-0 absolute left-0 top-0 z-[10] xl:static w-[280px] xl:w-auto block shadow-sm")}>
            <div className="card-body">
                <Button className={cn(`w-full rounded-lg flex items-center justify-start gap-2 h-11`)}>
                    <CirclePlus className="w-4.5" />
                    Compose
                </Button>

                <div className="mt-4">
                    <ul>
                        <li className="item-active mb-1.5">
                            <Link to="/email" className="hover:bg-blue-50 dark:hover:bg-slate-700 group hover:text-neutral-900 px-2.5 py-2.5 w-full rounded-lg text-neutral-600 dark:text-white flex items-center">
                                <span className="flex items-center gap-2.5 justify-between w-full">
                                    <span className="flex items-center gap-2.5">
                                        <span className="icon text-2xl line-height-1 flex group-hover:text-primary dark:group-hover:text-white">
                                            <Mail className="w-4" />
                                        </span>
                                        <span className="font-semibold">Inbox</span>
                                    </span>
                                    <span className="font-medium">800</span>
                                </span>
                            </Link>
                        </li>
                        <li className="mb-1.5">
                            <a href="/email" className="hover:bg-blue-50 dark:hover:bg-slate-700 group hover:text-neutral-900 px-2.5 py-2.5 w-full rounded-lg text-neutral-600 dark:text-white flex items-center">
                                <span className="flex items-center gap-2.5 justify-between w-full">
                                    <span className="flex items-center gap-2.5">
                                        <span className="icon text-2xl line-height-1 flex group-hover:text-primary dark:group-hover:text-white">
                                            <Star className="w-4" />
                                        </span>
                                        <span className="font-semibold">Starred</span>
                                    </span>
                                    <span className="font-medium">250</span>
                                </span>
                            </a>
                        </li>
                        <li className="mb-1.5">
                            <Link to="/email" className="hover:bg-blue-50 dark:hover:bg-slate-700 group hover:text-neutral-900 px-2.5 py-2.5 w-full rounded-lg text-neutral-600 dark:text-white flex items-center">
                                <span className="flex items-center gap-2.5 justify-between w-full">
                                    <span className="flex items-center gap-2.5">
                                        <span className="icon text-2xl line-height-1 flex group-hover:text-primary dark:group-hover:text-white">
                                            <Send className="w-4" />
                                        </span>
                                        <span className="font-semibold">Sent</span>
                                    </span>
                                    <span className="font-medium">80</span>
                                </span>
                            </Link>
                        </li>
                        <li className="mb-1.5">
                            <Link to="/email" className="hover:bg-blue-50 dark:hover:bg-slate-700 group hover:text-neutral-900 px-2.5 py-2.5 w-full rounded-lg text-neutral-600 dark:text-white flex items-center">
                                <span className="flex items-center gap-2.5 justify-between w-full">
                                    <span className="flex items-center gap-2.5">
                                        <span className="icon text-2xl line-height-1 flex group-hover:text-primary dark:group-hover:text-white">
                                            <Pencil className="w-4" />
                                        </span>
                                        <span className="font-semibold">Draft</span>
                                    </span>
                                    <span className="font-medium">50</span>
                                </span>
                            </Link>
                        </li>
                        <li className="mb-1.5">
                            <Link to="/email" className="hover:bg-blue-50 dark:hover:bg-slate-700 group hover:text-neutral-900 px-2.5 py-2.5 w-full rounded-lg text-neutral-600 dark:text-white flex items-center">
                                <span className="flex items-center gap-2.5 justify-between w-full">
                                    <span className="flex items-center gap-2.5">
                                        <span className="icon text-2xl line-height-1 flex group-hover:text-primary dark:group-hover:text-white">
                                            <TriangleAlert className="w-4" />
                                        </span>
                                        <span className="font-semibold">Spam</span>
                                    </span>
                                    <span className="font-medium">30</span>
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/email" className="hover:bg-blue-50 dark:hover:bg-slate-700 group hover:text-neutral-900 px-2.5 py-2.5 w-full rounded-lg text-neutral-600 dark:text-white flex items-center">
                                <span className="flex items-center gap-2.5 justify-between w-full">
                                    <span className="flex items-center gap-2.5">
                                        <span className="icon text-2xl line-height-1 flex group-hover:text-primary dark:group-hover:text-white">
                                            <Trash2 className="w-4" />
                                        </span>
                                        <span className="font-semibold">Bin</span>
                                    </span>
                                    <span className="font-medium">20</span>
                                </span>
                            </Link>
                        </li>
                    </ul>
                    <div className="mt-6">
                        <h6 className="text-lg font-semibold text-neutral-600 dark:text-neutral-200 mb-4">TAGS</h6>
                        <ul>
                            <li className="mb-5">
                                <span className="line-height-1 font-medium text-neutral-500 dark:text-neutral-300 text-sm flex items-center gap-2.5">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                    Personal
                                </span>
                            </li>
                            <li className="mb-5">
                                <span className="line-height-1 font-medium text-neutral-500 dark:text-neutral-300 text-sm flex items-center gap-2.5">
                                    <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                                    Social
                                </span>
                            </li>
                            <li className="mb-5">
                                <span className="line-height-1 font-medium text-neutral-500 dark:text-neutral-300 text-sm flex items-center gap-2.5">
                                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                                    Promotions
                                </span>
                            </li>
                            <li className="mb-5">
                                <span className="line-height-1 font-medium text-neutral-500 dark:text-neutral-300 text-sm flex items-center gap-2.5">
                                    <span className="w-2 h-2 bg-yellow-600 rounded-full"></span>
                                    Business
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default EmailSidebar;