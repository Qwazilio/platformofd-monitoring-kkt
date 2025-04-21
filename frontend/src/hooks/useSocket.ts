import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = `${process.env.BACKEND_SERVER_URL}`;

export default function useSocket() {
    const socketRef = useRef<Socket | null>(null)
    const [socket, setSocket] = useState<Socket | null>(null);
    useEffect(() => {
        const connection = io(SOCKET_URL, {
            transports: ['websocket']
            
        });

        socketRef.current = connection;
        setSocket(connection);

        return () => {
            
            if(socketRef.current) 
                if(socketRef.current.connected) 
                    socketRef.current.close()
        };
    }, []);
    
    return socket;
}
