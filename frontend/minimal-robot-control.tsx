"use client"

import { useState } from "react"
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react"

export default function MinimalRobotControl() {
  const [activeDirection, setActiveDirection] = useState<string | null>(null)

  const handleDirectionPress = (direction: string) => {
    setActiveDirection(direction)
    // Here you would typically send a command to your robot
    console.log(`Moving ${direction}`)
  }

  const handleDirectionRelease = () => {
    setActiveDirection(null)
    // Here you would typically send a stop command to your robot
    console.log("Stopped")
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 to-gray-600 flex items-center justify-center">
      <div className="grid grid-cols-3 gap-4">
        <div></div>
        <button
          className={`p-8 rounded-full transition-all duration-200 ${
            activeDirection === "up" ? "bg-blue-500 shadow-lg scale-110" : "bg-gray-700 hover:bg-gray-600"
          }`}
          onMouseDown={() => handleDirectionPress("up")}
          onMouseUp={handleDirectionRelease}
          onTouchStart={() => handleDirectionPress("up")}
          onTouchEnd={handleDirectionRelease}
        >
          <ArrowUp className="w-12 h-12 text-white" />
        </button>
        <div></div>
        <button
          className={`p-8 rounded-full transition-all duration-200 ${
            activeDirection === "left" ? "bg-blue-500 shadow-lg scale-110" : "bg-gray-700 hover:bg-gray-600"
          }`}
          onMouseDown={() => handleDirectionPress("left")}
          onMouseUp={handleDirectionRelease}
          onTouchStart={() => handleDirectionPress("left")}
          onTouchEnd={handleDirectionRelease}
        >
          <ArrowLeft className="w-12 h-12 text-white" />
        </button>
        <div className="w-24 h-24"></div>
        <button
          className={`p-8 rounded-full transition-all duration-200 ${
            activeDirection === "right" ? "bg-blue-500 shadow-lg scale-110" : "bg-gray-700 hover:bg-gray-600"
          }`}
          onMouseDown={() => handleDirectionPress("right")}
          onMouseUp={handleDirectionRelease}
          onTouchStart={() => handleDirectionPress("right")}
          onTouchEnd={handleDirectionRelease}
        >
          <ArrowRight className="w-12 h-12 text-white" />
        </button>
        <div></div>
        <button
          className={`p-8 rounded-full transition-all duration-200 ${
            activeDirection === "down" ? "bg-blue-500 shadow-lg scale-110" : "bg-gray-700 hover:bg-gray-600"
          }`}
          onMouseDown={() => handleDirectionPress("down")}
          onMouseUp={handleDirectionRelease}
          onTouchStart={() => handleDirectionPress("down")}
          onTouchEnd={handleDirectionRelease}
        >
          <ArrowDown className="w-12 h-12 text-white" />
        </button>
        <div></div>
      </div>
    </div>
  )
}

