import type { ReactNode } from "react";
import "./DropdownMenu.css";

export type DropdownMenuItem = {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  danger?: boolean;
};

type Props = {
  items: DropdownMenuItem[];
  /** Largeur du menu. Nombre = px, string = valeur CSS directe. Par défaut: min-width 180px. */
  width?: number | string;
};

export default function DropdownMenu({ items, width }: Props) {
  return (
    <div
      className="dropdown-menu"
      style={
        width !== undefined
          ? { width: typeof width === "number" ? `${width}px` : width, minWidth: "unset" }
          : undefined
      }
    >
      {items.map((item) => (
        <button
          key={item.label}
          type="button"
          className={`dropdown-menu-item${item.danger ? " dropdown-menu-item-danger" : ""}`}
          onClick={item.onClick}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>
  );
}
