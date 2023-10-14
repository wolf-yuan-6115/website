import { StrictMode, useEffect, useState } from "react";

export default function Nav() {
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
            (scroll ? "py-2" : "py-5") +
            " mx-auto max-w-5xl duration-300"
          }
        >
          <div className="grid grid-cols-2 py-2 place-items-center">
            <div>
              <a
                href="https://gitlab.com/wolf-yuan"
                className="text-white tabs font-semibold hover:font-bold hover:bg-gray-900"
              >
                GitLab
              </a>
            </div>
            <div>
              <a
                href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                className="text-white tabs font-semibold hover:font-bold"
              >
                YouTube
              </a>
            </div>
          </div>
        </div>
      </nav>
    </StrictMode>
  );
}
