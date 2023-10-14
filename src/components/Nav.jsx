import { StrictMode, useEffect, useState } from "react";

export default function Nav({ children }) {
  const [scroll, setScroll] = useState(false);
  useEffect(() => {
    window.addEventListener("scroll", () => {
      setScroll(window.scrollY > 56);
    });
  });

  return (
    <StrictMode>
      <nav
        className={
          (scroll ? "backdrop-brightness-75" : "") +
          " sticky top-0 backdrop-blur-md duration-300"
        }
      >
        <div
          className={
            (scroll ? "py-3" : "py-5") +
            " mx-auto max-w-4xl duration-300"
          }
        >
          <div className="grid grid-cols-4 gap-4">
            <div className="col-start-1 col-end-2">{children}</div>
          </div>
        </div>
      </nav>
    </StrictMode>
  );
}
