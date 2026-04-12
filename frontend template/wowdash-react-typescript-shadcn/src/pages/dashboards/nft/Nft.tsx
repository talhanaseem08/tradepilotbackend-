import LazyWrapper from "@/components/LazyWrapper";
import Breadcrumb from "@/layouts/Breadcrumb";
import { lazy } from "react";
const EthPriceCard = lazy(() => import("./components/EthPriceCard"))
const FeaturedCreatorsCard = lazy(() => import("./components/FeaturedCreatorsCard"))
const NftPromoBanner = lazy(() => import("./components/NftPromoBanner"))
const RecentBidCard = lazy(() => import("./components/RecentBidCard"))
const StatisticsCard = lazy(() => import("./components/StatisticsCard"))
const TopCreatorsCard = lazy(() => import("./components/TopCreatorsCard"))
const TrendingBidWidgets = lazy(() => import("./components/TrendingBidWidgets"))
const TrendingNftCard = lazy(() => import("./components/TrendingNftCard"))

const Nft = () => {
    return (
        <>
            <Breadcrumb title="NFT" text="NFT" />

            <div className="gap-6 grid grid-cols-1 2xl:grid-cols-12">
                <div className="col-span-12 2xl:col-span-8">
                    <div className="gap-6 grid grid-cols-1 sm:grid-cols-12">
                        <div className="col-span-12">
                            <LazyWrapper>
                                <NftPromoBanner />
                            </LazyWrapper>
                        </div>

                        <div className="col-span-12">
                            <LazyWrapper>
                                <TrendingBidWidgets />
                            </LazyWrapper>
                        </div>

                        <div className="col-span-12">
                            <LazyWrapper>
                                <TrendingNftCard />
                            </LazyWrapper>
                        </div>

                        <div className="col-span-12">
                            <LazyWrapper>
                                <RecentBidCard />
                            </LazyWrapper>
                        </div>
                    </div>
                </div>

                <div className="col-span-12 2xl:col-span-4">
                    <div className="gap-6 grid grid-cols-1 sm:grid-cols-12">
                        <div className="col-span-12 md:col-span-6 2xl:col-span-12">
                            <LazyWrapper>
                                <EthPriceCard />
                            </LazyWrapper>
                        </div>
                        <div className="col-span-12 md:col-span-6 2xl:col-span-12">
                            <LazyWrapper>
                                <StatisticsCard />
                            </LazyWrapper>
                        </div>
                        <div className="col-span-12 md:col-span-6 2xl:col-span-12">
                            <LazyWrapper>
                                <FeaturedCreatorsCard />
                            </LazyWrapper>
                        </div>
                        <div className="col-span-12 md:col-span-6 2xl:col-span-12">
                            <LazyWrapper>
                                <TopCreatorsCard />
                            </LazyWrapper>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default Nft;