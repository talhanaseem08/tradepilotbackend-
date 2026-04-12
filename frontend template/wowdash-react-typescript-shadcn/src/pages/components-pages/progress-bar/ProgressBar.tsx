import LazyWrapper from "@/components/LazyWrapper";
import DefaultCardComponent from "@/components/shared/DefaultCardComponent";
import Breadcrumb from "@/layouts/Breadcrumb";

const ProgressBar = () => {
    return (
        <>
            <Breadcrumb title="Progress Bar" text="Progress Bar" />

            <LazyWrapper>
                <div className="grid sm:grid-cols-12 gap-6">

                    <div className="col-span-12 sm:col-span-6">
                        <DefaultCardComponent title="Default Progress">
                            <div className="flex items-center flex-col gap-6">
                                <div className="w-full bg-primary/10 rounded-full h-2">
                                    <div className="bg-primary h-2 rounded-full dark:bg-primary" style={{ width: "20%" }}></div>
                                </div>
                                <div className="w-full bg-primary/10 rounded-full h-2">
                                    <div className="bg-primary h-2 rounded-full dark:bg-primary" style={{ width: "35%" }}></div>
                                </div>

                                <div className="w-full bg-primary/10 rounded-full h-2">
                                    <div className="bg-primary h-2 rounded-full dark:bg-primary" style={{ width: "50%" }}></div>
                                </div>

                                <div className="w-full bg-primary/10 rounded-full h-2">
                                    <div className="bg-primary h-2 rounded-full dark:bg-primary" style={{ width: "75%" }}></div>
                                </div>

                                <div className="w-full bg-primary/10 rounded-full h-2">
                                    <div className="bg-primary h-2 rounded-full dark:bg-primary" style={{ width: "90%" }}></div>
                                </div>
                            </div>
                        </DefaultCardComponent>
                    </div>

                    <div className="col-span-12 sm:col-span-6">
                        <DefaultCardComponent title="Progress with multiple color">
                            <div className="flex items-center flex-col gap-6">
                                <div className="w-full bg-primary/10 rounded-full h-2">
                                    <div className="bg-primary h-2 rounded-full dark:bg-primary" style={{ width: "20%" }}></div>
                                </div>

                                <div className="w-full bg-green-600/10 rounded-full h-2">
                                    <div className="bg-green-600 h-2 rounded-full dark:bg-green-600" style={{ width: "35%" }}></div>
                                </div>

                                <div className="w-full bg-cyan-600/10 rounded-full h-2">
                                    <div className="bg-cyan-600 h-2 rounded-full dark:bg-cyan-600" style={{ width: "50%" }}></div>
                                </div>

                                <div className="w-full bg-yellow-600/10 rounded-full h-2">
                                    <div className="bg-yellow-600 h-2 rounded-full dark:bg-yellow-600" style={{ width: "75%" }}></div>
                                </div>

                                <div className="w-full bg-red-600/10 rounded-full h-2">
                                    <div className="bg-red-600 h-2 rounded-full dark:bg-red-600" style={{ width: "90%" }}></div>
                                </div>
                            </div>
                        </DefaultCardComponent>
                    </div>

                    <div className="col-span-12 sm:col-span-6">
                        <DefaultCardComponent title="Progress with right label">
                            <div className="flex flex-col gap-6">
                                <div className="flex items-center gap-4 w-full">
                                    <div className="w-full bg-primary/10 rounded-full h-2">
                                        <div className="bg-primary h-2 rounded-full dark:bg-primary" style={{ width: "20%" }}></div>
                                    </div>
                                    <span className="text-neutral-600 text-xs font-semibold line-height-1">20%</span>
                                </div>

                                <div className="flex items-center gap-4 w-full">
                                    <div className="w-full bg-primary/10 rounded-full h-2">
                                        <div className="bg-primary h-2 rounded-full dark:bg-primary" style={{ width: "35%" }}></div>
                                    </div>
                                    <span className="text-neutral-600 text-xs font-semibold line-height-1">35%</span>
                                </div>

                                <div className="flex items-center gap-4 w-full">
                                    <div className="w-full bg-primary/10 rounded-full h-2">
                                        <div className="bg-primary h-2 rounded-full dark:bg-primary" style={{ width: "50%" }}></div>
                                    </div>
                                    <span className="text-neutral-600 text-xs font-semibold line-height-1">50%</span>
                                </div>

                                <div className="flex items-center gap-4 w-full">
                                    <div className="w-full bg-primary/10 rounded-full h-2">
                                        <div className="bg-primary h-2 rounded-full dark:bg-primary" style={{ width: "75%" }}></div>
                                    </div>
                                    <span className="text-neutral-600 text-xs font-semibold line-height-1">75%</span>
                                </div>

                                <div className="flex items-center gap-4 w-full">
                                    <div className="w-full bg-primary/10 rounded-full h-2">
                                        <div className="bg-primary h-2 rounded-full dark:bg-primary" style={{ width: "90%" }}></div>
                                    </div>
                                    <span className="text-neutral-600 text-xs font-semibold line-height-1">90%</span>
                                </div>
                            </div>
                        </DefaultCardComponent>
                    </div>

                    <div className="col-span-12 sm:col-span-6">
                        <DefaultCardComponent title="Progress with multiple color">
                            <div className="flex items-center flex-col gap-6 position-relative">
                                <div className="w-full bg-primary/10 rounded-full h-2 overflow-hidden">
                                    <div className="bg-primary h-2 rounded-full dark:bg-primary animate-progress transition-all ease-out duration-1000" style={{ width: "20%" }}></div>
                                </div>

                                <div className="w-full bg-green-600/10 rounded-full h-2 overflow-hidden">
                                    <div className="bg-green-600 h-2 rounded-full dark:bg-green-600 animate-progress transition-all ease-out duration-1000" style={{ width: "35%" }}></div>
                                </div>

                                <div className="w-full bg-cyan-600/10 rounded-full h-2 overflow-hidden">
                                    <div className="bg-cyan-600 h-2 rounded-full dark:bg-cyan-600 animate-progress transition-all ease-out duration-1000" style={{ width: "50%" }}></div>
                                </div>

                                <div className="w-full bg-yellow-600/10 rounded-full h-2 overflow-hidden">
                                    <div className="bg-yellow-600 h-2 rounded-full dark:bg-yellow-600 animate-progress transition-all ease-out duration-1000" style={{ width: "75%" }}></div>
                                </div>

                                <div className="w-full bg-red-600/10 rounded-full h-2 overflow-hidden">
                                    <div className="bg-red-600 h-2 rounded-full dark:bg-red-600 animate-progress transition-all ease-out duration-1000" style={{ width: "90%" }}></div>
                                </div>
                            </div>
                        </DefaultCardComponent>
                    </div>

                    <div className="col-span-12 sm:col-span-6">
                        <DefaultCardComponent title="Gradient Progress">
                            <div className="flex items-center flex-col gap-6 position-relative">
                                <div className="w-full bg-gradient-to-l to-blue-600/50 from-blue-600/10 rounded-full h-2 overflow-hidden">
                                    <div className="bg-gradient-to-l to-blue-700 from-blue-500 h-2 rounded-full dark:bg-primary animate-progress transition-all ease-out duration-1000" style={{ width: "20%" }}></div>
                                </div>

                                <div className="w-full bg-gradient-to-l to-green-600/50 from-green-600/10 rounded-full h-2 overflow-hidden">
                                    <div className="bg-gradient-to-l to-green-700 from-green-500 h-2 rounded-full dark:bg-green-600 animate-progress transition-all ease-out duration-1000" style={{ width: "35%" }}></div>
                                </div>

                                <div className="w-full bg-gradient-to-l to-cyan-600/50 from-cyan-600/10 rounded-full h-2 overflow-hidden">
                                    <div className="bg-gradient-to-l to-cyan-700 from-cyan-500 h-2 rounded-full dark:bg-cyan-600 animate-progress transition-all ease-out duration-1000" style={{ width: "50%" }}></div>
                                </div>

                                <div className="w-full bg-gradient-to-l to-yellow-600/50 from-yellow-600/10 rounded-full h-2 overflow-hidden">
                                    <div className="bg-gradient-to-l to-yellow-700 from-yellow-500 h-2 rounded-full dark:bg-yellow-600 animate-progress transition-all ease-out duration-1000" style={{ width: "75%" }}></div>
                                </div>

                                <div className="w-full bg-gradient-to-l to-red-600/50 from-red-600/10 rounded-full h-2 overflow-hidden">
                                    <div className="bg-gradient-to-l to-red-700 from-red-500 h-2 rounded-full dark:bg-red-600 animate-progress transition-all ease-out duration-1000" style={{ width: "90%" }}></div>
                                </div>
                            </div>

                        </DefaultCardComponent>
                    </div>
                </div>
            </LazyWrapper>
        </>
    );
};

export default ProgressBar;