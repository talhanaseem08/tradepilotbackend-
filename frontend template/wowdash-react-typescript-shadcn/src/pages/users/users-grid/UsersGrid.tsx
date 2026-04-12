import CustomSelect from "@/components/shared/CustomSelect";
import SearchBox from "@/components/shared/SearchBox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Breadcrumb from "@/layouts/Breadcrumb";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import UsersGridCard from "./UsersGridCard";

const UsersGrid = () => {
    return (
        <>
            <Breadcrumb title="Users Grid" text="Users Grid" />

            <Card className="card h-full !p-0 !block border-0 overflow-hidden">
                <CardHeader className="border-b border-neutral-200 dark:border-slate-600 !py-4 px-6 flex items-center flex-wrap gap-3 justify-between">
                    <div className="flex items-center flex-wrap gap-3">
                        <span className="text-base font-medium text-neutral-500 dark:text-neutral-300 mb-0">Show</span>
                        <CustomSelect
                            placeholder="1"
                            options={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]}
                        />
                        <SearchBox />
                    </div>
                    <Button className={cn(`w-auto h-11`)} asChild>
                        <Link to="#">
                            <Plus className="w-5 h-5" />
                            Add New User
                        </Link>
                    </Button>
                </CardHeader>

                <CardContent className="card-body p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 gap-6">
                        <UsersGridCard />
                    </div>
                </CardContent>
            </Card>

        </>
    );
};

export default UsersGrid;