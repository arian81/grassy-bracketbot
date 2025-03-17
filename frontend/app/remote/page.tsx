"use client";

import { useEffect, useState } from "react";
import mqtt from "mqtt";

export default function Home() {
  const [client, setClient] = useState<mqtt.MqttClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Connect to MQTT broker
    const mqttClient = mqtt.connect("ws://grass-bracketbot.local:9001", {
      protocol: "ws",
      clientId: "nextjs_client_" + Math.random().toString(16).substring(2, 8),
    });

    mqttClient.on("connect", () => {
      console.log("Connected to MQTT broker");
      setIsConnected(true);
    });

    mqttClient.on("error", (err) => {
      console.error("MQTT error:", err);
      setIsConnected(false);
    });

    setClient(mqttClient);

    return () => {
      mqttClient.end();
    };
  }, []);

  const sendCommand = (command: string) => {
    if (client && isConnected) {
      client.publish("robot/drive", command);
      console.log("Sent command:", command);
    }
  };

  const handleButtonDown = (direction: string) => {
    switch (direction) {
      case "up":
        sendCommand("forward");
        break;
      case "down":
        sendCommand("back");
        break;
      case "left":
        sendCommand("left");
        break;
      case "right":
        sendCommand("right");
        break;
    }
  };

  const handleButtonUp = () => {
    sendCommand("stop");
  };

  return (
    <div className="h-screen w-screen bg-black flex items-center justify-center">
      <div className="grid grid-cols-3 gap-4">
        {/* Connection status indicator */}
        <div className="col-span-3 mb-4 flex justify-center">
          <div
            className={`px-4 py-2 rounded-full text-sm ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {isConnected ? "Connected" : "Disconnected"}
          </div>
        </div>

        {/* Top row - Up button */}
        <div className="col-span-3 flex justify-center">
          <button
            className="w-20 h-20 md:w-20 md:h-20 w-24 h-24 text-white rounded-lg flex items-center justify-center hover:bg-gray-800 select-none"
            onMouseDown={() => handleButtonDown("up")}
            onMouseUp={handleButtonUp}
            onTouchStart={() => handleButtonDown("up")}
            onTouchEnd={handleButtonUp}
          >
            ↑
          </button>
        </div>

        {/* Middle row - Left, Empty space, Right buttons */}
        <button
          className="w-20 h-20 md:w-20 md:h-20 w-24 h-24 text-white rounded-lg flex items-center justify-center hover:bg-gray-800 select-none"
          onMouseDown={() => handleButtonDown("left")}
          onMouseUp={handleButtonUp}
          onTouchStart={() => handleButtonDown("left")}
          onTouchEnd={handleButtonUp}
        >
          ←
        </button>
        <div></div>
        <button
          className="w-20 h-20 md:w-20 md:h-20 w-24 h-24 text-white rounded-lg flex items-center justify-center hover:bg-gray-800 select-none"
          onMouseDown={() => handleButtonDown("right")}
          onMouseUp={handleButtonUp}
          onTouchStart={() => handleButtonDown("right")}
          onTouchEnd={handleButtonUp}
        >
          →
        </button>

        {/* Bottom row - Down button */}
        <div className="col-span-3 flex justify-center">
          <button
            className="w-20 h-20 md:w-20 md:h-20 w-24 h-24 text-white rounded-lg flex items-center justify-center hover:bg-gray-800 select-none"
            onMouseDown={() => handleButtonDown("down")}
            onMouseUp={handleButtonUp}
            onTouchStart={() => handleButtonDown("down")}
            onTouchEnd={handleButtonUp}
          >
            ↓
          </button>
        </div>
      </div>
    </div>
  );
}
