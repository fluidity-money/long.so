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

export default function TopBanner() {
  const { data } = useGraphqlUser();
  const notes = useFragment(NotesFragment, data?.notes);
  const topNote = notes?.find((item) => item.placement.includes("top"));
  const showBanners = useFeatureFlag("ui show banners");

  if (!topNote || !showBanners) return null;

  return (
    <div
      dangerouslySetInnerHTML={{ __html: topNote?.content }}
      className={cn(
        "fixed bottom-4",
        topNote?.placement.includes("left") ? "left-4" : "right-4",
      )}
    />
  );
}
