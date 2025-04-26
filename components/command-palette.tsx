"use client"

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useSystemStore } from "@/store/system-store";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export function CommandPalette() {
  const router = useRouter();
  const { navMain, navSecondary } = useSystemStore();
  const [open, setOpen] = useState(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const allItems = [
    ...navMain.map(item => ({
      ...item,
      group: "主菜单"
    })),
    ...navSecondary.map(item => ({
      ...item,
      group: "次要菜单"
    }))
  ];

  const flattenedItems = allItems.flatMap(item => 
    item.items 
      ? item.items.map(subItem => ({
          title: `${item.title} > ${subItem.title}`,
          url: subItem.url,
          group: item.group
        }))
      : [{
          title: item.title,
          url: item.url,
          group: item.group
        }]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0">
        <Command className="rounded-lg border shadow-md">
          <CommandInput placeholder="输入命令或搜索..." />
          <CommandList>
            <CommandEmpty>未找到结果</CommandEmpty>
            {["主菜单", "次要菜单"].map(group => (
              <CommandGroup key={group} heading={group}>
                {flattenedItems
                  .filter(item => item.group === group)
                  .map(item => (
                    <CommandItem
                      key={item.url}
                      onSelect={() => {
                        router.push(item.url);
                        setOpen(false);
                      }}
                    >
                      <span>{item.title}</span>
                    </CommandItem>
                  ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
} 