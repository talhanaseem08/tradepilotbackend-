import LazyWrapper from "@/components/LazyWrapper";
import Breadcrumb from "@/layouts/Breadcrumb";
import { lazy } from "react";
const AverageDailySalesCard = lazy(() => import("./components/AverageDailySalesCard"))
const MonthlyCampaignStateCard = lazy(() => import("./components/MonthlyCampaignStateCard"))
const RecentActivityCard = lazy(() => import("./components/RecentActivityCard"))
const RevenueStatisticCard = lazy(() => import("./components/RevenueStatisticCard"))
const SalesByCountriesCard = lazy(() => import("./components/SalesByCountriesCard"))
const SourceVisitorsCard = lazy(() => import("./components/SourceVisitorsCard"))
const SupportTrackerCard = lazy(() => import("./components/SupportTrackerCard"))
const TransactionsCard = lazy(() => import("./components/TransactionsCard"))
const UpgradePlanCard = lazy(() => import("./components/UpgradePlanCard"))

const Analytics = () => {
    return (
        <>
            <Breadcrumb title="Analytics" text="Analytics" />

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                <div className="col-span-12 2xl:col-span-6">
                    <LazyWrapper>
                        <UpgradePlanCard />
                    </LazyWrapper>
                </div>

                <div className="col-span-12 2xl:col-span-6">
                    <LazyWrapper>
                        <RevenueStatisticCard />
                    </LazyWrapper>
                </div>

                <div className="col-span-12 xl:col-span-6 2xl:col-span-4">
                    <LazyWrapper>
                        <SupportTrackerCard />
                    </LazyWrapper>
                </div>

                <div className="col-span-12 xl:col-span-6 2xl:col-span-4">
                    <LazyWrapper>
                        <AverageDailySalesCard />
                    </LazyWrapper>
                </div>

                <div className="col-span-12 2xl:col-span-4">
                    <LazyWrapper>
                        <TransactionsCard />
                    </LazyWrapper>
                </div>

                <div className="col-span-12 2xl:col-span-6">
                    <LazyWrapper>
                        <SalesByCountriesCard />
                    </LazyWrapper>
                </div>

                <div className="col-span-12 2xl:col-span-6">
                    <LazyWrapper>
                        <SourceVisitorsCard />
                    </LazyWrapper>
                </div>

                <div className="col-span-12 2xl:col-span-4">
                    <LazyWrapper>
                        <MonthlyCampaignStateCard />
                    </LazyWrapper>
                </div>

                <div className="col-span-12 2xl:col-span-8">
                    <LazyWrapper>
                        <RecentActivityCard />
                    </LazyWrapper>
                </div>

            </div>
        </>
    );
};

export default Analytics;