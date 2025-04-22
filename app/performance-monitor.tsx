"use client"

import { useEffect } from "react"
import { measurePerformance } from "@/lib/performance"

export function PerformanceMonitor() {
  useEffect(() => {
    // Measure the performance after page load
    if (document.readyState === "complete") {
      measurePerformance()
    } else {
      window.addEventListener("load", measurePerformance)
      return () => window.removeEventListener("load", measurePerformance)
    }
  }, [])

  // This component doesn't render anything
  return null
}

export default PerformanceMonitor
