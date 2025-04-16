import { DragEvent } from "react";
import { ProcessedEvent } from "../types";
import { useTheme } from "@mui/material";
import useStore from "./useStore";
import { addMinutes, format } from "date-fns";

const img = new Image();
img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";

let startPos: [number, number] | undefined;
const timeCell = document.createElement("div");
timeCell.style.position = "absolute";
timeCell.style.top = "-20px";
timeCell.style.width = "100%";
timeCell.style.textAlign = "center";
timeCell.style.fontSize = "12px";

const findRsCell = (
  bounds: DOMRect,
  cells: NodeListOf<Element>,
  withMiddle = false
): Element | null => {
  const middle = withMiddle ? (bounds.right - bounds.left) / 2 + bounds.left : bounds.left;
  let found: Element | null = null;
  for (const cell of cells) {
    const cellRect = cell.getBoundingClientRect();
    if (
      cellRect.top < bounds.top &&
      cellRect.bottom > bounds.top &&
      cellRect.left < middle &&
      cellRect.right > middle
    ) {
      found = cell;
      break;
    }
  }
  return found;
};

const useDragAttributes = (event: ProcessedEvent) => {
  const { setCurrentDragged, minuteHeight, currentDragged, onDrop } = useStore();
  const theme = useTheme();
  const headerRect = document.querySelector(".rs__header")?.getBoundingClientRect();
  const gridRect = document.querySelector("#rs__grid")?.getBoundingClientRect();
  return {
    draggable: true,
    onDragStart: (e: DragEvent<HTMLElement>) => {
      e.stopPropagation();
      setCurrentDragged(event);
      e.dataTransfer.setDragImage(img, 0, 0);
      startPos = [e.clientX, e.clientY];
      e.currentTarget.style.backgroundColor = theme.palette.error.main;
    },
    onDrag: (e: DragEvent<HTMLElement>) => {
      if (currentDragged && startPos) {
        if (currentDragged.allDay) {
          const cell = e.currentTarget.closest(".rs__multi_day") as HTMLElement;
          if (cell) {
            let diff = e.clientX - startPos[0];
            cell.style.transform = `translateX(${diff}px)`;
            const header = cell.closest(".rs__header") as HTMLElement;
            const headers = header?.parentElement?.querySelectorAll(".rs__header");
            if (headers) {
              let rect = cell.getBoundingClientRect();
              const leftmost = headers.item(0).getBoundingClientRect().left;
              const rightmost = headers.item(headers.length - 1).getBoundingClientRect().right;
              if (rect.left < leftmost) {
                diff += leftmost - rect.left;
              }
              if (rect.right > rightmost) {
                diff += rightmost - rect.right;
              }
              cell.style.transform = `translateX(${diff}px)`;
              rect = cell.getBoundingClientRect();
              const found = findRsCell(rect, headers) as HTMLElement;
              const dateString = found?.dataset.date;
              if (dateString) {
                timeCell.dataset.time = dateString;
              }
            }
          }
        } else {
          const cell = e.currentTarget.closest(".rs__event__item") as HTMLElement;
          if (cell && headerRect && gridRect) {
            const diff = [e.clientX - startPos[0], e.clientY - startPos[1]];
            cell.style.transform = `translate(${diff[0]}px, ${diff[1]}px)`;
            let rect = cell.getBoundingClientRect();
            if (rect.left < headerRect.left) {
              diff[0] += headerRect.left - rect.left;
            }
            if (rect.right > gridRect.right) {
              diff[0] += gridRect.right - rect.right;
            }
            if (rect.top < headerRect.bottom) {
              diff[1] += headerRect.bottom - rect.top;
            }
            if (rect.bottom > gridRect.bottom) {
              diff[1] += gridRect.bottom - rect.bottom;
            }

            cell.style.transform = `translate(${diff[0]}px, ${diff[1]}px)`;
            rect = cell.getBoundingClientRect();
            const timeCells = document.querySelectorAll(".rs__cell:not(.rs__header)");
            const found = findRsCell(rect, timeCells, true);

            if (found && minuteHeight && timeCell) {
              cell.appendChild(timeCell);
              const button = found.querySelector("& > button") as HTMLButtonElement;
              const fRect = found.getBoundingClientRect();
              const dateString = button?.dataset.start;
              const topDiff = rect.top - fRect.top;
              const mins = topDiff / minuteHeight;
              if (dateString) {
                const dd = new Date(dateString);
                const newDD = addMinutes(dd, mins);
                timeCell.dataset.time = newDD.toString();
                timeCell.innerText = format(newDD, "Pp");
              }
            }
          }
        }
      }
    },
    onDragEnd: (e: DragEvent<HTMLElement>) => {
      if (currentDragged) {
        if (currentDragged.allDay) {
          const cell = e.currentTarget.closest(".rs__multi_day") as HTMLElement;
          if (cell) {
            cell.style.transform = "unset";
          }
          const dateString = timeCell.dataset.time;
          if (dateString) {
            onDrop(e, currentDragged.event_id.toString(), new Date(dateString));
          }
        } else {
          const cell = e.currentTarget.closest(".rs__event__item") as HTMLElement;
          if (cell) {
            cell.removeChild(timeCell);
            cell.style.transform = "unset";
          }
          const dateString = timeCell.dataset.time;
          if (dateString) {
            onDrop(e, currentDragged.event_id.toString(), new Date(dateString));
          }
        }
      }
      setCurrentDragged();
      startPos = undefined;
      e.currentTarget.style.backgroundColor = event.color || theme.palette.primary.main;
    },
    onDragOver: (e: DragEvent<HTMLElement>) => {
      e.stopPropagation();
      e.preventDefault();
    },
    onDragEnter: (e: DragEvent<HTMLElement>) => {
      e.stopPropagation();
      e.preventDefault();
    },
  };
};

export default useDragAttributes;
