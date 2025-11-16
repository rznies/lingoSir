/* eslint-disable react/prop-types */
import clsx from "clsx"

export function Badge({ children, color = "bg-black", textColor = "text-white", className = "" }) {
  return (
    <span
      className={clsx(
        "inline-block px-3 py-1 text-xs font-black uppercase tracking-widest border-2 border-black",
        color,
        textColor,
        className,
      )}
    >
      {children}
    </span>
  )
}
