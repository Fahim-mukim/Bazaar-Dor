import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handlers = toNextJsHandler(auth);

const wrapHandler = (handlerFn) => async (request) => {
  try {
    const res = await handlerFn(request);
    if (res.status >= 500) {
      return Response.json(
        {
          message: "সার্ভারে সমস্যা দেখা দিয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।",
          status: res.status,
        },
        {
          status: res.status,
        }
      );
    }
    return res;
  } catch (error) {
    return Response.json(
      {
        message: "অনাকাঙ্ক্ষিত ত্রুটি দেখা দিয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
        status: 500,
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



