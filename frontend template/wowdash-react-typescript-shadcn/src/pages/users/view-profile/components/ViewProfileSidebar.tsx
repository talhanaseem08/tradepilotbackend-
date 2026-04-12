import UserGridBgImageHere from '@/assets/images/user-grid/user-grid-bg1.png';
import UserGridImageHere from '@/assets/images/user-grid/user-grid-img14.png';


const ViewProfileSidebar = () => {
    return (
        <div className="user-grid-card relative border border-slate-200 dark:border-slate-600 rounded-2xl overflow-hidden bg-white dark:bg-[#273142] h-full">
            <img src={UserGridBgImageHere} alt="" className="w-full object-fit-cover" />
            <div className="pb-6 ms-6 mb-6 me-6 -mt-[100px]">
                <div className="text-center border-b border-slate-200 dark:border-slate-600">
                    <img src={UserGridImageHere} alt="" className="border br-white border-width-2-px w-200-px h-[200px] rounded-full object-fit-cover mx-auto" />
                    <h6 className="mb-0 mt-4">Robiul Hasan</h6>
                    <span className="text-neutral-500 dark:text-neutral-300 mb-4">ifrandom@gmail.com</span>
                </div>
                <div className="mt-6">
                    <h6 className="text-xl mb-4">Personal Info</h6>
                    <ul>
                        <li className="flex items-center gap-1 mb-3">
                            <span className="w-[30%] text-base font-semibold text-neutral-600 dark:text-neutral-200">Full Name</span>
                            <span className="w-[70%] text-neutral-500 dark:text-neutral-300 font-medium">: Robiul Hasan</span>
                        </li>
                        <li className="flex items-center gap-1 mb-3">
                            <span className="w-[30%] text-base font-semibold text-neutral-600 dark:text-neutral-200"> Email</span>
                            <span className="w-[70%] text-neutral-500 dark:text-neutral-300 font-medium">: robiulhasan9559@gmail.com</span>
                        </li>
                        <li className="flex items-center gap-1 mb-3">
                            <span className="w-[30%] text-base font-semibold text-neutral-600 dark:text-neutral-200"> Phone Number</span>
                            <span className="w-[70%] text-neutral-500 dark:text-neutral-300 font-medium">: (1) 2536 2561 2365</span>
                        </li>
                        <li className="flex items-center gap-1 mb-3">
                            <span className="w-[30%] text-base font-semibold text-neutral-600 dark:text-neutral-200"> Department</span>
                            <span className="w-[70%] text-neutral-500 dark:text-neutral-300 font-medium">: Development</span>
                        </li>
                        <li className="flex items-center gap-1 mb-3">
                            <span className="w-[30%] text-base font-semibold text-neutral-600 dark:text-neutral-200"> Designation</span>
                            <span className="w-[70%] text-neutral-500 dark:text-neutral-300 font-medium">: Front End Developer</span>
                        </li>
                        <li className="flex items-center gap-1 mb-3">
                            <span className="w-[30%] text-base font-semibold text-neutral-600 dark:text-neutral-200"> Languages</span>
                            <span className="w-[70%] text-neutral-500 dark:text-neutral-300 font-medium">: English</span>
                        </li>
                        <li className="flex items-center gap-1">
                            <span className="w-[30%] text-base font-semibold text-neutral-600 dark:text-neutral-200"> Bio</span>
                            <span className="w-[70%] text-neutral-500 dark:text-neutral-300 font-medium">: Lorem Ipsum is simply dummy text of the printing and typesetting industry.</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ViewProfileSidebar;