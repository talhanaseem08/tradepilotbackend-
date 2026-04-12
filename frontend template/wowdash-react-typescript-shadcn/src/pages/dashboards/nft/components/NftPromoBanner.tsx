import NftCardImage from "@/assets/images/nft/nf-card-img.png";
import NftGradientBg from "@/assets/images/nft/nft-gradient-bg.png";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const NftPromoBanner = () => {
    return (
        <div className="nft-promo-card card border-0 rounded-xl overflow-hidden relative z-1 py-6 3xl:px-[76px] 2xl:px-[56px] xl:px-[40px] lg:px-[28px] px-4">
            {/* Background Image */}
            <img
                src={NftGradientBg}
                alt="NFT Background"
                className="absolute start-0 top-0 w-full h-full z-[1] object-cover"
            />

            {/* Inner Content */}
            <div className="nft-promo-card__inner flex sm:flex-row flex-col 3xl:gap-[80px] 2xl:gap-[48px] xl:gap-[32px] lg:gap-6 gap-5 items-center relative z-[2]">
                {/* Image */}
                <div className="nft-promo-card__thumb w-full lg:px-10">
                    <img
                        src={NftCardImage}
                        alt="NFT Card"
                        className="w-full h-full object-cover"
                        width={358}
                        height={306}
                    />
                </div>

                {/* Text Content */}
                <div className="flex-grow">
                    <h4 className="mb-4 text-white font-semibold">
                        Discover The Largest NFTs Marketplace
                    </h4>
                    <p className="text-white text-base">
                        The largest NFT (Non-Fungible Token) marketplace is OpenSea.
                        Established in 2017, OpenSea has grown to become the leading
                        platform for buying, selling, and trading digital assets.
                    </p>
                    <div className="flex items-center flex-wrap mt-6 gap-4">
                        <Link
                            to="#"
                            className="btn rounded-full border border-white text-white px-[32px] py-[9px] hover:bg-white hover:text-neutral-900 duration-200"
                        >
                            Explore
                        </Link>
                        <Button className={cn(`h-11 px-[28px] py-[11px] rounded-full`)}>
                            <Link
                                to="#"
                            >
                                Create Now
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NftPromoBanner;
