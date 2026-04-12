import { Card, CardContent } from "@/components/ui/card";

import SourceImage1 from "@/assets/images/home-nine/source-icon1.png";
import SourceImage2 from "@/assets/images/home-nine/source-icon2.png";
import SourceImage3 from "@/assets/images/home-nine/source-icon3.png";
import SourceImage4 from "@/assets/images/home-nine/source-icon4.png";
import CustomSelect from "@/components/shared/CustomSelect";

interface SourceVisitor {
    id: number;
    title: string;
    percentage: number;
    icon: string;
    bgColor: string;
    iconBg: string;
}

const sources: SourceVisitor[] = [
    {
        id: 1,
        title: "TikTok",
        percentage: 50,
        icon: SourceImage1,
        bgColor: "from-[#ffba4540] to-[#f4743540]",
        iconBg: "bg-yellow-600",
    },
    {
        id: 2,
        title: "Instagram",
        percentage: 66,
        icon: SourceImage2,
        bgColor: "from-[#fc788a40] to-[#98168b40]",
        iconBg: "bg-violet-600",
    },
    {
        id: 3,
        title: "Facebook",
        percentage: 82,
        icon: SourceImage3,
        bgColor: "from-[#19cfef40] to-[#0d6ab840]",
        iconBg: "bg-primary",
    },
    {
        id: 4,
        title: "Website",
        percentage: 96,
        icon: SourceImage4,
        bgColor: "from-[#86dd6640] to-[#028c4b40]",
        iconBg: "bg-green-600",
    },
];

const SourceVisitorsCard = () => {
    return (
        <Card className="card h-full rounded-lg border-0 !p-0 block">
            <CardContent className="card-body p-6 h-full flex flex-col justify-between">
                <div className="flex items-center flex-wrap gap-2 justify-between mb-5">
                    <h6 className="font-bold text-lg mb-0">Source Visitors</h6>
                    <CustomSelect
                        placeholder="Last Month"
                        options={["Last Month", "Last Weekly", "Last Yearly"]}
                    />
                </div>

                {/* Chart Bars */}
                <div className="relative h-full min-h-[280px]">
                    <div className="md:absolute start-0 top-0 mt-5">
                        <h6 className="mb-1">524,756</h6>
                        <span className="text-neutral-600 dark:text-neutral-200">
                            Total Platform Visitors
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 min-h-[inherit]">
                        {sources.map((src) => (
                            <div
                                key={src.id}
                                className="col-span-12 md:col-span-3 sm:col-span-6 flex flex-col justify-end"
                            >
                                <div
                                    className={`flex flex-col items-center p-6 pt-4 rounded-t-xl bg-gradient-to-b ${src.bgColor}`}
                                    style={{ minHeight: `${src.percentage}%` }}
                                >
                                    <span
                                        className={`w-[40px] h-[40px] flex shrink-0 justify-center items-center ${src.iconBg} rounded-full mb-3`}
                                    >
                                        <img src={src.icon} alt={src.title} />
                                    </span>
                                    <span className="text-neutral-600 dark:text-neutral-200">
                                        {src.title}
                                    </span>
                                    <h6 className="mb-0">{src.percentage}%</h6>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default SourceVisitorsCard;
