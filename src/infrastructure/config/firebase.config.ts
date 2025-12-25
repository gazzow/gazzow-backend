import admin from "firebase-admin";
import type { Messaging } from "firebase-admin/messaging";
// import logger from "../../utils/logger.js";

/**
 * Initialize Firebase Admin SDK
 * Supports two methods:
 * 2. Environment variables (recommended for production)
 */
const initializeFirebaseAdmin = (): admin.app.App => {
  // Check if already initialized
  if (admin.apps && admin.apps.length > 0) {
    console.log("Firebase Admin already initialized");
    return admin.app();
  }

  try {
    // Method : Use environment variables
    const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } =
      process.env;
    //   logger.debug(`Firebase_Private_Key: ${FIREBASE_PRIVATE_KEY}`)

    if (FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY) {
      console.log("Initializing Firebase Admin with environment variables...");

      return admin.initializeApp({
        credential: admin.credential.cert({
          projectId: FIREBASE_PROJECT_ID,
          clientEmail: FIREBASE_CLIENT_EMAIL,
          privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        }),
      });
    }

    // Neither method available
    throw new Error(
      "Firebase Admin initialization failed: Neither service account file nor environment variables found.\n" +
        "Please provide either:\n" +
        "1. serviceAccountKey.json file in the project root, OR\n" +
        "2. Environment variables: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY"
    );
  } catch (error) {
    console.error("Error initializing Firebase Admin:", error);
    throw error;
  }
};

// Initialize Firebase Admin
const firebaseApp = initializeFirebaseAdmin();

export const firebaseAdmin = admin;
export const messaging: Messaging = admin.messaging();

// Export app instance for testing or advanced use cases
export const app = firebaseApp;

