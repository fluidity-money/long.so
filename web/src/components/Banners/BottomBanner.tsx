"use client";
import { graphql, useFragment } from "@/gql";
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
  if (!bottomNote) return null;

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
