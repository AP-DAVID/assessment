"use client"

import { renderHook } from "@testing-library/react"
import { useMobile } from "@/hooks/use-mobile"

describe("useMobile Hook", () => {
  const originalInnerWidth = window.innerWidth

  afterEach(() => {
    // Restore the original innerWidth
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: originalInnerWidth,
    })
  })

  it("returns false for desktop viewport", () => {
    // Set viewport width to desktop size
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 1024,
    })

    // Trigger the resize event
    window.dispatchEvent(new Event("resize"))

    const { result } = renderHook(() => useMobile())
    expect(result.current).toBe(false)
  })

  it("returns true for mobile viewport", () => {
    // Set viewport width to mobile size
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 480,
    })

    // Trigger the resize event
    window.dispatchEvent(new Event("resize"))

    const { result } = renderHook(() => useMobile())
    expect(result.current).toBe(true)
  })
})
