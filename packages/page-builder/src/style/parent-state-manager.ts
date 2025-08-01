import {
  StateWithParent,
  generateParentStateDataAttribute,
  isViewState,
} from "./zod";

/**
 * Manages parent state detection and sets data attributes on parent elements
 * to enable CSS selectors for parent states
 *
 * Updated to work with block classnames (starting with 'block-') and new view states
 */
export class ParentStateManager {
  private static instance: ParentStateManager;
  private elementHandlers: Map<string, Map<string, () => void>> = new Map();
  private intersectionObservers: Map<string, IntersectionObserver> = new Map();

  static getInstance(): ParentStateManager {
    if (!ParentStateManager.instance) {
      ParentStateManager.instance = new ParentStateManager();
    }
    return ParentStateManager.instance;
  }

  /**
   * Initialize parent state detection for an element
   */
  initializeElement(element: Element, states: StateWithParent[]): void {
    const elementId = this.getElementId(element);

    // Clean up existing handlers
    this.cleanupElement(elementId);

    // Set up handlers for each parent state
    states.forEach((state) => {
      if (
        (state.parentLevel && state.parentLevel > 0) ||
        isViewState(state.state)
      ) {
        this.setupParentStateHandler(element, state);
      }
    });
  }

  /**
   * Clean up handlers for an element
   */
  cleanupElement(elementId: string): void {
    const handlers = this.elementHandlers.get(elementId);
    if (handlers) {
      handlers.forEach((cleanup) => cleanup());
      this.elementHandlers.delete(elementId);
    }

    // Clean up intersection observers
    const observer = this.intersectionObservers.get(elementId);
    if (observer) {
      observer.disconnect();
      this.intersectionObservers.delete(elementId);
    }
  }

  /**
   * Set up handler for a specific parent state
   */
  private setupParentStateHandler(
    element: Element,
    state: StateWithParent
  ): void {
    const elementId = this.getElementId(element);
    const parentLevel = state.parentLevel || 0;

    if (parentLevel === 0 && !isViewState(state.state)) return;

    // Find the parent element at the specified level
    let parentElement: Element | null = element;
    let currentElement: Element | null = element;
    let i = 0;
    while (i < parentLevel && currentElement) {
      currentElement = currentElement?.parentElement || null;
      if (
        Array.from(currentElement?.classList?.values() || []).some(
          (className) => className.startsWith("block-")
        )
      ) {
        parentElement = currentElement;
        i++;
      }
    }

    if (!parentElement) return;

    if (isViewState(state.state)) {
      this.setupViewStateHandler(element, parentElement, state);
      return;
    }

    // Set up event listeners on the parent element
    const cleanup = this.setupParentEventListeners(
      parentElement,
      element,
      state
    );

    // Store cleanup function
    if (!this.elementHandlers.has(elementId)) {
      this.elementHandlers.set(elementId, new Map());
    }
    this.elementHandlers
      .get(elementId)!
      .set(`${state.state}-${parentLevel}`, cleanup);
  }

  /**
   * Set up view state handler using Intersection Observer
   */
  private setupViewStateHandler(
    targetElement: Element,
    parentElement: Element,
    state: StateWithParent
  ): void {
    const elementId = this.getElementId(targetElement);
    const dataAttribute = generateParentStateDataAttribute(state);

    // Create intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (state.state === "inView") {
            if (entry.isIntersecting) {
              targetElement.setAttribute(dataAttribute, "true");
            } else {
              targetElement.removeAttribute(dataAttribute);
            }
          } else if (state.state === "notInView") {
            if (!entry.isIntersecting) {
              targetElement.setAttribute(dataAttribute, "true");
            } else {
              targetElement.removeAttribute(dataAttribute);
            }
          } else if (state.state === "firstTimeInView") {
            if (
              entry.isIntersecting &&
              !targetElement.hasAttribute(dataAttribute)
            ) {
              targetElement.setAttribute(dataAttribute, "true");
            }
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: "0px", // No margin
      }
    );

    observer.observe(parentElement);

    // Store observer for cleanup
    this.intersectionObservers.set(elementId, observer);
  }

  /**
   * Set up event listeners on parent element
   */
  private setupParentEventListeners(
    parentElement: Element,
    targetElement: Element,
    state: StateWithParent
  ): () => void {
    const dataAttribute = generateParentStateDataAttribute(state);

    if (!dataAttribute) return () => {};

    // Set up event listeners based on state type
    const eventMap: Record<string, string[]> = {
      hover: ["mouseenter", "mouseleave"],
      focus: ["focusin", "focusout"],
      active: ["mousedown", "mouseup"],
      disabled: ["focusin", "focusout"], // For disabled state, we'll check the disabled attribute
      inView: [], // Handled by Intersection Observer
      notInView: [], // Handled by Intersection Observer
      firstTimeInView: [], // Handled by Intersection Observer
    };

    const events = eventMap[state.state];
    if (!events || events.length === 0) return () => {};

    const handlers: Array<{ event: string; handler: (event: Event) => void }> =
      [];

    events.forEach((eventType) => {
      const handler = (event: Event) => {
        this.handleParentStateEvent(
          event,
          parentElement,
          targetElement,
          state,
          dataAttribute
        );
      };

      parentElement.addEventListener(eventType, handler, true);
      handlers.push({ event: eventType, handler });
    });

    // Return cleanup function
    return () => {
      handlers.forEach(({ event, handler }) => {
        parentElement.removeEventListener(event, handler, true);
      });
      // Remove data attribute
      targetElement.removeAttribute(dataAttribute);
    };
  }

  /**
   * Handle parent state events
   */
  private handleParentStateEvent(
    event: Event,
    parentElement: Element,
    targetElement: Element,
    state: StateWithParent,
    dataAttribute: string
  ): void {
    const isEntering =
      event.type.includes("enter") ||
      event.type === "focusin" ||
      event.type === "mousedown";

    if (isEntering) {
      targetElement.setAttribute(dataAttribute, "true");
    } else {
      targetElement.removeAttribute(dataAttribute);
    }
  }

  /**
   * Generate a unique ID for an element
   */
  private getElementId(element: Element): string {
    if (!element.hasAttribute("data-parent-state-id")) {
      const id = `parent-state-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      element.setAttribute("data-parent-state-id", id);
    }
    return element.getAttribute("data-parent-state-id")!;
  }

  /**
   * Clean up all handlers (call this when component unmounts)
   */
  cleanup(): void {
    this.elementHandlers.forEach((handlers) => {
      handlers.forEach((cleanup) => cleanup());
    });
    this.elementHandlers.clear();

    // Clean up all intersection observers
    this.intersectionObservers.forEach((observer) => {
      observer.disconnect();
    });
    this.intersectionObservers.clear();
  }
}

/**
 * Hook to use parent state manager in React components
 */
export function useParentStateManager() {
  const manager = ParentStateManager.getInstance();

  const initializeElement = (
    element: Element | null,
    states: StateWithParent[]
  ) => {
    if (element && states.length > 0) {
      manager.initializeElement(element, states);
    }
  };

  const cleanupElement = (element: Element | null) => {
    if (element) {
      const elementId = element.getAttribute("data-parent-state-id");
      if (elementId) {
        manager.cleanupElement(elementId);
      }
    }
  };

  return { initializeElement, cleanupElement };
}
