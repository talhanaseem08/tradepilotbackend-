import {
    Sidebar,
    SidebarContent,
    SidebarHeader
} from "@/components/ui/sidebar"
import { data } from "@/data/SidebarData"
import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"
import { NavMain } from "./NavMain"
import ThemeLogo from "./shared/ThemeLogo"


export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarHeader className="p-0">
                <Link to="/dashboard" className="sidebar-logo h-[72px] py-3.5 flex items-center justify-center border-b border-neutral-100 dark:border-slate-700 px-4">
                    <ThemeLogo />
                </Link>
            </SidebarHeader>
            
            <SidebarContent className={cn(`scrollbar-thin`)}>
                <NavMain items={data.navMain} />
            </SidebarContent>
        </Sidebar>
    )
}