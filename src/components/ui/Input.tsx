import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  prefix?: string;
}

const BASE =
  "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-300";

export default function Input({ prefix, className = "", ...props }: InputProps) {
  if (prefix) {
    return (
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none">
          {prefix}
        </span>
        <input className={[BASE, "pl-6", className].filter(Boolean).join(" ")} {...props} />
      </div>
    );
  }

  return <input className={[BASE, className].filter(Boolean).join(" ")} {...props} />;
}
