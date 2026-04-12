import LazyWrapper from "@/components/LazyWrapper";
import DefaultCardComponent from "@/components/shared/DefaultCardComponent";
import Breadcrumb from "@/layouts/Breadcrumb";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Link } from "react-router-dom";

const Pagination = () => {
    return (
        <>
            <Breadcrumb title="Pagination" text="Pagination" />

            <LazyWrapper>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <DefaultCardComponent title="Default Solid">
                        <ul className="pagination flex flex-wrap items-center gap-2 justify-center">
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium rounded-lg border-0 px-5 py-2.5 flex items-center justify-center h-[48]" to="#">First</Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium rounded-lg border-0 px-5 py-2.5 flex items-center justify-center h-[48]" to="#">Previous</Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium rounded-lg border-0 px-5 py-2.5 flex items-center justify-center h-[48] w-[48px]" to="#">
                                    <ChevronsLeft className="w-6" />
                                </Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium rounded-lg border-0 px-5 py-2.5 flex items-center justify-center h-[48] w-[48px]" to="#">1</Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link dark:bg-primary/25 text-neutral-900 dark:text-white font-medium rounded-lg border-0 px-5 py-2.5 flex items-center justify-center h-[48] w-[48px] bg-primary dark:bg-primary text-white" to="#">2</Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium rounded-lg border-0 px-5 py-2.5 flex items-center justify-center h-[48] w-[48px]" to="#">3</Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium rounded-lg border-0 px-5 py-2.5 flex items-center justify-center h-[48] w-[48px]" to="#">
                                    <ChevronsRight className="w-6" />
                                </Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium rounded-lg border-0 px-5 py-2.5 flex items-center justify-center h-[48]" to="#">Next</Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium rounded-lg border-0 px-5 py-2.5 flex items-center justify-center h-[48]" to="#">Last</Link>
                            </li>
                        </ul>
                        <ul className="pagination flex flex-wrap items-center gap-2 justify-center mt-6">
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium rounded-lg border-0 px-5 py-2.5 flex items-center justify-center h-[48px]" to="#">Previous</Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium rounded-lg border-0 flex items-center justify-center h-[48px] w-[48px]" to="#">
                                    <ChevronsLeft className="w-6" />
                                </Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium rounded-lg border-0 flex items-center justify-center h-[48px] w-[48px]" to="#">1</Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link  font-medium rounded-lg border-0 flex items-center justify-center h-[48px] w-[48px] bg-primary dark:bg-primary text-white" to="#">2</Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium rounded-lg border-0 flex items-center justify-center h-[48px] w-[48px]" to="#">3</Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium rounded-lg border-0 flex items-center justify-center h-[48px] w-[48px]" to="#">
                                    <ChevronsRight className="w-6" />
                                </Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium rounded-lg border-0 px-5 py-2.5 flex items-center justify-center h-[48px]" to="#">Next</Link>
                            </li>
                        </ul>
                    </DefaultCardComponent>
                    <DefaultCardComponent title="Outline">
                        <ul className="pagination flex flex-wrap items-center gap-2 justify-center">
                            <li className="page-item">
                                <Link className="page-link bg-white dark:bg-slate-700 border border-neutral-200 dark:border-neutral-600 text-neutral-900 dark:text-white font-medium rounded-lg px-5 py-2.5 flex items-center justify-center h-[48px]" to="#">First</Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-white dark:bg-slate-700 border border-neutral-200 dark:border-neutral-600 text-neutral-900 dark:text-white font-medium rounded-lg px-5 py-2.5 flex items-center justify-center h-[48px]" to="#">Previous</Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-white dark:bg-slate-700 border border-neutral-200 dark:border-neutral-600 text-neutral-900 dark:text-white font-medium rounded-lg flex items-center justify-center h-[48px] w-[48px]" to="#">
                                    <ChevronsLeft className="w-6" />
                                </Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-white dark:bg-slate-700 border border-neutral-200 dark:border-neutral-600 text-neutral-900 dark:text-white font-medium rounded-lg flex items-center justify-center h-[48px] w-[48px]" to="#">1</Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-white dark:bg-slate-700  font-medium rounded-lg flex items-center justify-center h-[48px] w-[48px] border border-primary text-primary dark:border-primary dark:text-primary" to="#">2</Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-white dark:bg-slate-700 border border-neutral-200 dark:border-neutral-600 text-neutral-900 dark:text-white font-medium rounded-lg flex items-center justify-center h-[48px] w-[48px]" to="#">3</Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-white dark:bg-slate-700 border border-neutral-200 dark:border-neutral-600 text-neutral-900 dark:text-white font-medium rounded-lg flex items-center justify-center h-[48px] w-[48px]" to="#">
                                    <ChevronsRight className="w-6" />
                                </Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-white dark:bg-slate-700 border border-neutral-200 dark:border-neutral-600 text-neutral-900 dark:text-white font-medium rounded-lg px-5 py-2.5 flex items-center justify-center h-[48px]" to="#">Next</Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-white dark:bg-slate-700 border border-neutral-200 dark:border-neutral-600 text-neutral-900 dark:text-white font-medium rounded-lg px-5 py-2.5 flex items-center justify-center h-[48px]" to="#">Last</Link>
                            </li>
                        </ul>
                        <ul className="pagination flex flex-wrap items-center gap-2 justify-center mt-6">
                            <li className="page-item">
                                <Link className="page-link bg-white dark:bg-slate-700 border border-neutral-200 dark:border-neutral-600 text-neutral-900 dark:text-white font-medium rounded-lg px-5 py-2.5 flex items-center justify-center h-[48px]" to="#">Previous</Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-white dark:bg-slate-700 border border-neutral-200 dark:border-neutral-600 text-neutral-900 dark:text-white font-medium rounded-lg flex items-center justify-center h-[48px] w-[48px]" to="#">
                                    <ChevronsLeft className="w-6" />
                                </Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-white dark:bg-slate-700 border border-neutral-200 dark:border-neutral-600 text-neutral-900 dark:text-white font-medium rounded-lg flex items-center justify-center h-[48px] w-[48px]" to="#">1</Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-white dark:bg-slate-700  font-medium rounded-lg flex items-center justify-center h-[48px] w-[48px] border border-primary text-primary dark:border-primary dark:text-primary" to="#">2</Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-white dark:bg-slate-700 border border-neutral-200 dark:border-neutral-600 text-neutral-900 dark:text-white font-medium rounded-lg flex items-center justify-center h-[48px] w-[48px]" to="#">3</Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-white dark:bg-slate-700 border border-neutral-200 dark:border-neutral-600 text-neutral-900 dark:text-white font-medium rounded-lg flex items-center justify-center h-[48px] w-[48px]" to="#">
                                    <ChevronsRight className="w-6" />
                                </Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-white dark:bg-slate-700 border border-neutral-200 dark:border-neutral-600 text-neutral-900 dark:text-white font-medium rounded-lg px-5 py-2.5 flex items-center justify-center h-[48px]" to="#">Next</Link>
                            </li>
                        </ul>
                    </DefaultCardComponent>
                    <DefaultCardComponent title="Square with icon">
                        <ul className="pagination flex flex-wrap items-center gap-2 justify-center">
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium rounded-lg border-0 flex items-center justify-center h-[48px] w-[48px]" to="#">
                                    <ChevronsLeft className="w-6" />
                                </Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium rounded-lg border-0 flex items-center justify-center h-[48px] w-[48px]" to="#">
                                    <ChevronLeft className="w-6" />
                                </Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium rounded-lg border-0 flex items-center justify-center h-[48px] w-[48px]" to="#">1</Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium rounded-lg border-0 flex items-center justify-center h-[48px] w-[48px]" to="#">2</Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link  font-medium rounded-lg border-0 flex items-center justify-center h-[48px] w-[48px] bg-primary dark:bg-primary text-white" to="#">3</Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium rounded-lg border-0 flex items-center justify-center h-[48px] w-[48px]" to="#">4</Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium rounded-lg border-0 flex items-center justify-center h-[48px] w-[48px]" to="#">5</Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium rounded-lg border-0 flex items-center justify-center h-[48px] w-[48px]" to="#">
                                    <ChevronRight className="w-6" />
                                </Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium rounded-lg border-0 flex items-center justify-center h-[48px] w-[48px]" to="#">
                                    <ChevronsRight className="w-6" />
                                </Link>
                            </li>
                        </ul>
                        <ul className="pagination flex flex-wrap items-center gap-2 justify-center mt-6">
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium rounded-lg border-0 flex items-center justify-center h-[48px] w-[48px]" to="#">
                                    <ChevronsLeft className="w-6" />
                                </Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium rounded-lg border-0 flex items-center justify-center h-[48px] w-[48px]" to="#">1</Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link  font-medium rounded-lg border-0 flex items-center justify-center h-[48px] w-[48px] bg-primary dark:bg-primary text-white" to="#">2</Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium rounded-lg border-0 flex items-center justify-center h-[48px] w-[48px]" to="#">3</Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium rounded-lg border-0 flex items-center justify-center h-[48px] w-[48px]" to="#">
                                    <ChevronsRight className="w-6" />
                                </Link>
                            </li>
                        </ul>
                    </DefaultCardComponent>
                    <DefaultCardComponent title="Rounded with icon">
                        <ul className="pagination flex flex-wrap items-center gap-2 justify-center">
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium rounded-full border-0 flex items-center justify-center h-[48px] w-[48px]" to="#">
                                    <ChevronsLeft className="w-6" />
                                </Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium rounded-full border-0 flex items-center justify-center h-[48px] w-[48px]" to="#">
                                    <ChevronLeft className="w-6" />
                                </Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium rounded-full border-0 flex items-center justify-center h-[48px] w-[48px]" to="#">1</Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium rounded-full border-0 flex items-center justify-center h-[48px] w-[48px]" to="#">2</Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link dark:text-white font-medium rounded-full border-0 flex items-center justify-center h-[48px] w-[48px] bg-primary dark:bg-primary text-white" to="#">3</Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium rounded-full border-0 flex items-center justify-center h-[48px] w-[48px]" to="#">4</Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium rounded-full border-0 flex items-center justify-center h-[48px] w-[48px]" to="#">5</Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium rounded-full border-0 flex items-center justify-center h-[48px] w-[48px]" to="#">
                                    <ChevronRight className="w-6" />
                                </Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium rounded-full border-0 flex items-center justify-center h-[48px] w-[48px]" to="#">
                                    <ChevronsRight className="w-6" />
                                </Link>
                            </li>
                        </ul>
                        <ul className="pagination flex flex-wrap items-center gap-2 justify-center mt-6">
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium rounded-full border-0 flex items-center justify-center h-[48px] w-[48px]" to="#">
                                    <ChevronsLeft className="w-6" />
                                </Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium rounded-full border-0 flex items-center justify-center h-[48px] w-[48px]" to="#">1</Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link dark:text-white font-medium rounded-full border-0 flex items-center justify-center h-[48px] w-[48px] bg-primary dark:bg-primary text-white" to="#">2</Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium rounded-full border-0 flex items-center justify-center h-[48px] w-[48px]" to="#">3</Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium rounded-full border-0 flex items-center justify-center h-[48px] w-[48px]" to="#">
                                    <ChevronsRight className="w-6" />
                                </Link>
                            </li>
                        </ul>
                    </DefaultCardComponent>
                    <DefaultCardComponent title="Default Solid">
                        <div className="p-6 bg-blue-50 dark:bg-primary/25 inline-block rounded-xl bg-blue-success-gradient justify-center mx-auto">
                            <ul className="pagination flex flex-wrap items-center gap-2 justify-center">
                                <li className="page-item">
                                    <Link className="page-link bg-white dark:bg-slate-700 text-neutral-900 dark:text-white font-medium rounded-lg border-0 px-5 py-2.5 flex items-center justify-center h-[48px]" to="#">Page 1of 11</Link>
                                </li>
                                <li className="page-item">
                                    <Link className="page-link bg-white dark:bg-slate-700 text-neutral-900 dark:text-white font-medium rounded-lg border-0 flex items-center justify-center h-[48px] w-[48px]" to="#">
                                        <ChevronsLeft className="w-6" />
                                    </Link>
                                </li>
                                <li className="page-item">
                                    <Link className="page-link bg-white dark:bg-slate-700 text-neutral-900 dark:text-white font-medium rounded-lg border-0 flex items-center justify-center h-[48px] w-[48px]" to="#">1</Link>
                                </li>
                                <li className="page-item">
                                    <Link className="page-link font-medium rounded-lg border-0 flex items-center justify-center h-[48px] w-[48px] bg-primary dark:bg-primary text-white" to="#">2</Link>
                                </li>
                                <li className="page-item">
                                    <Link className="page-link bg-white dark:bg-slate-700 text-neutral-900 dark:text-white font-medium rounded-lg border-0 flex items-center justify-center h-[48px] w-[48px]" to="#">3</Link>
                                </li>
                                <li className="page-item">
                                    <Link className="page-link bg-white dark:bg-slate-700 text-neutral-900 dark:text-white font-medium rounded-lg border-0 flex items-center justify-center h-[48px] w-[48px]" to="#">4</Link>
                                </li>
                                <li className="page-item">
                                    <Link className="page-link bg-white dark:bg-slate-700 text-neutral-900 dark:text-white font-medium rounded-lg border-0 flex items-center justify-center h-[48px] w-[48px]" to="#">5</Link>
                                </li>
                                <li className="page-item">
                                    <Link className="page-link bg-white dark:bg-slate-700 text-neutral-900 dark:text-white font-medium rounded-lg border-0 flex items-center justify-center h-[48px] w-[48px]" to="#">...</Link>
                                </li>
                                <li className="page-item">
                                    <Link className="page-link bg-white dark:bg-slate-700 text-neutral-900 dark:text-white font-medium rounded-lg border-0 flex items-center justify-center h-[48px] w-[48px]" to="#">
                                        <ChevronsRight className="w-6" />
                                    </Link>
                                </li>
                                <li className="page-item">
                                    <Link className="page-link bg-white dark:bg-slate-700 text-neutral-900 dark:text-white font-medium rounded-lg border-0 px-5 py-2.5 flex items-center justify-center h-[48px]" to="#">Last</Link>
                                </li>
                            </ul>
                        </div>
                    </DefaultCardComponent>
                    <DefaultCardComponent title="No Spacing">
                        <ul className="pagination flex flex-wrap items-center justify-center">
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium border-0 flex items-center justify-center h-[48px] w-[48px] rounded-s-full" to="#">
                                    <ChevronsLeft className="w-6" />
                                </Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium border-0 flex items-center justify-center h-[48px] w-[48px]" to="#">
                                    <ChevronLeft className="w-6" />
                                </Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium border-0 flex items-center justify-center h-[48px] w-[48px]" to="#">1</Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link dark:text-white font-medium border-0 flex items-center justify-center h-[48px] w-[48px] bg-primary dark:bg-primary text-white" to="#">2</Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium border-0 flex items-center justify-center h-[48px] w-[48px]" to="#">3</Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium border-0 flex items-center justify-center h-[48px] w-[48px]" to="#">4</Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium border-0 flex items-center justify-center h-[48px] w-[48px]" to="#">5</Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium border-0 flex items-center justify-center h-[48px] w-[48px]" to="#">
                                    <ChevronRight className="w-6" />
                                </Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium border-0 flex items-center justify-center h-[48px] w-[48px] rounded-e-full" to="#">
                                    <ChevronsRight className="w-6" />
                                </Link>
                            </li>
                        </ul>
                        <ul className="pagination flex flex-wrap items-center justify-center mt-6">
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium border-0 flex items-center justify-center h-[48px] w-[48px]  rounded-s-full" to="#">
                                    <ChevronLeft className="w-6" />
                                </Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium border-0 flex items-center justify-center h-[48px] w-[48px]" to="#">1</Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link dark:text-white font-medium border-0 flex items-center justify-center h-[48px] w-[48px] bg-primary dark:bg-primary text-white" to="#">2</Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium border-0 flex items-center justify-center h-[48px] w-[48px]" to="#">3</Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium border-0 flex items-center justify-center h-[48px] w-[48px]" to="#">4</Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium border-0 flex items-center justify-center h-[48px] w-[48px]" to="#">5</Link>
                            </li>
                            <li className="page-item">
                                <Link className="page-link bg-blue-50 dark:bg-primary/25 text-neutral-900 dark:text-white font-medium border-0 flex items-center justify-center h-[48px] w-[48px] rounded-e-full" to="#">
                                    <ChevronRight className="w-6" />
                                </Link>
                            </li>
                        </ul>
                    </DefaultCardComponent>

                </div>
            </LazyWrapper>

        </>
    );
};

export default Pagination;