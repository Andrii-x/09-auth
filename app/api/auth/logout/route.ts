import { proxyApiRequest } from "@/lib/api/proxyApiRequest";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  return proxyApiRequest(request, "auth/logout");
}