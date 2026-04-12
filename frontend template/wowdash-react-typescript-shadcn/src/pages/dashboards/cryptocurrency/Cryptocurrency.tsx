import LazyWrapper from "@/components/LazyWrapper";
import Breadcrumb from "@/layouts/Breadcrumb";
import { lazy } from "react";
const CoinAnalyticsCard = lazy(() => import("./components/CoinAnalyticsCard"))
const MarketInfoCard = lazy(() => import("./components/MarketInfoCard"))
const MasterCard = lazy(() => import("./components/MasterCard"))
const MyOrderCard = lazy(() => import("./components/MyOrderCard"))
const RecentTransactionCard = lazy(() => import("./components/RecentTransactionCard"))
const StatsCard = lazy(() => import("./components/StatsCard"))
const TotalBalanceCard = lazy(() => import("./components/TotalBalanceCard"))
const UsersActivateCard = lazy(() => import("./components/UsersActivateCard"))

const Cryptocurrency = () => {
    return (
        <>
            <Breadcrumb title="Cryptocurrency" text="Cryptocurrency" />

            <LazyWrapper>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-5 gap-6">
                    <StatsCard />
                </div>
            </LazyWrapper>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-6">
                <div className="xl:col-span-12 2xl:col-span-8">
                    <div className="grid grid-cols-1 2xl:grid-cols-12 gap-6">
                        <div className="col-span-12">
                            <LazyWrapper>
                                <CoinAnalyticsCard />
                            </LazyWrapper>
                        </div>

                        <div className="col-span-12 2xl:col-span-6">
                            <LazyWrapper>
                                <MarketInfoCard />
                            </LazyWrapper>
                        </div>

                        <div className="col-span-12 2xl:col-span-6">
                            <LazyWrapper>
                                <MyOrderCard />
                            </LazyWrapper>
                        </div>

                        <div className="col-span-12">
                            <LazyWrapper>
                                <RecentTransactionCard />
                            </LazyWrapper>
                        </div>
                    </div>
                </div>

                <div className="xl:col-span-12 2xl:col-span-4">
                    <div className="space-y-6">
                        <LazyWrapper>
                            <MasterCard />
                        </LazyWrapper>
                        <LazyWrapper>
                            <TotalBalanceCard />
                        </LazyWrapper>
                        <LazyWrapper>
                            <UsersActivateCard />
                        </LazyWrapper>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Cryptocurrency;
