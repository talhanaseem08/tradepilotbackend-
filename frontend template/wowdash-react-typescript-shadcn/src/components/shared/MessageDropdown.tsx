
import NotificationImg1 from '@/assets/images/notification/profile-3.png';
import NotificationImg2 from '@/assets/images/notification/profile-4.png';
import NotificationImg3 from '@/assets/images/notification/profile-5.png';
import NotificationImg4 from '@/assets/images/notification/profile-6.png';
import NotificationImg5 from '@/assets/images/notification/profile-7.png';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { Mail } from 'lucide-react';
import { Link } from "react-router-dom";

const MessageDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          className={cn(
            'rounded-[50%] sm:w-10 sm:h-10 w-8 h-8 text-neutral-900 dark:text-white bg-gray-200/75 hover:bg-gray-200 focus-visible:ring-0 dark:bg-slate-600 dark:hover:bg-slate-500 border-0 cursor-pointer data-[state=open]:bg-gray-300 dark:data-[state=open]:bg-slate-500'
          )}
        >
          <Mail />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="sm:w-[400px] max-h-[unset] me-6 p-0 rounded-2xl overflow-hidden shadow-lg block">
        <div className="">
          <div className="py-3 px-4 rounded-lg bg-primary/10 dark:bg-primary/25 m-4 flex items-center justify-between gap-2">
            <h6 className="text-lg text-neutral-900 dark:text-white font-semibold mb-0">Message</h6>
            <span className="sm:w-10 sm:h-10 w-8 h-8 bg-white dark:bg-slate-800 text-primary dark:text-primary font-bold flex justify-center items-center rounded-full">05</span>
          </div>
          <div className="scroll-sm !border-t-0">
            <div className="max-h-[400px] overflow-y-auto scrollbar-thin">
              <Link to="#" className="flex px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-600 justify-between gap-1">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 relative">
                    <img
                      src={NotificationImg1}
                      className="rounded-[50%]"
                      width={40}
                      height={40}
                      alt="User Image"
                    />
                    <span className="absolute end-[2px] -bottom-[1px] w-2.5 h-2.5 bg-green-500 border border-white rounded-full dark:border-gray-600"></span>
                  </div>
                  <div>
                    <h6 className="text-sm fw-semibold mb-1">Kathryn Murphy</h6>
                    <p className="mb-0 text-sm line-clamp-1">hey! there i'm...</p>
                  </div>
                </div>
                <div className="shrink-0 flex flex-col items-end gap-1">
                  <span className="text-sm text-neutral-500 dark:text-neutral-300">12:30 PM</span>
                  <span className="w-4 h-4 text-xs bg-yellow-600 dark:bg-yellow-600 text-white rounded-full flex justify-center items-center">8</span>
                </div>
              </Link>
              <Link to="#" className="flex px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-600 justify-between gap-1">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 relative">
                    <img
                      src={NotificationImg2}
                      className="rounded-[50%]"
                      width={40}
                      height={40}
                      alt="User Image"
                    />
                    <span className="absolute end-[2px] -bottom-[1px] w-2.5 h-2.5 bg-green-500 border border-white rounded-full dark:border-gray-600"></span>
                  </div>
                  <div>
                    <h6 className="text-sm fw-semibold mb-1">Robiul Hasan</h6>
                    <p className="mb-0 text-sm line-clamp-1">hey! there i'm...</p>
                  </div>
                </div>
                <div className="shrink-0 flex flex-col items-end gap-1">
                  <span className="text-sm text-neutral-500 dark:text-neutral-300">12:30 PM</span>
                  <span className="w-4 h-4 text-xs bg-yellow-600 dark:bg-yellow-600 text-white rounded-full flex justify-center items-center">8</span>
                </div>
              </Link>
              <Link to="#" className="flex px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-600 justify-between gap-1">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 relative">
                    <img
                      src={NotificationImg3}
                      className="rounded-[50%]"
                      width={40}
                      height={40}
                      alt="User Image"
                    />
                    <span className="absolute end-[2px] -bottom-[1px] w-2.5 h-2.5 bg-green-500 border border-white rounded-full dark:border-gray-600"></span>
                  </div>
                  <div>
                    <h6 className="text-sm fw-semibold mb-1">Kathryn Murphy</h6>
                    <p className="mb-0 text-sm line-clamp-1">hey! there i'm...</p>
                  </div>
                </div>
                <div className="shrink-0 flex flex-col items-end gap-1">
                  <span className="text-sm text-neutral-500 dark:text-neutral-300">12:30 PM</span>
                  <span className="w-4 h-4 text-xs bg-yellow-600 dark:bg-yellow-600 text-white rounded-full flex justify-center items-center">8</span>
                </div>
              </Link>
              <Link to="#" className="flex px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-600 justify-between gap-1">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 relative">
                    <img
                      src={NotificationImg4}
                      className="rounded-[50%]"
                      width={40}
                      height={40}
                      alt="User Image"
                    />
                    <span className="absolute end-[2px] -bottom-[1px] w-2.5 h-2.5 bg-green-500 border border-white rounded-full dark:border-gray-600"></span>
                  </div>
                  <div>
                    <h6 className="text-sm fw-semibold mb-1">Kathryn Murphy</h6>
                    <p className="mb-0 text-sm line-clamp-1">hey! there i'm...</p>
                  </div>
                </div>
                <div className="shrink-0 flex flex-col items-end gap-1">
                  <span className="text-sm text-neutral-500 dark:text-neutral-300">12:30 PM</span>
                  <span className="w-4 h-4 text-xs bg-yellow-600 dark:bg-yellow-600 text-white rounded-full flex justify-center items-center">8</span>
                </div>
              </Link>
              <Link to="#" className="flex px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-600 justify-between gap-1">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 relative">
                    <img
                      src={NotificationImg5}
                      className="rounded-[50%]"
                      width={40}
                      height={40}
                      alt="User Image"
                    />
                    <span className="absolute end-[2px] -bottom-[1px] w-2.5 h-2.5 bg-green-500 border border-white rounded-full dark:border-gray-600"></span>
                  </div>
                  <div>
                    <h6 className="text-sm fw-semibold mb-1">Kathryn Murphy</h6>
                    <p className="mb-0 text-sm line-clamp-1">hey! there i'm...</p>
                  </div>
                </div>
                <div className="shrink-0 flex flex-col items-end gap-1">
                  <span className="text-sm text-neutral-500 dark:text-neutral-300">12:30 PM</span>
                  <span className="w-4 h-4 text-xs bg-yellow-600 dark:bg-yellow-600 text-white rounded-full flex justify-center items-center">8</span>
                </div>
              </Link>
            </div>

            <div className="text-center py-3 px-4">
              <Link to="#" className="text-primary dark:text-primary font-semibold hover:underline text-center">See All Message </Link>
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default MessageDropdown;