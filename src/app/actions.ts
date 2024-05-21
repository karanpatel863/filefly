"use server";

import { Kobble } from "@kobbleio/admin";
import { getAuth } from "@kobbleio/next/server";
import getFirebaseAdmin from "@/lib/firebase-admin";
import { firestore } from "firebase-admin";
import Timestamp = firestore.Timestamp;

export async function generateLink(uuid: string) {
  if (!process.env.KOBBLE_SDK_SECRET_KEY) {
    throw new Error(
      "KOBBLE_SDK_SECRET_KEY is not set. Please set it in your environment variables.",
    );
  }

  const admin = getFirebaseAdmin();

  const { session } = await getAuth();

  if (!session) {
    throw new Error("You must be logged in to use this feature");
  }

  const kobble = new Kobble(process.env.KOBBLE_SDK_SECRET_KEY);

  const ref = await admin
    .storage()
    .bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET)
    .file(`uploads/${uuid}`);

  const meta = await ref.getMetadata();

  const signedUrlResponse = await ref.getSignedUrl({
    action: "read",
    expires: "03-09-2491", // never
  });

  const isAllowed = kobble.users.hasRemainingQuota(
    session.user.id,
    "shared-links",
  );

  if (!isAllowed) {
    throw new Error(
      "You have reached your image generation quota. Please upgrade your plan to generate more images.",
    );
  }

  await admin
    .firestore()
    .collection("links")
    .doc(uuid)
    .set({
      userId: session.user.id,
      signedUrl: signedUrlResponse?.[0],
      createdAt: Timestamp.now(),
      id: uuid,
      originalName: meta[0].metadata?.name ?? null,
      size: parseInt(meta[0].size as string) ?? null,
      contentType: meta[0].contentType ?? null,
    });

  await kobble.users.incrementQuotaUsage(session.user.id, "shared-links");

  return {
    link: `https://filefly.link/f/${uuid}`,
  };
}

export const retrieveFile = async (uuid: string) => {
  const admin = getFirebaseAdmin();

  const snap = await admin.firestore().collection("links").doc(uuid).get();

  if (!snap?.exists) {
    throw new Error("Link not found");
  }

  const data = snap.data();
  if (!data) {
    throw new Error("Link not found");
  }

  return {
    signedUrl: data.signedUrl,
    originalName: data.originalName,
    size: data.size,
    contentType: data.contentType,
  };
};
