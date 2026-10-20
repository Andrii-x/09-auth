import { proxyApiRequest } from "@/app/api/api";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return proxyApiRequest(request, "users/me");
}

export async function PATCH(request: NextRequest) {
  return proxyApiRequest(request, "users/me");
}