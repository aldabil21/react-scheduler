import { useEffect, useRef } from "react";

/**
 * The solution to make headers sticky with overflow
 */
const useSyncScroll = () => {
  const headersRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const header = headersRef.current;
    const body = bodyRef.current;
    const handleScroll = (event: Event) => {
      const el = event.currentTarget as HTMLElement;
      body?.scroll({ left: el.scrollLeft });
      header?.scroll({ left: el.scrollLeft });
    };
    console.log("Sync", body?.id);

    header?.addEventListener("scroll", handleScroll);
    body?.addEventListener("scroll", handleScroll);

    return () => {
      console.log("UnSync");
      header?.removeEventListener("scroll", handleScroll);
      body?.removeEventListener("scroll", handleScroll);
    };
  });

  return { headersRef, bodyRef };
};

export default useSyncScroll;
