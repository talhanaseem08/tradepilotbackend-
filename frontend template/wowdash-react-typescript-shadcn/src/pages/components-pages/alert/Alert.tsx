import LazyWrapper from "@/components/LazyWrapper";
import DefaultCardComponent from "@/components/shared/DefaultCardComponent";
import Breadcrumb from "@/layouts/Breadcrumb";
import { AlertCircle, BadgeCheck, CheckCheck, Clock, Link, ShieldCheck, Smile, Trash2, X } from 'lucide-react';

const Alert = () => {
    return (
        <>
            <Breadcrumb title="Alert" text="Alert" />

            <LazyWrapper>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    <div className="col-span-1 lg:col-span-6">
                        <DefaultCardComponent title="Default Alerts">
                            <div className="flex flex-col gap-4">
                                <div className="alert alert-blue bg-blue-50 dark:bg-primary/25 text-primary dark:text-blue-400 border-blue-50 px-6 py-[11px] mb-0 font-semibold text-lg rounded-lg flex items-center justify-between" role="alert">
                                    This is a Primary alert
                                    <button className="remove-button cursor-pointer text-primary text-2xl line-height-1">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="alert alert-purple bg-purple-100 dark:bg-purple-600/25 text-purple-600 dark:text-purple-400 border-purple-100 px-6 py-[11px] mb-0 font-semibold text-lg rounded-lg flex items-center justify-between" role="alert">
                                    This is a Secondary alert
                                    <button className="remove-button cursor-pointer dark:text-purple-400 text-2xl line-height-1">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="alert alert-yellow bg-yellow-100 dark:bg-yellow-600/25 text-yellow-600 dark:text-yellow-400 border-yellow-100 px-6 py-[11px] mb-0 font-semibold text-lg rounded-lg flex items-center justify-between" role="alert">
                                    This is a Warning alert
                                    <button className="remove-button cursor-pointer text-yellow-600 text-2xl line-height-1">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="alert alert-cyan bg-cyan-100 dark:bg-cyan-600/25 text-cyan-600 dark:text-cyan-400 border-cyan-100 px-6 py-[11px] mb-0 font-semibold text-lg rounded-lg flex items-center justify-between" role="alert">
                                    This is a Info alert
                                    <button className="remove-button cursor-pointer text-cyan-600 text-2xl line-height-1">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="alert alert-red bg-red-100 dark:bg-red-600/25 text-red-600 dark:text-red-400 border-red-100 px-6 py-[11px] mb-0 font-semibold text-lg rounded-lg flex items-center justify-between" role="alert">
                                    This is a Danger alert
                                    <button className="remove-button cursor-pointer text-red-600 text-2xl line-height-1">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </DefaultCardComponent>
                    </div>

                    <div className="col-span-1 lg:col-span-6">
                        <DefaultCardComponent title="Outline Alerts">
                            <div className="flex flex-col gap-4">
                                <div className="alert alert-blue bg-transparent text-primary border border-primary px-6 py-[11px] mb-0 font-semibold text-lg rounded-lg flex items-center justify-between" role="alert">
                                    This is a Primary alert
                                    <button className="remove-button cursor-pointer text-primary text-2xl line-height-1">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="alert alert-purple bg-transparent text-purple-600 dark:text-purple-400 border border-purple-600 px-6 py-[11px] mb-0 font-semibold text-lg rounded-lg flex items-center justify-between" role="alert">
                                    This is a Secondary alert
                                    <button className="remove-button cursor-pointer dark:text-purple-400 text-2xl line-height-1">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="alert alert-yellow bg-transparent text-yellow-600 border border-yellow-600 px-6 py-[11px] mb-0 font-semibold text-lg rounded-lg flex items-center justify-between" role="alert">
                                    This is a Warning alert
                                    <button className="remove-button cursor-pointer text-yellow-600 text-2xl line-height-1">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="alert alert-cyan bg-transparent text-cyan-600 border border-cyan-600 px-6 py-[11px] mb-0 font-semibold text-lg rounded-lg flex items-center justify-between" role="alert">
                                    This is a Info alert
                                    <button className="remove-button cursor-pointer text-cyan-600 text-2xl line-height-1">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="alert alert-red bg-transparent text-red-600 border border-red-600 px-6 py-[11px] mb-0 font-semibold text-lg rounded-lg flex items-center justify-between" role="alert">
                                    This is a Danger alert
                                    <button className="remove-button cursor-pointer text-red-600 text-2xl line-height-1">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </DefaultCardComponent>
                    </div>

                    <div className="col-span-12">
                        <DefaultCardComponent title="Solid Alerts">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                <div className="col-span-1 lg:col-span-6">
                                    <div className="flex flex-col gap-4">
                                        <div className="alert alert-blue bg-primary text-white border-primary px-6 py-[11px] mb-0 font-semibold text-lg rounded-lg flex items-center justify-between" role="alert">
                                            This is a Primary alert
                                            <button className="remove-button cursor-pointer text-white text-2xl line-height-1">
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <div className="alert alert-green bg-green-600 text-white border-green-600 px-6 py-[11px] mb-0 font-semibold text-lg rounded-lg flex items-center justify-between" role="alert">
                                            This is a Success alert
                                            <button className="remove-button cursor-pointer text-white text-2xl line-height-1">
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <div className="alert alert-cyan bg-cyan-600 text-white border-cyan-600 px-6 py-[11px] mb-0 font-semibold text-lg rounded-lg flex items-center justify-between" role="alert">
                                            This is a Info alert
                                            <button className="remove-button cursor-pointer text-white text-2xl line-height-1">
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-1 lg:col-span-6">
                                    <div className="flex flex-col gap-4">
                                        <div className="alert alert-purple bg-purple-600 text-white border-purple-600 px-6 py-[11px] mb-0 font-semibold text-lg rounded-lg flex items-center justify-between" role="alert">
                                            This is a Secondary alert
                                            <button className="remove-button cursor-pointer text-white text-2xl line-height-1">
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <div className="alert alert-yellow bg-yellow-600 text-white border-yellow-600 px-6 py-[11px] mb-0 font-semibold text-lg rounded-lg flex items-center justify-between" role="alert">
                                            This is a Warning alert
                                            <button className="remove-button cursor-pointer text-white text-2xl line-height-1">
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <div className="alert alert-red bg-red-600 text-white border-red-600 px-6 py-[11px] mb-0 font-semibold text-lg rounded-lg flex items-center justify-between" role="alert">
                                            This is a Danger alert
                                            <button className="remove-button cursor-pointer text-white text-2xl line-height-1">
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </DefaultCardComponent>
                    </div>

                    <div className="col-span-1 lg:col-span-6">
                        <DefaultCardComponent title="Outline Alerts">
                            <div className="flex flex-col gap-4">
                                <div className="alert alert-blue bg-blue-100 dark:bg-primary/25 text-primary dark:text-blue-400 border-blue-50 px-6 py-[11px] mb-0 font-semibold text-lg rounded-lg flex items-center justify-between" role="alert">
                                    <div className="flex items-center gap-2">
                                        <Smile className="w-5 h-5" />
                                        This is a Primary alert
                                    </div>
                                    <button className="remove-button cursor-pointer text-primary text-2xl line-height-1">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="alert alert-purple bg-purple-100 dark:bg-purple-600/25 text-purple-600 dark:text-purple-400 border-purple-100 px-6 py-[11px] mb-0 font-semibold text-lg rounded-lg flex items-center justify-between" role="alert">
                                    <div className="flex items-center gap-2">
                                        <Smile className="w-5 h-5" />
                                        This is a Secondary alert
                                    </div>
                                    <button className="remove-button cursor-pointer text-purple-600 dark:text-purple-400 text-2xl line-height-1">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="alert alert-green bg-green-100 dark:bg-green-600/25 text-green-600 dark:text-green-400 border-green-100 px-6 py-[11px] mb-0 font-semibold text-lg rounded-lg flex items-center justify-between" role="alert">
                                    <div className="flex items-center gap-2">
                                        <CheckCheck className="w-5 h-5" />
                                        This is a Success alert
                                    </div>
                                    <button className="remove-button cursor-pointer text-green-600 text-2xl line-height-1">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="alert alert-yellow bg-yellow-100 dark:bg-yellow-600/25 text-yellow-600 dark:text-yellow-400 border-yellow-100 px-6 py-[11px] mb-0 font-semibold text-lg rounded-lg flex items-center justify-between" role="alert">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5" />
                                        This is a Warning alert
                                    </div>
                                    <button className="remove-button cursor-pointer text-yellow-600 text-2xl line-height-1">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="alert alert-cyan bg-cyan-100 dark:bg-cyan-600/25 text-cyan-600 dark:text-cyan-400 border-cyan-100 px-6 py-[11px] mb-0 font-semibold text-lg rounded-lg flex items-center justify-between" role="alert">
                                    <div className="flex items-center gap-2">
                                        <Link className="w-5 h-5" />
                                        This is a Info alert
                                    </div>
                                    <button className="remove-button cursor-pointer text-cyan-600 text-2xl line-height-1">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="alert alert-red bg-red-100 dark:bg-red-600/25 text-red-600 dark:text-red-400 border-red-100 px-6 py-[11px] mb-0 font-semibold text-lg rounded-lg flex items-center justify-between" role="alert">
                                    <div className="flex items-center gap-2">
                                        <Trash2 className="w-5 h-5" />
                                        This is a Danger alert
                                    </div>
                                    <button className="remove-button cursor-pointer text-red-600 text-2xl line-height-1">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </DefaultCardComponent>
                    </div>

                    <div className="col-span-1 lg:col-span-6">
                        <DefaultCardComponent title="Left Border Alerts">
                            <div className="flex flex-col gap-4">
                                <div className="alert alert-blue bg-blue-100 dark:bg-primary/25 text-primary dark:text-blue-400 border-start-width-4-px border-l-[3px] border-primary dark:border-primary px-6 py-[13px] mb-0 font-semibold text-lg rounded flex items-center justify-between" role="alert">
                                    <div className="flex items-center gap-2">
                                        <Smile className="w-5 h-5" />
                                        This is a Primary alert
                                    </div>
                                    <button className="remove-button cursor-pointer text-primary text-2xl line-height-1">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="alert alert-purple bg-purple-100 dark:bg-purple-600/25 text-purple-600 dark:text-purple-400 border-purple-600 border-start-width-4-px border-l-[3px] dark:border-purple-600 px-6 py-[13px] mb-0 font-semibold text-lg rounded flex items-center justify-between" role="alert">
                                    <div className="flex items-center gap-2">
                                        <Smile className="w-5 h-5" />
                                        This is a Secondary alert
                                    </div>
                                    <button className="remove-button cursor-pointer dark:text-purple-400 text-2xl line-height-1">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="alert alert-green bg-green-100 dark:bg-green-600/25 text-green-600 dark:text-green-400 border-green-600 border-start-width-4-px border-l-[3px] dark:border-green-600 px-6 py-[13px] mb-0 font-semibold text-lg rounded flex items-center justify-between" role="alert">
                                    <div className="flex items-center gap-2">
                                        <CheckCheck className="w-5 h-5" />
                                        This is a Success alert
                                    </div>
                                    <button className="remove-button cursor-pointer text-green-600 text-2xl line-height-1">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="alert alert-yellow bg-yellow-100 dark:bg-yellow-600/25 text-yellow-600 dark:text-yellow-400 border-yellow-600 border-start-width-4-px border-l-[3px] dark:border-yellow-600 px-6 py-[13px] mb-0 font-semibold text-lg rounded flex items-center justify-between" role="alert">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5" />
                                        This is a Warning alert
                                    </div>
                                    <button className="remove-button cursor-pointer text-yellow-600 text-2xl line-height-1">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="alert alert-cyan bg-cyan-100 dark:bg-cyan-600/25 text-cyan-600 dark:text-cyan-400 border-cyan-600 border-start-width-4-px border-l-[3px] dark:border-cyan-600 px-6 py-[13px] mb-0 font-semibold text-lg rounded flex items-center justify-between" role="alert">
                                    <div className="flex items-center gap-2">
                                        <Link className="w-5 h-5" />
                                        This is a Info alert
                                    </div>
                                    <button className="remove-button cursor-pointer text-cyan-600 text-2xl line-height-1">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="alert alert-red bg-red-100 dark:bg-red-600/25 text-red-600 dark:text-red-400 border-red-600 border-start-width-4-px border-l-[3px] dark:border-red-600 px-6 py-[13px] mb-0 font-semibold text-lg rounded flex items-center justify-between" role="alert">
                                    <div className="flex items-center gap-2">
                                        <Trash2 className="w-5 h-5" />
                                        This is a Danger alert
                                    </div>
                                    <button className="remove-button cursor-pointer text-red-600 text-2xl line-height-1">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </DefaultCardComponent>
                    </div>

                    <div className="col-span-1 lg:col-span-6">
                        <DefaultCardComponent title="Default Alerts">
                            <div className="flex flex-col gap-4">
                                <div className="alert alert-blue bg-blue-100 dark:bg-primary/25 text-primary dark:text-blue-400 border-blue-50 px-6 py-[11px] mb-0 font-semibold text-lg rounded-lg" role="alert">
                                    <div className="flex items-center justify-between text-lg">
                                        This is a Primary alert
                                        <button className="remove-button cursor-pointer text-primary text-2xl line-height-1">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <p className="font-medium text-primary text-sm mt-2">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy</p>
                                </div>
                                <div className="alert alert-green bg-green-100 dark:bg-green-600/25 text-green-600 dark:text-green-400 border-green-100 px-6 py-[11px] mb-0 font-semibold text-lg rounded-lg" role="alert">
                                    <div className="flex items-center justify-between text-lg">
                                        This is a Success alert
                                        <button className="remove-button cursor-pointer text-green-600 text-2xl line-height-1">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <p className="font-medium text-green-600 text-sm mt-2">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy</p>
                                </div>
                                <div className="alert alert-yellow bg-yellow-100 dark:bg-yellow-600/25 text-yellow-600 dark:text-yellow-400 border-yellow-100 px-6 py-[11px] mb-0 font-semibold text-lg rounded-lg" role="alert">
                                    <div className="flex items-center justify-between text-lg">
                                        This is a Warning alert
                                        <button className="remove-button cursor-pointer text-yellow-600 text-2xl line-height-1">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <p className="font-medium text-yellow-600 text-sm mt-2">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy</p>
                                </div>
                                <div className="alert alert-cyan bg-cyan-100 dark:bg-cyan-600/25 text-cyan-600 dark:text-cyan-400 border-cyan-100 px-6 py-[11px] mb-0 font-semibold text-lg rounded-lg" role="alert">
                                    <div className="flex items-center justify-between text-lg">
                                        This is a Info alert
                                        <button className="remove-button cursor-pointer text-cyan-600 text-2xl line-height-1">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <p className="font-medium text-cyan-600 text-sm mt-2">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy</p>
                                </div>
                                <div className="alert alert-red bg-red-100 dark:bg-red-600/25 text-red-600 dark:text-red-400 border-red-100 px-6 py-[11px] mb-0 font-semibold text-lg rounded-lg" role="alert">
                                    <div className="flex items-center justify-between text-lg">
                                        This is a Danger alert
                                        <button className="remove-button cursor-pointer text-red-600 text-2xl line-height-1">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <p className="font-medium text-red-600 text-sm mt-2">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy</p>
                                </div>
                            </div>
                        </DefaultCardComponent>
                    </div>

                    <div className="col-span-1 lg:col-span-6">
                        <DefaultCardComponent title="Default Alerts">
                            <div className="flex flex-col gap-4">
                                <div className="alert alert-blue bg-blue-100 dark:bg-primary/25 text-primary dark:text-blue-400 border-blue-50 px-6 py-[11px] mb-0 font-semibold text-lg rounded-lg" role="alert">
                                    <div className="flex items-start justify-between text-lg">
                                        <div className="flex items-start gap-4">
                                            <Smile className="w-5 h-5 mt-1.5 shrink-0" />
                                            <div>
                                                This is a Primary alert
                                                <p className="font-medium text-primary text-sm mt-2">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy</p>
                                            </div>
                                        </div>
                                        <button className="remove-button cursor-pointer text-primary text-2xl line-height-1">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                                <div className="alert alert-green bg-green-100 dark:bg-green-600/25 text-green-600 dark:text-green-400 border-green-100 px-6 py-[11px] mb-0 font-semibold text-lg rounded-lg" role="alert">
                                    <div className="flex items-start justify-between text-lg">
                                        <div className="flex items-start gap-4">
                                            <BadgeCheck className="w-5 h-5 mt-1.5 shrink-0" />
                                            <div>
                                                This is a Success alert
                                                <p className="font-medium text-green-600 text-sm mt-2">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy</p>
                                            </div>
                                        </div>
                                        <button className="remove-button cursor-pointer text-green-600 text-2xl line-height-1">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                                <div className="alert alert-yellow bg-yellow-100 dark:bg-yellow-600/25 text-yellow-600 dark:text-yellow-400 border-yellow-100 px-6 py-[11px] mb-0 font-semibold text-lg rounded-lg" role="alert">
                                    <div className="flex items-start justify-between text-lg">
                                        <div className="flex items-start gap-4">
                                            <Clock className="w-5 h-5 mt-1.5 shrink-0" />
                                            <div>
                                                This is a Warning alert
                                                <p className="font-medium text-yellow-600 text-sm mt-2">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy</p>
                                            </div>
                                        </div>
                                        <button className="remove-button cursor-pointer text-yellow-600 text-2xl line-height-1">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                                <div className="alert alert-cyan bg-cyan-100 dark:bg-cyan-600/25 text-cyan-600 dark:text-cyan-400 border-cyan-100 px-6 py-[11px] mb-0 font-semibold text-lg rounded-lg" role="alert">
                                    <div className="flex items-start justify-between text-lg">
                                        <div className="flex items-start gap-4">
                                            <ShieldCheck className="w-5 h-5 mt-1.5 shrink-0" />
                                            <div>
                                                This is a Info alert
                                                <p className="font-medium text-cyan-600 text-sm mt-2">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy</p>
                                            </div>
                                        </div>
                                        <button className="remove-button cursor-pointer text-cyan-600 text-2xl line-height-1">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                                <div className="alert alert-red bg-red-100 dark:bg-red-600/25 text-red-600 dark:text-red-400 border-red-100 px-6 py-[11px] mb-0 font-semibold text-lg rounded-lg" role="alert">
                                    <div className="flex items-start justify-between text-lg">
                                        <div className="flex items-start gap-4">
                                            <Trash2 className="w-5 h-5 mt-1.5 shrink-0" />
                                            <div>
                                                This is a Danger alert
                                                <p className="font-medium text-red-600 text-sm mt-2">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy</p>
                                            </div>
                                        </div>
                                        <button className="remove-button cursor-pointer text-red-600 text-2xl line-height-1">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </DefaultCardComponent>
                    </div>

                </div>
            </LazyWrapper>

        </>
    );
};

export default Alert;