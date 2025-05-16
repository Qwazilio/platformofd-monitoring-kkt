import {ApiRequestForDataKKT} from "@/lib/axiosOFD";

export async function GET() {
  return await ApiRequestForDataKKT(process.env.DB_TOKEN);
}