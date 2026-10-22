import { isAxiosError } from "axios";
import { NextResponse } from "next/server";

export function logErrorResponse(
  error: unknown,
  context: string,
  fallbackMessage: string,
): NextResponse {
  if (isAxiosError(error)) {
    console.error(`${context}:`, error.response?.data ?? error.message);
    return NextResponse.json(
      error.response?.data ?? { error: fallbackMessage },
      { status: error.response?.status ?? 500 },
    );
  }

  console.error(`${context}:`, error);
  return NextResponse.json({ error: fallbackMessage }, { status: 500 });
}
