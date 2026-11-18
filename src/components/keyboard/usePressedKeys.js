import { useEffect, useState } from "react";
import { findKey } from "./layout";

// Tracks which on-screen keys are held down; returns a Set of key ids for <Keyboard>.
export function usePressedKeys() {
  const [pressedKeys, setPressedKeys] = useState(() => new Set());

  useEffect(() => {
    const update = (event, isDown) => {
      const key = findKey(event);
      if (!key) return;
      setPressedKeys((prev) => {
        if (prev.has(key.id) === isDown) return prev;
        const next = new Set(prev);
        isDown ? next.add(key.id) : next.delete(key.id);
        return next;
      });
    };
    const onKeyDown = (event) => update(event, true);
    const onKeyUp = (event) => {
      // macOS sends no keyup for keys released while Cmd is held,
      // so releasing Cmd clears everything.
      if (event.key === "Meta") setPressedKeys(new Set());
      else update(event, false);
    };
    const onBlur = () => setPressedKeys(new Set());

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  return pressedKeys;
}
