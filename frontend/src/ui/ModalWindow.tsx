import { CancelCircleIcon } from "@/media/defaultIcons"
import classes from "@/ui/modalWindow.module.scss"
import React, { useEffect, useState } from "react"
import useModalWindow from "@/hooks/useModalWindow";

export interface ModalWindowBase {
    id: string;
}
interface ModalWindowProps extends ModalWindowBase {
    title: string
    children?: React.ReactNode
}
export default function ModalWindow ({id, title, children} : ModalWindowProps) {
    const {closeWindow} = useModalWindow()
    const [position, setPosition] = useState({ x: window.innerWidth/ 2 - 250, y:  50});
    const [fixPosition, setFixPosition] = useState({x: 0, y: 0});
    const [dragging, setDragging] = useState(false);

    const handleMouseUp = () => {
      if(dragging){
        setDragging(false);
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    };

    useEffect(() => {
        document.addEventListener('keydown', HotKeyClose);
        return () => {
            document.removeEventListener('keydown', HotKeyClose);
        };
    }, [])

    useEffect(() => {
      if(dragging){
        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseup', handleMouseUp)
      }
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    },[dragging])

    const handleMouseMove = (event : MouseEvent) => {
      if (dragging) {
        const newX = event.clientX + fixPosition.x
        const newY = event.clientY + fixPosition.y;
        setPosition({ x: newX, y: newY });
      }
    };
  
    const handleMouseDown = (event: React.MouseEvent) => {
      setFixPosition({x: position.x - event.clientX, y: position.y - event.clientY})
      setDragging(true)
    }

    const HotKeyClose = (event: KeyboardEvent) => {
      if(event.key === 'Escape') closeWindow(id)
    }

    return(
        <div className={classes.wrapper}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
            }}
        >
            <div className={classes.top}  onMouseDown={(event) => handleMouseDown(event)}>
              <div className={classes.title}>{title}</div>
              <div className={classes.cancel} onClick={() => closeWindow(id)}><CancelCircleIcon color={"white"}/></div>
            </div>
            <div className={classes.body}>
                {children}
            </div>
        </div>
    )
}