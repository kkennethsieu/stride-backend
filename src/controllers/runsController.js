import { db } from "../config/firebase.js";
import { Timestamp } from "firebase-admin/firestore";

export const getAllRuns = async (req, res) => {
  const userId = req.userId;
  const lastSyncedDate = req.query.after;
  try {
    let query;
    if (lastSyncedDate) {
      query = db
        .collection("runs")
        .where("userId", "==", userId)
        .where("updatedAt", ">=", new Date(lastSyncedDate))
        .orderBy("updatedAt", "desc");

    } else {
      query = 
      db.collection("runs").where("userId", "==", userId)
        .orderBy("updatedAt", "desc");

    }

    const snapshot = await query.get();

    const runs = snapshot.docs.map(doc => {
        const data = doc.data()
        return {
            ...data,
            createdAt: data.createdAt?.toDate().toISOString(),
            updatedAt: data.updatedAt?.toDate().toISOString()
        }
    })

    return res.status(200).json({ runs })

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch runs" });
  }
};

export const createRun = async (req, res) => {
  const userIdFromParams = req.userId;
  const { userId, createdAt, id, ...safeBody } = req.body;

  try {
    const run = {
      ...safeBody,
      id,
      userId: userIdFromParams,
      updatedAt: Timestamp.now(),
      createdAt: Timestamp.now(),
      isDeleted: false,
    };
    await db.collection("runs").doc(run.id).set(run);
    return res.status(201).json({ run });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to create run" });
  }
};

export const updateRun = async (req, res) => {
  const userIdFromReq = req.userId;
  const runId = req.params.id;
  const { userId, createdAt, id, ...safeBody } = req.body;

  try {
    const ref = db.collection("runs").doc(runId);
    const snapshot = await ref.get();
    if (!snapshot.exists) {
      return res.status(404).json({ error: "Run not found" });
    }
    if (snapshot.data().userId !== userIdFromReq) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    await ref.update({ ...safeBody, updatedAt: Timestamp.now() });
    return res.status(200).json({ message: "Run updated" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to update run" });
  }
};

export const deleteRun = async (req, res) => {
  const userId = req.userId;
  const runId = req.params.id;

  try {
    const ref = db.collection("runs").doc(runId);
    const snapshot = await ref.get();
    if (!snapshot.exists) {
      return res.status(404).json({ error: "Run not found" });
    }
    if (snapshot.data().userId !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    console.log("deleting run:", runId)
    const result = await ref.update({ updatedAt: Timestamp.now(), isDeleted: true });
    console.log("delete result:", result)

    // await ref.update({ updatedAt: new Date(), isDeleted: true });
    return res.status(200).json({ message: "Run deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to delete run" });
  }
};
