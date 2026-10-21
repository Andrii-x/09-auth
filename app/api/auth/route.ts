import { proxyApiRequest } from "@/lib/api/proxyApiRequest";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return proxyApiRequest(request, "auth/session");
}
