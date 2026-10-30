import type { ReactNode } from "react";
import { ViewSwitch } from "@/views/view-switch";

/** Pages that are views over the dataset get the switch. Case pages do not. */
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
