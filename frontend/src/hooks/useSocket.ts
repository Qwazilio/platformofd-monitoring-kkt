import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export default function useSocket(socket_url: string) {
    const socketRef = useRef<Socket | null>(null)
    const [socket, setSocket] = useState<Socket | null>(null);
    useEffect(() => {
        const connection = io(socket_url, {
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
