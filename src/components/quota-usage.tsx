"use client";

import { useAccessControl, PricingLink } from "@kobbleio/next/client";

export const QuotaUsage = () => {
  const { quotas } = useAccessControl();

  const quota = quotas?.find((quota) => quota.name === "shared-links");

  if (!quota) {
    return null;
  }

  return (
    <div
      className={
        "flex gap-2 text-sm items-center justify-center h-full antialiased"
      }
    >
      <div className="rounded-full bg-teal-900 text-teal-500 py-1 px-3 flex gap-2">
        <div className={"font-mono"}>
          usage: {quota.usage}/{quota.limit}
        </div>
      </div>
      <div>
        {quota.remaining <= 0 && (
          <PricingLink>
            <span
              className={
                "rounded-md bg-red-800 hover:bg-red-600 text-red-100 py-1 px-3 flex gap-2"
              }
            >
              Upgrade
            </span>
          </PricingLink>
        )}
        {quota.remaining > 0 && (
          <PricingLink>
            <span
              className={
                "rounded-md bg-teal-500 hover:bg-red-600 text-red-100 py-1 px-3 flex gap-2"
              }
            >
              View pricing
            </span>
          </PricingLink>
        )}
      </div>
    </div>
  );
};
