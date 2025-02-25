import * as pathRegexp from "path-to-regexp";
import React from "react";

/**
 * Router is an object given to the RouterProvider that allows for navigation.
 * Takes inspiration from the Express framework's syntax.
 */
export default class Router {
  private routes: Route[] = [];

  public find(path: string): [Route, Record<string, string>] | [null, null] {
    for (let i = 0; i < this.routes.length; i++) {
      const route = this.routes[i];
      const match = route.match(path);
      const params = match != false ? match.params : null;
      if (params) {
        return [route, params];
      }
    }
    return [null, null];
  }

  public add(path: string, ...callbacks: RouteMiddleware[]): void {
    this.routes.push(new Route(path, callbacks));
  }
}

export type RouteMiddleware = (
  request: RouteRequest,
  next: () => RouteAction<RouteActionType>
) => React.ReactNode | RouteAction<RouteActionType>;

type RouteActionType = "next";

interface RouteRequest {
  path: string;
  params: Record<string, string>;
  query: URLSearchParams;
}

class RouteAction<T extends RouteActionType> {
  private type: T;
  public getType(): T { return this.type; }
  constructor(type: T) {
    this.type = type;
  }
}

/**
 * Route is an object that represents a route in the Router.
 */
export class Route {
  private path: string;
  private callbacks: RouteMiddleware[];
  private keys: pathRegexp.Key[];
  private regexp: RegExp;
  private matcher: pathRegexp.MatchFunction<Record<string, string>>;

  /**
   * Creates a new Route object.
   * @param path The path to match.
   * @param callback The callback to call when the route is matched.
   */
  constructor(path: string, callbacks: RouteMiddleware[]) {
    this.path = path;
    this.callbacks = callbacks;
    const data = pathRegexp.pathToRegexp(path);
    this.regexp = data.regexp;
    this.keys = data.keys;
    this.matcher = pathRegexp.match(this.path);
  }

  /**
   * Matches a path to the route.
   * @param path The path to match.
   * @returns The result of the match.
   */
  public match(path: string): pathRegexp.Match<Record<string, string>> {
    return this.matcher(path);
  }

  public execute(params: Record<string, string>): React.ReactNode {
    const next = () => new RouteAction("next");
    
    for (let i = 0; i < this.callbacks.length; i++) {
      const callback  = this.callbacks[i];
      const result = callback({
        path: location.pathname,
        params,
        query: new URLSearchParams(location.search)
      }, next);

      if (result instanceof RouteAction) {
        if (result.getType() === "next") {
          continue;
        }
      }
      return result as React.ReactNode;
    }
  }
}