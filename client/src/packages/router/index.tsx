import React, { AnchorHTMLAttributes } from "react";
import Router from "./Router.ts";

export interface RouterContext {
  navigate: (path: string) => void;
  content: React.ReactNode;
  exitWarning: boolean,
  enableExitWarning: (state: boolean) => void;
}

export const Context = React.createContext<RouterContext>(null!);

/**
 * Provides a top-level interface for interacting with the router.  
 * All route links and Router Displays should be wrapped in this provider.
 */
function RouterProvider(props: { children: React.ReactNode, router: Router }) {
  const [path, setPath] = React.useState<string>(location.pathname);
  const [content, setContent] = React.useState<React.ReactNode>(null);
  const [exitWarning, setExitWarning] = React.useState(false);
  const enableExitWarning = React.useCallback((state: boolean) => setExitWarning(state), []);
  
  React.useEffect(() => {
    const statechange = () => {
      setPath(location.pathname);
    };
    
    addEventListener("popstate", statechange);

    return () => {
      removeEventListener("popstate", statechange);
    }
  }, []);

  React.useEffect(() => {
    const router = props.router;

    const [route, params] = router.find(path);
    if (route) {
      setContent(route.execute(params));
    }
  }, [path]);

  const warnExit = React.useCallback((e: BeforeUnloadEvent) => {
    if (exitWarning) {
      e.preventDefault();
      e.returnValue = '';
    }
  }, [exitWarning]);

  React.useEffect(() => {
    if (exitWarning) {
      addEventListener('beforeunload', warnExit);
    }
    return () => {
      removeEventListener('beforeunload', warnExit);
    }
  }, [exitWarning]);

  const navigate = (path: string) => {
    if (exitWarning && !confirm("Are you sure you want to leave this page?")) {
      return;
    }

    if (exitWarning) {
      enableExitWarning(false);
    }
    
    history.pushState(null, "", path);
    setPath(path);
  }

  return (
    <Context.Provider value={{
      navigate,
      content,
      exitWarning,
      enableExitWarning
    }}>
      {props.children}
    </Context.Provider>
  );
}

export function Link(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const navigate = useNavigate();

  return (
    <a
      {...props}
      onClick={e => {
        if (props.onClick) {
          props.onClick(e);
          if (e.defaultPrevented) {
            return;
          }
        }
        e.preventDefault();
        if (props.href) {
          navigate(props.href);
        }
      }}
    >
      {props.children}
    </a>
  );
}

export function RouterDisplay() {
  const route = useRoute();
  return route.content;
}

export function useRoute() {
  return React.useContext(Context);
}

export function useNavigate() {
  const route = useRoute();

  return function navigate(path: string) {
    route.navigate(path);
  }
}

export function useExitWarning() {
  
}

export default RouterProvider;