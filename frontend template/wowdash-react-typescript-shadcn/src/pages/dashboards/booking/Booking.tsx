import LazyWrapper from "@/components/LazyWrapper";
import CustomSelect from "@/components/shared/CustomSelect";
import { Card } from "@/components/ui/card";
import Breadcrumb from "@/layouts/Breadcrumb";
import { lazy } from "react";
const HorizontalBarChart = lazy(() => import("@/pages/chart/line-chart/HorizontalBarChart"))
const SpendOverview = lazy(() => import("./components/SpendOverview"))
const CheckInOut = lazy(() => import("./components/CheckInOut"))
const TransactionHistoryCard = lazy(() => import("../finance/components/TransactionHistoryCard"))
const BookingCountriesStatus = lazy(() => import("./components/BookingCountriesStatus"))
const EarningStatisticCard = lazy(() => import("./components/EarningStatisticCard"))
const ExclusiveTravelPackages = lazy(() => import("./components/ExclusiveTravelPackages"))
const AvailableRoom = lazy(() => import("./components/AvailableRoom"))
const StatisticsCards = lazy(() => import("./components/StatisticsCards"))

const Booking = () => {
    return (
        <>
            <Breadcrumb title="Booking" text="Booking" />

            <div className="mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
                    <div className="col-span-12 md:col-span-6 2xl:col-span-4">
                        <LazyWrapper>
                            <StatisticsCards />
                        </LazyWrapper>
                    </div>

                    <div className="col-span-12 md:col-span-6 2xl:col-span-4">
                        <LazyWrapper>
                            <AvailableRoom />
                        </LazyWrapper>
                    </div>

                    <div className="col-span-12 2xl:col-span-4">
                        <LazyWrapper>
                            <Card className="card p-5 rounded-xl bg-white dark:bg-[#273142] h-full">
                                <div className="flex items-center flex-wrap gap-2 justify-between">
                                    <h6 className="mb-0 font-bold text-lg">Booking Statistic</h6>
                                    <CustomSelect
                                        placeholder="Monthly"
                                        options={["Monthly", "Weekly", "Yearly",]}
                                    />
                                </div>
                                <div className="relative text-style label-bold -my-6">
                                    <HorizontalBarChart />
                                </div>
                            </Card>
                        </LazyWrapper>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
                <div className="col-span-12 md:col-span-6 xl:col-span-8">
                    <div className="flex flex-col gap-6">
                        <LazyWrapper>
                            <ExclusiveTravelPackages />
                        </LazyWrapper>
                        <LazyWrapper>
                            <EarningStatisticCard />
                        </LazyWrapper>
                        <LazyWrapper>
                            <TransactionHistoryCard />
                        </LazyWrapper>
                    </div>
                </div>
                <div className="col-span-12 md:col-span-6 xl:col-span-4">
                    <div className="flex flex-col gap-6">
                        <LazyWrapper>
                            <BookingCountriesStatus />
                        </LazyWrapper>
                        <LazyWrapper>
                            <CheckInOut />
                        </LazyWrapper>
                        <LazyWrapper>
                            <SpendOverview />
                        </LazyWrapper>
                    </div>
                </div>
            </div>

        </>
    );
};

export default Booking;