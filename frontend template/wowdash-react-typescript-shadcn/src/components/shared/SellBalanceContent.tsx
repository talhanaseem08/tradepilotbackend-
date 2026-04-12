import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const SellBalanceContent = () => {
  return (
    <div className="space-y-5">
      <div>
        <Label
          htmlFor="sellAmount"
          className="font-semibold mb-2 block text-neutral-600 dark:text-white"
        >
          Sell Amount
        </Label>
        <Input
          id="sellAmount"
          placeholder="Enter amount to sell"
          className="border border-neutral-200 dark:border-slate-700 focus:border-primary dark:focus:border-primary focus-visible:border-primary h-11 rounded-lg !shadow-none !ring-0"
        />
      </div>

      <div>
        <Label
          htmlFor="reason"
          className="font-semibold mb-2 block text-neutral-600 dark:text-white"
        >
          Reason for Selling
        </Label>
        <Textarea
          id="reason"
          placeholder="Enter your reason"
          className="border border-neutral-200 dark:border-slate-700 focus:border-primary dark:focus:border-primary focus-visible:border-primary rounded-lg !shadow-none !ring-0 h-[100px]"
        />
      </div>

      <div className="mb-6">
        <span className="mb-1.5 text-sm text-neutral-500 dark:text-neutral-300">
          Available Balance
        </span>
        <h6 className="mb-1.5 font-semibold text-xl text-red-500 dark:text-red-500">
          $124,000.00
        </h6>
      </div>

      <Button variant="default" className="w-full h-11">
        Sell Now
      </Button>
    </div>
  );
};

export default SellBalanceContent;
