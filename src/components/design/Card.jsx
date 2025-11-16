/* eslint-disable react/prop-types */
import clsx from "clsx"

import { NB_THEME } from "./theme"

export function Card({ children, className = "", tone = "white" }) {
  return (
    <div
      className={clsx(
        NB_THEME.border,
        NB_THEME.shadow,
        tone === "white" ? "bg-white" : tone,
        "p-6",
        className,
      )}
    >
      {children}
    </div>
  )
}
