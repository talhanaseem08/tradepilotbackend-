import LazyWrapper from "@/components/LazyWrapper";
import Breadcrumb from "@/layouts/Breadcrumb";
import { lazy } from "react";
const LatestInvestmentsCard = lazy(() => import("./components/LatestInvestmentsCard"))
const MostLocationCard = lazy(() => import("./components/MostLocationCard"))
const MyPortfolioCard = lazy(() => import("./components/MyPortfolioCard"))
const NoticeBoardCard = lazy(() => import("./components/NoticeBoardCard"))
const ProjectStatusCard = lazy(() => import("./components/ProjectStatusCard"))
const RevenueStatisticsCard = lazy(() => import("./components/RevenueStatisticsCard"))
const StaticCard = lazy(() => import("./components/StaticCard"))
const StatsCard = lazy(() => import("./components/StatsCard"))
const TotalTransactionsCard = lazy(() => import("./components/TotalTransactionsCard"))

const Investment = () => {
    return (
        <>
            <Breadcrumb title="Investment" text="Investment" />

            <LazyWrapper>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4 gap-6">
                    <StatsCard />
                </div>
            </LazyWrapper>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
                <div className="col-span-12 2xl:col-span-8">
                    <LazyWrapper>
                        <RevenueStatisticsCard />
                    </LazyWrapper>
                </div>
                <div className="col-span-12 lg:col-span-6 2xl:col-span-4">
                    <LazyWrapper>
                        <StaticCard />
                    </LazyWrapper>
                </div>
                <div className="col-span-12 lg:col-span-6 2xl:col-span-3">
                    <LazyWrapper>
                        <MostLocationCard />
                    </LazyWrapper>
                </div>
                <div className="col-span-12 lg:col-span-6 2xl:col-span-3">
                    <LazyWrapper>
                        <MyPortfolioCard />
                    </LazyWrapper>
                </div>
                <div className="col-span-12 lg:col-span-6 2xl:col-span-6">
                    <LazyWrapper>
                        <LatestInvestmentsCard />
                    </LazyWrapper>
                </div>
                <div className="col-span-12 lg:col-span-6 2xl:col-span-4">
                    <LazyWrapper>
                        <NoticeBoardCard />
                    </LazyWrapper>
                </div>
                <div className="col-span-12 lg:col-span-6 2xl:col-span-4">
                    <LazyWrapper>
                        <TotalTransactionsCard />
                    </LazyWrapper>
                </div>
                <div className="col-span-12 2xl:col-span-4">
                    <LazyWrapper>
                        <ProjectStatusCard />
                    </LazyWrapper>
                </div>
            </div>

        </>
    );
};

export default Investment;