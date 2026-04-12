import LazyWrapper from "@/components/LazyWrapper";
import Breadcrumb from "@/layouts/Breadcrumb";
import { lazy } from "react";
const CustomersStatisticsCard = lazy(() => import("./components/CustomersStatisticsCard"))
const DailySalesCard = lazy(() => import("./components/DailySalesCard"))
const DistributionMapsCard = lazy(() => import("./components/DistributionMapsCard"))
const RecentOrdersCard = lazy(() => import("./components/RecentOrdersCard"))
const RevenueReportCard = lazy(() => import("./components/RevenueReportCard"))
const StockReportCard = lazy(() => import("./components/StockReportCard"))
const TopCustomersCard = lazy(() => import("./components/TopCustomersCard"))
const TopSellingProductCard = lazy(() => import("./components/TopSellingProductCard"))
const TransactionsCard = lazy(() => import("./components/TransactionsCard"))

const Ecommerce = () => {
    return (
        <>
            <Breadcrumb title="eCommerce" text="eCommerce" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                <div className="md:col-span-12 2xl:col-span-9">
                    <LazyWrapper>
                        <RevenueReportCard />
                    </LazyWrapper>
                </div>

                <div className="md:col-span-12 lg:col-span-6 2xl:col-span-3">
                    <LazyWrapper>
                        <CustomersStatisticsCard />
                    </LazyWrapper>
                </div>

                <div className="md:col-span-12 lg:col-span-6 2xl:col-span-9">
                    <LazyWrapper>
                        <RecentOrdersCard />
                    </LazyWrapper>
                </div>

                <div className="md:col-span-12 lg:col-span-6 2xl:col-span-3">
                    <LazyWrapper>
                        <TransactionsCard />
                    </LazyWrapper>
                </div>

                <div className="md:col-span-12 lg:col-span-6 2xl:col-span-4">
                    <LazyWrapper>
                        <DailySalesCard />
                    </LazyWrapper>
                </div>

                <div className="md:col-span-12 lg:col-span-6 2xl:col-span-4">
                    <LazyWrapper>
                        <DistributionMapsCard />
                    </LazyWrapper>
                </div>

                <div className="md:col-span-12 lg:col-span-6 2xl:col-span-4">
                    <LazyWrapper>
                        <TopCustomersCard />
                    </LazyWrapper>
                </div>

                <div className="md:col-span-12 2xl:col-span-6">
                    <LazyWrapper>
                        <TopSellingProductCard />
                    </LazyWrapper>
                </div>

                <div className="md:col-span-12 2xl:col-span-6">
                    <LazyWrapper>
                        <StockReportCard />
                    </LazyWrapper>
                </div>

            </div>

        </>
    );
};

export default Ecommerce;