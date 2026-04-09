import { useEffect } from "react";

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title;
    return () => {
      document.title = "GreyWhale | Sacramento Web Design for Small Businesses";
    };
  }, [title]);
}
