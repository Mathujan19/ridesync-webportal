import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";
import { initializeApp } from "firebase-admin/app";

initializeApp();

export const notifyOperatorsOnRoadAlert = onDocumentCreated(
  "road_alerts/{alertId}",
  async (event) => {
    const alert = event.data?.data();
    if (!alert) {
      return;
    }

    const message = {
      topic: `operators_${alert.region || "global"}`,
      notification: {
        title: alert.title || "Road Alert",
        body: alert.details || "A new road alert has been posted.",
      },
      data: {
        type: "road_alert",
        status: alert.status || "active",
      },
    };

    await getMessaging().send(message);

    await getFirestore().collection("logs").add({
      action: "fcm_road_alert_sent",
      details: `Alert pushed to operators topic ${message.topic}`,
      createdAt: new Date(),
    });
  }
);

export const createOperatorAccount = onCall(async (request) => {
  const role = request.auth?.token?.role;
  if (role !== "Admin") {
    throw new HttpsError("permission-denied", "Only admins can create operators.");
  }

  const { email, password, displayName, region } = request.data || {};
  if (!email || !password) {
    throw new HttpsError("invalid-argument", "email and password are required.");
  }

  const user = await getAuth().createUser({
    email,
    password,
    displayName: displayName || "Operator",
  });

  await getAuth().setCustomUserClaims(user.uid, { role: "Operator" });

  await getFirestore().collection("users").doc(user.uid).set({
    email,
    role: "Operator",
    displayName: displayName || "Operator",
    region: region || "Metro",
    frozen: false,
    createdAt: new Date(),
  });

  return { uid: user.uid, role: "Operator" };
});

export const weatherWatchdog = onSchedule("every 30 minutes", async () => {
  const weatherAlerts = await getFirestore()
    .collection("reports")
    .where("type", "==", "weather")
    .where("status", "==", "active")
    .get();

  if (weatherAlerts.empty) {
    return;
  }

  await getMessaging().send({
    topic: "operators_global",
    notification: {
      title: "RideSync Weather Warning",
      body: "Active weather alerts detected. Check RideSync app for details.",
    },
    data: {
      type: "weather_alert",
      count: String(weatherAlerts.size),
    },
  });
});