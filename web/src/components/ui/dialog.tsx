import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

export const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ children, ...props }, forwardedRef) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-30 bg-black/50" />
    <DialogPrimitive.Content {...props} ref={forwardedRef}>
      <div className="mr-2 mt-2 flex justify-end">
        <DialogPrimitive.Close
          aria-label="Close"
          className="flex size-6 items-center justify-center rounded-md bg-white"
        >
          <span className="text-xs">Esc</span>
        </DialogPrimitive.Close>
      </div>
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
DialogContent.displayName = DialogPrimitive.Content.displayName;
