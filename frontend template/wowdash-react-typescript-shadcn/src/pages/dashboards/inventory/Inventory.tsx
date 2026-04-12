import LazyWrapper from "@/components/LazyWrapper";
import Breadcrumb from "@/layouts/Breadcrumb";
import { lazy } from "react";
const IncomeExpenseCard = lazy(() => import("./components/IncomeExpenseCard"))
const OverallReportCard = lazy(() => import("./components/OverallReportCard"))
const PurchaseSalesCard = lazy(() => import("./components/PurchaseSalesCard"))
const RecentTransactionsCard = lazy(() => import("./components/RecentTransactionsCard"))
const StateCards = lazy(() => import("./components/StateCards"))
const TopCustomerCard = lazy(() => import("./components/TopCustomerCard"))
const TopSuppliersCard = lazy(() => import("./components/TopSuppliersCard"))
const UsersCard = lazy(() => import("./components/UsersCard"))

const Inventory = () => {
    return (
        <>
            <Breadcrumb title="POS & Inventory" text="POS & Inventory" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                <div className="col-span-12">
                    <LazyWrapper>
                        <StateCards />
                    </LazyWrapper>
                </div>
                <div className="col-span-12 2xl:col-span-8">
                    <LazyWrapper>
                        <IncomeExpenseCard />
                    </LazyWrapper>
                </div>
                <div className="col-span-12 md:col-span-6 2xl:col-span-4">
                    <LazyWrapper>
                        <UsersCard />
                    </LazyWrapper>
                </div>
                <div className="col-span-12 md:col-span-6 2xl:col-span-4">
                    <LazyWrapper>
                        <TopSuppliersCard />
                    </LazyWrapper>
                </div>
                <div className="col-span-12 md:col-span-6 2xl:col-span-4">
                    <LazyWrapper>
                        <TopCustomerCard />
                    </LazyWrapper>
                </div>
                <div className="col-span-12 md:col-span-6 2xl:col-span-4">
                    <LazyWrapper>
                        <OverallReportCard />
                    </LazyWrapper>
                </div>
                <div className="col-span-12 md:col-span-6 2xl:col-span-4">
                    <LazyWrapper>
                        <PurchaseSalesCard />
                    </LazyWrapper>
                </div>
                <div className="col-span-12 md:col-span-6 2xl:col-span-8">
                    <LazyWrapper>
                        <RecentTransactionsCard />
                    </LazyWrapper>
                </div>

            </div>
        </>
    );
};

export default Inventory;