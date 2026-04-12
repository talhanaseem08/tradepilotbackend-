import FlagImage from "@/assets/images/lang-flag.png";
import LazyWrapper from "@/components/LazyWrapper";
import DefaultCardComponent from "@/components/shared/DefaultCardComponent";
import Breadcrumb from "@/layouts/Breadcrumb";
import { BellRing, Mail } from "lucide-react";

const Badges = () => {
    return (
        <>
            <Breadcrumb title="Badges" text="Badges" />

            <LazyWrapper>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <DefaultCardComponent title="Default Badges">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="badge text-sm font-semibold bg-primary px-5 py-1.5 rounded text-white">Primary</span>
                            <span className="badge text-sm font-semibold bg-purple-600 px-5 py-1.5 rounded text-white">Secondary</span>
                            <span className="badge text-sm font-semibold bg-green-600 px-5 py-1.5 rounded text-white">Success</span>
                            <span className="badge text-sm font-semibold bg-cyan-600 px-5 py-1.5 rounded text-white">Info</span>
                            <span className="badge text-sm font-semibold bg-yellow-500 px-5 py-1.5 rounded text-white">Warning</span>
                            <span className="badge text-sm font-semibold bg-red-600 px-5 py-1.5 rounded text-white">Danger</span>
                            <span className="badge text-sm font-semibold bg-neutral-800 px-5 py-1.5 rounded text-white">Dark</span>
                            <span className="badge text-sm font-semibold bg-transparent px-5 py-1.5 rounded text-primary">Link</span>
                            <span className="badge text-sm font-semibold bg-light-600 dark:bg-slate-600 px-5 py-1.5 rounded text-dark">Light</span>
                        </div>
                    </DefaultCardComponent>

                    <DefaultCardComponent title="Outline Badges">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="badge text-sm font-semibold border border-primary text-primary bg-transparent px-5 py-1.5 rounded">Primary</span>
                            <span className="badge text-sm font-semibold border border-purple-600 dark:text-purple-400 bg-transparent px-5 py-1.5 rounded">Secondary</span>
                            <span className="badge text-sm font-semibold border border-green-600 text-green-600 bg-transparent px-5 py-1.5 rounded">Success</span>
                            <span className="badge text-sm font-semibold border border-cyan-600 text-cyan-600 bg-transparent px-5 py-1.5 rounded">Info</span>
                            <span className="badge text-sm font-semibold border border-yellow-600 text-yellow-500 bg-transparent px-5 py-1.5 rounded">Warning</span>
                            <span className="badge text-sm font-semibold border border-red-600 text-red-600 bg-transparent px-5 py-1.5 rounded">Danger</span>
                            <span className="badge text-sm font-semibold border border-neutral-800 text-neutral-800 bg-transparent px-5 py-1.5 rounded">Dark</span>
                            <span className="badge text-sm font-semibold bg-transparent px-5 py-1.5 rounded text-primary">Link</span>
                            <span className="badge text-sm font-semibold border bg-transparent px-5 py-1.5 rounded text-neutral-500 dark:text-neutral-300">Light</span>
                        </div>
                    </DefaultCardComponent>

                    <DefaultCardComponent title="Soft Badges">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="badge text-sm font-semibold text-primary bg-blue-100 dark:bg-primary/25 px-5 py-1.5 rounded">Primary</span>
                            <span className="badge text-sm font-semibold text-purple-600 bg-purple-100 dark:bg-purple-600/25 px-5 py-1.5 rounded">Secondary</span>
                            <span className="badge text-sm font-semibold text-green-600 bg-green-100 dark:bg-green-600/25 px-5 py-1.5 rounded">Success</span>
                            <span className="badge text-sm font-semibold text-cyan-600 bg-cyan-100 dark:bg-cyan-600/25 px-5 py-1.5 rounded">Info</span>
                            <span className="badge text-sm font-semibold text-yellow-500 bg-yellow-100 dark:bg-yellow-500/25 px-5 py-1.5 rounded">Warning</span>
                            <span className="badge text-sm font-semibold text-red-600 bg-red-100 dark:bg-red-600/25 px-5 py-1.5 rounded">Danger</span>
                            <span className="badge text-sm font-semibold text-neutral-800 bg-neutral-300 dark:text-neutral-900 px-5 py-1.5 rounded">Dark</span>
                            <span className="badge text-sm font-semibold bg-transparent px-5 py-1.5 rounded text-primary">Link</span>
                            <span className="badge text-sm font-semibold bg-light-100 dark:bg-slate-600 px-5 py-1.5 rounded text-neutral-500 dark:text-neutral-300">Light</span>
                        </div>
                    </DefaultCardComponent>

                    <DefaultCardComponent title="Rounded Badges">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="badge text-sm font-semibold rounded-full bg-primary px-5 py-1.5 text-white">Primary</span>
                            <span className="badge text-sm font-semibold rounded-full bg-purple-600 px-5 py-1.5 text-white">Secondary</span>
                            <span className="badge text-sm font-semibold rounded-full bg-green-600 px-5 py-1.5 text-white">Success</span>
                            <span className="badge text-sm font-semibold rounded-full bg-cyan-600 px-5 py-1.5 text-white">Info</span>
                            <span className="badge text-sm font-semibold rounded-full bg-yellow-500 px-5 py-1.5 text-white">Warning</span>
                            <span className="badge text-sm font-semibold rounded-full bg-red-600 px-5 py-1.5 text-white">Danger</span>
                            <span className="badge text-sm font-semibold rounded-full bg-neutral-800 px-5 py-1.5 text-white">Dark</span>
                            <span className="badge text-sm font-semibold rounded-full bg-transparent px-5 py-1.5 text-primary">Link</span>
                            <span className="badge text-sm font-semibold rounded-full bg-light-600 dark:bg-slate-600 px-5 py-1.5 text-dark">Light</span>
                        </div>
                    </DefaultCardComponent>

                    <DefaultCardComponent title="Gradient Badges">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="badge text-sm font-semibold bg-gradient-to-r from-blue-700 to-blue-400  px-5 py-1.5 rounded text-white">Primary</span>
                            <span className="badge text-sm font-semibold bg-gradient-to-r from-purple-700 to-purple-400  px-5 py-1.5 rounded text-white">Secondary</span>
                            <span className="badge text-sm font-semibold bg-gradient-to-r from-green-700 to-green-400  px-5 py-1.5 rounded text-white">Success</span>
                            <span className="badge text-sm font-semibold bg-gradient-to-r from-cyan-700 to-cyan-400  px-5 py-1.5 rounded text-white">Info</span>
                            <span className="badge text-sm font-semibold bg-gradient-to-r from-yellow-700 to-yellow-400  px-5 py-1.5 rounded text-white">Warning</span>
                            <span className="badge text-sm font-semibold bg-gradient-to-r from-red-700 to-red-400  px-5 py-1.5 rounded text-white">Danger</span>
                            <span className="badge text-sm font-semibold bg-gradient-to-r from-neutral-700 to-neutral-400  px-5 py-1.5 rounded text-white">Dark</span>
                        </div>
                    </DefaultCardComponent>

                    <DefaultCardComponent title="Badges With Button">
                        <div className="flex flex-wrap items-center gap-3">
                            <button type="button" className="badge text-sm font-semibold bg-primary px-4 py-1.5 rounded text-white flex items-center gap-2">
                                Primary
                                <span className="badge text-neutral-900 dark:text-neutral-900 bg-white w-5 h-5 flex items-center justify-center rounded text-xs">4</span>
                            </button>
                            <button type="button" className="badge text-sm font-semibold bg-purple-600 px-4 py-1.5 rounded text-white flex items-center gap-2">
                                Secondary
                                <span className="badge text-neutral-900 dark:text-neutral-900 bg-white w-5 h-5 flex items-center justify-center rounded text-xs">4</span>
                            </button>
                            <button type="button" className="badge text-sm font-semibold bg-green-600 px-4 py-1.5 rounded text-white flex items-center gap-2">
                                Success
                                <span className="badge text-neutral-900 dark:text-neutral-900 bg-white w-5 h-5 flex items-center justify-center rounded text-xs">4</span>
                            </button>
                            <button type="button" className="badge text-sm font-semibold bg-cyan-600 px-4 py-1.5 rounded text-white flex items-center gap-2">
                                Info
                                <span className="badge text-neutral-900 dark:text-neutral-900 bg-white w-5 h-5 flex items-center justify-center rounded text-xs">4</span>
                            </button>
                            <button type="button" className="badge text-sm font-semibold bg-yellow-500 px-4 py-1.5 rounded text-white flex items-center gap-2">
                                Warning
                                <span className="badge text-neutral-900 dark:text-neutral-900 bg-white w-5 h-5 flex items-center justify-center rounded text-xs">4</span>
                            </button>
                            <button type="button" className="badge text-sm font-semibold bg-red-600 px-4 py-1.5 rounded text-white flex items-center gap-2">
                                Danger
                                <span className="badge text-neutral-900 dark:text-neutral-900 bg-white w-5 h-5 flex items-center justify-center rounded text-xs">4</span>
                            </button>
                            <button type="button" className="badge text-sm font-semibold bg-neutral-800 px-4 py-1.5 rounded text-white flex items-center gap-2">
                                Dark
                                <span className="badge text-neutral-900 dark:text-neutral-900 bg-white w-5 h-5 flex items-center justify-center rounded text-xs">4</span>
                            </button>
                        </div>
                    </DefaultCardComponent>

                    <DefaultCardComponent title="Number Rounded Badges">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="badge text-sm font-semibold w-8 h-8 flex justify-center items-center rounded-full bg-primary  text-white">1</span>
                            <span className="badge text-sm font-semibold w-8 h-8 flex justify-center items-center rounded-full bg-purple-600  text-white">2</span>
                            <span className="badge text-sm font-semibold w-8 h-8 flex justify-center items-center rounded-full bg-green-600  text-white">3</span>
                            <span className="badge text-sm font-semibold w-8 h-8 flex justify-center items-center rounded-full bg-yellow-500  text-white">4</span>
                            <span className="badge text-sm font-semibold w-8 h-8 flex justify-center items-center rounded-full bg-red-600  text-white">5</span>

                            <span className="badge text-sm font-semibold w-8 h-8 flex justify-center items-center rounded-full text-primary dark:text-primary bg-blue-50 dark:bg-primary/25">1</span>
                            <span className="badge text-sm font-semibold w-8 h-8 flex justify-center items-center rounded-full text-purple-600 dark:text-purple-500 bg-purple-50 dark:bg-purple-600/25">1</span>
                            <span className="badge text-sm font-semibold w-8 h-8 flex justify-center items-center rounded-full text-green-600 dark:text-green-500 bg-green-100 dark:bg-green-600/25">3</span>
                            <span className="badge text-sm font-semibold w-8 h-8 flex justify-center items-center rounded-full text-yellow-500 dark:text-yellow-500 bg-yellow-100 dark:bg-yellow-500/25">4</span>
                            <span className="badge text-sm font-semibold w-8 h-8 flex justify-center items-center rounded-full text-red-600 dark:text-red-500 bg-red-100 dark:bg-red-600/25">5</span>

                            <span className="badge text-sm font-semibold w-8 h-8 flex justify-center items-center rounded-full border border-primary text-primary dark:text-primary">1</span>
                            <span className="badge text-sm font-semibold w-8 h-8 flex justify-center items-center rounded-full border border-purple-600 text-purple-600 dark:text-purple-500">1</span>
                            <span className="badge text-sm font-semibold w-8 h-8 flex justify-center items-center rounded-full border border-green-600 text-green-600 dark:text-green-500">3</span>
                            <span className="badge text-sm font-semibold w-8 h-8 flex justify-center items-center rounded-full border border-yellow-600 text-yellow-500 dark:text-yellow-500">4</span>
                            <span className="badge text-sm font-semibold w-8 h-8 flex justify-center items-center rounded-full border border-red-600 text-red-600 dark:text-red-500">5</span>

                        </div>
                    </DefaultCardComponent>

                    <DefaultCardComponent title="Number Square Badges">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="badge text-sm font-semibold w-8 h-8 flex justify-center items-center rounded bg-primary  text-white">1</span>
                            <span className="badge text-sm font-semibold w-8 h-8 flex justify-center items-center rounded bg-purple-600  text-white">2</span>
                            <span className="badge text-sm font-semibold w-8 h-8 flex justify-center items-center rounded bg-green-600  text-white">3</span>
                            <span className="badge text-sm font-semibold w-8 h-8 flex justify-center items-center rounded bg-yellow-500  text-white">4</span>
                            <span className="badge text-sm font-semibold w-8 h-8 flex justify-center items-center rounded bg-red-600  text-white">5</span>

                            <span className="badge text-sm font-semibold w-8 h-8 flex justify-center items-center rounded text-primary dark:text-primary bg-blue-50 dark:bg-primary/25">1</span>
                            <span className="badge text-sm font-semibold w-8 h-8 flex justify-center items-center rounded text-purple-600 dark:text-purple-500 bg-purple-50 dark:bg-purple-600/25">2</span>
                            <span className="badge text-sm font-semibold w-8 h-8 flex justify-center items-center rounded text-green-600 dark:text-green-500 bg-green-100 dark:bg-green-600/25">3</span>
                            <span className="badge text-sm font-semibold w-8 h-8 flex justify-center items-center rounded text-yellow-500 dark:text-yellow-500 bg-yellow-100 dark:bg-yellow-500/25">4</span>
                            <span className="badge text-sm font-semibold w-8 h-8 flex justify-center items-center rounded text-red-600 dark:text-red-500 bg-red-100 dark:bg-red-600/25">5</span>

                            <span className="badge text-sm font-semibold w-8 h-8 flex justify-center items-center rounded border border-primary text-primary dark:text-primary">1</span>
                            <span className="badge text-sm font-semibold w-8 h-8 flex justify-center items-center rounded border border-purple-600 text-purple-600 dark:text-purple-500">2</span>
                            <span className="badge text-sm font-semibold w-8 h-8 flex justify-center items-center rounded border border-green-600 text-green-600 dark:text-green-500">3</span>
                            <span className="badge text-sm font-semibold w-8 h-8 flex justify-center items-center rounded border border-yellow-600 text-yellow-500 dark:text-yellow-500">4</span>
                            <span className="badge text-sm font-semibold w-8 h-8 flex justify-center items-center rounded border border-red-600 text-red-600 dark:text-red-500">5</span>

                        </div>
                    </DefaultCardComponent>

                    <DefaultCardComponent title="Different Badges">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex flex-wrap items-center gap-3">
                                <button type="button" className="bg-primary text-white rounded relative px-5 py-2 text-sm line-height-1 flex items-center">
                                    Inbox
                                    <span className="absolute top-0 -end-[8px] -translate-y-1/2 px-1 py-0.5 badge rounded-full bg-primary border border-white">2</span>
                                </button>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <button type="button" className="bg-yellow-500 text-white rounded relative px-5 py-2 text-sm line-height-1 flex items-center">
                                    Inbox
                                    <span className="absolute top-0 -end-[8px] -translate-y-1/2 px-1 py-0.5 badge rounded-full bg-red-600">99+</span>
                                </button>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <button type="button" className="relative">
                                    <img src={FlagImage} alt="image" className="w-8 h-8 object-fit-cover rounded-full" />
                                    <span className="absolute top-0 -end-[8px] -translate-y-1/2 px-1 py-0.5 leading-[1] flex items-center justify-center badge rounded-full bg-red-600 border border-white text-white">2</span>
                                </button>
                            </div>

                            <button className="relative rounded-full flex justify-center items-center" type="button">
                                <Mail className="w-8" />
                                <span className="absolute top-0 -end-[8px] -translate-y-1/2 px-1 py-0.5 leading-[1] flex items-center justify-center badge rounded-full bg-red-600 text-white">2</span>
                            </button>

                            <button className="relative rounded-full flex justify-center items-center" type="button">
                                <BellRing className="w-8" />
                                <span className="absolute top-0 -end-[8px] -translate-y-1/2 px-1 py-0.5 leading-[1] flex items-center justify-center badge rounded-full bg-red-600 text-white">2</span>
                            </button>
                            <button className="relative rounded-full flex justify-center items-center" type="button">
                                <BellRing className="w-8" />
                                <span className="absolute top-0 start-1/2 -translate-y-1/2 -translate-x-1/2 px-1 py-0.5 leading-[1] flex items-center justify-center rounded-full bg-red-600 text-white w-2 h-2"></span>
                            </button>
                        </div>
                    </DefaultCardComponent>

                    <DefaultCardComponent title="Badge Dots Style">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                <span className="text-primary font-medium">Primary</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                                <span className="dark:text-purple-400 font-medium">Secondary</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                                <span className="text-green-600 font-medium">Success</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-cyan-600 rounded-full"></span>
                                <span className="text-cyan-600 font-medium">Info</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                                <span className="text-yellow-500 font-medium">Warning</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                                <span className="text-red-600 font-medium">Danger</span>
                            </div>
                        </div>
                    </DefaultCardComponent>

                </div>
            </LazyWrapper>

        </>
    );
};

export default Badges;