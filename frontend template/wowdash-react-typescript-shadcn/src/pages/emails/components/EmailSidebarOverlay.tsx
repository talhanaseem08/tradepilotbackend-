
import { useEmailSidebar } from '@/context/EmailSidebarContext';

const EmailSidebarOverlay = () => {
    const { isSidebarOpen, closeSidebar } = useEmailSidebar();

    return isSidebarOpen ? (
        <div className="fixed inset-0 bg-black/50 z-[5] xl:hidden" onClick={closeSidebar} />
    ) : null;
};

export default EmailSidebarOverlay;
