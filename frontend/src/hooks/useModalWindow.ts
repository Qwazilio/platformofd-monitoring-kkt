import React from "react";
import {modalWindowType, useModalWindowsStore} from "@/hooks/store/useModalWindowStore";

export default function useModalWindow(){
    const { windows, setWindows } = useModalWindowsStore();

    const createWindow = (node: (id: string) => React.JSX.Element, title: string) => {
        const id = Date.now() + Math.random();
        const newWindow = {
            id: id,
            title: title,
            content: node,
            isShow: true,
            zIndex: (windows[0]) ? windows[0].zIndex + 1 : 1000,
        };
        setWindows((prev) => [...prev, newWindow]);
    };

    const closeWindow = (id: string) => {
        setWindows((prev) =>
            prev.filter((window: modalWindowType) => window.id != id),
        );
    };

    const getWindowId = (id: string) => {
        if(windows.length > 0) return windows.find((window: modalWindowType) => window.id == id)
    }

    const upFromIndex = (id: string) => {
        const newWindows: modalWindowType[] = [...windows];
        const index = newWindows.findIndex(w => w.id === id);
        if (index > -1) {
            const [item] = newWindows.splice(index, 1); // вырезать обжект из массива
            newWindows.push(item);                    // вставить в конец
        }
        setWindows(() => newWindows);
    }


    return { createWindow, closeWindow, getWindowId, upFromIndex };
}