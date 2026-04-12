
import { default as NotificationImg1, default as NotificationImg2 } from "@/assets/images/notification/profile-4.png";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Bell, CircleCheck } from "lucide-react";
import { Link } from "react-router-dom";

const NotificationDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          className={cn(
            "rounded-[50%] sm:w-10 sm:h-10 w-8 h-8 text-neutral-900 dark:text-white bg-gray-200/75 hover:bg-gray-200 focus-visible:ring-0 dark:bg-slate-600 dark:hover:bg-slate-500 border-0 cursor-pointer data-[state=open]:bg-gray-300 dark:data-[state=open]:bg-slate-500"
          )}
        >
          <Bell className="h-[5.2rem] w-[5.2rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="sm:w-[400px] max-h-[unset] me-6 p-0 rounded-2xl overflow-hidden shadow-lg block">
        <div className="">
          <div className="py-3 px-4 rounded-lg bg-primary/10 dark:bg-primary/25 m-4 flex items-center justify-between gap-2">
            <h6 className="text-lg text-neutral-900 dark:text-white font-semibold mb-0">
              Notification
            </h6>
            <span className="sm:w-10 sm:h-10 w-8 h-8 bg-white dark:bg-slate-800 text-primary dark:text-primary font-bold flex justify-center items-center rounded-full">
              05
            </span>
          </div>
          <div className="scroll-sm !border-t-0">
            <div className="max-h-[400px] overflow-y-auto scrollbar-thin">
              <Link
                to="#"
                className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 justify-between gap-1"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 relative w-11 h-11 bg-green-200 dark:bg-green-600 text-green flex justify-center items-center rounded-full">
                    <CircleCheck />
                  </div>
                  <div>
                    <h6 className="text-sm fw-semibold mb-1">
                      Congratulations
                    </h6>
                    <p className="mb-0 text-sm line-clamp-1">
                      Your profile has been Verified. Your profile has been
                      Verified
                    </p>
                  </div>
                </div>
                <div className="shrink-0">
                  <span className="text-sm text-neutral-500 dark:text-neutral-300">
                    23 Mins ago
                  </span>
                </div>
              </Link>
              <Link
                to="#"
                className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 justify-between gap-1"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 relative">
                    <img
                      src={NotificationImg1}
                      className="rounded-[50%]"
                      width={40}
                      height={40}
                      alt="User Image"
                    />
                  </div>
                  <div>
                    <h6 className="text-sm fw-semibold mb-1">Robiul Hasan</h6>
                    <p className="mb-0 text-sm line-clamp-1">
                      You can stitch between art boards
                    </p>
                  </div>
                </div>
                <div className="shrink-0">
                  <span className="text-sm text-neutral-500 dark:text-neutral-300">
                    23 Mins ago
                  </span>
                </div>
              </Link>
              <Link
                to="#"
                className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 justify-between gap-1"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 relative w-11 h-11 bg-blue-100 dark:bg-primary/25 text-primary flex justify-center items-center rounded-full">
                    AM
                  </div>
                  <div>
                    <h6 className="text-sm fw-semibold mb-1">Arlene McCoy</h6>
                    <p className="mb-0 text-sm line-clamp-1">
                      Invite you to prototyping
                    </p>
                  </div>
                </div>
                <div className="shrink-0">
                  <span className="text-sm text-neutral-500 dark:text-neutral-300">
                    23 Mins ago
                  </span>
                </div>
              </Link>
              <Link
                to="#"
                className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 justify-between gap-1"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 relative">
                    <img
                      src={NotificationImg2}
                      className="rounded-[50%]"
                      width={40}
                      height={40}
                      alt="User Image"
                    />
                  </div>
                  <div>
                    <h6 className="text-sm fw-semibold mb-1">Annette Black</h6>
                    <p className="mb-0 text-sm line-clamp-1">
                      Invite you to prototyping
                    </p>
                  </div>
                </div>
                <div className="shrink-0">
                  <span className="text-sm text-neutral-500 dark:text-neutral-300">
                    23 Mins ago
                  </span>
                </div>
              </Link>
              <Link
                to="#"
                className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 justify-between gap-1"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 relative w-11 h-11 bg-blue-100 dark:bg-primary/25 text-primary flex justify-center items-center rounded-full">
                    DR
                  </div>
                  <div>
                    <h6 className="text-sm fw-semibold mb-1">
                      Darlene Robertson
                    </h6>
                    <p className="mb-0 text-sm line-clamp-1">
                      Invite you to prototyping
                    </p>
                  </div>
                </div>
                <div className="shrink-0">
                  <span className="text-sm text-neutral-500 dark:text-neutral-300">
                    23 Mins ago
                  </span>
                </div>
              </Link>
            </div>

            <div className="text-center py-3 px-4">
              <Link
                to="#"
                className="text-primary dark:text-primary font-semibold hover:underline text-center"
              >
                See All Message{" "}
              </Link>
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
