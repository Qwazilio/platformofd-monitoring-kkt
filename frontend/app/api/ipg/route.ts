import { axiosIPG } from "@/lib/axiosOFD";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const apiResponse = await axiosIPG.get('/v1/client/kkts');
    return NextResponse.json(apiResponse.data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}