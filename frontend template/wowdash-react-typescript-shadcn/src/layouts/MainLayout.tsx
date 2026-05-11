import { Outlet } from 'react-router-dom';
import { DashboardMarketProvider } from '@/context/DashboardMarketContext';
import Footer from './Footer';
import Header from './Header';
import SidebarLayout from './SidebarLayout';

const MainLayout = () => {
    return (
        <SidebarLayout>
            <DashboardMarketProvider>
                <div className="flex flex-col min-h-full">
                    <Header />
                    <div className="dashboard-body bg-neutral-100 dark:bg-[#1e2734] md:p-6 p-4 flex-1">
                        <Outlet />
                    </div>
                    <Footer />
                </div>
            </DashboardMarketProvider>
        </SidebarLayout>
    );
};

export default MainLayout;
