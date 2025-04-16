import React, { useState, useEffect, useRef } from 'react'

interface TypewriterProps {
  text: string
  speed?: number
  onDone?: () => void
}

const Typewriter: React.FC<TypewriterProps> = ({ text, speed = 50, onDone }) => {
  const [displayed, setDisplayed] = useState('')
  const indexRef = useRef(0)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    indexRef.current = 0
    setDisplayed('')

    const typeCharacter = () => {
      if (indexRef.current < text.length) {
        const char = text[indexRef.current]
        if (char !== undefined) {
          setDisplayed((prev) => prev + char)
        }
        indexRef.current++
        timeoutRef.current = window.setTimeout(typeCharacter, speed)
      } else {
        if (onDone) onDone()
      }
    }

    timeoutRef.current = window.setTimeout(typeCharacter, speed)

    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [text, speed, onDone]);

  return <h2 style={{color:"#34495e"}}>{displayed}</h2>
}

export default Typewriter;
