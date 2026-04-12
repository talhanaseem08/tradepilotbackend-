import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

import NftImage1 from "@/assets/images/nft/nft-img1.png";
import NftImage2 from "@/assets/images/nft/nft-img2.png";
import NftImage3 from "@/assets/images/nft/nft-img3.png";
import NftImage4 from "@/assets/images/nft/nft-img4.png";

import UserImage1 from "@/assets/images/nft/nft-user-img1.png";
import UserImage2 from "@/assets/images/nft/nft-user-img2.png";
import UserImage3 from "@/assets/images/nft/nft-user-img3.png";
import UserImage4 from "@/assets/images/nft/nft-user-img4.png";
import { Link } from "react-router-dom";

type NftCard = {
    id: number;
    title: string;
    nftImage: string;
    userImage: string;
    userName: string;
    priceEth: string;
    priceUsd: string;
    category: string; // ✅ Add category
};

const nftCards: NftCard[] = [
    {
        id: 1,
        title: "Fantastic Alien",
        nftImage: NftImage1,
        userImage: UserImage1,
        userName: "Watson Kristin",
        priceEth: "1.44 ETH",
        priceUsd: "$4,224.96",
        category: "art",
    },
    {
        id: 2,
        title: "New Figures",
        nftImage: NftImage2,
        userImage: UserImage2,
        userName: "Watson Kristin",
        priceEth: "1.44 ETH",
        priceUsd: "$4,224.96",
        category: "music",
    },
    {
        id: 3,
        title: "New Figures",
        nftImage: NftImage3,
        userImage: UserImage3,
        userName: "Watson Kristin",
        priceEth: "1.44 ETH",
        priceUsd: "$4,224.96",
        category: "utility",
    },
    {
        id: 4,
        title: "New Figures",
        nftImage: NftImage4,
        userImage: UserImage4,
        userName: "Watson Kristin",
        priceEth: "1.44 ETH",
        priceUsd: "$4,224.96",
        category: "fashion",
    },
];

function shuffleArray<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
}

interface TrendingNftWidgetsProps {
    category: string;
}

const TrendingNftWidgets: React.FC<TrendingNftWidgetsProps> = ({ category }) => {
    const filtered = category === "all" ? nftCards : nftCards.filter(c => c.category === category);

    const shuffled = shuffleArray(filtered);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-6">
            {shuffled.map((card) => (
                <div
                    key={card.id}
                    className="nft-card bg-white dark:bg-slate-800 rounded overflow-hidden"
                >
                    <div className="rounded overflow-hidden">
                        <img
                            src={card.nftImage}
                            alt={card.title}
                            className="w-full h-full object-cover"
                            width={250}
                            height={196}
                        />
                    </div>
                    <div className="p-2.5">
                        <h6 className="text-base font-bold text-neutral-600 dark:text-white mb-1">
                            {card.title}
                        </h6>

                        {/* User Info */}
                        <div className="flex items-center gap-2">
                            <img
                                src={card.userImage}
                                className="w-7 h-7 rounded-full object-cover"
                                alt={card.userName}
                                width={28}
                                height={28}
                            />
                            <span className="text-sm text-neutral-500 dark:text-neutral-300 font-medium">
                                {card.userName}
                            </span>
                        </div>

                        {/* Price Info */}
                        <div className="mt-2.5 flex items-center justify-between gap-2 flex-wrap">
                            <span className="text-sm text-neutral-500 dark:text-neutral-300 font-medium">
                                Price:{" "}
                                <span className="text-sm text-neutral-600 dark:text-white font-semibold">
                                    {card.priceEth}
                                </span>
                            </span>
                            <span className="text-sm font-semibold text-blue-600">
                                {card.priceUsd}
                            </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center flex-wrap mt-3 gap-2">
                            <Link
                                to="#"
                                className="btn rounded-full border text-neutral-500 dark:text-neutral-300 border-neutral-500 dark:border-neutral-300 px-3 py-1.5 hover:bg-neutral-500 dark:hover:bg-slate-600 hover:text-white flex-grow text-center duration-200"
                            >
                                History
                            </Link>
                            <Button
                                className={cn(
                                    "h-[39px] px-3 !py-1.5 flex-grow text-center rounded-full duration-200"
                                )}
                            >
                                <Link to="#">Buy Now</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TrendingNftWidgets;
