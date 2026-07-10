
import { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <div className="h-full min-h-[calc(100vh-0px)]">{children}</div>
    </div>
  );
};

export default layout;
