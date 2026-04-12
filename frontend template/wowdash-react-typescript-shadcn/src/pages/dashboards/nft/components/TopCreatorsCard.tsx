import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import React, { useState } from "react";

import Image1 from "@/assets/images/nft/creator-img1.png";
import Image2 from "@/assets/images/nft/creator-img2.png";
import Image3 from "@/assets/images/nft/creator-img3.png";
import Image4 from "@/assets/images/nft/creator-img4.png";
import Image5 from "@/assets/images/nft/creator-img5.png";
import CommonLink from "@/components/shared/CommonLink";

interface Creator {
    id: number;
    name: string;
    username: string;
    avatar: string;
    isFollowing: boolean;
}

const creatorsData: Creator[] = [
    {
        id: 1,
        name: "Theresa Webb",
        username: "@wishon",
        avatar: Image1,
        isFollowing: false,
    },
    {
        id: 2,
        name: "Arlene McCoy",
        username: "@nemccoy",
        avatar: Image2,
        isFollowing: false,
    },
    {
        id: 3,
        name: "Kathryn Murphy",
        username: "@kathrynmur",
        avatar: Image3,
        isFollowing: false,
    },
    {
        id: 4,
        name: "Marvin McKinney",
        username: "@marvinckin",
        avatar: Image4,
        isFollowing: false,
    },
    {
        id: 5,
        name: "Theresa Webb",
        username: "@wishon",
        avatar: Image1,
        isFollowing: false,
    },
    {
        id: 6,
        name: "Dianne Russell",
        username: "@dinne_r",
        avatar: Image5,
        isFollowing: false,
    },
];

const TopCreatorsCard: React.FC = () => {

    const [followState, setFollowState] = useState(creatorsData);

    const toggleFollow = (itemId:number) => {
        setFollowState((prevState) => 
            prevState.map((creator) => {
                return creator.id === itemId 
                ? { ...creator, isFollowing: !creator.isFollowing } 
                : creator
            })
        )
    }

    return (
        <Card className="card h-full rounded-lg border-0 !p-0">
            <CardContent className="card-body p-0 flex flex-col justify-between gap-8">
                <div>
                    {/* Header */}
                    <div className="card-header border-b border-neutral-200 dark:border-slate-500 py-4 px-6">
                        <div className="flex items-center flex-wrap gap-2 justify-between">
                            <h6 className="font-bold text-lg mb-0">Top Creators</h6>
                            <CommonLink />
                        </div>
                    </div>

                    {/* List */}
                    <div className="card-body px-6 py-5">
                        {followState.map((creator, index) => (
                            <div
                                key={creator.id}
                                className={`flex items-center justify-between gap-2 flex-wrap ${index !== creatorsData.length - 1 ? "mb-[32px]" : "mb-0"
                                    }`}
                            >
                                <div className="flex items-center">
                                    <img
                                        src={creator.avatar}
                                        alt={creator.name}
                                        className="flex-shrink-0 w-10 h-10 rounded-full me-3"
                                    />
                                    <div className="flex-grow-1">
                                        <h6 className="text-base mb-0 font-semibold">
                                            {creator.name}
                                        </h6>
                                        <span className="text-sm text-neutral-500 dark:text-neutral-300 font-normal">
                                            {creator.username}
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    className="text-white px-6 rounded-full follow-btn transition-2"
                                    onClick={() => toggleFollow(creator.id)}
                                >
                                    {creator.isFollowing ? "Following" : "Follow"}
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default TopCreatorsCard;
