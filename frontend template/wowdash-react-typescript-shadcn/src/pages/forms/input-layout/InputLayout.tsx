import LazyWrapper from "@/components/LazyWrapper";
import DefaultCardComponent from "@/components/shared/DefaultCardComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Breadcrumb from "@/layouts/Breadcrumb";
import { cn } from "@/lib/utils";
import { Lock, Mail, PhoneCall, UserRound } from "lucide-react";

const InputLayout = () => {
    return (
        <>
            <Breadcrumb title="Input Layout" text="Input Layout" />

            <LazyWrapper>
                <div className="grid grid-cols-12 gap-5">
                    <div className="md:col-span-6 col-span-12">
                        <DefaultCardComponent title="Vertical Input Form">
                            <div className="flex flex-col gap-4">
                                <div className="">
                                    <Label htmlFor="FirstNameHere" className="text-[#4b5563] dark:text-white mb-2">First Name </Label>
                                    <Input type="text" id="FirstNameHere" className="border border-neutral-300 px-5 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-12 rounded-lg !shadow-none !ring-0" placeholder="First Name" />
                                </div>
                                <div className="">
                                    <Label htmlFor="LastNameTwoss" className="text-[#4b5563] dark:text-white mb-2">Last Name </Label>
                                    <Input type="text" id="LastNameTwoss" className="border border-neutral-300 px-5 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-12 rounded-lg !shadow-none !ring-0" placeholder="Last Name" />
                                </div>
                                <div className="">
                                    <Label htmlFor="UserEmailnad" className="text-[#4b5563] dark:text-white mb-2"> Email </Label>
                                    <Input type="email" id="UserEmailnad" className="border border-neutral-300 px-5 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-12 rounded-lg !shadow-none !ring-0" placeholder="Enter Email" />
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
                                        <Input type="tel" id="InputWithPhone" className="border border-neutral-300 px-5 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-12 rounded-e-lg rounded-s-none !shadow-none !ring-0" placeholder="+1 (555) 000-0000" />
                                    </div>
                                </div>
                                <div className="">
                                    <Label htmlFor="passwordolks" className="text-[#4b5563] dark:text-white mb-2"> Password </Label>
                                    <Input type="password" id="passwordolks" className="border border-neutral-300 px-5 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-12 rounded-lg !shadow-none !ring-0" placeholder="******" />
                                </div>
                                <div className="">
                                    <Button variant="default" className={cn("h-12 px-8")}>Submit</Button>
                                </div>
                            </div>
                        </DefaultCardComponent>
                    </div>

                    <div className="md:col-span-6 col-span-12">
                        <DefaultCardComponent title="Input Form With Icons">
                            <div className="flex flex-col gap-4">
                                <div className="">
                                    <Label htmlFor="FirstNameTwoes" className="text-[#4b5563] dark:text-white mb-2">First Name </Label>
                                    <div className="relative">
                                        <Input type="text" id="FirstNameTwoes" className="border border-neutral-300 ps-12 pe-12 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-12 rounded-lg !shadow-none !ring-0" placeholder="First Name" />
                                        <UserRound className="absolute start-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-700 dark:text-neutral-200" />
                                    </div>
                                </div>
                                <div className="">
                                    <Label htmlFor="LastNamesdsddsg" className="text-[#4b5563] dark:text-white mb-2">Last Name </Label>
                                    <div className="relative">
                                        <Input type="text" id="LastNamesdsddsg" className="border border-neutral-300 ps-12 pe-12 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-12 rounded-lg !shadow-none !ring-0" placeholder="Last Name" />
                                        <UserRound className="absolute start-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-700 dark:text-neutral-200" />
                                    </div>
                                </div>
                                <div className="">
                                    <Label htmlFor="UserEmailesa" className="text-[#4b5563] dark:text-white mb-2"> Email </Label>
                                    <div className="relative">
                                        <Input type="email" id="UserEmailesa" className="border border-neutral-300 ps-12 pe-12 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-12 rounded-lg !shadow-none !ring-0" placeholder="Enter Email" />
                                        <Mail className="absolute start-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-700 dark:text-neutral-200" />
                                    </div>
                                </div>
                                <div className="">
                                    <Label htmlFor="myPhoneTwos" className="text-[#4b5563] dark:text-white mb-2"> Phone </Label>
                                    <div className="relative">
                                        <Input type="tel" id="myPhoneTwos" className="border border-neutral-300 ps-12 pe-12 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-12 rounded-lg !shadow-none !ring-0" placeholder="+1 (555) 000-0000" />
                                        <PhoneCall className="absolute start-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-700 dark:text-neutral-200" />
                                    </div>
                                </div>
                                <div className="">
                                    <Label htmlFor="passwordows" className="text-[#4b5563] dark:text-white mb-2"> Password </Label>
                                    <div className="relative">
                                        <Input type="password" id="passwordows" className="border border-neutral-300 ps-12 pe-12 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-12 rounded-lg !shadow-none !ring-0" placeholder="******" />
                                        <Lock className="absolute start-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-700 dark:text-neutral-200" />
                                    </div>
                                </div>
                                <div className="">
                                    <Button variant="default" className={cn("h-12 px-8")}>Submit</Button>
                                </div>
                            </div>
                        </DefaultCardComponent>
                    </div>

                    <div className="md:col-span-6 col-span-12">
                        <DefaultCardComponent title="Horizontal Input Form">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-5 sm:flex-nowrap flex-wrap">
                                    <Label htmlFor="FirstNameee" className="min-w-[110px] text-[#4b5563] dark:text-white mb-2">First Name </Label>
                                    <Input type="text" id="FirstNameee" className="border border-neutral-300 px-5 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-12 rounded-lg !shadow-none !ring-0" placeholder="First Name" />
                                </div>
                                <div className="flex items-center gap-5 sm:flex-nowrap flex-wrap">
                                    <Label htmlFor="LastNameodsg" className="min-w-[110px] text-[#4b5563] dark:text-white mb-2">Last Name </Label>
                                    <Input type="text" id="LastNameodsg" className="border border-neutral-300 px-5 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-12 rounded-lg !shadow-none !ring-0" placeholder="Last Name" />
                                </div>
                                <div className="flex items-center gap-5 sm:flex-nowrap flex-wrap">
                                    <Label htmlFor="UserEmailsdgaj" className="min-w-[110px] text-[#4b5563] dark:text-white mb-2"> Email </Label>
                                    <Input type="email" id="UserEmailsdgaj" className="border border-neutral-300 px-5 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-12 rounded-lg !shadow-none !ring-0" placeholder="Enter Email" />
                                </div>
                                <div className="flex items-center gap-5 sm:flex-nowrap flex-wrap">
                                    <Label htmlFor="InputWithPhoneTwoo" className="min-w-[110px] text-[#4b5563] dark:text-white mb-2">Input with Phone </Label>
                                    <div className="flex w-full">
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
                                        <Input type="tel" id="InputWithPhoneTwoo" className="border border-neutral-300 px-5 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-12 rounded-e-lg rounded-s-none !shadow-none !ring-0" placeholder="+1 (555) 000-0000" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-5 sm:flex-nowrap flex-wrap">
                                    <Label htmlFor="passworddsg" className="min-w-[110px] text-[#4b5563] dark:text-white mb-2"> Password </Label>
                                    <Input type="password" id="passworddsg" className="border border-neutral-300 px-5 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-12 rounded-lg !shadow-none !ring-0" placeholder="******" />
                                </div>
                                <div className="flex items-center gap-5">
                                    <Button variant="default" className={cn("h-12 px-8")}>Submit</Button>
                                </div>
                            </div>
                        </DefaultCardComponent>
                    </div>

                    <div className="md:col-span-6 col-span-12">
                        <DefaultCardComponent title="Horizontal Input Form With Icons">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-5 sm:flex-nowrap flex-wrap">
                                    <Label htmlFor="FirstNamesGoesHere" className="min-w-[110px] text-[#4b5563] dark:text-white mb-2">First Name </Label>
                                    <div className="relative w-full">
                                        <Input type="text" id="FirstNamesGoesHere" className="border border-neutral-300 ps-12 pe-12 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-12 rounded-lg !shadow-none !ring-0" placeholder="First Name" />
                                        <UserRound className="absolute start-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-700 dark:text-neutral-200" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-5 sm:flex-nowrap flex-wrap">
                                    <Label htmlFor="LastNamesgaxv" className="min-w-[110px] text-[#4b5563] dark:text-white mb-2">Last Name </Label>
                                    <div className="relative w-full">
                                        <Input type="text" id="LastNamesgaxv" className="border border-neutral-300 ps-12 pe-12 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-12 rounded-lg !shadow-none !ring-0" placeholder="Last Name" />
                                        <UserRound className="absolute start-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-700 dark:text-neutral-200" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-5 sm:flex-nowrap flex-wrap">
                                    <Label htmlFor="UserEmaillaks" className="min-w-[110px] text-[#4b5563] dark:text-white mb-2"> Email </Label>
                                    <div className="relative w-full">
                                        <Input type="email" id="UserEmaillaks" className="border border-neutral-300 ps-12 pe-12 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-12 rounded-lg !shadow-none !ring-0" placeholder="Enter Email" />
                                        <Mail className="absolute start-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-700 dark:text-neutral-200" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-5 sm:flex-nowrap flex-wrap">
                                    <Label htmlFor="myPhone" className="min-w-[110px] text-[#4b5563] dark:text-white mb-2"> Phone </Label>
                                    <div className="relative w-full">
                                        <Input type="tel" id="myPhone" className="border border-neutral-300 ps-12 pe-12 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-12 rounded-lg !shadow-none !ring-0" placeholder="+1 (555) 000-0000" />
                                        <PhoneCall className="absolute start-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-700 dark:text-neutral-200" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-5 sm:flex-nowrap flex-wrap">
                                    <Label htmlFor="passwordlsg" className="min-w-[110px] text-[#4b5563] dark:text-white mb-2"> Password </Label>
                                    <div className="relative w-full">
                                        <Input type="password" id="passwordlsg" className="border border-neutral-300 ps-12 pe-12 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-12 rounded-lg !shadow-none !ring-0" placeholder="******" />
                                        <Lock className="absolute start-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-700 dark:text-neutral-200" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-5">
                                    <Button variant="default" className={cn("h-12 px-8")}>Submit</Button>
                                </div>
                            </div>
                        </DefaultCardComponent>
                    </div>
                </div>
            </LazyWrapper>

        </>
    );
};

export default InputLayout;