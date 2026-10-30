import type { ReactNode } from "react";
import { ViewSwitch } from "@/views/view-switch";

/** /views: the dataset through every registered renderer, with the switch. Home and case pages do not get it. */
export default function ViewsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="mx-auto max-w-grid px-6 pt-8">
        <ViewSwitch />
      </div>
      {children}
    </>
  );
}
