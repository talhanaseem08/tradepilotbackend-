import LazyWrapper from "@/components/LazyWrapper";
import Breadcrumb from "@/layouts/Breadcrumb";
import { lazy } from "react";

const GenerateContentCard = lazy(() => import("./components/GenerateContentCard"));
const SalesStatisticCard = lazy(() => import("./components/SalesStatisticCard"));
const StatCard = lazy(() => import("./components/StatCard"));
const TabsWithTableCard = lazy(() => import("./components/TabsWithTableCard"));
const TopCountriesCard = lazy(() => import("./components/TopCountriesCard"));
const TopPerformerCard = lazy(() => import("./components/TopPerformerCard"));
const TotalSubscriberCard = lazy(() => import("./components/TotalSubscriberCard"));
const UserOverviewCard = lazy(() => import("./components/UserOverviewCard"));

const AiDashboard = () => {
  return (
    <>
      <Breadcrumb title="AI" text="AI" />

      <LazyWrapper>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-6">
          <StatCard />
        </div>
      </LazyWrapper>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-6">
        <div className="xl:col-span-12 2xl:col-span-6">
          <LazyWrapper>
            <SalesStatisticCard />
          </LazyWrapper>
        </div>

        <div className="xl:col-span-6 2xl:col-span-3">
          <LazyWrapper>
            <TotalSubscriberCard />
          </LazyWrapper>
        </div>

        <div className="xl:col-span-6 2xl:col-span-3">
          <LazyWrapper>
            <UserOverviewCard />
          </LazyWrapper>
        </div>

        <div className="xl:col-span-12 2xl:col-span-9">
          <LazyWrapper>
            <TabsWithTableCard />
          </LazyWrapper>
        </div>

        <div className="xl:col-span-12 2xl:col-span-3">
          <LazyWrapper>
            <TopPerformerCard listClasses="space-y-6 max-h-[408px] overflow-y-auto scrollbar-thin scrollbar-invisible hover:scrollbar-visible" />
          </LazyWrapper>
        </div>

        <div className="xl:col-span-12 2xl:col-span-6">
          <LazyWrapper>
            <TopCountriesCard />
          </LazyWrapper>
        </div>

        <div className="xl:col-span-12 2xl:col-span-6">
          <LazyWrapper>
            <GenerateContentCard />
          </LazyWrapper>
        </div>
      </div>
    </>
  );
};

export default AiDashboard;
