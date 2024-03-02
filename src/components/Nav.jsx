import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

export default function Nav() {
  const [scroll, setScroll] = useState(false);
  useEffect(() => {
    window.addEventListener("scroll", () => {
      setScroll(window.scrollY > 52);
    });
  });

  return (
    <nav
      className={twMerge(
        "sticky top-0 z-10 backdrop-blur-lg duration-300",
        scroll && "backdrop-brightness-75",
      )}
    >
      <div
        className={twMerge(
          "px-5 mx-auto max-w-6xl duration-300",
          scroll ? "py-4" : "py-6",
        )}
      >
        <div className="grid grid-cols-2">
          <div className="col-start-1 col-end-2">
            <div className="flex flex-row items-center gap-4">
              <a href="/">
                <div className="basis-1/8">
                  <img
                    src="/transparent_64x64.webp"
                    alt="My avatar"
                    width="40"
                    height="40"
                    className="rounded-md object-fill w-10 h-10"
                  />
                  <p className="sr-only">
                    Click here to go back to the homepage
                  </p>
                </div>
              </a>
              <a href="/">
                <div
                  className={twMerge(
                    "basis-1/8 font-bold text-xl transition-opacity duration-300 opacity-0",
                    scroll ? "sm:opacity-100" : "sm:opacity-0",
                  )}
                >
                  Wolf Yuan
                </div>
                <p className="sr-only">
                  Click here to go back to the homepage
                </p>
              </a>
            </div>
          </div>
          <div className="col-start-2 col-end-3">
            <div className="flex justify-end items-center gap-6 text-lg h-10">
              <div className="basis-1/8">
                <a
                  href="https://gitlab.com/wolf-yuan"
                  target="_blank"
                  className="hover:text-gray-400 duration-300"
                >
                  <div className="flex justify-between items-center md:gap-2">
                    <Icon icon="simple-icons:gitlab" />
                    <p className="sr-only md:not-sr-only">GitLab</p>
                  </div>
                </a>
              </div>
              <div className="basis-1/10">
                <a
                  href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  target="_blank"
                  className="hover:text-gray-400 duration-300"
                >
                  <div className="flex justify-between items-center md:gap-2">
                    <Icon icon="simple-icons:youtube" />
                    <p className="sr-only md:not-sr-only">YouTube</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
