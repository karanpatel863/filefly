"use client";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Header } from "@/components/header";
import Dropzone from "react-dropzone";
import { useEffect, useState } from "react";
import { storage } from "@/lib/firebase";
import { ref, uploadBytesResumable } from "@firebase/storage";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import { ls } from "@/lib/local-storage";
import { SuccessAnimation } from "@/components/ui/success-animation";
import { nanoid } from "nanoid";
import { useAuth } from "@kobbleio/next/client";

export default function Home() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const pendingUpload = ls.getLatestUploadId();

    ls.resetLatestUploadId();

    if (pendingUpload?.length) {
      router.push(`/upload/${pendingUpload}`);
    }
  }, [router]);

  const handleUpload = (files: File[]) => {
    setIsDragging(false);
    setProgress(0);
    setIsUploading(true);

    const uuid = nanoid();
    const storageRef = ref(storage, `uploads/${uuid}`);
    const uploadTask = uploadBytesResumable(storageRef, files[0], {
      customMetadata: {
        name: files[0].name,
      },
    });

    uploadTask.on("state_changed", (snapshot) => {
      const progressFloat =
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      const progressDecimal = progressFloat.toFixed(0);
      const progress = parseInt(progressDecimal, 10);

      setProgress(progress);

      if (progress === 100) {
        setIsSuccess(true);

        if (!user) {
          ls.setLatestUploadId(uuid);
        }

        setTimeout(() => {
          handleSuccessAnimationComplete(uuid);
        }, 2000);
      }
    });
  };

  const handleSuccessAnimationComplete = (uuid: string) => {
    router.push(`/upload/${uuid}`);
  };

  return (
    <>
      <Header />
      <Dropzone
        onDrop={(acceptedFiles) => {}}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDropRejected={() => setIsDragging(false)}
        onDropAccepted={handleUpload}
      >
        {({ getRootProps, getInputProps }) => (
          <div
            {...getRootProps()}
            className={`h-screen flex items-center justify-center bg-gradient-to-r from-teal-200 to-teal-500 ${isUploading && "animated-background"}`}
          >
            {isSuccess && (
              <div
                className={
                  "fixed top-0 bottom-0 right-0 left-0 flex items-center justify-center z-50"
                }
              >
                <div className={"max-w-xl"}>
                  <SuccessAnimation />
                </div>
              </div>
            )}
            {isDragging && (
              <div
                className={
                  "bg-teal-300/90 fixed top-0 left-0 bottom-0 right-0 z-50 p-10"
                }
              >
                <div
                  className={
                    "border-dashed border-4 border-teal-500 p-10 flex items-center justify-center h-full w-full rounded-2xl"
                  }
                >
                  <h1 className={"text-4xl text-teal-700 font-bold"}>
                    Drop your file anywhere
                  </h1>
                </div>
              </div>
            )}
            <main className={"flex-grow gap-3"}>
              <div className={"container max-w-2xl flex justify-center"}>
                <div>
                  {!isUploading && (
                    <Card className="w-[400px]">
                      <CardHeader>
                        <CardTitle>Drop your files</CardTitle>
                        <CardDescription>
                          Instantly share files with anyone.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div
                          className={
                            "rounded-2xl border-dashed border p-3 text-center flex flex-col items-center justify-center"
                          }
                        >
                          <Image
                            width={50}
                            height={50}
                            src={"upload.svg"}
                            alt={"upload"}
                          />
                          <p className={"text-sm"}>
                            Upload any file, any format, up to 100GB
                          </p>
                          <input {...getInputProps()} />
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {isUploading && (
                    <Card className="w-[400px]">
                      <CardHeader>
                        <CardTitle>Uploading {progress}%</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div
                          className={
                            "rounded-2xl border-dashed border p-3 text-center flex flex-col items-center justify-center"
                          }
                        >
                          <Progress value={progress} />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </main>
          </div>
        )}
      </Dropzone>
    </>
  );
}
