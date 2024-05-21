"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { retrieveFile } from "@/app/actions";
import useDownloader from "react-use-downloader";
import { Progress } from "@/components/ui/progress";
import prettyBytes from "pretty-bytes";

export default function UploadPage({
  params: { uid },
}: {
  params: { uid: string };
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [fileInfo, setFileInfo] = useState<{
    signedUrl: string;
    size: number;
    contentType: string;
    originalName: string;
  } | null>(null);

  const { size, elapsed, percentage, download, cancel, error, isInProgress } =
    useDownloader();

  const fetchData = async (uid: string) => {
    const file = await retrieveFile(uid);

    setFileInfo({
      signedUrl: file.signedUrl,
      originalName: file.originalName,
      size: file.size,
      contentType: file.contentType,
    });
  };

  useEffect(() => {
    setIsLoading(true);

    fetchData(uid)
      .then(() => {})
      .finally(() => {
        setIsLoading(false);
      });
  }, [uid]);

  return (
    <div>
      <div
        className={`h-screen flex items-center justify-center bg-gradient-to-r from-teal-200 to-teal-500`}
      >
        <main className={"flex-grow gap-3"}>
          <div className={"container max-w-2xl flex justify-center"}>
            <div>
              <Card className="w-[400px]">
                <CardHeader>
                  <CardTitle>Your file is ready!</CardTitle>
                </CardHeader>
                <CardContent>
                  {fileInfo && (
                    <div className={"text-center mb-5"}>
                      <div className={"text-gray-600"}>
                        {fileInfo.originalName ?? "NA"}
                      </div>
                      <div className={"text-gray-500"}>
                        {prettyBytes(fileInfo.size)}
                      </div>
                    </div>
                  )}

                  {isInProgress && <Progress value={percentage} />}
                </CardContent>
                {!isInProgress && (
                  <CardFooter className="flex items-center justify-center">
                    <Button
                      size={"sm"}
                      onClick={() => {
                        download(
                          fileInfo?.signedUrl!,
                          fileInfo?.originalName ?? "Filefly file",
                        );
                      }}
                    >
                      Download
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
