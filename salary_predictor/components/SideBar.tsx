"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function SideBar() {
  const router = useRouter();
  const pathname = usePathname();

  const steps = [
    { path: "/step-one", label: "Step 1", description: "Basic Info" },
    { path: "/step-two", label: "Step 2", description: "Technical Details" },
    { path: "/step-three", label: "Step 3", description: "Projects" },
  ];

  return (
    <Sidebar className="bg-gray-50 border-r border-gray-200">
      <SidebarContent className="h-full py-8">
        <SidebarGroup>
          <SidebarGroupLabel className="px-6 text-lg font-semibold text-gray-900 mb-4">
            Progress
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-4 px-3">
              {steps.map((step, index) => (
                <SidebarMenuItem key={step.path} className="block">
                  <button
                    onClick={() => router.push(step.path)}
                    className={cn(
                      "w-full aspect-square p-4 rounded-xl transition-all duration-200 group relative",
                      "hover:shadow-lg hover:scale-[1.02]",
                      "flex flex-col items-center justify-center gap-2",
                      pathname === step.path
                        ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                        : "bg-white text-gray-600 hover:bg-gray-50",
                      "border border-gray-200"
                    )}
                  >
                    <div className="text-2xl font-bold">{step.label}</div>
                    <div
                      className={cn(
                        "text-sm transition-colors",
                        pathname === step.path
                          ? "text-blue-100"
                          : "text-gray-500"
                      )}
                    >
                      {step.description}
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={cn(
                          "absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-px h-4",
                          pathname === step.path ? "bg-blue-400" : "bg-gray-300"
                        )}
                      />
                    )}
                  </button>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
