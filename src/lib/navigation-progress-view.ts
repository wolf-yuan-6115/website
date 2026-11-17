import type { NavigationProgressState } from "./navigation-progress";

export function createNavigationProgressView(
  bar: HTMLElement,
  fill: HTMLElement,
) {
  let frozen = false;

  function setWidth(value: number) {
    // Styling and easing stay in Tailwind; only this runtime value is dynamic.
    fill.style.setProperty(
      "--navigation-progress",
      `${value * 100}%`,
    );
  }

  return {
    render({ value, visible }: NavigationProgressState) {
      if (value === 0) {
        fill.dataset.reset = "true";
        fill.dataset.complete = "false";
        setWidth(0);
        // Commit the zero-width baseline without a reverse animation.
        fill.getBoundingClientRect();
      } else if (visible && !frozen) {
        fill.dataset.reset = "false";
        fill.dataset.complete = String(value === 1);
        // Establish the pre-change layout, including immediately after a swap,
        // before setting the new target. Otherwise both can paint as one jump.
        fill.getBoundingClientRect();
        setWidth(value);
      }
      // During fade-out, leave the drawn width alone until the hidden reset.
      bar.classList.toggle("opacity-0", !visible);
      bar.classList.toggle("opacity-100", visible);
      bar.setAttribute("aria-hidden", String(!visible));
    },
    freeze() {
      const width = bar.getBoundingClientRect().width;
      const drawn =
        width > 0 ? fill.getBoundingClientRect().width / width : 0;
      frozen = true;
      fill.dataset.reset = "true";
      setWidth(Math.min(1, Math.max(0, drawn)));
      fill.getBoundingClientRect();
    },
    resume() {
      frozen = false;
    },
  };
}
