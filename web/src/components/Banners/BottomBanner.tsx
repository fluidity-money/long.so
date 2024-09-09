"use client";
import { graphql, useFragment } from "@/gql";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { useGraphqlUser } from "@/hooks/useGraphql";
import { cn } from "@/lib/utils";
import { useWelcomeStore } from "@/stores/useWelcomeStore";
import { usePathname } from "next/navigation";
import { useState } from "react";
const NotesFragment = graphql(`
  fragment NotesFragment on Note {
    content
    placement
  }
`);
const pagesWithBanner = ["/", "/stake/pool", "/swap/confirm"];
export default function BottomBanner() {
  const pathname = usePathname();
  const renderBanner = pagesWithBanner.includes(pathname);
  const { data } = useGraphqlUser();
  const notes = useFragment(NotesFragment, data?.notes);
  const bottomNote = notes?.find((item) => item.placement.includes("bottom"));
  const featureEnabled = useFeatureFlag("ui show banners");
  const [isBannerClosed, setIsBannerClosed] = useState(false);
  const welcome = useWelcomeStore((state) => state.welcome);
  const dontRenderBanner =
    !bottomNote ||
    !featureEnabled ||
    isBannerClosed ||
    !renderBanner ||
    welcome;

  if (dontRenderBanner) return null;

  const isLeftBanner = bottomNote.placement.includes("left");
  return (
    <div
      className={cn(
        "fixed bottom-16 z-20",
        isLeftBanner ? "left-4" : "right-4",
      )}
    >
      <div
        dangerouslySetInnerHTML={{ __html: bottomNote.content }}
        className="banner flex max-h-32 max-w-64 rounded-md bg-stone-900"
      ></div>
      <div
        onClick={() => setIsBannerClosed(true)}
        className="absolute right-2 top-2 flex cursor-pointer items-center justify-center rounded-md bg-white px-3 py-1 text-xs"
      >
        Esc
      </div>
    </div>
  );
}
