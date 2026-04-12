import CommonLink from '@/components/shared/CommonLink';
import RecentLeadsTable from '@/components/tables/RecentLeadsTable';
import TodoListRecentTable from '@/components/tables/TodoListRecentTable';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TodoListRecentCard = () => {
    return (
        <Card className="card !p-0">
            <CardContent className="px-0">
                <Tabs defaultValue="todoList" className="gap-0">
                    <div className="flex items-center justify-between border-b border-neutral-200 dark:border-slate-600">
                        <TabsList className='bg-transparent dark:bg-transparent rounded-none h-[50px]  p-0'>
                            <TabsTrigger value="todoList" className='py-2.5 px-4 font-medium text-base inline-flex items-center gap-3 dark:bg-transparent text-neutral-600 hover:text-primary dark:text-white dark:hover:text-blue-500 border-0 border-b-1 border-transparent dark:border-transparent data-[state=active]:border-primary dark:data-[state=active]:border-primary dark:data-[state=active]:bg-transparent rounded-[0] data-[state=active]:shadow-none data-[state=active]:text-primary cursor-pointer translate-y-px'>
                                To Do List
                            </TabsTrigger>
                            <TabsTrigger value="recentLeads" className='py-2.5 px-4 font-medium text-base inline-flex items-center gap-3 dark:bg-transparent text-neutral-600 hover:text-primary dark:text-white dark:hover:text-blue-500 border-0 border-b-1 border-transparent dark:border-transparent data-[state=active]:border-primary dark:data-[state=active]:border-primary dark:data-[state=active]:bg-transparent rounded-[0] data-[state=active]:shadow-none data-[state=active]:text-primary cursor-pointer translate-y-px'>
                                Recent Leads
                            </TabsTrigger>
                        </TabsList>
                        <div className="pe-6">
                            <CommonLink />
                        </div>
                    </div>

                    <div className="p-6">
                        <TabsContent value="todoList">
                            <TodoListRecentTable />
                        </TabsContent>
                        <TabsContent value="recentLeads">
                            <RecentLeadsTable />
                        </TabsContent>
                    </div>
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default TodoListRecentCard;