import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

initializeApp({
  projectId: "stride-rc",
});

export const db = getFirestore();
export const auth = getAuth();
