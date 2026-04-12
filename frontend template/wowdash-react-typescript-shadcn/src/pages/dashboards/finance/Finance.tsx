import LazyWrapper from "@/components/LazyWrapper";
import Breadcrumb from "@/layouts/Breadcrumb";
import { lazy } from "react";
const StateCards = lazy(() => import("./components/StatisticsCard"))
const BalanceStatistic = lazy(() => import("./components/BalanceStatistic"))
const EarningCategories = lazy(() => import("./components/EarningCategories"))
const ExpenseStatisticsCard = lazy(() => import("./components/ExpenseStatisticsCard"))
const PaymentHistory = lazy(() => import("./components/PaymentHistory"))
const MonthlyExpenseBreakdown = lazy(() => import("./components/MonthlyExpenseBreakdown"))
const QuickTransfer = lazy(() => import("./components/QuickTransfer"))
const InvestmentCard = lazy(() => import("./components/InvestmentCard"))
const TransactionHistoryCard = lazy(() => import("./components/TransactionHistoryCard"))

const Finance = () => {
    return (
        <>
            <Breadcrumb title="Finance" text="Finance" />

            <LazyWrapper>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
                    <StateCards />
                </div>
            </LazyWrapper>

            <div className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
                    <div className="col-span-12 xl:col-span-8">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            <div className="col-span-12">
                                <LazyWrapper>
                                    <BalanceStatistic />
                                </LazyWrapper>
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <LazyWrapper>
                                    <EarningCategories />
                                </LazyWrapper>
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <LazyWrapper>
                                    <ExpenseStatisticsCard />
                                </LazyWrapper>
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <LazyWrapper>
                                    <PaymentHistory />
                                </LazyWrapper>
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <LazyWrapper>
                                    <MonthlyExpenseBreakdown />
                                </LazyWrapper>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-12 xl:col-span-4">
                        <div className="flex flex-col gap-6">
                            <LazyWrapper>
                                <QuickTransfer />
                            </LazyWrapper>
                            <LazyWrapper>
                                <InvestmentCard />
                            </LazyWrapper>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-6 lg:block hidden">
                <LazyWrapper>
                    <TransactionHistoryCard />
                </LazyWrapper>
            </div>

        </>
    );
};

export default Finance;