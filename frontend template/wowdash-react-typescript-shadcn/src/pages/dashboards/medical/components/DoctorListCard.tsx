import DoctorImage1 from '@/assets/images/home-eight/doctor-img1.png';
import DoctorImage2 from '@/assets/images/home-eight/doctor-img2.png';
import DoctorImage3 from '@/assets/images/home-eight/doctor-img3.png';
import DoctorImage4 from '@/assets/images/home-eight/doctor-img4.png';
import DoctorImage5 from '@/assets/images/home-eight/doctor-img5.png';
import DoctorImage6 from '@/assets/images/home-eight/doctor-img6.png';
import CommonLink from "@/components/shared/CommonLink";
import { Card, CardContent } from "@/components/ui/card";

const DoctorListCard = () => {
    return (
        <Card className="card h-full rounded-lg border-0 !p-0">
            <CardContent className="card-body p-0 flex flex-col justify-between gap-8">
                <div>
                    <div className="card-header border-b border-neutral-200 dark:border-slate-500 py-4 px-6">
                        <div className="flex items-center flex-wrap gap-2 justify-between">
                            <h6 className="font-bold text-lg mb-0">Doctors List</h6>
                            <CommonLink />
                        </div>
                    </div>
                    <div className="card-body py-4 px-6">
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center">
                                    <img src={DoctorImage1} alt="" className="w-10 h-10 rounded-full flex-shrink-0 me-3 overflow-hidden" />
                                    <div className="flex-grow-1">
                                        <h6 className="text-base mb-0">Dr. Davis</h6>
                                        <span className="text-sm text-gray-600 dark:text-neutral-100 font-medium">Cardiology</span>
                                    </div>
                                </div>
                                <span className="bg-green-500/15 text-green-500 dark:text-green-500 px-2.5 py-1 rounded-lg font-medium text-sm">Available</span>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center">
                                    <img src={DoctorImage2} alt="" className="w-10 h-10 rounded-full flex-shrink-0 me-3 overflow-hidden" />
                                    <div className="flex-grow-1">
                                        <h6 className="text-base mb-0">Dr. Riead</h6>
                                        <span className="text-sm text-gray-600 dark:text-neutral-100 font-medium">Orthopedics</span>
                                    </div>
                                </div>
                                <span className="bg-green-500/15 text-green-500 dark:text-green-500 px-2.5 py-1 rounded-lg font-medium text-sm">Available</span>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center">
                                    <img src={DoctorImage3} alt="" className="w-10 h-10 rounded-full flex-shrink-0 me-3 overflow-hidden" />
                                    <div className="flex-grow-1">
                                        <h6 className="text-base mb-0">Albert Flores</h6>
                                        <span className="text-sm text-gray-600 dark:text-neutral-100 font-medium">Ophthalmology</span>
                                    </div>
                                </div>
                                <span className="bg-red-500/15 text-red-600 dark:text-red-600 px-2.5 py-1 rounded-lg font-medium text-sm">Not Available</span>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center">
                                    <img src={DoctorImage4} alt="" className="w-10 h-10 rounded-full flex-shrink-0 me-3 overflow-hidden" />
                                    <div className="flex-grow-1">
                                        <h6 className="text-base mb-0">Dr. Smith</h6>
                                        <span className="text-sm text-gray-600 dark:text-neutral-100 font-medium">Cardiology</span>
                                    </div>
                                </div>
                                <span className="bg-green-500/15 text-green-500 dark:text-green-500 px-2.5 py-1 rounded-lg font-medium text-sm">Available</span>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center">
                                    <img src={DoctorImage6} alt="" className="w-10 h-10 rounded-full flex-shrink-0 me-3 overflow-hidden" />
                                    <div className="flex-grow-1">
                                        <h6 className="text-base mb-0">Dr. Johnson</h6>
                                        <span className="text-sm text-gray-600 dark:text-neutral-100 font-medium">Cardiology</span>
                                    </div>
                                </div>
                                <span className="bg-red-500/15 text-red-600 dark:text-red-600 px-2.5 py-1 rounded-lg font-medium text-sm">Not Available</span>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center">
                                    <img src={DoctorImage5} alt="" className="w-10 h-10 rounded-full flex-shrink-0 me-3 overflow-hidden" />
                                    <div className="flex-grow-1">
                                        <h6 className="text-base mb-0">Dr. Martinez</h6>
                                        <span className="text-sm text-gray-600 dark:text-neutral-100 font-medium">Cardiology</span>
                                    </div>
                                </div>
                                <span className="bg-green-500/15 text-green-500 dark:text-green-500 px-2.5 py-1 rounded-lg font-medium text-sm">Available</span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default DoctorListCard;