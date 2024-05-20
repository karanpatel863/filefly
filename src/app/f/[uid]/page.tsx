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

export default function UploadPage({
  params: { uid },
}: {
  params: { uid: string };
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const { size, elapsed, percentage, download, cancel, error, isInProgress } =
    useDownloader();

  const handleDownload = () => {
    alert("downloading");
  };

  const fetchData = async (uid: string) => {
    const file = await retrieveFile(uid);
    console.log("FILE", file);
    setFileUrl(file.signedUrl);
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
                {isInProgress && (
                  <CardContent>
                    <Progress value={percentage} />
                  </CardContent>
                )}
                {!isInProgress && (
                  <CardFooter className="flex items-center justify-center">
                    <Button
                      size={"sm"}
                      onClick={() => {
                        download(fileUrl!, "filefly");
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
