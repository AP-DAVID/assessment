"use client"

import * as React from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type CarouselProps = {
  children: React.ReactNode
  className?: string
}

type CarouselState = {
  activeIndex: number
  isSliding: boolean
  itemCount: number
}

type CarouselAction =
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "GOTO"; payload: number }
  | { type: "SET_COUNT"; payload: number }

const carouselReducer = (state: CarouselState, action: CarouselAction): CarouselState => {
  switch (action.type) {
    case "NEXT":
      return {
        ...state,
        activeIndex: (state.activeIndex + 1) % state.itemCount,
        isSliding: true,
      }
    case "PREV":
      return {
        ...state,
        activeIndex: (state.activeIndex - 1 + state.itemCount) % state.itemCount,
        isSliding: true,
      }
    case "GOTO":
      return {
        ...state,
        activeIndex: action.payload,
        isSliding: true,
      }
    case "SET_COUNT":
      return {
        ...state,
        itemCount: action.payload,
      }
    default:
      return state
  }
}

export const CarouselContext = React.createContext<{
  activeIndex: number
  slideToIndex: (index: number) => void
  next: () => void
  prev: () => void
  itemCount: number
  setItemCount: (count: number) => void
}>({
  activeIndex: 0,
  slideToIndex: () => { },
  next: () => { },
  prev: () => { },
  itemCount: 0,
  setItemCount: () => { },
})

export function Carousel({ children, className }: CarouselProps) {
  const [state, dispatch] = React.useReducer(carouselReducer, {
    activeIndex: 0,
    isSliding: false,
    itemCount: 0,
  })

  const next = React.useCallback(() => dispatch({ type: "NEXT" }), [])
  const prev = React.useCallback(() => dispatch({ type: "PREV" }), [])
  const slideToIndex = React.useCallback((index: number) => dispatch({ type: "GOTO", payload: index }), [])

  const setItemCount = React.useCallback(
    (count: number) => {
      if (count !== state.itemCount) {
        dispatch({ type: "SET_COUNT", payload: count })
      }
    },
    [state.itemCount],
  )

  const contextValue = React.useMemo(
    () => ({
      activeIndex: state.activeIndex,
      slideToIndex,
      next,
      prev,
      itemCount: state.itemCount,
      setItemCount,
    }),
    [state.activeIndex, slideToIndex, next, prev, state.itemCount, setItemCount]
  )

  return (
    <CarouselContext.Provider value={contextValue}>
      <div className={cn("relative", className)}>{children}</div>
    </CarouselContext.Provider>
  )
}

export function CarouselContent({ children, className }: { children: React.ReactNode; className?: string }) {
  const { activeIndex } = React.useContext(CarouselContext)
  const itemsRef = React.useRef<HTMLDivElement>(null)
  const { setItemCount } = React.useContext(CarouselContext)

  React.useEffect(() => {
    if (itemsRef.current) {
      const childCount = React.Children.count(children)
      setItemCount(childCount)
    }
  }, [children, setItemCount])

  return (
    <div className={cn("overflow-hidden", className)}>
      <div
        ref={itemsRef}
        className="flex transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {React.Children.map(children, (child) => (
          <div className="min-w-full flex-shrink-0">{child}</div>
        ))}
      </div>
    </div>
  )
}

export function CarouselItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("px-1", className)}>{children}</div>
}

export function CarouselPrevious({ className }: { className?: string }) {
  const { prev } = React.useContext(CarouselContext)
  return (
    <Button
      variant="outline"
      size="icon"
      type="button"
      className={cn("absolute left-2 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full", className)}
      onClick={(e) => {
        e.stopPropagation()
        prev()
      }}
      aria-label="Previous slide"
    >
      <ArrowLeft className="h-4 w-4" />
    </Button>
  )
}

export function CarouselNext({ className }: { className?: string }) {
  const { next } = React.useContext(CarouselContext)
  return (
    <Button
      variant="outline"
      size="icon"
      type="button"
      className={cn("absolute right-2 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full", className)}
      onClick={(e) => {
        e.stopPropagation()
        next()
      }}
      aria-label="Next slide"
    >
      <ArrowRight className="h-4 w-4" />
    </Button>
  )
}

export function CarouselIndicators({ className }: { className?: string }) {
  const { activeIndex, slideToIndex, itemCount } = React.useContext(CarouselContext)
  return (
    <div className={cn("flex justify-center gap-1 py-2", className)}>
      {Array.from({ length: itemCount }).map((_, index) => (
        <Button
          key={index}
          variant="ghost"
          size="icon"
          className={cn("h-2 w-2 rounded-full p-0", activeIndex === index ? "bg-primary" : "bg-muted-foreground/20")}
          onClick={() => slideToIndex(index)}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  )
}
