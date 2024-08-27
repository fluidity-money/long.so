"use client";
import { graphql, useFragment } from "@/gql";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { useGraphqlUser } from "@/hooks/useGraphql";
import { cn } from "@/lib/utils";
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

  if (!bottomNote || !showBanners) return null;

  return (
    <div
      dangerouslySetInnerHTML={{ __html: bottomNote?.content }}
      className={cn(
        "fixed bottom-4",
        bottomNote?.placement.includes("left") ? "left-4" : "right-4",
      )}
    />
  );
}
