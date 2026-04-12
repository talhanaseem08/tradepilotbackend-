import CommonLink from "@/components/shared/CommonLink";
import { Card, CardContent } from "@/components/ui/card";

const MonthlyExpenseBreakdown: React.FC = () => {
    return (
        <Card className="card h-full rounded-lg border-0 !p-0 block">
            <CardContent className="card-body p-0 h-full">
                <div>
                    {/* Header */}
                    <div className="card-header border-b border-neutral-200 dark:border-slate-500 py-4 px-6">
                        <div className="flex items-center flex-wrap gap-2 justify-between">
                            <h6 className="font-bold text-lg mb-0">Monthly Expense Breakdown</h6>
                            <CommonLink />
                        </div>
                    </div>

                    {/* Users list */}
                    <div className="p-6">
                        <div className="mb-3 flex">
                            <svg xmlns="http://www.w3.org/2000/svg" width="464" height="12" viewBox="0 0 464 12" fill="none">
                                <g clipPath="url(#clip0_6886_52892)">
                                    <rect width="464" height="12" rx="6" fill="#6B7280" />
                                    <rect width="464" height="12" rx="6" fill="#06B6D4" />
                                    <rect width="418" height="12" rx="6" fill="#22C55E" />
                                    <rect width="365" height="12" rx="6" fill="#84CC16" />
                                    <rect width="295" height="12" rx="6" fill="#EAB308" />
                                    <rect width="210" height="12" rx="6" fill="#F59E0B" />
                                    <rect width="111" height="12" rx="6" fill="#F97316" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_6886_52892">
                                        <rect width="464" height="12" rx="6" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-neutral-100 dark:bg-slate-600/25">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-2 bg-orange-600 rounded-[50rem]"></span>
                                <span className="text-neutral-600 dark:text-neutral-300">Healthcare</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-neutral-600 dark:text-neutral-300">$1500</span>
                                <span className="text-neutral-600 dark:text-neutral-300 font-semibold">40%</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-base">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-2 bg-yellow-600 rounded-[50rem]"></span>
                                <span className="text-neutral-600 dark:text-neutral-300">Education</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-neutral-600 dark:text-neutral-300">$1500</span>
                                <span className="text-neutral-600 dark:text-neutral-300 font-semibold">40%</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-neutral-100 dark:bg-slate-600/25">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-2 bg-yellow-600 rounded-[50rem]"></span>
                                <span className="text-neutral-600 dark:text-neutral-300">Clothes</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-neutral-600 dark:text-neutral-300">$1500</span>
                                <span className="text-neutral-600 dark:text-neutral-300 font-semibold">40%</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-base">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-2 bg-green-600 rounded-[50rem]"></span>
                                <span className="text-neutral-600 dark:text-neutral-300">Food</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-neutral-600 dark:text-neutral-300">$1500</span>
                                <span className="text-neutral-600 dark:text-neutral-300 font-semibold">30%</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-neutral-100 dark:bg-slate-600/25">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-2 bg-green-600 rounded-[50rem]"></span>
                                <span className="text-neutral-600 dark:text-neutral-300">Transport</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-neutral-600 dark:text-neutral-300">$1500</span>
                                <span className="text-neutral-600 dark:text-neutral-300 font-semibold">20%</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-base">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-2 bg-cyan-600 rounded-[50rem]"></span>
                                <span className="text-neutral-600 dark:text-neutral-300">Pets</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-neutral-600 dark:text-neutral-300">$1500</span>
                                <span className="text-neutral-600 dark:text-neutral-300 font-semibold">20%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default MonthlyExpenseBreakdown;
