import axios from 'axios';
import {NextResponse} from "next/server";

async function ApiRequestForDataKKT(token: string) {
    const config = {
        headers: {
            token: token,
            accept: 'application/json',
            acceptCharset: 'utf-8'
        }
    }
    try {
        const apiResponse = await axios.get("https://ofv-api-v0-1-1.evotor.ru/v1/client/kkts", config);
        return NextResponse.json(apiResponse.data, { status: 200 });
    } catch (error) {
        console.error(error.message);
        if(error.response.status === 502) return NextResponse.json({error: "Сервер API не отвечает"},{ status: 502 });
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}

export {ApiRequestForDataKKT}