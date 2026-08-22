import { useCallback, useEffect, useRef, type RefObject } from "react";

/**
 * Loading and rendering reCAPTCHA in a single-page app.
 *
 * The previous approach — inject api.js from an effect and let it auto-render
 * every `.g-recaptcha` div — broke in two ways.
 *
 * It never rendered after an in-site navigation. api.js auto-renders exactly
 * once, as it loads. Each page guarded with "is the script already there?", so
 * on the second form page the guard skipped it, nothing re-ran, and the widget
 * container stayed empty — no checkbox and, worse, no `g-recaptcha-response`
 * field for the form to post. Deep-linking worked, clicking through the nav did
 * not, which is why it looked intermittent.
 *
 * And it started late. Appending the script from an effect means the request
 * begins only after React hydrates, so the widget arrives seconds after the
 * form is visible. The root document now preconnects to Google's hosts, which
 * gets the TLS handshake out of the way before this runs.
 *
 * `render=explicit` turns auto-rendering off entirely, so a widget appears
 * because a mounted component asked for one. That is deterministic in both
 * directions: no missing widget on navigation, and no double-render race
 * between auto-render and this code.
 */

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      render: (container: HTMLElement, params: { sitekey: string }) => number;
      getResponse: (widgetId?: number) => string;
      reset: (widgetId?: number) => void;
    };
  }
}

/**
 * The key registered for orchardcorp.com, shared by the Salesforce
 * Web-to-Lead forms. It lived inline in six files, which is how a test-domain
 * key once reached production on one form and not the others.
 */
export const WEB_TO_LEAD_SITE_KEY = "6LfpApAsAAAAAJGnaVnxcbJVdndYjgJeW_8KPZ_n";

const API_SRC = "https://www.google.com/recaptcha/api.js?render=explicit";

let loading: Promise<void> | null = null;

function loadApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.grecaptcha?.render) return Promise.resolve();
  if (loading) return loading;

  loading = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = API_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      // Cleared so a later mount can try again rather than inheriting a
      // permanently rejected promise from one flaky load.
      loading = null;
      reject(new Error("reCAPTCHA failed to load"));
    };
    document.head.appendChild(script);
  });

  return loading;
}

/**
 * Renders a widget into `container` for as long as the component is mounted.
 *
 * `getToken` reads from this widget by id rather than the implicit first one,
 * so it stays correct if a page ever carries two.
 */
export function useRecaptcha(container: RefObject<HTMLDivElement | null>, siteKey: string) {
  const widgetId = useRef<number | undefined>(undefined);

  useEffect(() => {
    let active = true;

    loadApi()
      .then(() => new Promise<void>((ready) => window.grecaptcha!.ready(ready)))
      .then(() => {
        const el = container.current;
        // childElementCount guards against a double render in StrictMode,
        // which throws "reCAPTCHA has already been rendered in this element".
        if (!active || !el || el.childElementCount > 0) return;
        widgetId.current = window.grecaptcha!.render(el, { sitekey: siteKey });
      })
      .catch((error) => console.error("[recaptcha]", error));

    return () => {
      active = false;
      // A solved widget left behind would hand its token to the next form.
      if (widgetId.current !== undefined) {
        try {
          window.grecaptcha?.reset(widgetId.current);
        } catch {
          /* the widget's node is already gone; nothing to reset */
        }
      }
      widgetId.current = undefined;
    };
  }, [container, siteKey]);

  const getToken = useCallback(() => {
    if (widgetId.current === undefined) return "";
    try {
      return window.grecaptcha?.getResponse(widgetId.current) ?? "";
    } catch {
      return "";
    }
  }, []);

  const reset = useCallback(() => {
    if (widgetId.current === undefined) return;
    try {
      window.grecaptcha?.reset(widgetId.current);
    } catch {
      /* nothing to reset */
    }
  }, []);

  return { getToken, reset };
}
