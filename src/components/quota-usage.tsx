"use client";

import { useAccessControl, PricingLink } from "@kobbleio/next/client";

export const QuotaUsage = () => {
  const { quotas } = useAccessControl();

  const quota = quotas?.find((quota) => quota.name === "shared-links");

  if (!quota) {
    return null;
  }

  return (
    <>
      <div className="rounded-full bg-teal-900 text-[#33C6AB] py-1 px-3 flex gap-2">
        <div className={"font-mono"}>
          usage: {quota.usage}/ {quota.limit}
        </div>
      </div>
      {quota.remaining <= 0 && (
        <PricingLink>
          <span
            className={
              "rounded-full border border-red-500 bg-red-none text-red-500 py-1 px-3 flex gap-2"
            }
          >
            Upgrade
          </span>
        </PricingLink>
      )}
    </>
  );
};
