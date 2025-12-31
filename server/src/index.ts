import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dynamoose from "dynamoose";
import courseRoutes from "./routes/courseRoutes.js";
import { clerkMiddleware, createClerkClient, requireAuth } from "@clerk/express";
import userClerkRoutes from "./routes/userClerkRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import userCourseProgressRoutes from "./routes/userCourseProgressRoutes.js";
import serverless from "serverless-http";
import seed from "./seed/seedDynamodb.js";
// route imports 

// configurations
dotenv.config();
const isProduction = process.env.NODE_ENV === "production";

if (!isProduction) {
  dynamoose.aws.ddb.local();
}

// Validate required environment variables
const clerkSecretKey = process.env.CLERK_SECRET_KEY;
if (!clerkSecretKey) {
  throw new Error("CLERK_SECRET_KEY environment variable is required");
}

export const clerkClient = createClerkClient({
  secretKey: clerkSecretKey,
});

// express setup
const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(clerkMiddleware());

// routes
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/courses", courseRoutes);
app.use("/users/clerk", requireAuth(), userClerkRoutes);
app.use("/transactions", requireAuth(), transactionRoutes);
app.use("/users/course-progress", requireAuth(), userCourseProgressRoutes);

// server setup
const PORT = process.env.PORT || 8001;
if(!isProduction) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// aws production environment for serverless
const serverlessApp = serverless(app);
export const handler = async (event: any, context: any) => {
  if (event.action === "seed") {
    await seed();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Data seeded successfully" }),
    };
  } else {
    return serverlessApp(event, context);
  }
};

export default app;