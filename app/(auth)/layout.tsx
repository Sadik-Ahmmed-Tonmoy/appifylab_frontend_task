import { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <> 
      <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
      {children}
    </>
  );
};

export default layout;
