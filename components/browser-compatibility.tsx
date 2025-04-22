"use client"

import { useEffect, useState } from "react"
import { checkBrowserSupport, applyBrowserPolyfills } from "@/lib/browser-compatibility"
import { AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function BrowserCompatibility() {
  const [showWarning, setShowWarning] = useState(false)
  const [browserInfo, setBrowserInfo] = useState<ReturnType<typeof checkBrowserSupport> | null>(null)

  useEffect(() => {
    // Check browser support
    const support = checkBrowserSupport()
    setBrowserInfo(support)

    // Apply polyfills
    applyBrowserPolyfills()

    // Show warning for older browsers
    if (!support.modern) {
      setShowWarning(true)
    }
  }, [])

  if (!showWarning || !browserInfo) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-amber-50 border-t border-amber-200 text-amber-800">
      <div className="container mx-auto flex items-start justify-between">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium">Browser Compatibility Notice</h3>
            <p className="text-sm mt-1">
              Your browser may not support all features of this application. For the best experience, please use the
              latest version of Chrome, Firefox, Safari, or Edge.
            </p>
            <ul className="text-xs mt-2 space-y-1">
              {!browserInfo.supportsFlexGap && <li>• Modern layout features not fully supported</li>}
              {!browserInfo.supportsGridLayout && <li>• Grid layout not supported</li>}
              {!browserInfo.supportsIntersectionObserver && <li>• Performance optimizations limited</li>}
            </ul>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="flex-shrink-0 text-amber-800 hover:bg-amber-100"
          onClick={() => setShowWarning(false)}
          aria-label="Dismiss browser compatibility notice"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default BrowserCompatibility
