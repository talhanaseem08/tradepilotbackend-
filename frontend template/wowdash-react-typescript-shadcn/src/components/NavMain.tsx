import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

interface SidebarItem {
  title?: string;
  url?: string;
  icon?: LucideIcon;
  items?: {
    title: string;
    url?: string;
    circleColor: string;
  }[];
  label?: string;
}

export function NavMain({ items }: { items: SidebarItem[] }) {
  const location = useLocation();
  const pathname = location.pathname;

  // State: which dropdown is open
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  // Toggle a dropdown
  const handleToggleGroup = (title?: string) => {
    if (!title) return;
    setOpenGroup((prev) => (prev === title ? null : title));
  };

  // Check if dropdown contains active page
  const isDropdownActive = (item: SidebarItem) => {
    if (!item.items) return false;
    return item.items.some(
      (sub) => sub.url && (pathname === sub.url || pathname.startsWith(sub.url))
    );
  };

  return (
    <SidebarGroup className="flex flex-col w-full px-4 py-3">
      <SidebarMenu>
        {items.map((item) => {
          // Dropdown with subitems
          if (item.items && item.items.length > 0 && item.title) {
            const isActiveDropdown = isDropdownActive(item);
            const isOpen = isActiveDropdown || openGroup === item.title;

            return (
              <SidebarMenuItem key={item.title}>
                <Collapsible open={isOpen}>
                  <div>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        onClick={() => handleToggleGroup(item.title)}
                        className={cn(
                          "flex items-center py-5.5 px-3 text-base text-[#4b5563] dark:text-white hover:bg-primary/10 dark:hover:bg-slate-700",
                          isOpen
                            ? "bg-primary text-white dark:bg-primary"
                            : ""
                        )}
                      >
                        {item.icon && (
                          <item.icon className="!w-4.5 !h-4.5" />
                        )}
                        <span>{item.title}</span>
                        <ChevronRight
                          className={cn(
                            "ms-auto transition-transform duration-200",
                            isOpen ? "rotate-90" : ""
                          )}
                        />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <SidebarMenuSub className="mt-2 ms-6 space-y-1">
                        {item.items.map((subItem) => {
                          if (!subItem.url) return null;
                          const isSubActive =
                            pathname === subItem.url ||
                            pathname.startsWith(subItem.url);

                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                className={cn(
                                  "py-5.5 px-3 text-base text-[#4b5563] dark:text-white hover:bg-primary/10 active:bg-primary/10 dark:hover:bg-slate-700",
                                  isSubActive
                                    ? "bg-primary/10 font-bold dark:bg-slate-600"
                                    : ""
                                )}
                              >
                                <NavLink
                                  to={subItem.url}
                                  className="flex items-center gap-3.5"
                                  onClick={() =>
                                    item.title && setOpenGroup(item.title)
                                  }
                                >
                                  <span
                                    className={`w-2 h-2 rounded-full ${subItem.circleColor}`}
                                  />
                                  <span>{subItem.title}</span>
                                </NavLink>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              </SidebarMenuItem>
            );
          }

          // Label
          if (item.label) {
            return (
              <SidebarGroupLabel key={`label-${item.label}`}>
                {item.label}
              </SidebarGroupLabel>
            );
          }

          // Top-level single page
          if (item.url && item.title) {
            const isMenuActive =
              pathname === item.url || pathname.startsWith(item.url);

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={cn(
                    "flex items-center py-5.5 px-3 text-base text-[#4b5563] dark:text-white hover:bg-primary/10 dark:hover:bg-slate-700",
                    isMenuActive ? "bg-primary text-white dark:hover:bg-primary" : ""
                  )}
                  onClick={() => setOpenGroup(null)} // Close all dropdowns
                >
                  <Link to={item.url} className="flex items-center gap-2">
                    {item.icon && (
                      <item.icon className="!w-4.5 !h-4.5" />
                    )}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          return null;
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
