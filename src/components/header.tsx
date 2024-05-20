"use client";

import { FC } from "react";
import { QuotaUsage } from "@/components/quota-usage";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@kobbleio/next/client";

export const Header: FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className={"fixed top-0 right-0 p-5 flex gap-2"}>
      <div>
        <Avatar>
          <AvatarImage src={user.pictureUrl!} />
          <AvatarFallback>{user.name?.[0] ?? "NC"}</AvatarFallback>
        </Avatar>
      </div>
      <div>
        <QuotaUsage></QuotaUsage>
      </div>
    </div>
  );
};
