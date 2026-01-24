'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue } from 'framer-motion'

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const frameRef = useRef<number | null>(null)
  const latestPos = useRef({ x: -100, y: -100 })
  const hoveringRef = useRef(false)

  useEffect(() => {
    const updateCursor = () => {
      cursorX.set(latestPos.current.x)
      cursorY.set(latestPos.current.y)
      frameRef.current = null
    }

    const moveCursor = (e: PointerEvent) => {
      latestPos.current = { x: e.clientX - 16, y: e.clientY - 16 }
      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(updateCursor)
      }
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)

    const isInteractive = (target: EventTarget | null) =>
      target instanceof Element && !!target.closest('a, button, [role="button"]')

    const handlePointerOver = (e: PointerEvent) => {
      const hovering = isInteractive(e.target)
      if (hovering !== hoveringRef.current) {
        hoveringRef.current = hovering
        setIsHovering(hovering)
      }
    }

    const handlePointerOut = (e: PointerEvent) => {
      if (!isInteractive(e.target)) return
      const stillHovering = isInteractive(e.relatedTarget)
      if (!stillHovering && hoveringRef.current) {
        hoveringRef.current = false
        setIsHovering(false)
      }
    }

    window.addEventListener('pointermove', moveCursor, { passive: true })
    window.addEventListener('pointerdown', handleMouseDown)
    window.addEventListener('pointerup', handleMouseUp)
    document.addEventListener('pointerover', handlePointerOver)
    document.addEventListener('pointerout', handlePointerOut)

    return () => {
      window.removeEventListener('pointermove', moveCursor)
      window.removeEventListener('pointerdown', handleMouseDown)
      window.removeEventListener('pointerup', handleMouseUp)
      document.removeEventListener('pointerover', handlePointerOver)
      document.removeEventListener('pointerout', handlePointerOut)
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
      }
    }
  }, [cursorX, cursorY])

  return (
    <>
      {/* Main Cursor */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
        }}
      >
        <motion.div
          className="w-full h-full rounded-full bg-luxury-white"
          animate={{
            scale: isHovering ? 2 : isClicking ? 0.8 : 1,
            opacity: isHovering ? 0.5 : 1,
          }}
          transition={{ duration: 0.15 }}
        />
      </motion.div>

      {/* Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 w-16 h-16 pointer-events-none z-[9998]"
        style={{
          x: cursorX,
          y: cursorY,
        }}
      >
        <motion.div
          className="w-full h-full rounded-full border-2 border-luxury-white/30"
          animate={{
            scale: isHovering ? 1.5 : isClicking ? 0.9 : 1,
            opacity: isHovering ? 0.6 : 0.3,
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {/* Trailing Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 pointer-events-none z-[9997]"
        style={{
          x: cursorX,
          y: cursorY,
        }}
      >
        <motion.div
          className="w-full h-full rounded-full bg-luxury-white/50"
          animate={{
            scale: isHovering ? 1.5 : 1,
          }}
        />
      </motion.div>
    </>
  )
}

