import { twMerge } from "tailwind-merge";

export default function Button({
  className,
  link,
  target,
  glow,
  children,
}) {
  return (
    <div
      className={twMerge(
        "w-fit bg-gray-800 border-2 border-emerald-200 border-solid hover:bg-emerald-200 hover:text-gray-800 hover:shadow-emerald-200 duration-300",
        glow && "hover:shadow-[0_0_15px_4px]",
        className,
      )}
    >
      <a
        href={link}
        target={target ?? "_self"}
        className="inline w-max h-max"
      >
        <div className="px-5 py-3">{children}</div>
      </a>
    </div>
  );
}
