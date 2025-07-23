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
      {state === "collapsed" && (
        <SidebarTrigger className="absolute left-4 top-4 z-10">
          <PanelLeftOpen className="size-4" />
        </SidebarTrigger>
      )}
      <Thread />
    </>
  );
};

export const Assistant = () => {
  const runtime = useChatRuntime({
    cloud,
    api: "/api/chat",
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <SidebarProvider>
        <div className="flex h-dvh w-full p-2">
          <AppSidebar />
          <SidebarInset className="flex-1">
            <MainContent />
          </SidebarInset>
        </div>
      </SidebarProvider>
    </AssistantRuntimeProvider>
  );
};
