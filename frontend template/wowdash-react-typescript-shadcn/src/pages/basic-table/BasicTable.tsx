import LazyWrapper from "@/components/LazyWrapper";
import DefaultCardComponent from "@/components/shared/DefaultCardComponent";
import BorderedColorTable from "@/components/tables/BorderedColorTable";
import BorderedTable from "@/components/tables/BorderedTable";
import DefaultTable from "@/components/tables/DefaultTable";
import RecentOrdersTable from "@/components/tables/RecentOrdersTable";
import TopSellingProductTable from "@/components/tables/TopSellingProductTable";
import Breadcrumb from "@/layouts/Breadcrumb";

const BasicTable = () => {
    return (
        <>
            <Breadcrumb title="Basic Table" text="Basic Table" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-6">
                    <DefaultCardComponent title="Default Table">
                        <LazyWrapper>
                            <DefaultTable />
                        </LazyWrapper>
                    </DefaultCardComponent>
                </div>
                <div className="col-span-12 lg:col-span-6">
                    <DefaultCardComponent title="Bordered Tables">
                        <LazyWrapper>
                            <BorderedTable />
                        </LazyWrapper>
                    </DefaultCardComponent>
                </div>
                <div className="col-span-12 lg:col-span-6">
                    <DefaultCardComponent title="Tables Border Colors">
                        <LazyWrapper>
                            <BorderedColorTable />
                        </LazyWrapper>
                    </DefaultCardComponent>
                </div>
                <div className="col-span-12 lg:col-span-6">
                    <DefaultCardComponent title="Striped Rows">
                        <LazyWrapper>
                            <TopSellingProductTable />
                        </LazyWrapper>
                    </DefaultCardComponent>
                </div>
                <div className="col-span-12">
                    <DefaultCardComponent title="Card Tables">
                        <LazyWrapper>
                            <RecentOrdersTable />
                        </LazyWrapper>
                    </DefaultCardComponent>
                </div>
            </div>

        </>
    );
};

export default BasicTable;