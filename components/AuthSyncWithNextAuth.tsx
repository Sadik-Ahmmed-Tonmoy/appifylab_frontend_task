/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { logout, setUser } from "@/redux/features/auth/authSlice";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useAppDispatch } from "../redux/hooks";

export default function AuthSyncWithNextAuth({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (status === "authenticated" && session) {
      const user = (session as any).user;
      const accessToken = (session as any).accessToken;
      const refreshToken = (session as any).refreshToken;
      console.log("accessToken", accessToken);
      console.log("refreshToken", refreshToken);
      if (user?.id) {
        dispatch(
          setUser({
            user,
            access_token: accessToken,
            refresh_token: refreshToken,
          })
        );
      } else {
        console.warn("No user data in session – clearing Redux");
        dispatch(logout());
      }
    } else if (status === "unauthenticated") {
      dispatch(logout());
    }
  }, [session, status, dispatch]);

  return <>{children}</>;
}