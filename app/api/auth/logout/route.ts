import { proxyApiRequest } from "@/app/api/api";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  return proxyApiRequest(request, "auth/logout");
}