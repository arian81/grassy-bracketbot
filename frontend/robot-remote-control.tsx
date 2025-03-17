"use client"

import { useState } from "react"
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Power, Zap, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function RobotRemoteControl() {
  const [power, setPower] = useState(false)
  const [status, setStatus] = useState("Standby")
  const [loading, setLoading] = useState(false)

  const handleAction = (action: string) => {
    setLoading(true)
    setStatus(`Executing: ${action}`)
    setTimeout(() => {
      setStatus("Ready")
      setLoading(false)
    }, 1500)
  }

  const togglePower = () => {
    setPower(!power)
    setStatus(power ? "Shutting down..." : "Booting up...")
    setTimeout(() => {
      setStatus(power ? "Standby" : "Ready")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-xl rounded-xl overflow-hidden">
        <CardHeader className="bg-gray-800 text-white">
          <CardTitle className="text-2xl font-bold text-center">Robot Remote Control</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="text-lg font-semibold mb-2">Status:</div>
            <div className="bg-gray-200 rounded-lg p-3 text-center">
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="animate-spin mr-2" />
                  {status}
                </div>
              ) : (
                status
              )}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div></div>
            <Button variant="outline" size="lg" onClick={() => handleAction("Move Forward")} disabled={!power}>
              <ArrowUp className="h-6 w-6" />
            </Button>
            <div></div>
            <Button variant="outline" size="lg" onClick={() => handleAction("Move Left")} disabled={!power}>
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => handleAction("Stop")} disabled={!power}>
              <div className="h-3 w-3 bg-red-500 rounded-full"></div>
            </Button>
            <Button variant="outline" size="lg" onClick={() => handleAction("Move Right")} disabled={!power}>
              <ArrowRight className="h-6 w-6" />
            </Button>
            <div></div>
            <Button variant="outline" size="lg" onClick={() => handleAction("Move Backward")} disabled={!power}>
              <ArrowDown className="h-6 w-6" />
            </Button>
            <div></div>
          </div>
          <div className="flex justify-center space-x-4">
            <Button variant={power ? "destructive" : "default"} size="lg" onClick={togglePower} className="w-full">
              <Power className="mr-2 h-4 w-4" />
              {power ? "Power Off" : "Power On"}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => handleAction("Special Action")}
              disabled={!power}
              className="w-full"
            >
              <Zap className="mr-2 h-4 w-4" />
              Special Action
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

