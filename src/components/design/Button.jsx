/* eslint-disable react/prop-types */
import clsx from "clsx"

import { NB_THEME } from "./theme"

const VARIANTS = {
  primary: "bg-[#111] text-white hover:bg-gray-900",
  secondary: "bg-white text-[#111] hover:bg-gray-50",
  red: "bg-[#E60023] text-white hover:bg-red-700",
  yellow: "bg-[#F8D300] text-black hover:bg-yellow-400",
  blue: "bg-[#004B8D] text-white hover:bg-blue-800",
  outline: "bg-transparent text-[#111]",
}

export function Button({ children, variant = "primary", icon: Icon, className = "", ...props }) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 px-6 py-3 text-lg font-bold uppercase tracking-wider",
        NB_THEME.border,
        NB_THEME.shadow,
        NB_THEME.hover,
        VARIANTS[variant] ?? VARIANTS.primary,
        className,
      )}
      {...props}
    >
      <span>{children}</span>
      {Icon ? <Icon size={20} strokeWidth={3} /> : null}
    </button>
  )
}
