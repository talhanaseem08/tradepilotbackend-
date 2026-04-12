import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import LanguageImg1 from "@/assets/images/flags/flag1.png";
import LanguageImg2 from "@/assets/images/flags/flag2.png";
import LanguageImg3 from "@/assets/images/flags/flag3.png";

const LanguageSelect = () => {
  return (
    <Select>
      <SelectTrigger
        className={cn(
          "focus-visible:ring-0 border-0 bg-gray-200/75 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 !h-10 dark:text-white cursor-pointer data-[state=open]:bg-gray-300 dark:data-[state=open]:bg-slate-600 sm:max-w-[unset] max-w-[80px] px-3 data-[placeholder]:text-neutral-800"
        )}
      >
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="en" className="cursor-pointer">
            <span className="">
              <img
                src={LanguageImg1}
                className="rounded-[50%] sm:flex hidden"
                width={20}
                height={20}
                alt="Flag"
              />
            </span>
            En
          </SelectItem>
          <SelectItem value="bn" className="cursor-pointer">
            <span className="">
              <img
                src={LanguageImg2}
                className="rounded-[50%] sm:flex hidden"
                width={20}
                height={20}
                alt="Flag"
              />
            </span>
            Bn
          </SelectItem>
          <SelectItem value="ar" className="cursor-pointer">
            <span className="">
              <img
                src={LanguageImg3}
                className="rounded-[50%] sm:flex hidden"
                width={20}
                height={20}
                alt="Flag"
              />
            </span>
            Ar
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default LanguageSelect;
