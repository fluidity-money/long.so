"use client";
import { graphql, useFragment } from "@/gql";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { useGraphqlUser } from "@/hooks/useGraphql";
import { cn } from "@/lib/utils";
import { useState } from "react";
const NotesFragment = graphql(`
  fragment NotesFragment on Note {
    content
    placement
  }
`);

export default function BottomBanner() {
  const { data } = useGraphqlUser();
  const notes = useFragment(NotesFragment, data?.notes);
  const bottomNote = notes?.find((item) => item.placement.includes("bottom"));
  const showBanners = useFeatureFlag("ui show banners");
  const [isBannerClosed, setIsBannerClosed] = useState(false);

  if (!bottomNote || !showBanners || isBannerClosed) return null;

  const isLeftBanner = bottomNote.placement.includes("left");
  return (
    <div
      className={cn(
        "fixed bottom-16 z-20  ",
        isLeftBanner ? "left-4" : "right-4",
      )}
    >
      <div
        dangerouslySetInnerHTML={{ __html: bottomNote.content }}
        className="banner flex max-h-32 max-w-64 rounded-md bg-stone-900"
      ></div>
      <div
        onClick={() => setIsBannerClosed(true)}
        className="absolute right-2 top-2 flex cursor-pointer items-center justify-center rounded-md bg-white px-3 py-1 text-sm"
      >
        x
      </div>
    </div>
  );
}
