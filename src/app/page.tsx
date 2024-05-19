"use client";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Dropzone from "react-dropzone";
import { useAuth } from "@kobbleio/next/client";
import { useMemo, useState } from "react";
import { storage } from "@/lib/firebase";
import { ref, uploadBytesResumable } from "@firebase/storage";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { SignedIn, LoginButton, SignedOut } from "@kobbleio/next/client";

export default function Home() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { user } = useAuth();

  const isFileReady = useMemo(() => {
    return progress === 100;
  }, [progress]);

  const handleUpload = (files: File[]) => {
    console.log(files);
    setIsDragging(false);
    setProgress(0);
    setIsUploading(true);

    // generate unguessable UUID
    const uuid = crypto.randomUUID();
    const storageRef = ref(storage, `uploads/${uuid}`);
    const uploadTask = uploadBytesResumable(storageRef, files[0]);

    uploadTask.on("state_changed", (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done");
      setProgress(progress);
      localStorage.setItem("filefly-upload-uuid", uuid);

      if (progress === 100) {
        setIsUploading(false);
      }
    });
  };

  const getLink = () => {
    const uuid = localStorage.getItem("filefly-upload-uuid");
    console.log(uuid);

    if (!uuid) {
      return setProgress(0);
    }
  };

  if (!isFileReady) {
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
                    <CardTitle>Share it!</CardTitle>
                    <CardDescription>
                      Get your link and share it with your friends.
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-center gap-3">
                    <SignedIn>
                      <LoginButton>
                        <Button>Sign-in to get my link</Button>
                      </LoginButton>
                    </SignedIn>
                    <SignedIn>
                      <Button onClick={getLink}>Get my link</Button>
                    </SignedIn>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <Dropzone
      onDrop={(acceptedFiles) => console.log(acceptedFiles)}
      onDragEnter={() => setIsDragging(true)}
      onDragLeave={() => setIsDragging(false)}
      onDropRejected={() => setIsDragging(false)}
      onDropAccepted={handleUpload}
    >
      {({ getRootProps, getInputProps }) => (
        <div
          {...getRootProps()}
          className={`h-screen flex items-center justify-center bg-gradient-to-r from-teal-200 to-teal-500`}
        >
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
                        Deploy your new project in one-click.
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
                          Upload any file, any format, any size.
                        </p>
                        <input {...getInputProps()} />
                      </div>
                    </CardContent>
                    {/*<CardFooter className="flex justify-center gap-3">*/}
                    {/*  <Button variant="outline">Cancel</Button>*/}
                    {/*  <Button>Get fly link</Button>*/}
                    {/*</CardFooter>*/}
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
                    {/*<CardFooter className="flex justify-center gap-3">*/}
                    {/*  <Button variant="outline">Cancel</Button>*/}
                    {/*  <Button>Get fly link</Button>*/}
                    {/*</CardFooter>*/}
                  </Card>
                )}
              </div>
            </div>
          </main>
        </div>
      )}
    </Dropzone>
  );
}
