"use client";

import { AssistantRuntimeProvider, AssistantCloud } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { Thread } from "@/components/assistant-ui/thread";
import { SidebarInset, SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { PanelLeftOpen } from "lucide-react";

const cloud = new AssistantCloud({
  baseUrl: process.env["NEXT_PUBLIC_ASSISTANT_BASE_URL"]!,
  anonymous: true,
});

const MainContent = () => {
  const { state } = useSidebar();
  
  return (
    <>
      <SidebarTrigger className={`absolute left-2.25 top-2.25 m-2 z-10 transition-all duration-150 ${
        state === "expanded" ? "-translate-x-12 opacity-0 pointer-events-none" : "translate-x-0"
      }`}>
        <PanelLeftOpen className="size-4" />
      </SidebarTrigger>
      <Thread />
    </>
  );
};

export const Assistant = () => {
  const runtime = useChatRuntime({
    cloud,
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <SidebarProvider>
        <div className="flex h-dvh w-full pr-0.5">
          <AppSidebar />
          <SidebarInset>
            <MainContent />
          </SidebarInset>
        </div>
      </SidebarProvider>
    </AssistantRuntimeProvider>
  );
};
