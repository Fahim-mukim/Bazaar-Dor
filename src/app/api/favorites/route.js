import { auth } from "@/lib/auth";
import { getUserFavorites, toggleProductFavorite, isProductFavorited } from "@/lib/db/favorites";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const headerList = await headers();
    const session = await auth.api.getSession({ headers: headerList });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (productId) {
      const isFav = await isProductFavorited(session.user.id, productId);
      return NextResponse.json({ favorited: isFav });
    }

    const favorites = await getUserFavorites(session.user.id);
    return NextResponse.json({ favorites });
  } catch (err) {
    console.error("[API Favorites GET Error]:", err.name, err.message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const headerList = await headers();
    const session = await auth.api.getSession({ headers: headerList });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    if (!body?.product?.id) {
      return NextResponse.json({ error: "Product payload is required" }, { status: 400 });
    }

    const result = await toggleProductFavorite(session.user.id, body.product);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[API Favorites POST Error]:", err.name, err.message);
    return NextResponse.json({ error: "Failed to update favorite" }, { status: 500 });
  }
}
