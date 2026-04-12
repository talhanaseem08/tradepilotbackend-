import LazyWrapper from "@/components/LazyWrapper";
import DefaultCardComponent from "@/components/shared/DefaultCardComponent";
import { Input } from "@/components/ui/input";
import Breadcrumb from "@/layouts/Breadcrumb";

const Radio = () => {
    return (
        <>
            <Breadcrumb title="Radio" text="Radio" />

            <LazyWrapper>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <DefaultCardComponent title="Default Radio">
                        <div className="flex items-center flex-wrap gap-7">
                            <div className="flex items-center gap-2">
                                <Input className="!shadow-none !ring-0 !focus:ring-0 rounded-[50rem] peer w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" type="radio" name="radio1" id="radio1" defaultChecked />
                                <label className="peer-checked:text-primary leading-[1] font-medium" htmlFor="radio1"> Radio Active </label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Input className="!shadow-none !ring-0 !focus:ring-0 rounded-[50rem] peer w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" type="radio" name="radio2" id="radio2" defaultChecked />
                                <label className="peer-checked:text-purple-600 leading-[1] font-medium" htmlFor="radio2"> Radio Active </label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Input className="!shadow-none !ring-0 !focus:ring-0 rounded-[50rem] peer w-4 h-4 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" type="radio" name="radio3" id="radio3" defaultChecked />
                                <label className="peer-checked:text-green-600 leading-[1] font-medium" htmlFor="radio3"> Radio Active </label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Input className="!shadow-none !ring-0 !focus:ring-0 rounded-[50rem] peer w-4 h-4 text-yellow-500 bg-gray-100 border-gray-300 focus:ring-yellow-500 dark:focus:ring-yellow-500 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" type="radio" name="radio4" id="radio4" defaultChecked />
                                <label className="peer-checked:text-yellow-500 leading-[1] font-medium" htmlFor="radio4"> Radio Active </label>
                            </div>
                        </div>
                        <div className="flex items-center flex-wrap gap-7 mt-6">
                            <div className="flex items-center gap-2">
                                <Input className="!shadow-none !ring-0 !focus:ring-0 rounded-[50rem] peer w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" type="radio" name="radio" id="radio11" />
                                <label className="peer-checked:text-primary leading-[1] font-medium" htmlFor="radio11"> Radio Inactive </label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Input className="!shadow-none !ring-0 !focus:ring-0 rounded-[50rem] peer w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" type="radio" name="radio" id="radio22" />
                                <label className="peer-checked:text-purple-600 leading-[1] font-medium" htmlFor="radio22"> Radio Inactive </label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Input className="!shadow-none !ring-0 !focus:ring-0 rounded-[50rem] peer w-4 h-4 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" type="radio" name="radio" id="radio33" />
                                <label className="peer-checked:text-green-600 leading-[1] font-medium" htmlFor="radio33"> Radio Inactive </label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Input className="!shadow-none !ring-0 !focus:ring-0 rounded-[50rem] peer w-4 h-4 text-yellow-500 bg-gray-100 border-gray-300 focus:ring-yellow-500 dark:focus:ring-yellow-500 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" type="radio" name="radio" id="radio44" />
                                <label className="peer-checked:text-yellow-500 leading-[1] font-medium" htmlFor="radio44"> Radio Inactive </label>
                            </div>
                        </div>
                    </DefaultCardComponent>

                    <DefaultCardComponent title="Radio Disable">
                        <div className="flex items-center flex-wrap gap-7">
                            <div className="flex items-center gap-2">
                                <Input className="!shadow-none !ring-0 !focus:ring-0 rounded-[50rem] peer w-4 h-4 opacity-75 text-primary bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" type="radio" name="radio11" id="radio111" defaultChecked disabled />
                                <label className="peer-disabled:opacity-75 peer-checked:text-primary leading-[1] font-medium" htmlFor="radio111"> Radio Active </label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Input className="!shadow-none !ring-0 !focus:ring-0 rounded-[50rem] peer w-4 h-4 opacity-75 text-purple-600 bg-gray-100 border-gray-300 focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" type="radio" name="radio22" id="radio222" defaultChecked disabled />
                                <label className="peer-disabled:opacity-75 peer-checked:text-purple-600 leading-[1] font-medium" htmlFor="radio222"> Radio Active </label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Input className="!shadow-none !ring-0 !focus:ring-0 rounded-[50rem] peer w-4 h-4 opacity-75 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" type="radio" name="radio33" id="radio333" defaultChecked disabled />
                                <label className="peer-disabled:opacity-75 peer-checked:text-green-600 leading-[1] font-medium" htmlFor="radio333"> Radio Active </label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Input className="!shadow-none !ring-0 !focus:ring-0 rounded-[50rem] peer w-4 h-4 opacity-75 text-yellow-500 bg-gray-100 border-gray-300 focus:ring-yellow-500 dark:focus:ring-yellow-500 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" type="radio" name="radio44" id="radio444" defaultChecked disabled />
                                <label className="peer-disabled:opacity-75 peer-checked:text-yellow-500 leading-[1] font-medium" htmlFor="radio444"> Radio Active </label>
                            </div>
                        </div>
                        <div className="flex items-center flex-wrap gap-7 mt-6">
                            <div className="flex items-center gap-2">
                                <Input className="!shadow-none !ring-0 !focus:ring-0 rounded-[50rem] peer w-4 h-4 disabled:opacity-75 text-primary bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" type="radio" name="radio0" id="radio1011" disabled />
                                <label className="peer-disabled:opacity-75 peer-checked:text-primary leading-[1] font-medium" htmlFor="radio1011"> Radio Inactive </label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Input className="!shadow-none !ring-0 !focus:ring-0 rounded-[50rem] peer w-4 h-4 disabled:opacity-75 text-purple-600 bg-gray-100 border-gray-300 focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" type="radio" name="radio0" id="radio2022" disabled />
                                <label className="peer-disabled:opacity-75 peer-checked:text-purple-600 leading-[1] font-medium" htmlFor="radio2022"> Radio Inactive </label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Input className="!shadow-none !ring-0 !focus:ring-0 rounded-[50rem] peer w-4 h-4 disabled:opacity-75 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" type="radio" name="radio0" id="radio3033" disabled />
                                <label className="peer-disabled:opacity-75 peer-checked:text-green-600 leading-[1] font-medium" htmlFor="radio3033"> Radio Inactive </label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Input className="!shadow-none !ring-0 !focus:ring-0 rounded-[50rem] peer w-4 h-4 disabled:opacity-75 text-yellow-500 bg-gray-100 border-gray-300 focus:ring-yellow-500 dark:focus:ring-yellow-500 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" type="radio" name="radio0" id="radio4044" disabled />
                                <label className="peer-disabled:opacity-75 peer-checked:text-yellow-500 leading-[1] font-medium" htmlFor="radio4044"> Radio Inactive </label>
                            </div>
                        </div>
                    </DefaultCardComponent>

                    <DefaultCardComponent title="Radio With Button">
                        <div className="flex items-center flex-wrap gap-6">
                            <div className="bg-blue-50 dark:bg-primary/25 px-5 py-3 rounded-lg">
                                <span className="flex items-center gap-2">
                                    <Input className="!shadow-none !ring-0 !focus:ring-0 rounded-[50rem] peer w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" type="radio" name="radio100" id="radio100" defaultChecked />
                                    <label className="peer-checked:text-primary leading-[1] font-medium" htmlFor="radio100"> Radio Active </label>
                                </span>
                            </div>
                            <div className="bg-neutral-100 dark:bg-neutral-600/25 px-5 py-3 rounded-lg">
                                <span className="flex items-center gap-2">
                                    <Input className="!shadow-none !ring-0 !focus:ring-0 rounded-[50rem] peer w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" type="radio" name="radio200" id="radio200" defaultChecked />
                                    <label className="peer-checked:text-purple-600 leading-[1] font-medium" htmlFor="radio200"> Radio Active </label>
                                </span>
                            </div>
                            <div className="bg-green-100 dark:bg-green-600/25 px-5 py-3 rounded-lg">
                                <span className="flex items-center gap-2">
                                    <Input className="!shadow-none !ring-0 !focus:ring-0 rounded-[50rem] peer w-4 h-4 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" type="radio" name="radio300" id="radio300" defaultChecked />
                                    <label className="peer-checked:text-green-600 leading-[1] font-medium" htmlFor="radio300"> Radio Active </label>
                                </span>
                            </div>
                            <div className="bg-yellow-100 dark:bg-yellow-500/25 px-5 py-3 rounded-lg">
                                <span className="flex items-center gap-2">
                                    <Input className="!shadow-none !ring-0 !focus:ring-0 rounded-[50rem] peer w-4 h-4 text-yellow-500 bg-gray-100 border-gray-300 focus:ring-yellow-500 dark:focus:ring-yellow-500 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" type="radio" name="radio4000" id="radio4000" defaultChecked />
                                    <label className="peer-checked:text-yellow-500 leading-[1] font-medium" htmlFor="radio4000"> Radio Active </label>
                                </span>
                            </div>
                            <div className="bg-red-100 dark:bg-red-600/25 px-5 py-3 rounded-lg">
                                <span className="flex items-center gap-2">
                                    <Input className="!shadow-none !ring-0 !focus:ring-0 rounded-[50rem] peer w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" type="radio" name="radio400" id="radio400" defaultChecked />
                                    <label className="peer-checked:text-red-600 leading-[1] font-medium" htmlFor="radio400"> Radio Active </label>
                                </span>
                            </div>
                        </div>
                    </DefaultCardComponent>

                    <DefaultCardComponent title="Radio Horizontal">
                        <div className="flex items-center flex-wrap gap-7">
                            <div className="flex items-center gap-2">
                                <Input className="!shadow-none !ring-0 !focus:ring-0 rounded-[50rem] peer w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" type="radio" name="horizontal" id="horizontal1" />
                                <label className="peer-checked:text-primary leading-[1] font-medium" htmlFor="horizontal1"> Horizontal 1 </label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Input className="!shadow-none !ring-0 !focus:ring-0 rounded-[50rem] peer w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" type="radio" name="horizontal" id="horizontal2" />
                                <label className="peer-checked:text-purple-600 leading-[1] font-medium" htmlFor="horizontal2"> Horizontal 2 </label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Input className="!shadow-none !ring-0 !focus:ring-0 rounded-[50rem] peer w-4 h-4 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" type="radio" name="horizontal" id="horizontal3" />
                                <label className="peer-checked:text-green-600 leading-[1] font-medium" htmlFor="horizontal3"> Horizontal 3 </label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Input className="!shadow-none !ring-0 !focus:ring-0 rounded-[50rem] peer w-4 h-4 text-yellow-500 bg-gray-100 border-gray-300 focus:ring-yellow-500 dark:focus:ring-yellow-500 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" type="radio" name="horizontal" id="horizontal4" />
                                <label className="peer-checked:text-yellow-500 leading-[1] font-medium" htmlFor="horizontal4"> Horizontal 4 </label>
                            </div>
                        </div>
                    </DefaultCardComponent>

                    <DefaultCardComponent title="Radio Vertical">
                        <div className="flex items-start flex-col flex-wrap gap-6">
                            <div className="flex items-center gap-2">
                                <Input className="!shadow-none !ring-0 !focus:ring-0 rounded-[50rem] peer w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" type="radio" name="vertical" id="vertical11" />
                                <label className="peer-checked:text-primary leading-[1] font-medium" htmlFor="vertical11"> Vertical 1 </label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Input className="!shadow-none !ring-0 !focus:ring-0 rounded-[50rem] peer w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" type="radio" name="vertical" id="vertical22" />
                                <label className="peer-checked:text-purple-600 leading-[1] font-medium" htmlFor="vertical22"> Vertical 2 </label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Input className="!shadow-none !ring-0 !focus:ring-0 rounded-[50rem] peer w-4 h-4 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" type="radio" name="vertical" id="vertical33" />
                                <label className="peer-checked:text-green-600 leading-[1] font-medium" htmlFor="vertical33"> Vertical 3 </label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Input className="!shadow-none !ring-0 !focus:ring-0 rounded-[50rem] peer w-4 h-4 text-yellow-500 bg-gray-100 border-gray-300 focus:ring-yellow-500 dark:focus:ring-yellow-500 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" type="radio" name="vertical" id="vertical44" />
                                <label className="peer-checked:text-yellow-500 leading-[1] font-medium" htmlFor="vertical44"> Vertical 4 </label>
                            </div>
                        </div>
                    </DefaultCardComponent>

                </div>
            </LazyWrapper>

        </>
    );
};

export default Radio;