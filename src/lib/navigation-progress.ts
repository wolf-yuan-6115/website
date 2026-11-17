export interface NavigationProgressState {
  value: number;
  visible: boolean;
}

type Schedule = (callback: () => void, delay: number) => () => void;

const scheduleTimeout: Schedule = (callback, delay) => {
  const timer = setTimeout(callback, delay);
  return () => clearTimeout(timer);
};

// Match the indicator's Tailwind duration-500 opacity transition.
const FADE_MS = 500;
// Allow the Tailwind duration-1000 width transition to finish before fading.
const WIDTH_TRANSITION_MS = 1000;
const SHOW_DELAY_MS = 150;
const TICK_MS = 100;

/** Exponential ease-out: p(t) = 0.94 × (1 − exp(−t / 1800ms)). */
export function estimateNavigationProgress(elapsedMs: number) {
  return 0.94 * (1 - Math.exp(-Math.max(0, elapsedMs) / 1800));
}

/** Estimated progress only: completion must come from the router. */
export function createNavigationProgress(
  render: (state: NavigationProgressState) => void,
  schedule: Schedule = scheduleTimeout,
  now: () => number = () => performance.now(),
) {
  let navigation = 0;
  let active = false;
  let value = 0;
  let visible = false;
  let startedAt = 0;
  let cancelTimer = () => {};

  const publish = () => render({ value, visible });
  const isActive = (id: number) => id === navigation && active;

  function trickle(id: number) {
    cancelTimer = schedule(() => {
      if (!isActive(id)) return;
      value = Math.max(
        value,
        estimateNavigationProgress(now() - startedAt),
      );
      publish();
      trickle(id);
    }, TICK_MS);
  }

  function reveal(id: number) {
    value = 0;
    visible = false;
    publish();
    cancelTimer = schedule(() => {
      if (!isActive(id)) return;
      startedAt = now();
      visible = true;
      publish();
      trickle(id);
    }, SHOW_DELAY_MS);
  }

  function fadeOut(id: number, afterFade?: () => void) {
    visible = false;
    // Preserve the current width throughout the opacity fade.
    publish();
    cancelTimer = schedule(() => {
      if (id !== navigation) return;
      value = 0;
      publish();
      afterFade?.();
    }, FADE_MS);
  }

  function reset() {
    cancelTimer();
    navigation += 1;
    active = false;
    value = 0;
    visible = false;
    publish();
  }

  return {
    start() {
      cancelTimer();
      const id = ++navigation;
      active = true;
      // Even a superseded or finishing bar must fade before its width resets.
      if (value > 0) fadeOut(id, () => reveal(id));
      else reveal(id);
      return id;
    },
    prepared(id: number) {
      if (!isActive(id) || !visible) return;
      value = Math.max(value, 0.8);
      publish();
    },
    complete(id: number) {
      if (!isActive(id)) return;
      cancelTimer();
      active = false;
      if (!visible) {
        if (value > 0) fadeOut(id);
        return;
      }
      value = 1;
      publish();
      cancelTimer = schedule(() => {
        if (id !== navigation) return;
        fadeOut(id);
      }, WIDTH_TRANSITION_MS);
    },
    cancel(id: number) {
      if (!isActive(id)) return;
      cancelTimer();
      active = false;
      if (value > 0) fadeOut(id);
      else {
        visible = false;
        publish();
      }
    },
    reset,
  };
}
