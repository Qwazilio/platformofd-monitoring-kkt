import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

//const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_SERVER_URL;
const SOCKET_URL = "localhost:3001"; // Fallback for local development
export default function useSocket(namespace?: string) {
    const socketRef = useRef<Socket | null>(null)
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        if (!SOCKET_URL) {
            throw new Error("NEXT_PUBLIC_BACKEND_SERVER_URL is not defined");
        }
        if(socketRef.current) return;
        const connection = io(namespace ? `${SOCKET_URL}/${namespace}` : SOCKET_URL, {
            transports: ['websocket']
        });

        socketRef.current = connection;
        setSocket(connection);

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
                setSocket(null);
            }
        };
    }, []);

    return socket;
}
