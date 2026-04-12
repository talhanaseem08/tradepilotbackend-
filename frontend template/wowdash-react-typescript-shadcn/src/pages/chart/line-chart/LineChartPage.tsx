import GradientChart from "@/components/charts/GradientChart";
import LineChart from "@/components/charts/LineChart";
import LineChartAnimation from "@/components/charts/LineChartAnimation";
import LineChartLabel from "@/components/charts/LineChartLabel";
import SteplineChart from "@/components/charts/SteplineChart";
import ZoomableChart from "@/components/charts/ZoomableChart";
import LazyWrapper from "@/components/LazyWrapper";
import DefaultCardComponent from "@/components/shared/DefaultCardComponent";
import Breadcrumb from "@/layouts/Breadcrumb";

const LineChartPage = () => {
    return (
        <>
            <Breadcrumb title="Line Chart" text="Line Chart" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DefaultCardComponent title="Default Line Chart">
                    <LazyWrapper>
                        <LineChart />
                    </LazyWrapper>
                </DefaultCardComponent>
                <DefaultCardComponent title="Zoomable Chart">
                    <LazyWrapper>
                        <ZoomableChart />
                    </LazyWrapper>
                </DefaultCardComponent>
                <DefaultCardComponent title="Line Chart with Data Labels">
                    <LazyWrapper>
                        <LineChartLabel />
                    </LazyWrapper>
                </DefaultCardComponent>
                <DefaultCardComponent title="Line Chart Animation">
                    <LazyWrapper>
                        <LineChartAnimation />
                    </LazyWrapper>
                </DefaultCardComponent>
                <DefaultCardComponent title="Stepline Charts">
                    <LazyWrapper>
                        <SteplineChart />
                    </LazyWrapper>
                </DefaultCardComponent>
                <DefaultCardComponent title="Gradient Charts">
                    <LazyWrapper>
                        <GradientChart />
                    </LazyWrapper>
                </DefaultCardComponent>
            </div>
        </>
    );
};

export default LineChartPage;