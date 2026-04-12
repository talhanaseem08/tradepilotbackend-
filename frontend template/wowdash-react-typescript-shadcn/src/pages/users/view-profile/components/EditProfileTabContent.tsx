import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { handleProfileUpdate } from './actions/handleProfileUpdate';
import AvatarUpload from './AvatarUpload';

const EditProfileTabContent = () => {
    return (
        <div>
            <h6 className="text-base text-neutral-600 dark:text-neutral-200 mb-4">Profile Image</h6>
            <div className="mb-6 mt-4">
                <AvatarUpload />
            </div>

            <form action={handleProfileUpdate}>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-x-6">
                    <div className="col-span-12 sm:col-span-6">
                        <div className="mb-5">
                            <Label htmlFor="name" className="inline-block font-semibold text-neutral-600 dark:text-neutral-200 text-sm mb-2">
                                Full Name <span className="text-red-600">*</span>
                            </Label>
                            <Input name="name" type="text" id="name" placeholder="Enter Full Name" required />
                        </div>
                    </div>
                    <div className="col-span-12 sm:col-span-6">
                        <div className="mb-5">
                            <Label htmlFor="email" className="inline-block font-semibold text-neutral-600 dark:text-neutral-200 text-sm mb-2">
                                Email <span className="text-red-600">*</span>
                            </Label>
                            <Input name="email" type="email" id="email" placeholder="Enter email address" required />
                        </div>
                    </div>
                    <div className="col-span-12 sm:col-span-6">
                        <div className="mb-5">
                            <Label htmlFor="number" className="inline-block font-semibold text-neutral-600 dark:text-neutral-200 text-sm mb-2">Phone</Label>
                            <Input name="number" type="tel" id="number" placeholder="Enter phone number" />
                        </div>
                    </div>
                    <div className="col-span-12 sm:col-span-6">
                        <div className="mb-5">
                            <Label htmlFor="department" className="inline-block font-semibold text-neutral-600 dark:text-neutral-200 text-sm mb-2">Department</Label>
                            <Input name="department" id="department" placeholder="Enter Department" />
                        </div>
                    </div>
                    <div className="col-span-12 sm:col-span-6">
                        <div className="mb-5">
                            <Label htmlFor="designation" className="inline-block font-semibold text-neutral-600 dark:text-neutral-200 text-sm mb-2">Designation</Label>
                            <Input name="designation" id="designation" placeholder="Enter Designation" />
                        </div>
                    </div>
                    <div className="col-span-12 sm:col-span-6">
                        <div className="mb-5">
                            <Label htmlFor="language" className="inline-block font-semibold text-neutral-600 dark:text-neutral-200 text-sm mb-2">Language</Label>
                            <Input name="language" id="language" placeholder="Enter Language" />
                        </div>
                    </div>
                    <div className="col-span-12">
                        <div className="mb-5">
                            <Label htmlFor="desc" className="inline-block font-semibold text-neutral-600 dark:text-neutral-200 text-sm mb-2">Description</Label>
                            <Textarea name="desc" id="desc" placeholder="Write Description" />
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-center gap-3">
                    <Button type="reset" variant="outline" className="h-[48px] border border-red-600 bg-transparent hover:bg-red-600/20 text-red-600 text-base px-14 py-[11px] rounded-lg">
                        Cancel
                    </Button>
                    <Button type="submit" className="h-[48px] text-base px-14 py-3 rounded-lg">
                        Save
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default EditProfileTabContent;
