"use client";
import React from "react";
import { useErrorReportingStore } from "../stores/useErrorReport";
import { Dialog, DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";
import * as Sentry from "@sentry/nextjs";

export default function ErrorReportingDialog() {
  const { isOpen, setIsOpen, error, setError } = useErrorReportingStore();
  async function handleError() {
    Sentry.captureException(error, {
      tags: {
        userReport: "contracts",
      },
    });
    // close dialog
    setError(null);
    setIsOpen(false);
  }
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen) => {
        setIsOpen(isOpen);
        !isOpen && setError(null);
      }}
    >
      <DialogContent className="fixed bottom-4 right-4 z-50 rounded-md bg-black">
        <div className="flex flex-col items-center justify-center gap-4 p-6 text-sm text-white">
          <span className="font-bold">Report this error?</span>
          <span>
            {error instanceof Error ? error.name : "Unknown error name"}
          </span>
          <p className="max-h-40 max-w-xl overflow-x-hidden overflow-y-scroll whitespace-break-spaces rounded-md bg-white/10 p-4 text-xs">
            {error instanceof Error ? error.message : "Unknown error message"}
          </p>
          <Button onClick={handleError} variant={"secondary"}>
            Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
