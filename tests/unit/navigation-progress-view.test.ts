import { expect, test } from "bun:test";

import { createNavigationProgressView } from "../../src/lib/navigation-progress-view";

function harness() {
  let drawnWidth = 0;
  const widths: string[] = [];
  const attributes = new Map<string, string>();
  const classes = new Map<string, boolean>();
  const dataset: Record<string, string> = {};
  const measurements: Array<Record<string, string>> = [];
  const bar = {
    getBoundingClientRect: () => ({ width: 1000 }),
    classList: {
      toggle: (name: string, value: boolean) =>
        classes.set(name, value),
    },
    setAttribute: (name: string, value: string) =>
      attributes.set(name, value),
  } as unknown as HTMLElement;
  const fill = {
    dataset,
    style: {
      setProperty: (_: string, value: string) => widths.push(value),
    },
    getBoundingClientRect: () => {
      measurements.push({ ...dataset });
      return { width: drawnWidth };
    },
  } as unknown as HTMLElement;
  return {
    view: createNavigationProgressView(bar, fill),
    widths,
    attributes,
    classes,
    dataset,
    measurements,
    draw: (width: number) => {
      drawnWidth = width;
    },
  };
}

test("page swaps preserve drawn width, not the outstanding progress target", () => {
  const h = harness();
  h.view.render({ value: 0.8, visible: true });
  h.draw(350);
  h.view.freeze();
  expect(h.widths.at(-1)).toBe("35%");
  expect(h.dataset.reset).toBe("true");
  h.view.render({ value: 0.9, visible: true });
  expect(h.widths.at(-1)).toBe("35%");
  h.view.resume();
  h.view.render({ value: 1, visible: true });
  expect(h.widths.at(-1)).toBe("100%");
  // The previous layout is established with completion easing enabled.
  expect(h.measurements.at(-1)).toEqual({
    reset: "false",
    complete: "true",
  });
});

test("fade-out holds width and the hidden reset cannot animate backwards", () => {
  const h = harness();
  h.view.render({ value: 0.6, visible: true });
  h.view.render({ value: 0.6, visible: false });
  expect(h.widths).toEqual(["60%"]);
  expect(h.classes.get("opacity-0")).toBe(true);
  expect(h.attributes.get("aria-hidden")).toBe("true");
  h.view.render({ value: 0, visible: false });
  expect(h.widths.at(-1)).toBe("0%");
  expect(h.measurements.at(-1)?.reset).toBe("true");
});

test("completion easing is enabled only for the final movement", () => {
  const h = harness();
  h.view.render({ value: 0.4, visible: true });
  expect(h.dataset.complete).toBe("false");
  h.view.render({ value: 1, visible: true });
  expect(h.dataset.complete).toBe("true");
  h.view.render({ value: 0, visible: false });
  expect(h.dataset.complete).toBe("false");
  expect(h.dataset.reset).toBe("true");
});
