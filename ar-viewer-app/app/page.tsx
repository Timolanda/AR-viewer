"use client"
import dynamic from "next/dynamic"
import Sidebar from "@/components/sidebar"
import Toolbar from "@/components/toolbar"
import Timeline from "@/components/timeline"
import { ProjectProvider } from "@/components/project-context"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { PropertiesPanel } from "@/components/properties-panel"

// Dynamically import the Canvas component to avoid SSR issues
const Canvas = dynamic(() => import("@/components/canvas"), { ssr: false })

export default function Home() {
  return (
    <ProjectProvider>
      <div className="flex h-[calc(100vh-3.5rem)] bg-background">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <Sidebar />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={60}>
            <div className="flex flex-col h-full">
              <Toolbar />
              <div className="flex-1 relative">
                <Canvas />
              </div>
              <Timeline />
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <PropertiesPanel />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </ProjectProvider>
  )
}

