import DoubleBarChart from "@/components/charts/DoubleBarChart";
import FourColorBarChart from "@/components/charts/FourColorBarChart";
import SingleBarChart from "@/components/charts/SingleBarChart";
import UpdownBarChart from "@/components/charts/UpdownBarChart";
import LazyWrapper from "@/components/LazyWrapper";
import DefaultCardComponent from "@/components/shared/DefaultCardComponent";
import Breadcrumb from "@/layouts/Breadcrumb";

const ColumnChartPage = () => {
    return (
        <>
            <Breadcrumb title="Column Chart" text="Column Chart" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DefaultCardComponent title="Column Charts">
                    <LazyWrapper>
                        <div className="-m-2">
                            <DoubleBarChart />
                        </div>
                    </LazyWrapper>
                </DefaultCardComponent>
                <DefaultCardComponent title="Column Charts">
                    <LazyWrapper>
                        <div className="-m-4">
                            <SingleBarChart chartColor={"487FFF"} chartHeight={264} chartBorderRadius={8} chartColumnWidth={16} />
                        </div>
                    </LazyWrapper>
                </DefaultCardComponent>
                <DefaultCardComponent title="Group Columns">
                    <LazyWrapper>
                        <div className="-m-4">
                            <FourColorBarChart chartHeight={300} />
                        </div>
                    </LazyWrapper>
                </DefaultCardComponent>
                <DefaultCardComponent title="Simple Column">
                    <LazyWrapper>
                        <div className="-m-4">
                            <UpdownBarChart />
                        </div>
                    </LazyWrapper>
                </DefaultCardComponent>
            </div>

        </>
    );
};

export default ColumnChartPage;