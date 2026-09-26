"use client";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import { useUIStore } from "@/stores/ui-store";

export function MobileSidebar() {
    const open = useUIStore((state) => state.mobileSidebarOpen);
    const setOpen = useUIStore((state) => state.setMobileSidebarOpen);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent
                side="left"
                className="w-72 border-none bg-hff-navy p-0 [&>button]:hidden"
            >
                <Sidebar variant="mobile" onClose={() => setOpen(false)} />
            </SheetContent>
        </Sheet>
    );
}