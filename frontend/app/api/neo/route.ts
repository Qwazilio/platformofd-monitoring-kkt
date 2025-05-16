import {ApiRequestForDataKKT} from "@/lib/axiosOFD";

export async function GET() {
  return await ApiRequestForDataKKT(process.env.NEO_TOKEN);
}