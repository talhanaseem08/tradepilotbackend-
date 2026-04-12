import TabsImage1 from "@/assets/images/tabs/tabs-image1.png";
import TabsImage2 from "@/assets/images/tabs/tabs-image2.png";
import LazyWrapper from "@/components/LazyWrapper";
import DefaultCardComponent from "@/components/shared/DefaultCardComponent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import Breadcrumb from "@/layouts/Breadcrumb";
import { TabsList } from "@radix-ui/react-tabs";
import { FileText, Home, Settings, User } from 'lucide-react';

const TabAccordion = () => {
    return (
        <>
            <Breadcrumb title="TabAccordion" text="TabAccordion" />

            <LazyWrapper>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="col-span-12 xl:col-span-6">
                        <DefaultCardComponent title="Default Tabs">
                            <Tabs defaultValue="DefaultHome" className="gap-0">
                                <div className="flex items-center justify-between border-b border-neutral-200 dark:border-slate-600">
                                    <TabsList className='bg-transparent dark:bg-transparent rounded-none h-[50px]  p-0'>
                                        <TabsTrigger value="DefaultHome" className='py-2.5 px-4 font-medium text-base inline-flex items-center gap-3 dark:bg-transparent text-neutral-600 hover:text-primary dark:text-white dark:hover:text-blue-500 border-0 border-b-1 border-transparent dark:border-transparent data-[state=active]:text-primary dark:data-[state=active]:text-primary data-[state=active]:border-primary dark:data-[state=active]:border-primary dark:data-[state=active]:bg-transparent rounded-[0] data-[state=active]:shadow-none cursor-pointer translate-y-px'>
                                            Home
                                        </TabsTrigger>
                                        <TabsTrigger value="DefaultDetails" className='py-2.5 px-4 font-medium text-base inline-flex items-center gap-3 dark:bg-transparent text-neutral-600 hover:text-primary dark:text-white dark:hover:text-blue-500 border-0 border-b-1 border-transparent dark:border-transparent data-[state=active]:text-primary dark:data-[state=active]:text-primary data-[state=active]:border-primary dark:data-[state=active]:border-primary dark:data-[state=active]:bg-transparent rounded-[0] data-[state=active]:shadow-none cursor-pointer translate-y-px'>
                                            Details
                                        </TabsTrigger>
                                        <TabsTrigger value="DefaultProfile" className='py-2.5 px-4 font-medium text-base inline-flex items-center gap-3 dark:bg-transparent text-neutral-600 hover:text-primary dark:text-white dark:hover:text-blue-500 border-0 border-b-1 border-transparent dark:border-transparent data-[state=active]:text-primary dark:data-[state=active]:text-primary data-[state=active]:border-primary dark:data-[state=active]:border-primary dark:data-[state=active]:bg-transparent rounded-[0] data-[state=active]:shadow-none cursor-pointer translate-y-px'>
                                            Profile
                                        </TabsTrigger>
                                        <TabsTrigger value="DefaultSettings" className='py-2.5 px-4 font-medium text-base inline-flex items-center gap-3 dark:bg-transparent text-neutral-600 hover:text-primary dark:text-white dark:hover:text-blue-500 border-0 border-b-1 border-transparent dark:border-transparent data-[state=active]:text-primary dark:data-[state=active]:text-primary data-[state=active]:border-primary dark:data-[state=active]:border-primary dark:data-[state=active]:bg-transparent rounded-[0] data-[state=active]:shadow-none cursor-pointer translate-y-px'>
                                            Settings
                                        </TabsTrigger>
                                    </TabsList>
                                </div>

                                <div className="pt-6">
                                    <TabsContent value="DefaultHome" className="p-0">
                                        <h6 className="text-lg mb-2">Title Home </h6>
                                        <p className="text-neutral-500 dark:text-neutral-300 mb-4">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1400s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not </p>
                                        <p className="text-neutral-500 dark:text-neutral-300 mb-0">It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop</p>
                                    </TabsContent>
                                    <TabsContent value="DefaultDetails" className="p-0">
                                        <h6 className="text-lg mb-2">Title Details </h6>
                                        <p className="text-neutral-500 dark:text-neutral-300 mb-4">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1400s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not </p>
                                        <p className="text-neutral-500 dark:text-neutral-300 mb-0">It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop</p>
                                    </TabsContent>
                                    <TabsContent value="DefaultProfile" className="p-0">
                                        <h6 className="text-lg mb-2">Title Profile </h6>
                                        <p className="text-neutral-500 dark:text-neutral-300 mb-4">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1400s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not </p>
                                        <p className="text-neutral-500 dark:text-neutral-300 mb-0">It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop</p>
                                    </TabsContent>
                                    <TabsContent value="DefaultSettings" className="p-0">
                                        <h6 className="text-lg mb-2">Title Settings </h6>
                                        <p className="text-neutral-500 dark:text-neutral-300 mb-4">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1400s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not </p>
                                        <p className="text-neutral-500 dark:text-neutral-300 mb-0">It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop</p>
                                    </TabsContent>
                                </div>
                            </Tabs>
                        </DefaultCardComponent>
                    </div>

                    <div className="col-span-12 xl:col-span-6">
                        <DefaultCardComponent title="Focus Tabs">
                            <Tabs defaultValue="FocusHome" className="gap-0">
                                <div className="flex items-center justify-between">
                                    <TabsList className='bg-transparent dark:bg-transparent rounded-none h-[50px]  p-0'>
                                        <TabsTrigger value="FocusHome" className='h-10 px-4 data-[state=active]:text-primary data-[state=active]:bg-primary/10 dark:data-[state=active]:bg-primary/20 duration-300 !shadow-none dark:text-white'>
                                            Home
                                        </TabsTrigger>
                                        <TabsTrigger value="FocusDetails" className='h-10 px-4 data-[state=active]:text-primary data-[state=active]:bg-primary/10 dark:data-[state=active]:bg-primary/20 duration-300 !shadow-none dark:text-white'>
                                            Details
                                        </TabsTrigger>
                                        <TabsTrigger value="FocusProfile" className='h-10 px-4 data-[state=active]:text-primary data-[state=active]:bg-primary/10 dark:data-[state=active]:bg-primary/20 duration-300 !shadow-none dark:text-white'>
                                            Profile
                                        </TabsTrigger>
                                        <TabsTrigger value="FocusSettings" className='h-10 px-4 data-[state=active]:text-primary data-[state=active]:bg-primary/10 dark:data-[state=active]:bg-primary/20 duration-300 !shadow-none dark:text-white'>
                                            Settings
                                        </TabsTrigger>
                                    </TabsList>
                                </div>

                                <div className="pt-6">
                                    <TabsContent value="FocusHome" className="p-0">
                                        <h6 className="text-lg mb-2">Title Home </h6>
                                        <p className="text-neutral-500 dark:text-neutral-300 mb-4">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1400s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not </p>
                                        <p className="text-neutral-500 dark:text-neutral-300 mb-0">It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop</p>
                                    </TabsContent>
                                    <TabsContent value="FocusDetails" className="p-0">
                                        <h6 className="text-lg mb-2">Title Details </h6>
                                        <p className="text-neutral-500 dark:text-neutral-300 mb-4">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1400s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not </p>
                                        <p className="text-neutral-500 dark:text-neutral-300 mb-0">It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop</p>
                                    </TabsContent>
                                    <TabsContent value="FocusProfile" className="p-0">
                                        <h6 className="text-lg mb-2">Title Profile </h6>
                                        <p className="text-neutral-500 dark:text-neutral-300 mb-4">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1400s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not </p>
                                        <p className="text-neutral-500 dark:text-neutral-300 mb-0">It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop</p>
                                    </TabsContent>
                                    <TabsContent value="FocusSettings" className="p-0">
                                        <h6 className="text-lg mb-2">Title Settings </h6>
                                        <p className="text-neutral-500 dark:text-neutral-300 mb-4">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1400s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not </p>
                                        <p className="text-neutral-500 dark:text-neutral-300 mb-0">It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop</p>
                                    </TabsContent>
                                </div>
                            </Tabs>
                        </DefaultCardComponent>
                    </div>

                    <div className="col-span-12 xl:col-span-6">
                        <DefaultCardComponent title="Button Tabs">
                            <Tabs defaultValue="ButtonHome" className="gap-0">
                                <div className="flex items-center justify-between">
                                    <TabsList className='bg-transparent dark:bg-transparent rounded-none h-[50px]  p-0'>
                                        <TabsTrigger value="ButtonHome" className='h-10 px-4 data-[state=active]:text-white data-[state=active]:bg-primary dark:data-[state=active]:bg-primary !shadow-none dark:text-white'>
                                            Home
                                        </TabsTrigger>
                                        <TabsTrigger value="ButtonDetails" className='h-10 px-4 data-[state=active]:text-white data-[state=active]:bg-primary dark:data-[state=active]:bg-primary !shadow-none dark:text-white'>
                                            Details
                                        </TabsTrigger>
                                        <TabsTrigger value="ButtonProfile" className='h-10 px-4 data-[state=active]:text-white data-[state=active]:bg-primary dark:data-[state=active]:bg-primary !shadow-none dark:text-white'>
                                            Profile
                                        </TabsTrigger>
                                        <TabsTrigger value="ButtonSettings" className='h-10 px-4 data-[state=active]:text-white data-[state=active]:bg-primary dark:data-[state=active]:bg-primary !shadow-none dark:text-white'>
                                            Settings
                                        </TabsTrigger>
                                    </TabsList>
                                </div>

                                <div className="pt-6">
                                    <TabsContent value="ButtonHome" className="p-0">
                                        <div className="flex items-center gap-3">
                                            <div className="shrink-0">
                                                <img src={TabsImage1} className="rounded-lg" alt="Image" />
                                            </div>
                                            <div className="grow">
                                                <h6 className="text-lg mb-2">Title Home</h6>
                                                <p className="text-neutral-500 dark:text-neutral-300 mb-4">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1400s, when an unknown printer took a galley of type and scrambled it to </p>
                                                <p className="text-neutral-500 dark:text-neutral-300 mb-0"> make a type specimen book. It has survived not industry's standard dummy</p>
                                            </div>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="ButtonDetails" className="p-0">
                                        <div className="flex items-center gap-3">
                                            <div className="shrink-0">
                                                <img src={TabsImage2} className="rounded-lg" alt="Image" />
                                            </div>
                                            <div className="grow">
                                                <h6 className="text-lg mb-2">Title Details</h6>
                                                <p className="text-neutral-500 dark:text-neutral-300 mb-4">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1400s, when an unknown printer took a galley of type and scrambled it to </p>
                                                <p className="text-neutral-500 dark:text-neutral-300 mb-0"> make a type specimen book. It has survived not industry's standard dummy</p>
                                            </div>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="ButtonProfile" className="p-0">
                                        <div className="flex items-center gap-3">
                                            <div className="shrink-0">
                                                <img src={TabsImage1} className="rounded-lg" alt="Image" />
                                            </div>
                                            <div className="grow">
                                                <h6 className="text-lg mb-2">Title Profile</h6>
                                                <p className="text-neutral-500 dark:text-neutral-300 mb-4">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1400s, when an unknown printer took a galley of type and scrambled it to </p>
                                                <p className="text-neutral-500 dark:text-neutral-300 mb-0"> make a type specimen book. It has survived not industry's standard dummy</p>
                                            </div>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="ButtonSettings" className="p-0">
                                        <div className="flex items-center gap-3">
                                            <div className="shrink-0">
                                                <img src={TabsImage2} className="rounded-lg" alt="Image" />
                                            </div>
                                            <div className="grow">
                                                <h6 className="text-lg mb-2">Title Settings</h6>
                                                <p className="text-neutral-500 dark:text-neutral-300 mb-4">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1400s, when an unknown printer took a galley of type and scrambled it to </p>
                                                <p className="text-neutral-500 dark:text-neutral-300 mb-0"> make a type specimen book. It has survived not industry's standard dummy</p>
                                            </div>
                                        </div>
                                    </TabsContent>
                                </div>
                            </Tabs>
                        </DefaultCardComponent>
                    </div>

                    <div className="col-span-12 xl:col-span-6">
                        <DefaultCardComponent title="Icon Button Tabs">
                            <Tabs defaultValue="VerticalNavHome" className="gap-0 dfl">
                                <div className="flex items-center justify-between">
                                    <TabsList className='bg-transparent dark:bg-transparent rounded-none h-[50px]  p-0 flex items-center gap-0'>
                                        <TabsTrigger value="VerticalNavHome" className='h-10 px-4 data-[state=active]:text-white data-[state=active]:bg-primary dark:data-[state=active]:bg-primary !shadow-none dark:text-white flex items-center gap-2'>
                                            <Home className="w-4 h-4" />
                                            Home
                                        </TabsTrigger>
                                        <TabsTrigger value="VerticalNavDetails" className='h-10 px-4 data-[state=active]:text-white data-[state=active]:bg-primary dark:data-[state=active]:bg-primary !shadow-none dark:text-white flex items-center gap-2'>
                                            <FileText className="w-4 h-4" />
                                            Details
                                        </TabsTrigger>
                                        <TabsTrigger value="VerticalNavProfile" className='h-10 px-4 data-[state=active]:text-white data-[state=active]:bg-primary dark:data-[state=active]:bg-primary !shadow-none dark:text-white flex items-center gap-2'>
                                            <User className="w-4 h-4" />
                                            Profile
                                        </TabsTrigger>
                                        <TabsTrigger value="VerticalNavSettings" className='h-10 px-4 data-[state=active]:text-white data-[state=active]:bg-primary dark:data-[state=active]:bg-primary !shadow-none dark:text-white flex items-center gap-2'>
                                            <Settings className="w-4 h-4" />
                                            Settings
                                        </TabsTrigger>
                                    </TabsList>
                                </div>

                                <div className="pt-6">
                                    <TabsContent value="VerticalNavHome" className="p-0">
                                        <div className="flex items-center gap-3">
                                            <div className="shrink-0">
                                                <img src={TabsImage1} className="rounded-lg" alt="Image" />
                                            </div>
                                            <div className="grow">
                                                <h6 className="text-lg mb-2">Title Home</h6>
                                                <p className="text-neutral-500 dark:text-neutral-300 mb-4">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1400s, when an unknown printer took a galley of type and scrambled it to </p>
                                                <p className="text-neutral-500 dark:text-neutral-300 mb-0"> make a type specimen book. It has survived not industry's standard dummy</p>
                                            </div>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="VerticalNavDetails" className="p-0">
                                        <div className="flex items-center gap-3">
                                            <div className="shrink-0">
                                                <img src={TabsImage2} className="rounded-lg" alt="Image" />
                                            </div>
                                            <div className="grow">
                                                <h6 className="text-lg mb-2">Title Details</h6>
                                                <p className="text-neutral-500 dark:text-neutral-300 mb-4">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1400s, when an unknown printer took a galley of type and scrambled it to </p>
                                                <p className="text-neutral-500 dark:text-neutral-300 mb-0"> make a type specimen book. It has survived not industry's standard dummy</p>
                                            </div>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="VerticalNavProfile" className="p-0">
                                        <div className="flex items-center gap-3">
                                            <div className="shrink-0">
                                                <img src={TabsImage1} className="rounded-lg" alt="Image" />
                                            </div>
                                            <div className="grow">
                                                <h6 className="text-lg mb-2">Title Profile</h6>
                                                <p className="text-neutral-500 dark:text-neutral-300 mb-4">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1400s, when an unknown printer took a galley of type and scrambled it to </p>
                                                <p className="text-neutral-500 dark:text-neutral-300 mb-0"> make a type specimen book. It has survived not industry's standard dummy</p>
                                            </div>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="VerticalNavSettings" className="p-0">
                                        <div className="flex items-center gap-3">
                                            <div className="shrink-0">
                                                <img src={TabsImage2} className="rounded-lg" alt="Image" />
                                            </div>
                                            <div className="grow">
                                                <h6 className="text-lg mb-2">Title Settings</h6>
                                                <p className="text-neutral-500 dark:text-neutral-300 mb-4">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1400s, when an unknown printer took a galley of type and scrambled it to </p>
                                                <p className="text-neutral-500 dark:text-neutral-300 mb-0"> make a type specimen book. It has survived not industry's standard dummy</p>
                                            </div>
                                        </div>
                                    </TabsContent>
                                </div>
                            </Tabs>
                        </DefaultCardComponent>
                    </div>

                    <div className="col-span-12 xl:col-span-6">
                        <DefaultCardComponent title="Vertical Nav Tabs">
                            <Tabs defaultValue="IconButtonHome" className="gap-3 flex flex-row">
                                <div className="shrink-0">
                                    <TabsList className='bg-transparent dark:bg-transparent rounded-none flex items-center justify-start flex-col p-0'>
                                        <TabsTrigger value="IconButtonHome" className='h-10 px-4 py-2.5 data-[state=active]:text-white w-full data-[state=active]:bg-primary dark:data-[state=active]:bg-primary !shadow-none dark:text-white'>
                                            Home
                                        </TabsTrigger>
                                        <TabsTrigger value="IconButtonDetails" className='h-10 px-4 py-2.5 data-[state=active]:text-white w-full data-[state=active]:bg-primary dark:data-[state=active]:bg-primary !shadow-none dark:text-white'>
                                            Details
                                        </TabsTrigger>
                                        <TabsTrigger value="IconButtonProfile" className='h-10 px-4 py-2.5 data-[state=active]:text-white w-full data-[state=active]:bg-primary dark:data-[state=active]:bg-primary !shadow-none dark:text-white'>
                                            Profile
                                        </TabsTrigger>
                                        <TabsTrigger value="IconButtonSettings" className='h-10 px-4 py-2.5 data-[state=active]:text-white w-full data-[state=active]:bg-primary dark:data-[state=active]:bg-primary !shadow-none dark:text-white'>
                                            Settings
                                        </TabsTrigger>
                                    </TabsList>
                                </div>

                                <div className="grow-[1]">
                                    <TabsContent value="IconButtonHome" className="p-0">
                                        <h6 className="text-lg mb-2">Title Home</h6>
                                        <p className="text-neutral-500 dark:text-neutral-300 mb-4">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1400s, when an unknown printer took a galley of type and scrambled it to </p>
                                        <p className="text-neutral-500 dark:text-neutral-300 mb-0"> make a type specimen book. It has survived not industry's standard dummy</p>
                                    </TabsContent>
                                    <TabsContent value="IconButtonDetails" className="p-0">
                                        <h6 className="text-lg mb-2">Title Details</h6>
                                        <p className="text-neutral-500 dark:text-neutral-300 mb-4">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1400s, when an unknown printer took a galley of type and scrambled it to </p>
                                        <p className="text-neutral-500 dark:text-neutral-300 mb-0"> make a type specimen book. It has survived not industry's standard dummy</p>
                                    </TabsContent>
                                    <TabsContent value="IconButtonProfile" className="p-0">
                                        <h6 className="text-lg mb-2">Title Profile</h6>
                                        <p className="text-neutral-500 dark:text-neutral-300 mb-4">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1400s, when an unknown printer took a galley of type and scrambled it to </p>
                                        <p className="text-neutral-500 dark:text-neutral-300 mb-0"> make a type specimen book. It has survived not industry's standard dummy</p>
                                    </TabsContent>
                                    <TabsContent value="IconButtonSettings" className="p-0">
                                        <h6 className="text-lg mb-2">Title Settings</h6>
                                        <p className="text-neutral-500 dark:text-neutral-300 mb-4">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1400s, when an unknown printer took a galley of type and scrambled it to </p>
                                        <p className="text-neutral-500 dark:text-neutral-300 mb-0"> make a type specimen book. It has survived not industry's standard dummy</p>
                                    </TabsContent>
                                </div>
                            </Tabs>
                        </DefaultCardComponent>
                    </div>

                    <div className="col-span-12 xl:col-span-6">
                        <Card className="card h-full !p-0 !block border-0 overflow-hidden">
                            <Tabs defaultValue="CardHeaderHome" className="gap-0">
                                <CardHeader className="flex items-center justify-between border-b border-neutral-200 dark:border-slate-600 !pb-0">
                                    <CardTitle className="text-lg font-semibold">Card Header Tabs</CardTitle>
                                    <TabsList className='bg-transparent dark:bg-transparent rounded-none h-[50px]  p-0'>
                                        <TabsTrigger value="CardHeaderHome" className='py-2.5 px-4 font-medium text-base inline-flex items-center gap-3 dark:bg-transparent text-neutral-600 hover:text-primary dark:text-white dark:hover:text-blue-500 border-0 border-b-1 border-transparent dark:border-transparent data-[state=active]:text-primary dark:data-[state=active]:text-primary data-[state=active]:border-primary dark:data-[state=active]:border-primary dark:data-[state=active]:bg-transparent rounded-[0] data-[state=active]:shadow-none cursor-pointer translate-y-px'>
                                            Home
                                        </TabsTrigger>
                                        <TabsTrigger value="CardHeaderDetails" className='py-2.5 px-4 font-medium text-base inline-flex items-center gap-3 dark:bg-transparent text-neutral-600 hover:text-primary dark:text-white dark:hover:text-blue-500 border-0 border-b-1 border-transparent dark:border-transparent data-[state=active]:text-primary dark:data-[state=active]:text-primary data-[state=active]:border-primary dark:data-[state=active]:border-primary dark:data-[state=active]:bg-transparent rounded-[0] data-[state=active]:shadow-none cursor-pointer translate-y-px'>
                                            Details
                                        </TabsTrigger>
                                        <TabsTrigger value="CardHeaderProfile" className='py-2.5 px-4 font-medium text-base inline-flex items-center gap-3 dark:bg-transparent text-neutral-600 hover:text-primary dark:text-white dark:hover:text-blue-500 border-0 border-b-1 border-transparent dark:border-transparent data-[state=active]:text-primary dark:data-[state=active]:text-primary data-[state=active]:border-primary dark:data-[state=active]:border-primary dark:data-[state=active]:bg-transparent rounded-[0] data-[state=active]:shadow-none cursor-pointer translate-y-px'>
                                            Profile
                                        </TabsTrigger>
                                        <TabsTrigger value="CardHeaderSettings" className='py-2.5 px-4 font-medium text-base inline-flex items-center gap-3 dark:bg-transparent text-neutral-600 hover:text-primary dark:text-white dark:hover:text-blue-500 border-0 border-b-1 border-transparent dark:border-transparent data-[state=active]:text-primary dark:data-[state=active]:text-primary data-[state=active]:border-primary dark:data-[state=active]:border-primary dark:data-[state=active]:bg-transparent rounded-[0] data-[state=active]:shadow-none cursor-pointer translate-y-px'>
                                            Settings
                                        </TabsTrigger>
                                    </TabsList>
                                </CardHeader>

                                <CardContent className="card-body p-6">
                                    <TabsContent value="CardHeaderHome" className="p-0">
                                        <h6 className="text-lg mb-2">Title Home </h6>
                                        <p className="text-neutral-500 dark:text-neutral-300 mb-4">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1400s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not </p>
                                        <p className="text-neutral-500 dark:text-neutral-300 mb-0">It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop</p>
                                    </TabsContent>
                                    <TabsContent value="CardHeaderDetails" className="p-0">
                                        <h6 className="text-lg mb-2">Title Details </h6>
                                        <p className="text-neutral-500 dark:text-neutral-300 mb-4">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1400s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not </p>
                                        <p className="text-neutral-500 dark:text-neutral-300 mb-0">It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop</p>
                                    </TabsContent>
                                    <TabsContent value="CardHeaderProfile" className="p-0">
                                        <h6 className="text-lg mb-2">Title Profile </h6>
                                        <p className="text-neutral-500 dark:text-neutral-300 mb-4">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1400s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not </p>
                                        <p className="text-neutral-500 dark:text-neutral-300 mb-0">It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop</p>
                                    </TabsContent>
                                    <TabsContent value="CardHeaderSettings" className="p-0">
                                        <h6 className="text-lg mb-2">Title Settings </h6>
                                        <p className="text-neutral-500 dark:text-neutral-300 mb-4">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1400s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not </p>
                                        <p className="text-neutral-500 dark:text-neutral-300 mb-0">It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop</p>
                                    </TabsContent>
                                </CardContent>
                            </Tabs>
                        </Card>
                    </div>

                </div>
            </LazyWrapper>
        </>
    );
};

export default TabAccordion;