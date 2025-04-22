// Browser compatibility detection and polyfills

/**
 * Check if the browser supports modern features
 * @returns Object with browser support flags
 */
export function checkBrowserSupport() {
  // Only run on client
  if (typeof window === "undefined") {
    return {
      modern: true,
      supportsFlexGap: true,
      supportsGridLayout: true,
      supportsIntersectionObserver: true,
    }
  }

  // Check for flex gap support
  const supportsFlexGap = (() => {
    // Create flex container with gap
    const flex = document.createElement("div")
    flex.style.display = "flex"
    flex.style.flexDirection = "column"
    flex.style.gap = "1px"

    // Append two child elements
    flex.appendChild(document.createElement("div"))
    flex.appendChild(document.createElement("div"))

    // Append to the DOM
    document.body.appendChild(flex)

    // Check if gap works
    const isSupported = flex.scrollHeight === 1

    // Clean up
    flex.parentNode?.removeChild(flex)

    return isSupported
  })()

  // Check for grid layout support
  const supportsGridLayout = (() => {
    return window.CSS && CSS.supports && CSS.supports("display", "grid")
  })()

  // Check for Intersection Observer support
  const supportsIntersectionObserver = (() => {
    return "IntersectionObserver" in window
  })()

  // Determine if this is a modern browser
  const modern = supportsFlexGap && supportsGridLayout && supportsIntersectionObserver

  return {
    modern,
    supportsFlexGap,
    supportsGridLayout,
    supportsIntersectionObserver,
  }
}

/**
 * Apply polyfills and fallbacks for older browsers
 */
export function applyBrowserPolyfills() {
  const support = checkBrowserSupport()

  // Apply CSS fallbacks for flex gap if not supported
  if (!support.supportsFlexGap) {
    document.documentElement.classList.add("no-flex-gap")
  }

  // Apply CSS fallbacks for grid layout if not supported
  if (!support.supportsGridLayout) {
    document.documentElement.classList.add("no-grid")
  }

  // Polyfill for IntersectionObserver
  if (!support.supportsIntersectionObserver) {
    import("intersection-observer").then(() => {
      console.log("IntersectionObserver polyfill loaded")
    })
  }
}
