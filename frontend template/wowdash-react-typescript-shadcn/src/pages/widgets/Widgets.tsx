import LazyWrapper from "@/components/LazyWrapper";
import DefaultCardComponent from "@/components/shared/DefaultCardComponent";
import Breadcrumb from "@/layouts/Breadcrumb";
import ClientPaymentStatusCard from "../dashboards/crm/components/ClientPaymentStatusCard";
import EarningStatisticsCard from "../dashboards/crm/components/EarningStatisticsCard";
import StatsCard from "../dashboards/crm/components/StatsCard";
import SalesStatisticCard from "../dashboards/dashboard/components/SalesStatisticCard";
import StatCard from "../dashboards/dashboard/components/StatCard";
import TopCountriesCard from "../dashboards/dashboard/components/TopCountriesCard";
import UserOverviewCard from "../dashboards/dashboard/components/UserOverviewCard";
import DailySalesCard from "../dashboards/ecommerce/components/DailySalesCard";
import StaticCard from "../dashboards/investment/components/StaticCard";
import StatsCardCryptocurrency from './../dashboards/cryptocurrency/components/StatsCard';
import StatsCardEcommerce from './../dashboards/ecommerce/components/StatsCard';

const Widgets = () => {
    return (
        <>
            <Breadcrumb title="Widgets" text="Widgets" />

            <div className="">
                <DefaultCardComponent title="Metrics">
                    <div className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-6">
                            <LazyWrapper>
                                <StatCard />
                            </LazyWrapper>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-6">
                            <LazyWrapper>
                                <StatsCard />
                            </LazyWrapper>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-neutral-200 dark:border-neutral-600">
                            <LazyWrapper>
                                <StatsCardEcommerce />
                            </LazyWrapper>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-6">
                            <LazyWrapper>
                                <StatsCardCryptocurrency />
                            </LazyWrapper>
                        </div>
                    </div>
                </DefaultCardComponent>


                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-6">
                    <div className="col-span-12 xl:col-span-12 2xl:col-span-6">
                        <LazyWrapper>
                            <SalesStatisticCard />
                        </LazyWrapper>
                    </div>
                    <div className="col-span-12 2xl:col-span-6">
                        <TopCountriesCard />
                    </div>
                    <div className="col-span-12 xl:col-span-6 2xl:col-span-4">
                        <LazyWrapper>
                            <ClientPaymentStatusCard />
                        </LazyWrapper>
                    </div>
                    <div className="col-span-12 xl:col-span-6 2xl:col-span-8">
                        <LazyWrapper>
                            <EarningStatisticsCard />
                        </LazyWrapper>
                    </div>
                    <div className="col-span-12 xl:col-span-6 2xl:col-span-4">
                        <LazyWrapper>
                            <UserOverviewCard />
                        </LazyWrapper>
                    </div>
                    <div className="col-span-12 xl:col-span-6 2xl:col-span-4">
                        <LazyWrapper>
                            <DailySalesCard />
                        </LazyWrapper>
                    </div>
                    <div className="col-span-12 xl:col-span-6 2xl:col-span-4">
                        <LazyWrapper>
                            <StaticCard />
                        </LazyWrapper>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Widgets;