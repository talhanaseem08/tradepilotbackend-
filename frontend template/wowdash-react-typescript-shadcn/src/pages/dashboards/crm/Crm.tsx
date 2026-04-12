import LazyWrapper from "@/components/LazyWrapper";
import Breadcrumb from "@/layouts/Breadcrumb";
import { lazy } from "react";
const TopPerformerCard = lazy(() => import("../dashboard/components/TopPerformerCard"))
const CampaignCard = lazy(() => import("./components/CampaignCard"))
const ClientPaymentStatusCard = lazy(() => import("./components/ClientPaymentStatusCard"))
const CountriesStatusCard = lazy(() => import("./components/CountriesStatusCard"))
const CustomerOverviewCard = lazy(() => import("./components/CustomerOverviewCard"))
const EarningStatisticsCard = lazy(() => import("./components/EarningStatisticsCard"))
const LastTransactionCard = lazy(() => import("./components/LastTransactionCard"))
const RevenueGrowthCard = lazy(() => import("./components/RevenueGrowthCard"))
const StatsCard = lazy(() => import("./components/StatsCard"))
const TodoListRecentCard = lazy(() => import("./components/TodoListRecentCard"))

const Crm = () => {
    return (
        <>
            <Breadcrumb title="CRM" text="CRM" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">

                <div className="lg:col-span-12 2xl:col-span-8">
                    <LazyWrapper>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            <StatsCard />
                        </div>
                    </LazyWrapper>
                </div>

                <div className="lg:col-span-12 2xl:col-span-4">
                    <LazyWrapper>
                        <RevenueGrowthCard />
                    </LazyWrapper>
                </div>

                <div className="lg:col-span-12 2xl:col-span-8">
                    <LazyWrapper>
                        <EarningStatisticsCard />
                    </LazyWrapper>
                </div>

                <div className="lg:col-span-12 2xl:col-span-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-6 2xl:col-span-12 col-xxl-12 col-sm-6">
                            <LazyWrapper>
                                <CampaignCard />
                            </LazyWrapper>
                        </div>
                        <div className="lg:col-span-6 2xl:col-span-12 col-xxl-12 col-sm-6">
                            <LazyWrapper>
                                <CustomerOverviewCard />
                            </LazyWrapper>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-6 2xl:col-span-4">
                    <LazyWrapper>
                        <ClientPaymentStatusCard />
                    </LazyWrapper>
                </div>

                <div className="lg:col-span-6 2xl:col-span-4">
                    <LazyWrapper>
                        <CountriesStatusCard />
                    </LazyWrapper>
                </div>

                <div className="lg:col-span-12 2xl:col-span-4">
                    <LazyWrapper>
                        <TopPerformerCard listClasses="space-y-6 max-h-[458px] overflow-y-auto scrollbar-thin scrollbar-invisible hover:scrollbar-visible" />
                    </LazyWrapper>
                </div>

                <div className="lg:col-span-12 2xl:col-span-6">
                    <LazyWrapper>
                        <TodoListRecentCard />
                    </LazyWrapper>
                </div>

                <div className="lg:col-span-12 2xl:col-span-6">
                    <LazyWrapper>
                        <LastTransactionCard />
                    </LazyWrapper>
                </div>

            </div>
        </>
    );
};

export default Crm;