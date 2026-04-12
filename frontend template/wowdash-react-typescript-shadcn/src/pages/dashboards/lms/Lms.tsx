import LazyWrapper from "@/components/LazyWrapper";
import Breadcrumb from "@/layouts/Breadcrumb";
import { lazy } from "react";
const CourseActivityCard = lazy(() => import("./components/CourseActivityCard"))
const CoursesCard = lazy(() => import("./components/CoursesCard"))
const StudentProgressCard = lazy(() => import("./components/StudentProgressCard"))
const TopCategoriesCard = lazy(() => import("./components/TopCategoriesCard"))
const TopInstructorsCard = lazy(() => import("./components/TopInstructorsCard"))
const TrafficSourceCard = lazy(() => import("./components/TrafficSourceCard"))
const WidgetsAverageChart = lazy(() => import("./components/WidgetsAverageChart"))

const Lms = () => {
    return (
        <>
            <Breadcrumb title="LMS" text="LMS" />

            <div className="grid grid-cols-1 2xl:grid-cols-12 gap-6">
                <div className="col-span-12 2xl:col-span-8">
                    <LazyWrapper>
                        <div className="">
                            <WidgetsAverageChart />
                        </div>
                    </LazyWrapper>
                </div>
                <div className="col-span-12 md:col-span-6 2xl:col-span-4">
                    <LazyWrapper>
                        <TrafficSourceCard />
                    </LazyWrapper>
                </div>
                <div className="col-span-12 md:col-span-6 2xl:col-span-4">
                    <LazyWrapper>
                        <TopCategoriesCard />
                    </LazyWrapper>
                </div>
                <div className="col-span-12 md:col-span-6 2xl:col-span-4">
                    <LazyWrapper>
                        <TopInstructorsCard />
                    </LazyWrapper>
                </div>
                <div className="col-span-12 md:col-span-6 2xl:col-span-4">
                    <LazyWrapper>
                        <StudentProgressCard />
                    </LazyWrapper>
                </div>
                <div className="col-span-12 2xl:col-span-8">
                    <LazyWrapper>
                        <CoursesCard />
                    </LazyWrapper>
                </div>
                <div className="col-span-12 2xl:col-span-4">
                    <LazyWrapper>
                        <CourseActivityCard />
                    </LazyWrapper>
                </div>
            </div>

        </>
    );
};

export default Lms;