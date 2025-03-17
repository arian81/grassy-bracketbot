"use client";

import {
  useRive,
  useStateMachineInput,
  Layout,
  Fit,
  Alignment,
} from "@rive-app/react-canvas";
import mqtt from "mqtt";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";

const emotionSchema = z.object({
  emotion: z.enum(["happy", "sad", "smug", "talking", "countdown", "loading"]),
});

export default function FacePage() {
  const { RiveComponent, rive } = useRive({
    // You'll need to add your .riv file to the public directory
    src: "/animations/grassy_bot.riv",
    stateMachines: "State Machine 1",
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center,
    }),
    autoplay: true,
    onLoad: () => {
      console.log("rive loaded");
    },
  });

  // Add state machine inputs with correct names

  //  sad
  const trigger1Input = useStateMachineInput(
    rive,
    "State Machine 1",
    "Trigger 1",
    false
  );

  // annya
  const trigger3Input = useStateMachineInput(
    rive,
    "State Machine 1",
    "Trigger 3",
    false
  );

  // Happy (Default)
  const trigger4Input = useStateMachineInput(
    rive,
    "State Machine 1",
    "Trigger 4",
    false
  );

  // const trigger4Input = useDeferredValue(_trigger4Input);

  const boolean1Input = useStateMachineInput(
    rive,
    "State Machine 1",
    "Boolean 1",
    false
  );

  const sadButton = useRef<HTMLButtonElement | null>(null);
  const happyButton = useRef<HTMLButtonElement | null>(null);
  const talkingButton = useRef<HTMLButtonElement | null>(null);
  const smugButton = useRef<HTMLButtonElement | null>(null);

  // Add countdown state
  const [countdown, setCountdown] = useState<string | null>(null);
  const [isCountingDown, setIsCountingDown] = useState(false);

  // Add loading state
  const [isLoading, setIsLoading] = useState(false);

  // Add countdown logic
  const startCountdown = () => {
    setIsCountingDown(true);
    setCountdown("Rock");

    setTimeout(() => setCountdown("Paper"), 1000);
    setTimeout(() => setCountdown("Scissors"), 2000);
    setTimeout(() => setCountdown("Shoot!"), 3000);
    setTimeout(() => {
      setCountdown(null);
      setIsCountingDown(false);
    }, 4000);
  };

  const changeEmotion = (
    emotion: "happy" | "sad" | "smug" | "talking" | "countdown" | "loading"
  ) => {
    if (emotion === "countdown") {
      startCountdown();
    } else if (emotion === "loading") {
      setIsLoading(true);
    } else {
      setIsLoading(false);
      if (emotion === "happy") {
        happyButton.current?.click();
      } else if (emotion === "sad") {
        sadButton.current?.click();
      } else if (emotion === "smug") {
        smugButton.current?.click();
      } else if (emotion === "talking") {
        talkingButton.current?.click();
      }
    }
  };

  // const [emotionChange, setEmotionChange] = useState(false);
  // const [isConnected, setIsConnected] = useState(false);
  // const [client, setClient] = useState<mqtt.MqttClient | null>(null);

  // useEffect(() => {
  //   let interval: NodeJS.Timeout;

  //   if (emotionChange) {
  //     interval = setInterval(() => {
  //       if (trigger4Input) trigger4Input.fire();
  //       setEmotionChange(false);
  //       console.log("this running");
  //     }, 5000);
  //   }

  //   // Cleanup interval on component unmount or when emotionChange becomes false
  //   return () => {
  //     if (interval) clearInterval(interval);
  //   };
  // }, [emotionChange]); // Removed trigger4Input from dependencies

  // Add WebSocket connection
  useEffect(() => {
    // Connect to MQTT broker
    const mqttClient = mqtt.connect("ws://100.115.252.70:9001", {
      protocol: "ws",
      clientId: "nextjs_client_" + Math.random().toString(16).substring(2, 8),
    });

    mqttClient.on("connect", () => {
      console.log("Connected to MQTT broker");
      // setIsConnected(true);

      // Subscribe to the emotion topic
      mqttClient.subscribe("#", (err) => {
        if (err) console.error("Subscription error:", err);
        else console.log("Subscribed to everything");
      });
    });

    mqttClient.on("error", (err) => {
      console.error("MQTT error:", err);
      // setIsConnected(false);
    });

    // Add message handler
    mqttClient.on("message", (topic, message) => {
      try {
        const messageStr = message.toString();
        // console.log("Received message:", messageStr, "on topic:", topic); // Enhanced debug log

        // Check if the message starts with { to indicate JSON
        if (messageStr.trim().startsWith("{")) {
          // console.log("Received JSON message:", messageStr);
          const jsonData = JSON.parse(messageStr);
          const parsedMessage = emotionSchema.safeParse(jsonData);

          if (parsedMessage.success) {
            console.log("success");
            changeEmotion(parsedMessage.data.emotion);
          } else {
            console.error("Invalid message format:", parsedMessage.error);
          }
        } else {
          console.log("Received non-JSON message, ignoring:", messageStr);
        }
      } catch (error) {
        console.error("Error parsing message:", error);
        // Continue execution, ignoring malformed messages
      }
    });
    // setClient(mqttClient);

    return () => {
      mqttClient.end();
    };
  }, []);

  return (
    <div className="h-screen w-screen bg-black flex flex-col items-center justify-center">
      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-white text-9xl font-bold">
            Thinking<span className="dots-animation"></span>
          </span>
        </div>
      ) : isCountingDown ? (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-white text-9xl font-bold">{countdown}</span>
        </div>
      ) : (
        <div className="w-full h-full max-w-2xl max-h-2xl">
          <RiveComponent className="w-full h-full [filter:saturate(1.2)_brightness(0.9)]" />
        </div>
      )}
      <div className="absolute bottom-10 flex gap-4">
        <button
          onClick={() => {
            if (trigger1Input) {
              // setEmotionChange(true);
              trigger1Input.fire();
            }
          }}
          ref={sadButton}
          className="hidden px-4 py-2 bg-green-500 rounded-lg text-white"
        >
          Be sad
        </button>
        <button
          onClick={() => {
            if (trigger4Input) {
              // setEmotionChange(true);
              trigger4Input.fire();
            }
          }}
          ref={happyButton}
          className="hidden px-4 py-2 bg-green-500 rounded-lg text-white"
        >
          Be Happy
        </button>
        <button
          onClick={() => {
            if (boolean1Input) boolean1Input.value = !boolean1Input.value;
          }}
          ref={talkingButton}
          className="hidden px-4 py-2 bg-green-500 rounded-lg text-white"
        >
          Talk
        </button>
        <button
          onClick={() => {
            if (trigger3Input) {
              // setEmotionChange(true);
              trigger3Input.fire();
            }
          }}
          ref={smugButton}
          className="hidden px-4 py-2 bg-green-500 rounded-lg text-white"
        >
          Be Smug
        </button>
      </div>
    </div>
  );
}
