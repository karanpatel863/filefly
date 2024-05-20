import admin from "firebase-admin";

const serviceAccountB64 = Buffer.from(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string,
  "base64",
).toString("utf-8");

const serviceAccount = JSON.parse(serviceAccountB64);

export const getFirebaseAdmin = () => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    });

    return admin;
  }

  return admin;
};

export default getFirebaseAdmin;
