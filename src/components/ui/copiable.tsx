import { Clipboard, ClipboardCheck } from "lucide-react";
import { FC, useState } from "react";

type Props = React.PropsWithChildren<{
  isCopied?: boolean;
}>;

export const Copiable: FC<Props> = ({ isCopied, children }) => {
  return (
    <div
      className={
        "bg-gray-100 rounded-lg p-3 font-mono flex items-center justify-start gap-3"
      }
    >
      {isCopied && (
        <ClipboardCheck className={"w-4 h-4 shrink-0"}></ClipboardCheck>
      )}
      {!isCopied && (
        <Clipboard className={"w-4 h-4 cursor-pointer shrink-0"}></Clipboard>
      )}
      <div className={"mono overflow-clip truncate"}>{children}</div>
    </div>
  );
};
