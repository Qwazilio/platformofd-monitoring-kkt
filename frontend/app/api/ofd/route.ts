import { ApiRequestForDataKKT } from "@/lib/axiosOFD";
import { organizations } from "@/apiConfig";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const orgId = searchParams.get("org");

    const org = organizations.find(o => o.id === orgId);

    if (!org || !org.token) {
        return Response.json({ error: "Organization not found" }, { status: 404 });
    }

    const data = await ApiRequestForDataKKT(org.token);

    return Response.json(data);
}