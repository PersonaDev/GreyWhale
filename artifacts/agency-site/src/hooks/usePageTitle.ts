import { useEffect } from "react";

const DEFAULT_TITLE = "GreyWhale Web Design | Sacramento Web Design for Small Businesses";
const DEFAULT_DESC  = "Sacramento web design for local small businesses. Custom-built, search-optimized websites starting at $49/mo. No upfront cost, no contracts. Your site goes live in 14 days.";

export function usePageTitle(title: string, description?: string) {
  useEffect(() => {
    document.title = title;
    let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute("name", "description");
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", description ?? DEFAULT_DESC);
    return () => {
      document.title = DEFAULT_TITLE;
      tag?.setAttribute("content", DEFAULT_DESC);
    };
  }, [title, description]);
}
