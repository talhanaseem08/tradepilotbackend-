import LazyWrapper from "@/components/LazyWrapper";
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

const Company = () => {
    return (
        <>
            <Breadcrumb title="Company" text="Company" />

            <LazyWrapper>
                <div>
                    <div className="card h-full rounded-lg border-0 p-6">
                        <div className="card-body p-0">
                            <form>
                                <div className="grid md:grid-cols-2 gap-x-5">
                                    <div className="mb-5">
                                        <Label htmlFor="name" className="text-sm font-semibold mb-2 block text-neutral-900 dark:text-white">Full Name <span className="text-red-600">*</span></Label>
                                        <Input type="text" className="border border-neutral-300 px-5 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-12 rounded-lg !shadow-none !ring-0" id="name" name="name" placeholder="Enter Full Name" />
                                    </div>
                                    <div className="mb-5">
                                        <Label htmlFor="email" className="text-sm font-semibold mb-2 block text-neutral-900 dark:text-white">Email <span className="text-red-600">*</span></Label>
                                        <Input type="email" className="border border-neutral-300 px-5 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-12 rounded-lg !shadow-none !ring-0" id="email" name="email" placeholder="Enter email address" />
                                    </div>
                                    <div className="mb-5">
                                        <Label htmlFor="number" className="text-sm font-semibold mb-2 block text-neutral-900 dark:text-white">Phone Number</Label>
                                        <Input type="tel" className="border border-neutral-300 px-5 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-12 rounded-lg !shadow-none !ring-0" id="number" name="number" placeholder="Enter phone number" />
                                    </div>
                                    <div className="mb-5">
                                        <Label htmlFor="website" className="text-sm font-semibold mb-2 block text-neutral-900 dark:text-white"> Website</Label>
                                        <Input type="url" className="border border-neutral-300 px-5 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-12 rounded-lg !shadow-none !ring-0" id="website" name="website" placeholder="Website URL" />
                                    </div>
                                    <div className="mb-5">
                                        <Label htmlFor="country" className="text-sm font-semibold mb-2 block text-neutral-900 dark:text-white">Country <span className="text-red-600">*</span> </Label>
                                        <Select>
                                            <SelectTrigger id='country' className="border border-neutral-300 px-5 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-12 !rounded-lg !shadow-none !ring-0 !h-[48px] !w-full">
                                                <SelectValue placeholder="Enter Language" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="USA">USA</SelectItem>
                                                <SelectItem value="Bangladesh">Bangladesh</SelectItem>
                                                <SelectItem value="Pakistan">Pakistan</SelectItem>
                                                <SelectItem value="India">India</SelectItem>
                                                <SelectItem value="Canada">Canada</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="mb-5">
                                        <Label htmlFor="city" className="text-sm font-semibold mb-2 block text-neutral-900 dark:text-white">City <span className="text-red-600">*</span> </Label>
                                        <Select>
                                            <SelectTrigger id='city' className="border border-neutral-300 px-5 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-12 !rounded-lg !shadow-none !ring-0 !h-[48px] !w-full">
                                                <SelectValue placeholder="Select City" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Washington">Washington</SelectItem>
                                                <SelectItem value="Dhaka">Dhaka</SelectItem>
                                                <SelectItem value="Lahor">Lahor</SelectItem>
                                                <SelectItem value="Panjab">Panjab</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="mb-5">
                                        <Label htmlFor="state" className="text-sm font-semibold mb-2 block text-neutral-900 dark:text-white">State <span className="text-red-600">*</span> </Label>
                                        <Select>
                                            <SelectTrigger id='state' className="border border-neutral-300 px-5 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-12 !rounded-lg !shadow-none !ring-0 !h-[48px] !w-full">
                                                <SelectValue placeholder="Select State" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Washington">Washington</SelectItem>
                                                <SelectItem value="Dhaka">Dhaka</SelectItem>
                                                <SelectItem value="Lahor">Lahor</SelectItem>
                                                <SelectItem value="Panjab">Panjab</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="mb-5">
                                        <Label htmlFor="zip" className="text-sm font-semibold mb-2 block text-neutral-900 dark:text-white"> Zip Code <span className="text-red-600">*</span></Label>
                                        <Input type="text" className="border border-neutral-300 px-5 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-12 rounded-lg !shadow-none !ring-0" id="zip" name="zip" placeholder="Zip Code" />
                                    </div>
                                    <div className="mb-5 col-span-2">
                                        <Label htmlFor="address" className="text-sm font-semibold mb-2 block text-neutral-900 dark:text-white"> Address <span className="text-red-600">*</span></Label>
                                        <Input type="text" className="border border-neutral-300 px-5 dark:border-slate-500 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-12 rounded-lg !shadow-none !ring-0" id="address" name="address" placeholder="Enter Your Address" />
                                    </div>
                                    <div className="col-span-2 flex items-center justify-center gap-3 mt-6">
                                        <Button type="reset" className="h-[48px] border border-red-600 bg-transparent hover:bg-red-600/20 dark:hover:bg-red-600/20 text-red-600 text-base px-14 py-[11px] rounded-lg">
                                            Reset
                                        </Button>
                                        <Button type="submit" className="h-[48px] text-base px-14 py-3 rounded-lg">
                                            Save Changes
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </LazyWrapper>
        </>
    );
};

export default Company;