import React from "react";

namespace HookHelper {
  /**
   * Converts a promise to a hook.
   * @param fn The promise function to convert to a hook.
   * @param defaultValue The default value to set the state to.
   * @returns A hook that returns the promise result, a set state function, a refresh function that will rerun the callback and set state on resolved.
   */
  export function promiseUseHook<T, const TArgs extends unknown[]>(
    fn: (...args: TArgs) => PromiseLike<T>,
    defaultValue: T | null = null
  ) {
    return function useHook(...args: TArgs) {
      const [state, setState] = React.useState<T | null>(defaultValue);
      const refresh = (...args: TArgs) => {
        fn(...args).then(setState);
      }
      React.useEffect(() => {
        refresh(...args);
      }, []);
      return [state, setState, refresh] as const;
    }
  }

  /**
   * Converts a promise to a hook with dependencies.
   * @param fn The promise function to convert to a hook.
   * @param defaultValue The default value to set the state to.
   * @returns A hook that returns the promise result, a set state function, a refresh function that will rerun the callback and set state on resolved.
   */
  export function promiseUseHookDeps<T, const TArgs extends unknown[]>(
    fn: (...args: TArgs) => PromiseLike<T>,
    defaultValue: T | null = null
  ) {
    return function useHookDeps(deps: React.DependencyList, ...args: TArgs) {
      const [state, setState] = React.useState<T | null>(defaultValue);
      const refresh = (...args: TArgs) => {
        fn(...args).then(setState);
      }
      React.useEffect(() => {
        refresh(...args);
      }, deps);
      return [state, setState, refresh] as const;
    }
  }
}

export default HookHelper;