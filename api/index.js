// Load environment variables
require("dotenv").config();

const express = require("express");
const multer = require("multer");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
const path = require("path");
const cors = require("cors");
const admin = require("firebase-admin");

const app = express();
const upload = multer({ dest: "/tmp/" }); // Use /tmp for serverless

// Enable CORS
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://your-production-domain.com",
      "https://nursery-project-89d8b.web.app",
      "https://nursery-project-89d8b.firebaseapp.com",
    ],
    credentials: true,
  })
);
app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Nursery Registration API is running!",
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: "nursery-registration-api",
  });
});

// Test endpoint for debugging
app.get("/api/test", (req, res) => {
  res.json({
    message: "API endpoint is working!",
    firebase_initialized: admin.apps.length > 0,
    timestamp: new Date().toISOString(),
  });
});

app.post("/api/test", (req, res) => {
  res.json({
    message: "POST API endpoint is working!",
    received_body: req.body,
    firebase_initialized: admin.apps.length > 0,
    timestamp: new Date().toISOString(),
  });
});

const VA_API_KEY =
  "M2l1MzExeHY0d2p2dWI0Nno2cDQxOlJ6RmFUaTcwRzZyOUlXdHdIa0plcHdHMFdKcDhQYWpQ";
const VA_API_URL =
  "https://api.va.landing.ai/v1/tools/agentic-document-analysis";

