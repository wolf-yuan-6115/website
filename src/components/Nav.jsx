import { useEffect, useState } from "react";
import { SiGitlab, SiYoutube } from "@icons-pack/react-simple-icons";
import { twMerge } from "tailwind-merge";

export default function Nav({ children }) {
  const [scroll, setScroll] = useState(false);
  useEffect(() => {
    window.addEventListener("scroll", () => {
      setScroll(window.scrollY > 56);
    });
  });

  return (
    <nav
      className={twMerge(
        "sticky top-0 backdrop-blur-lg duration-300",
        scroll && "backdrop-brightness-75",
      )}
    >
      <div
        className={twMerge(
          "px-5 mx-auto max-w-4xl duration-300",
          scroll ? "py-4" : "py-6",
        )}
      >
        <div className="grid grid-cols-2">
          <div className="col-start-1 col-end-2">
            <div className="flex flex-row items-center gap-4">
              <div className="basis-1/8">{children}</div>
              <div
                className={twMerge(
                  "basis-1/8 font-bold text-xl transition-opacity duration-300",
                  scroll ? "opacity-100" : "opacity-0",
                )}
              >
                Wolf Yuan
              </div>
            </div>
          </div>
          <div className="col-start-2 col-end-3">
            <div className="flex justify-end items-center gap-6 text-lg h-10">
              <div className="basis-1/8">
                <a
                  href="https://gitlab.com/wolf-yuan"
                  target="_blank"
                >
                  <div className="flex justify-between items-center md:gap-2">
                    <SiGitlab />
                    <p className="sr-only md:not-sr-only">GitLab</p>
                  </div>
                </a>
              </div>
              <div className="basis-1/10">
                <a
                  href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  target="_blank"
                >
                  <div className="flex justify-between items-center md:gap-2">
                    <SiYoutube />
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
