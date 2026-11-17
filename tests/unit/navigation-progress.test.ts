import { describe, expect, test } from "bun:test";

import {
  createNavigationProgress,
  estimateNavigationProgress,
  type NavigationProgressState,
} from "../../src/lib/navigation-progress";

function harness() {
  let now = 0;
  let state: NavigationProgressState = { value: 0, visible: false };
  const jobs = new Set<{ at: number; run: () => void }>();
  const history: NavigationProgressState[] = [];
  const progress = createNavigationProgress(
    (next) => {
      state = next;
      history.push(next);
    },
    (run, delay) => {
      const job = { at: now + delay, run };
      jobs.add(job);
      return () => {
        jobs.delete(job);
      };
    },
    () => now,
  );

  function advance(milliseconds: number) {
    const end = now + milliseconds;
    for (;;) {
      const next = [...jobs].sort((a, b) => a.at - b.at)[0];
      if (!next || next.at > end) break;
      now = next.at;
      jobs.delete(next);
      next.run();
    }
    now = end;
  }

  return { progress, advance, history, state: () => state, jobs };
}

describe("navigation progress", () => {
  test("fast cached navigations never flash the bar", () => {
    const h = harness();
    const id = h.progress.start();
    h.advance(80);
    h.progress.prepared(id);
    h.progress.complete(id);
    h.advance(1000);
    expect(h.history.every(({ visible }) => !visible)).toBe(true);
    expect(h.jobs.size).toBe(0);
  });

  test("long navigation remains below completion until the DOM is ready", () => {
    const h = harness();
    const id = h.progress.start();
    h.advance(2000);
    const before = h.state().value;
    expect(h.state().visible).toBe(true);
    h.progress.prepared(id);
    expect(h.state().value).toBeGreaterThanOrEqual(before);
    h.advance(120_000);
    expect(h.state().value).toBeLessThan(1);
    h.progress.complete(id);
    expect(h.state()).toEqual({ value: 1, visible: true });
    h.advance(1500);
    expect(h.state().visible).toBe(false);
    expect(h.state().value).toBe(0);
    expect(h.jobs.size).toBe(0);
  });

  test("a cancelled or failed request leaves no bar or running timer", () => {
    const h = harness();
    const id = h.progress.start();
    h.advance(1000);
    h.progress.cancel(id);
    h.advance(10_000);
    expect(h.state()).toEqual({ value: 0, visible: false });
    expect(h.jobs.size).toBe(0);
  });

  test("stale completion and cancellation cannot stop a newer navigation", () => {
    const h = harness();
    const old = h.progress.start();
    h.advance(1000);
    const latest = h.progress.start();
    h.progress.prepared(old);
    h.progress.complete(old);
    h.progress.cancel(old);
    h.advance(1000);
    expect(h.state().visible).toBe(true);
    expect(h.state().value).toBeLessThan(1);
    h.progress.complete(latest);
    expect(h.state().value).toBe(1);
  });

  test("a pending fade cannot hide the next request", () => {
    const h = harness();
    const first = h.progress.start();
    h.advance(200);
    h.progress.complete(first);
    h.advance(100);
    h.progress.start();
    h.advance(800);
    expect(h.state().visible).toBe(true);
    expect(h.state().value).toBeLessThan(1);
  });

  test("the time-based curve starts at zero and slows below 100 percent", () => {
    expect(estimateNavigationProgress(0)).toBe(0);
    expect(estimateNavigationProgress(-10)).toBe(0);
    const early = estimateNavigationProgress(1000);
    const middle = estimateNavigationProgress(2000);
    const later = estimateNavigationProgress(3000);
    expect(early).toBeGreaterThan(0);
    expect(middle).toBeGreaterThan(early);
    expect(later).toBeGreaterThan(middle);
    expect(later - middle).toBeLessThan(middle - early);
    expect(estimateNavigationProgress(1_000_000)).toBeLessThan(1);
  });

  test("a new visible bar begins at zero rather than a preset value", () => {
    const h = harness();
    h.progress.start();
    h.advance(150);
    expect(h.state()).toEqual({ value: 0, visible: true });
    h.advance(100);
    expect(h.state().value).toBeCloseTo(
      estimateNavigationProgress(100),
    );
  });

  test("completion retains full width until the slow fade finishes", () => {
    const h = harness();
    const id = h.progress.start();
    h.advance(1000);
    h.progress.complete(id);
    h.advance(999);
    expect(h.state()).toEqual({ value: 1, visible: true });
    h.advance(1);
    expect(h.state()).toEqual({ value: 1, visible: false });
    h.advance(499);
    expect(h.state().value).toBe(1);
    h.advance(1);
    expect(h.state()).toEqual({ value: 0, visible: false });
  });

  test("cancellation fades the current width before resetting it", () => {
    const h = harness();
    const id = h.progress.start();
    h.advance(2000);
    const value = h.state().value;
    h.progress.cancel(id);
    expect(h.state()).toEqual({ value, visible: false });
    h.advance(499);
    expect(h.state().value).toBe(value);
    h.advance(1);
    expect(h.state()).toEqual({ value: 0, visible: false });
  });

  test("restarting during a fade hides before resetting and starts at zero", () => {
    const h = harness();
    const first = h.progress.start();
    h.advance(1000);
    h.progress.complete(first);
    h.advance(1100);
    h.progress.start();
    expect(h.state()).toEqual({ value: 1, visible: false });
    h.advance(500);
    expect(h.state()).toEqual({ value: 0, visible: false });
    h.advance(150);
    expect(h.state()).toEqual({ value: 0, visible: true });
    h.advance(100);
    expect(h.state().value).toBeGreaterThan(0);
  });

  test("page exit resets progress and ignores late callbacks", () => {
    const h = harness();
    const id = h.progress.start();
    h.advance(500);
    h.progress.reset();
    h.progress.prepared(id);
    h.progress.complete(id);
    h.advance(1000);
    expect(h.state()).toEqual({ value: 0, visible: false });
    expect(h.jobs.size).toBe(0);
  });
});
