import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handlers = toNextJsHandler(auth);

const wrapHandler = (handlerFn) => async (request) => {
  try {
    const res = await handlerFn(request);
    if (res.status >= 500) {
      const mongoUri = process.env.MONGODB_URI || "";
      const isPlaceholder =
        mongoUri.includes("<db_password>") || mongoUri.includes("<password>");

      const message = isPlaceholder
        ? "ডাটাবেজ সংযোগে সমস্যা হচ্ছে। আপনার .env ফাইলে MONGODB_URI-তে <db_password>-এর স্থলে প্রকৃত পাসওয়ার্ড বসিয়ে ফাইলটি সংরক্ষণ করুন।"
        : "ডাটাবেজ সংযোগে সমস্যা দেখা দিয়েছে। অনুগ্রহ করে আপনার MongoDB ক্লাস্টার ও পাসওয়ার্ড চেক করুন।";

      return Response.json(
        {
          message,
          error: "DatabaseConnectionError",
          status: res.status,
        },
        {
          status: res.status,
        }
      );
    }
    return res;
  } catch (error) {
    const isMongoAuthError =
      error?.name === "MongoServerError" ||
      error?.name === "MongoServerSelectionError" ||
      error?.message?.includes("bad auth") ||
      error?.message?.includes("authentication failed") ||
      error?.message?.includes("timed out") ||
      error?.message?.includes("SSL alert");

    const message = isMongoAuthError
      ? "ডাটাবেজ সংযোগে সমস্যা হচ্ছে। আপনার .env ফাইলে MONGODB_URI-তে <db_password>-এর স্থানে আসল পাসওয়ার্ড প্রদান করে সার্ভার রিস্টার্ট করুন।"
      : error?.message || "সার্ভারে অনাকাঙ্ক্ষিত ত্রুটি দেখা দিয়েছে।";

    return Response.json(
      {
        message,
        error: error?.name || "InternalServerError",
        status: 500,
        code: isMongoAuthError ? "DATABASE_AUTH_FAILED" : "INTERNAL_SERVER_ERROR",
      },
      { status: 500 }
    );
  }
};

export const GET = wrapHandler(handlers.GET);
export const POST = wrapHandler(handlers.POST);
export const PATCH = wrapHandler(handlers.PATCH);
export const PUT = wrapHandler(handlers.PUT);
export const DELETE = wrapHandler(handlers.DELETE);


