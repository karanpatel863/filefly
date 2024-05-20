"use client";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, LoginButton } from "@kobbleio/next/client";
import { generateLink } from "@/app/actions";
import { useRouter } from "next/navigation";
import { Copiable } from "@/components/ui/copiable";
import { useState } from "react";
import { ArrowPathIcon } from "@heroicons/react/16/solid";
import { QuotaUsage } from "@/components/quota-usage";

export default function UploadPage({ params: { uid } }) {
  const router = useRouter();
  const [isCopied, setIsCopied] = useState(false);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);

  const handleCopy = () => {
    if (!signedUrl) return;

    navigator.clipboard.writeText(signedUrl);
    setIsCopied(() => {
      setTimeout(() => {
        setIsCopied(false);
      }, 1000);
      return true;
    });
  };

  const getLink = async () => {
    if (!uid) return console.error("No uid");

    const { link } = await generateLink(uid);

    setSignedUrl(link);
  };

  return (
    <>
      <div onClick={handleCopy}>
        {isCopied && (
          <div
            className={
              "bg-teal-300/90 fixed top-0 left-0 bottom-0 right-0 z-50 p-10"
            }
          >
            <div
              className={
                "border-teal-500 p-10 flex items-center justify-center h-full w-full rounded-2xl"
              }
            >
              <h1 className={"text-4xl text-teal-700 font-bold"}>
                Link Copied ;)
              </h1>
            </div>
          </div>
        )}
        <div
          className={`h-screen flex items-center justify-center bg-gradient-to-r from-teal-200 to-teal-500`}
        >
          <main className={"flex-grow gap-3"}>
            <div className={"container max-w-2xl flex justify-center"}>
              <div>
                <Card className="w-[400px]">
                  <CardHeader>
                    <CardTitle>Share it!</CardTitle>
                    <CardDescription>
                      Get your link and share it with your friends.
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-center gap-3">
                    <SignedOut>
                      <LoginButton>
                        <Button>Sign-in to get my link</Button>
                      </LoginButton>
                    </SignedOut>
                    <SignedIn>
                      <div className={"space-y-5 w-full"}>
                        {signedUrl && (
                          <Copiable isCopied={isCopied}>{signedUrl}</Copiable>
                        )}

                        {!signedUrl && (
                          <Button onClick={getLink} className={"w-full"}>
                            Get my link
                          </Button>
                        )}

                        <div className={"w-full flex justify-center"}>
                          <Button
                            size={"sm"}
                            variant={"outline"}
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push("/");
                            }}
                          >
                            <ArrowPathIcon className={"w-3 h-3 mr-2"} />
                            Upload another file
                          </Button>
                        </div>
                      </div>
                    </SignedIn>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
