"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils"; // Ensure you have the `cn` utility for merging classNames
import { X } from "lucide-react"; // Close icon

export const Dialog = DialogPrimitive.Root;

export const DialogTrigger = DialogPrimitive.Trigger;

export const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] w-full max-w-md -translate-x-[50%] -translate-y-[50%] bg-white p-6 rounded-lg shadow-lg z-50",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">
        <X className="w-5 h-5" />
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
DialogContent.displayName = "DialogContent";

export const DialogHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="text-lg font-semibold text-center">{children}</div>
);

export const DialogTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xl font-bold text-center">{children}</h2>
);
