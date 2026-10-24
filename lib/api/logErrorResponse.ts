import { isAxiosError } from "axios";
import { NextResponse } from "next/server";

export function logErrorResponse(error: unknown, context: string): NextResponse {
  console.error(`${context}:`, error);
  return NextResponse.json(
    {
      error: error instanceof Error ? error.message : "Request failed.",
      response: isAxiosError(error) ? error.response?.data : undefined,
    },
    {
      status: isAxiosError(error) ? error.status ?? 500 : 500,
    },
  );
}
