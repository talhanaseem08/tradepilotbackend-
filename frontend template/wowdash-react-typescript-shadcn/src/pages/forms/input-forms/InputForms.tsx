import PaymentIcon from "@/assets/images/card/payment-icon.png";
import LazyWrapper from "@/components/LazyWrapper";
import { DatePicker } from "@/components/shared/DatePicker";
import DefaultCardComponent from "@/components/shared/DefaultCardComponent";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Breadcrumb from "@/layouts/Breadcrumb";
import { Copy, Mail } from "lucide-react";

const InputForms = () => {
    return (
        <>
            <Breadcrumb title="Input Forms" text="Input Forms" />

            <LazyWrapper>
                <div className="grid grid-cols-12 gap-5">
                    <div className="md:col-span-6 col-span-12 space-y-6">
                        <div className="h-auto">
                            <DefaultCardComponent title="Default Inputs">
                                <div className="flex flex-col gap-4">
                                    <div className="">
                                        <Label htmlFor="basicInput" className="text-[#4b5563] dark:text-white mb-2">Basic Input </Label>
                                        <Input type="text" id="basicInput" className="border border-neutral-300 px-5 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-12 rounded-lg !shadow-none !ring-0" />
                                    </div>
                                    <div className="">
                                        <Label htmlFor="InputWithPlaceholder" className="text-[#4b5563] dark:text-white mb-2">Input With Placeholder </Label>
                                        <Input type="email" id="InputWithPlaceholder" className="border border-neutral-300 px-5 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-12 rounded-lg !shadow-none !ring-0" placeholder="info@gmail.com" />
                                    </div>
                                    <div className="">
                                        <Label htmlFor="InputWithPhone" className="text-[#4b5563] dark:text-white mb-2">Input With Phone </Label>
                                        <Input type="tel" id="InputWithPhone" className="border border-neutral-300 px-5 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-12 rounded-lg !shadow-none !ring-0" placeholder="+1 (555) 253-08515" />
                                    </div>
                                    <div className="">
                                        <Label htmlFor="InputDate" className="text-[#4b5563] dark:text-white mb-2">Input Date </Label>
                                        <DatePicker />
                                    </div>
                                    <div className="">
                                        <Label htmlFor="InputWithPayment" className="text-[#4b5563] dark:text-white mb-2">Input with Payment </Label>
                                        <div className="flex">
                                            <div className="shrink-0 flex px-2 -ms-[0px] flex items-center justify-center w-[56px] border border-neutral-300 dark:border-slate-500 border-e-0 rounded-s-lg rounded-e-none">
                                                <img src={PaymentIcon} alt="Image" />
                                            </div>
                                            <Input type="text" id="InputWithPayment" className="border border-neutral-300 px-5 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-12 rounded-e-lg rounded-s-none !shadow-none !ring-0" placeholder="Card Number" />
                                        </div>
                                    </div>
                                </div>
                            </DefaultCardComponent>
                        </div>
                        <div className="">
                            <DefaultCardComponent title="Input Group">
                                <div className="flex flex-col gap-4">
                                    <div className="">
                                        <Label htmlFor="MyInput" className="text-[#4b5563] dark:text-white mb-2">Input </Label>
                                        <div className="flex">
                                            <div className="shrink-0 flex px-2 -ms-[0px] flex items-center justify-center w-[42px] border border-neutral-300 dark:border-slate-500 border-e-0 rounded-s-lg rounded-e-none">
                                                <Mail className="w-4" />
                                            </div>
                                            <Input type="text" id="MyInput" className="border border-neutral-300 px-5 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-12 rounded-e-lg rounded-s-none !shadow-none !ring-0" placeholder="info@gmail.com" />
                                        </div>
                                    </div>
                                    <div className="">
                                        <Label htmlFor="MyInputOne" className="text-[#4b5563] dark:text-white mb-2">Input </Label>
                                        <div className="flex">
                                            <div className="shrink-0 flex px-2 -ms-[0px] flex items-center justify-center border border-neutral-300 dark:border-slate-500 border-e-0 rounded-s-lg rounded-e-none">
                                                <Select>
                                                    <SelectTrigger className="border-0 !bg-transparent px-1 text-sm dark:text-white focus:ring-0 focus:ring-offset-0 !h-full">
                                                        <SelectValue placeholder="US" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white dark:bg-slate-900">
                                                        <SelectItem value="US">US</SelectItem>
                                                        <SelectItem value="BD">BD</SelectItem>
                                                        <SelectItem value="AUS">AUS</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <Input type="text" id="MyInputOne" className="border border-neutral-300 px-5 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-12 rounded-e-lg rounded-s-none !shadow-none !ring-0" placeholder="info@gmail.com" />
                                        </div>
                                    </div>
                                    <div className="">
                                        <Label htmlFor="MyInputTwo" className="text-[#4b5563] dark:text-white mb-2">Input </Label>
                                        <div className="flex">
                                            <Input type="text" id="MyInputTwo" className="border border-neutral-300 px-5 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-12 rounded-s-lg rounded-e-none !shadow-none !ring-0" placeholder="info@gmail.com" />
                                            <div className="shrink-0 flex px-2 -ms-[0px] flex items-center justify-center border border-neutral-300 dark:border-slate-500 border-s-0 rounded-e-lg rounded-s-none">
                                                <Select>
                                                    <SelectTrigger className="border-0 !bg-transparent px-1 text-sm dark:text-white focus:ring-0 focus:ring-offset-0 !h-full">
                                                        <SelectValue placeholder="US" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white dark:bg-slate-900">
                                                        <SelectItem value="US">US</SelectItem>
                                                        <SelectItem value="BD">BD</SelectItem>
                                                        <SelectItem value="AUS">AUS</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="">
                                        <Label htmlFor="MyInputHttps" className="text-[#4b5563] dark:text-white mb-2">Input </Label>
                                        <div className="flex">
                                            <div className="shrink-0 flex px-2 -ms-[0px] flex items-center justify-center border border-neutral-300 dark:border-slate-500 border-e-0 rounded-s-lg rounded-e-none">
                                                http://
                                            </div>
                                            <Input type="url" id="MyInputHttps" className="border border-neutral-300 px-5 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-12 rounded-e-lg rounded-s-none !shadow-none !ring-0" placeholder="www.random.com" />
                                        </div>
                                    </div>
                                    <div className="">
                                        <Label htmlFor="MyInputTwoCopy" className="text-[#4b5563] dark:text-white mb-2">Input </Label>
                                        <div className="flex">
                                            <Input type="text" id="MyInputTwoCopy" className="border border-neutral-300 px-5 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-12 rounded-s-lg rounded-e-none !shadow-none !ring-0" placeholder="www.random.com" />
                                            <div className="shrink-0 flex px-2 -ms-[0px] flex items-center justify-center border border-neutral-300 dark:border-slate-500 border-s-0 rounded-e-lg rounded-s-none">
                                                <div className="flex items-center gap-2">
                                                    <Copy className="w-4" />
                                                    Copy
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-sm mt-4 mb-0">This is a hint text to help user.</p>
                                    </div>
                                </div>
                            </DefaultCardComponent>
                        </div>
                    </div>

                    <div className="md:col-span-6 col-span-12 space-y-6">
                        <div className="">
                            <DefaultCardComponent title="Input Group">
                                <div className="flex flex-col gap-4">
                                    <div className="">
                                        <Label htmlFor="InputLarge" className="text-[#4b5563] dark:text-white mb-2">Input Large </Label>
                                        <Input type="email" id="InputLarge" className="border border-neutral-300 px-5 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-[60px] rounded-lg !shadow-none !ring-0" placeholder="info@gmail.com" />
                                    </div>
                                    <div className="">
                                        <Label htmlFor="InputMedium" className="text-[#4b5563] dark:text-white mb-2">Input Medium </Label>
                                        <Input type="email" id="InputMedium" className="border border-neutral-300 px-5 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-[48px] rounded-lg !shadow-none !ring-0" placeholder="info@gmail.com" />
                                    </div>
                                    <div className="">
                                        <Label htmlFor="InputSmall" className="text-[#4b5563] dark:text-white mb-2">Input Small </Label>
                                        <Input type="email" id="InputSmall" className="border border-neutral-300 px-5 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-[40px] rounded-lg !shadow-none !ring-0" placeholder="info@gmail.com" />
                                    </div>
                                </div>
                            </DefaultCardComponent>
                        </div>
                        <div className="">
                            <DefaultCardComponent title="File Input Sizing">
                                <div className="flex flex-col gap-4">
                                    <div className="">
                                        <Label htmlFor="FileInputLarge" className="text-[#4b5563] dark:text-white mb-2"> Large Size File Input </Label>
                                        <Input type="file" id="FileInputLarge" className="border border-neutral-300 px-5 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-[60px] leading-[56px] rounded-lg !shadow-none !ring-0" placeholder="info@gmail.com" />
                                    </div>
                                    <div className="">
                                        <Label htmlFor="FileInputMedium" className="text-[#4b5563] dark:text-white mb-2"> Medium Size File Input </Label>
                                        <Input type="file" id="FileInputMedium" className="border border-neutral-300 px-5 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-[48px] leading-[40px] rounded-lg !shadow-none !ring-0" placeholder="info@gmail.com" />
                                    </div>
                                    <div className="">
                                        <Label htmlFor="FileInputSmall" className="text-[#4b5563] dark:text-white mb-2"> Small Size File Input </Label>
                                        <Input type="file" id="FileInputSmall" className="border border-neutral-300 px-5 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-[40px] leading-[34px] rounded-lg !shadow-none !ring-0" placeholder="info@gmail.com" />
                                    </div>
                                </div>
                            </DefaultCardComponent>
                        </div>
                        <div className="">
                            <DefaultCardComponent title="Custom Forms">
                                <div className="flex flex-col gap-4">
                                    <div className="">
                                        <Label htmlFor="ReadonlyInput" className="text-[#4b5563] dark:text-white mb-2"> Readonly Input </Label>
                                        <Input type="text" id="ReadonlyInput" className="border border-neutral-400 px-5 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-[48px] leading-[56px] rounded-lg !shadow-none !ring-0 bg-neutral-200" placeholder="info@gmail.com" disabled />
                                    </div>
                                    <div className="">
                                        <Label htmlFor="InputWithPhone" className="text-[#4b5563] dark:text-white mb-2">Input with Phone </Label>
                                        <div className="flex">
                                            <div className="shrink-0 flex px-2 -ms-[0px] flex items-center justify-center border border-neutral-300 dark:border-slate-500 border-e-0 rounded-s-lg rounded-e-none">
                                                <Select>
                                                    <SelectTrigger className="border-0 !bg-transparent px-1 text-sm dark:text-white focus:ring-0 focus:ring-offset-0 !h-full">
                                                        <SelectValue placeholder="US" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white dark:bg-slate-900">
                                                        <SelectItem value="US">US</SelectItem>
                                                        <SelectItem value="BD">BD</SelectItem>
                                                        <SelectItem value="AUS">AUS</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <Input type="text" id="InputWithPhone" className="border border-neutral-300 px-5 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-12 rounded-e-lg rounded-s-none !shadow-none !ring-0" placeholder="info@gmail.com" />
                                        </div>
                                    </div>
                                    <div className="">
                                        <Label htmlFor="FileInputMedium" className="text-[#4b5563] dark:text-white mb-2"> Medium Size File Input </Label>
                                        <Input type="file" id="FileInputMedium" className="border border-neutral-300 px-5 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-[48px] leading-[40px] rounded-lg !shadow-none !ring-0" placeholder="info@gmail.com" />
                                    </div>
                                </div>
                            </DefaultCardComponent>
                        </div>
                    </div>

                    <div className="col-span-12">
                        <div className="">
                            <DefaultCardComponent title="Textarea input field">
                                <div className="grid grid-cols-12 gap-5">
                                    <div className="lg:col-span-4 col-span-12">
                                        <Label htmlFor="DescriptionOne" className="text-[#4b5563] dark:text-white mb-2">Description </Label>
                                        <Textarea className="border border-neutral-300 px-5 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-[120px] rounded-lg !shadow-none !ring-0" placeholder="Enter a description..." />
                                    </div>
                                    <div className="lg:col-span-4 col-span-12">
                                        <Label htmlFor="DescriptionTwo" className="text-[#4b5563] dark:text-white mb-2">Description </Label>
                                        <Textarea className="border border-neutral-400 px-5 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-[120px] rounded-lg !shadow-none !ring-0 bg-neutral-200" placeholder="Enter a description..." disabled />
                                    </div>
                                    <div className="lg:col-span-4 col-span-12">
                                        <Label htmlFor="DescriptionThree" className="text-[#4b5563] dark:text-white mb-2">Description </Label>
                                        <Textarea className="border border-red-600 dark:border-red-600 px-5 focus:border-red-600 dark:focus:border-red-600 focus-visible:border-red-600 h-[120px] rounded-lg !shadow-none !ring-0" placeholder="Enter a description..." />
                                        <p className="text-red-600 text-sm mt-2"> Please enter a message in the textarea. </p>
                                    </div>
                                </div>
                            </DefaultCardComponent>
                        </div>
                    </div>
                </div>
            </LazyWrapper>
        </>
    );
};

export default InputForms;