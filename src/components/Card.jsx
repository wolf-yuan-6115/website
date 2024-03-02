import { Icon } from "@iconify/react";
import { twMerge } from "tailwind-merge";

export default function Card({
  className,
  title,
  desc,
  link,
  linkName,
  target,
  icons,
}) {
  return (
    <div
      className="duration-150"
      onMouseMove={(element) => {
        let rect = element.currentTarget.getBoundingClientRect();

        let x = element.clientX - rect.left;
        let y = element.clientY - rect.top;

        let dX = (x - rect.width / 2) / (rect.width / 2);
        let dY = (y - rect.height / 2) / (rect.height / 2);

        element.currentTarget.style.transform = `perspective(500px) rotateY(${
          dX * 4
        }deg) rotateX(${-dY * 4}deg)`;
      }}
      onMouseLeave={(element) => {
        element.currentTarget.style.transform = "";
      }}
    >
      <a href={link} target={target ?? "_self"} className="w-fit">
        <div
          className={twMerge(
            "px-5 py-5 w-fit bg-gray-800 border-2 border-emerald-200 border-solid hover:bg-emerald-200 hover:text-gray-800 !duration-300",
            className,
          )}
        >
          <div className="min-h-72 md:min-h-64 grid">
            <div>
              <div className="grid grid-flow-col">
                <p className="text-xl place-self-start font-bold my-auto md:text-2xl">
                  {title}
                </p>
                <div className="place-self-end text-xl md:text-3xl">
                  {icons.map((i) => (
                    <Icon
                      icon={i.icon}
                      className={twMerge("inline mx-2", className)}
                      key={i.icon}
                    />
                  ))}
                </div>
              </div>
              <p className="text-md md:text-xl py-4">{desc}</p>
            </div>
            <div className="place-self-end w-full text-sm">
              Click here to go to{" "}
              <span className="font-bold">{linkName}</span>
              <Icon
                icon="material-symbols:arrow-forward-rounded"
                className="mx-2 inline"
              />
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}
