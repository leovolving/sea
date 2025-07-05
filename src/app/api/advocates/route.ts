import { NextRequest } from "next/server";
import { ilike, or } from "drizzle-orm";

import db from "../../../db";
import { advocates } from "../../../db/schema";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const searchInput = searchParams.get("search")?.trim();
  const data = searchInput
    ? await db
        .select()
        .from(advocates)
        .where(
          or(
            // TODO: handle partial matches
            ilike(advocates.firstName, searchInput),
            ilike(advocates.lastName, searchInput)
          )
        )
    : await db.select().from(advocates);

  return Response.json({ data });
}
