import CommonLink from "@/components/shared/CommonLink";
import { Card, CardContent } from "@/components/ui/card";

const PaymentHistory: React.FC = () => {
    return (
        <Card className="card h-full rounded-lg border-0 !p-0 block">
            <CardContent className="card-body p-0 h-full">
                <div>
                    {/* Header */}
                    <div className="card-header border-b border-neutral-200 dark:border-slate-500 py-4 px-6">
                        <div className="flex items-center flex-wrap gap-2 justify-between">
                            <h6 className="font-bold text-lg mb-0">Payment History</h6>
                            <CommonLink />
                        </div>
                    </div>

                    {/* Users list */}
                    <div className="p-6">
                        <div className="">
                            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-bottom border-neutral-200">
                                <div className="">
                                    <h6 className="text-base mb-0">Digital Assets</h6>
                                    <span className="text-xs text-neutral-600 dark:text-neutral-300 font-medium">18 Nov 2024</span>
                                </div>
                                <div className="">
                                    <h6 className="text-sm mb-1">$450.00</h6>
                                    <span className="text-xs py-[2px] font-medium text-green-600 bg-green-100 dark:bg-green-600/25 dark:text-green-600 rounded-[50rem] px-4">Paid</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-bottom border-neutral-200">
                                <div className="">
                                    <h6 className="text-base mb-0">Electricity</h6>
                                    <span className="text-xs text-neutral-600 dark:text-neutral-300 font-medium">18 Nov 2024</span>
                                </div>
                                <div className="">
                                    <h6 className="text-sm mb-1">$150.00</h6>
                                    <span className="text-xs py-[2px] font-medium text-yellow-600 bg-yellow-100 dark:bg-yellow-600/25 dark:text-yellow-600 rounded-[50rem] px-4">Due</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-bottom border-neutral-200">
                                <div className="">
                                    <h6 className="text-base mb-0">Internet Bill</h6>
                                    <span className="text-xs text-neutral-600 dark:text-neutral-300 font-medium">18 Nov 2024</span>
                                </div>
                                <div className="">
                                    <h6 className="text-sm mb-1">$450.00</h6>
                                    <span className="text-xs py-[2px] font-medium text-red-600 bg-red-100 dark:bg-red-600/25 dark:text-red-600 rounded-[50rem] px-4">Cancel</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-bottom border-neutral-200">
                                <div className="">
                                    <h6 className="text-base mb-0">House rent </h6>
                                    <span className="text-xs text-neutral-600 dark:text-neutral-300 font-medium">18 Nov 2024</span>
                                </div>
                                <div className="">
                                    <h6 className="text-sm mb-1">$450.00</h6>
                                    <span className="text-xs py-[2px] font-medium text-green-600 bg-green-100 dark:bg-green-600/25 dark:text-green-600 rounded-[50rem] px-4">Paid</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="">
                                    <h6 className="text-base mb-0">Office rent</h6>
                                    <span className="text-xs text-neutral-600 dark:text-neutral-300 font-medium">18 Nov 2024</span>
                                </div>
                                <div className="">
                                    <h6 className="text-sm mb-1">$450.00</h6>
                                    <span className="text-xs py-[2px] font-medium text-green-600 bg-green-100 dark:bg-green-600/25 dark:text-green-600 rounded-[50rem] px-4">Paid</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default PaymentHistory;
