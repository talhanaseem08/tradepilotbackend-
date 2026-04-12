import LazyWrapper from "@/components/LazyWrapper";
import DefaultCardComponent from "@/components/shared/DefaultCardComponent";
import Breadcrumb from "@/layouts/Breadcrumb";
import { Star } from "lucide-react";

const StarRatings = () => {
    return (
        <>
            <Breadcrumb title="Star Ratings" text="Star Ratings" />

            <LazyWrapper>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <DefaultCardComponent title="Default Star Ratings">
                        <ul className="flex flex-wrap items-center gap-3">
                            <li className="text-warning-600 text-[32px] line-height-1">
                                <Star fill="#ff9f29" stroke="#ff9f29" size={26} />
                            </li>
                            <li className="text-warning-600 text-[32px] line-height-1">
                                <Star fill="#ff9f29" stroke="#ff9f29" size={26} />
                            </li>
                            <li className="text-warning-600 text-[32px] line-height-1">
                                <Star fill="#ff9f29" stroke="#ff9f29" size={26} />
                            </li>
                            <li className="text-warning-600 text-[32px] line-height-1">
                                <Star fill="#ff9f29" stroke="#ff9f29" size={26} />
                            </li>
                            <li className="text-warning-600 text-[32px] line-height-1">
                                <Star fill="#ff9f29" stroke="#ff9f29" size={26} />
                            </li>
                        </ul>
                    </DefaultCardComponent>
                    <DefaultCardComponent title="Half Star">
                        <ul className="flex flex-wrap items-center gap-3">
                            <li className="text-warning-600 text-[32px] line-height-1">
                                <Star fill="#ff9f29" stroke="#ff9f29" size={26} />
                            </li>
                            <li className="text-warning-600 text-[32px] line-height-1">
                                <Star fill="#ff9f29" stroke="#ff9f29" size={26} />
                            </li>
                            <li className="text-warning-600 text-[32px] line-height-1">
                                <Star fill="#ff9f29" stroke="#ff9f29" size={26} />
                            </li>
                            <li className="text-warning-600 text-[32px] line-height-1">
                                <Star stroke="#ff9f29" size={26} />
                            </li>
                            <li className="text-warning-600 text-[32px] line-height-1">
                                <Star stroke="#ff9f29" size={26} />
                            </li>
                        </ul>
                    </DefaultCardComponent>
                    <DefaultCardComponent title="Multi Color">
                        <ul className="flex flex-wrap items-center gap-3">
                            <li className="text-[32px] line-height-1 text-primary">  <Star fill="#487fff" stroke="#487fff" size={26} />
                            </li>
                            <li className="text-[32px] line-height-1 dark:text-purple-400">  <Star fill="#9810fa" stroke="#9810fa" size={26} />
                            </li>
                            <li className="text-[32px] line-height-1 text-green-600">  <Star fill="#16a34a" stroke="#16a34a" size={26} />
                            </li>
                            <li className="text-[32px] line-height-1 text-cyan-600">  <Star fill="#2563eb" stroke="#2563eb" size={26} />
                            </li>
                            <li className="text-[32px] line-height-1 text-red-600">  <Star fill="#dc2626" stroke="#dc2626" size={26} />
                            </li>
                        </ul>
                    </DefaultCardComponent>
                    <DefaultCardComponent title="Rating">
                        <ul className="flex flex-wrap items-center gap-3">
                            <li className="text-warning-600 text-[32px] line-height-1">
                                <Star fill="#ff9f29" stroke="#ff9f29" size={26} />
                            </li>
                            <li className="text-warning-600 text-[32px] line-height-1">
                                <Star fill="#ff9f29" stroke="#ff9f29" size={26} />
                            </li>
                            <li className="text-neutral-400 text-[32px] line-height-1">
                                <Star fill="#ff9f29" stroke="#ff9f29" size={26} />
                            </li>
                            <li className="text-neutral-400 text-[32px] line-height-1">
                                <Star fill="#ff9f29" stroke="#ff9f29" size={26} />
                            </li>
                            <li className="text-neutral-400 text-[32px] line-height-1">
                                <Star fill="#ff9f29" stroke="#ff9f29" size={26} />
                            </li>
                        </ul>
                    </DefaultCardComponent>
                </div>
            </LazyWrapper>

        </>
    );
};

export default StarRatings;