// Your schema definition
const schema = {
  type: "object",
  title: "Nursery Registration Form Extraction Schema",
  $schema: "http://json-schema.org/draft-07/schema#",
  properties: {
    // Child Details
    childName: { type: "string" },
    age: { type: "string" },
    dateOfBirth: { type: "string" },
    countryOfBirth: { type: "string" },
    address: { type: "string" },

    // Mother's Details
    motherName: { type: "string" },
    motherDob: { type: "string" },
    nationalInsurance: { type: "string" },
    email: { type: "string" },
    occupation: { type: "string" },
    homeNumberMother: { type: "string" },
    workNumberMother: { type: "string" },
    mobileMother: { type: "string" },

    // Father's Details
    fatherName: { type: "string" },
    fatherDOB: { type: "string" },
    niFather: { type: "string" },
    emailFather: { type: "string" },
    occupationFather: { type: "string" },
    homeNumberFather: { type: "string" },
    workNumberFather: { type: "string" },
    mobileFather: { type: "string" },

    // Additional Info
    nationality: { type: "string" },
    ethnicityCulturalBackground: { type: "string" },
    pickupAuthorization: { type: "string" },

    // Other Children
    otherChild1Name: { type: "string" },
    otherChild1Age: { type: "string" },
    otherChild1Relationship: { type: "string" },
    otherChild2Name: { type: "string" },
    otherChild2Age: { type: "string" },
    otherChild2Relationship: { type: "string" },

    // Family Info
    familyDoctor: { type: "string" },
    familyCircumstances: { type: "string" },
    childLivesWith: { type: "string" },

    // Emergency Contacts
    emergencyContact1Name: { type: "string" },
    emergencyContact1Address: { type: "string" },
    emergencyContact1Phone: { type: "string" },
    emergencyContact1Relationship: { type: "string" },
    emergencyContact2Name: { type: "string" },
    emergencyContact2Address: { type: "string" },
    emergencyContact2Phone: { type: "string" },
    emergencyContact2Relationship: { type: "string" },

    // Independence Skills (all boolean)
    takeOffSocks: { type: "boolean" },
    putOnSocks: { type: "boolean" },
    takeOffShoes: { type: "boolean" },
    putOnShoes: { type: "boolean" },
    fastenVelcro: { type: "boolean" },
    fastenBuckles: { type: "boolean" },
    fastenLaces: { type: "boolean" },
    takeOffCoat: { type: "boolean" },
    hangUpCoat: { type: "boolean" },
    putOnCoatZip: { type: "boolean" },
    putOnCoatButtons: { type: "boolean" },
    washHands: { type: "boolean" },
    blowNose: { type: "boolean" },
    eatBySelf: { type: "boolean" },

    // Toileting (all boolean)
    askToilet: { type: "boolean" },
    useToiletProperly: { type: "boolean" },
    goToiletAlone: { type: "boolean" },
    needButtonHelp: { type: "boolean" },
    needWashBottom: { type: "boolean" },
    needWipeBottom: { type: "boolean" },
    needWashHandsHelp: { type: "boolean" },

    // Behavior & Moods
    specialToy: { type: "string" },
    dealWithFrustration: { type: "string" },
    comfortReassure: { type: "string" },
    worriesFrighten: { type: "string" },
    showPleased: { type: "string" },
    mixPlayChildren: { type: "string" },
    relationshipIssues: { type: "string" },
    additionalSettleInfo: { type: "string" },

    // Playing & Learning
    gamesLikes: { type: "string" },
    familyFriendsPlay: { type: "string" },
    preferOthersAlone: { type: "string" },
    enjoyTogether: { type: "string" },
    techDevices: { type: "string" },

    // Pre-school Experience
    childminder: { type: "string" },
    creche: { type: "string" },
    dayNursery: { type: "string" },
    nurserySchool: { type: "string" },
    parentToddler: { type: "string" },
    playGroup: { type: "string" },
    otherProvision: { type: "string" },

    // Physical Health
    outdoorActivities: { type: "string" },
    likesOutdoors: { type: "boolean" },
    usedToWalking: { type: "boolean" },
    earlyDifficulties: { type: "string" },
    seriousIllnesses: { type: "string" },
    hasVaccinations: { type: "boolean" },
    developmentReview: { type: "string" },
    allergiesDietary: { type: "string" },
    isRightHanded: { type: "boolean" },
    bedtime: { type: "string" },
    hasWakingProblems: { type: "boolean" },
    sleepsAfternoon: { type: "boolean" },
    externalServices: { type: "string" },

    // Talking & Listening
    languagesSpoken: { type: "string" },
    speechClear: { type: "boolean" },
    listensAttentively: { type: "boolean" },
    carriesInstructions: { type: "boolean" },
    favoriteBook: { type: "string" },
    nurseryRhymes: { type: "string" },
    likesBooks: { type: "boolean" },
    libraryVisits: { type: "string" },

    // Consents (all boolean)
    consentDataProcessing: { type: "boolean" },
    consentLocalTrips: { type: "boolean" },
    consentPhotographs: { type: "boolean" },
    consentEmergencyContact: { type: "boolean" },
    consentArtworkDisplay: { type: "boolean" },
    consentLearningJourney: { type: "boolean" },
    agreeNurseryPolicies: { type: "boolean" },
    agreePayFees: { type: "boolean" },

    // Nursery details
    grade: { type: "string" },
    nursery: { type: "string" },
    yearJoined: { type: "string" },
    nurseryName: { type: "string" },
    yearType: { type: "string" },
  },
};

// Initialize Firebase Admin SDK
let isFirebaseInitialized = false;
try {
  if (!admin.apps.length) {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      // Production environment with service account as environment variable
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log("✅ Firebase initialized with environment service account");
    } else {
      // Development environment with local file
      const serviceAccount = require("../nursery-project-89d8b-firebase-adminsdk-fbsvc-19a2a10086.json");
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log("✅ Firebase initialized with local service account file");
    }
    isFirebaseInitialized = true;
  }
} catch (error) {
  console.error("❌ Firebase initialization error:", error.message);
  console.error("Stack:", error.stack);
}

