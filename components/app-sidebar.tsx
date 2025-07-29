import * as React from "react";
import { Github, MessagesSquare, PanelLeftClose } from "lucide-react";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { ThreadList } from "./assistant-ui/thread-list";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();

  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-b mb-2">
        <div className="flex items-center justify-between">
          <SidebarMenu>
            <SidebarMenuItem className="mr-2">
              <SidebarMenuButton size="lg" asChild>
                <Link href="https://assistant-ui.com" target="_blank">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <MessagesSquare className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none mr-6">
                    <span className="font-semibold">assistant-ui</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarTrigger
            className={`mr-2 transition-all duration-150 ${
              state === "collapsed"
                ? "opacity-0 translate-x-8 pointer-events-none"
                : "translate-x-0"
            }`}
          >
            <PanelLeftClose className="size-4" />
          </SidebarTrigger>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <ThreadList />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link
                href="https://github.com/assistant-ui/assistant-ui"
                target="_blank"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Github className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">GitHub</span>
                  <span className="">View Source</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
