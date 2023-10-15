import { useEffect, useState } from "react";

export default function Nav({ children }) {
  const [scroll, setScroll] = useState(false);
  useEffect(() => {
    window.addEventListener("scroll", () => {
      setScroll(window.scrollY > 56);
    });
  });

  return (
    <nav
      className={
        (scroll ? "backdrop-brightness-75" : "") +
        " sticky top-0 backdrop-blur-md duration-300"
      }
    >
      <div
        className={
          (scroll ? "py-4" : "py-6") +
          " px-5 mx-auto max-w-4xl duration-300"
        }
      >
        <div className="grid grid-cols-2 text-xl">
          <div className="col-start-1 col-end-2">
            <div className="flex flex-row items-center gap-4">
              <div className="basis-1/8">{children}</div>
              <div
                className={
                  "basis-1/8 transition-opacity duration-300 " +
                  (scroll ? "opacity-100" : "opacity-0")
                }
              >
                Wolf Yuan
              </div>
            </div>
          </div>
          <div className="col-start-2 col-end-3">
            <div className="flex flex-row justify-end items-center gap-4 h-10">
              <div className="basis-1/8">Blog</div>
              <div className="basis-1/8">YouTube</div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
