import { useCallback, useState } from "react";

export function useToggle(initial = false) {
  const [isOpen, setisOpen] = useState(initial);

  const open = useCallback(() => setisOpen(true), []);
  const close = useCallback(() => setisOpen(false), []);
  const toggle = useCallback(() => setisOpen((v) => !v), []);

  return { isOpen, open, close, toggle, setisOpen };
}