// API endpoint
app.post("/extract", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const originalName = req.file.originalname;

    const form = new FormData();
    form.append("pdf", fs.createReadStream(filePath), originalName);
    form.append("fields_schema", JSON.stringify(schema));

    const response = await axios.post(VA_API_URL, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Basic ${VA_API_KEY}`,
      },
    });

    fs.unlinkSync(filePath); // Clean uploaded file

    // Transform the response to match our flat structure if needed
    const extractedData = response.data.data.extracted_schema;
    let flatData = {};

    // If the API returns nested data, flatten it
    if (extractedData.childDetails) {
      flatData = {
        ...extractedData.childDetails,
        ...extractedData.motherDetails,
        ...extractedData.fatherDetails,
        ...extractedData.additionalInfo,
        // Handle arrays by mapping to our flat fields
        otherChild1Name: extractedData.otherChildren?.[0]?.name || "",
        otherChild1Age: extractedData.otherChildren?.[0]?.age || "",
        otherChild1Relationship:
          extractedData.otherChildren?.[0]?.relationship || "",
        otherChild2Name: extractedData.otherChildren?.[1]?.name || "",
        otherChild2Age: extractedData.otherChildren?.[1]?.age || "",
        otherChild2Relationship:
          extractedData.otherChildren?.[1]?.relationship || "",
        familyDoctor: extractedData.familyInfo?.familyDoctor || "",
        familyCircumstances:
          extractedData.familyInfo?.familyCircumstances || "",
        childLivesWith: extractedData.familyInfo?.childLivesWith || "",
        // Handle emergency contacts
        emergencyContact1Name: extractedData.emergencyContacts?.[0]?.name || "",
        emergencyContact1Address:
          extractedData.emergencyContacts?.[0]?.address || "",
        emergencyContact1Phone:
          extractedData.emergencyContacts?.[0]?.phone || "",
        emergencyContact1Relationship:
          extractedData.emergencyContacts?.[0]?.relationship || "",
        emergencyContact2Name: extractedData.emergencyContacts?.[1]?.name || "",
        emergencyContact2Address:
          extractedData.emergencyContacts?.[1]?.address || "",
        emergencyContact2Phone:
          extractedData.emergencyContacts?.[1]?.phone || "",
        emergencyContact2Relationship:
          extractedData.emergencyContacts?.[1]?.relationship || "",
        // Spread all other flat properties
        ...extractedData.independenceSkills,
        ...extractedData.toileting,
        ...extractedData.behaviorMoods,
        ...extractedData.playingLearning,
        ...extractedData.preSchoolExperience,
        ...extractedData.physicalHealth,
        ...extractedData.talkingListening,
        ...extractedData.consents,
      };
    } else {
      // If already flat, use as-is
      flatData = extractedData;
    }

    res.json({ extracted_schema: flatData });
  } catch (error) {
    console.error(
      "❌ Extraction failed:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Extraction failed." });
  }
});

app.post("/api/deleteUserFromAuth", async (req, res) => {
  console.log("🔥 Delete user request received:", { body: req.body });

  const { uid, email } = req.body;

  if (!uid && !email) {
    console.log("❌ Missing uid or email");
    return res.status(400).json({ error: "Missing uid or email" });
  }

  try {
    // Check if Firebase is properly initialized
    if (!admin.apps.length) {
      console.log("❌ Firebase not initialized");
      return res.status(500).json({ error: "Firebase not initialized" });
    }

    let userToDelete = uid;

    // If UID missing, lookup by email
    if ((!uid || uid.trim() === "") && email) {
      console.log("🔍 Looking up user by email:", email);
      const userRecord = await admin.auth().getUserByEmail(email);
      userToDelete = userRecord.uid;
      console.log("✅ Found user UID:", userToDelete);
    }

    // Final check
    if (!userToDelete) {
      console.log("❌ Could not resolve user UID");
      throw new Error("Could not resolve user UID for deletion");
    }

    console.log("🗑️ Deleting user:", userToDelete);
    await admin.auth().deleteUser(userToDelete);
    console.log("✅ User deleted successfully");

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Auth deletion error:", err);
    console.error("Error details:", {
      message: err.message,
      code: err.code,
      stack: err.stack,
    });
    res.status(500).json({
      error: err.message,
      code: err.code || "UNKNOWN_ERROR",
    });
  }
});

module.exports = app;
