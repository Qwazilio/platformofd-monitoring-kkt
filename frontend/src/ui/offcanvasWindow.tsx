import { CancelCircleIcon } from "@/media/defaultIcons"
import classes from "@/ui/offcanvasWindow.module.scss"
import React, { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react"

interface OffcanvasWindowProps{ 
    title: string
    close: Dispatch<SetStateAction<boolean>>
    children?: React.ReactNode
}
export default function OffcanvasWindow ({title, close, children} : OffcanvasWindowProps) {
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

    const closeWindow = (event: KeyboardEvent) => {
      if(event.key === 'Escape') close(false)      
    }

    useEffect(() => {
      document.addEventListener('keydown', closeWindow);
      return () => {
        document.removeEventListener('keydown', closeWindow);
      };
    }, [])

    return(
        <div className={classes.wrapper}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
            }}
        >
            <div className={classes.top}  onMouseDown={(event) => handleMouseDown(event)}>
              <div className={classes.title}>{title}</div>
              <div className={classes.cancel} onClick={() => close(false)}><CancelCircleIcon color={"white"}/></div>
            </div>
            <div className={classes.body}>
                {children}
            </div>
        </div>
    )
}