import * as PIXI from "pixi.js";
import { Live2DModel } from "pixi-live2d-display";
import { useEffect, useRef, useState } from "react";
import { MotionSync } from "live2d-motionsync";
import { Button, Card, Input, Select, Space, Spin } from "antd";
import { modelMap } from "./models";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).PIXI = PIXI;

async function arrayBufferToAudioBuffer(arrayBuffer: ArrayBuffer) {
  const audioContext = new AudioContext();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return audioBuffer;
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState("");
  const leftMotionSync = useRef<MotionSync>();
  const rightMotionSync = useRef<MotionSync>();

  const leftModelName = "mao"; // Predefined left model
  const rightModelName = "BogDanoff"; // Predefined right model

  const [loading, setLoading] = useState(true);

  const leftModelRef = useRef<Live2DModel | null>(null);
  const rightModelRef = useRef<Live2DModel | null>(null);

  const MotionTesting = async () => {
    const leftModel = leftModelRef.current; // Access from ref
    console.log("This is getting called!  ", leftModel);
    if (leftModel) {
      console.log("Left Model is available!");
      leftModel.motion(""); // Replace "" with the desired motion name or ID
    } else {
      console.error("Left Model is not loaded yet.");
    }
  };

  // const play = async (side: 'left' | 'right' | 'both') => {
  //   const buffer = await tts(text);
  //   const audioBuffer = await arrayBufferToAudioBuffer(buffer);

  //   if (side === 'left' || side === 'both') {
  //     leftMotionSync.current?.play(audioBuffer);
  //   }
  //   if (side === 'right' || side === 'both') {
  //     rightMotionSync.current?.play(audioBuffer);
  //   }
  // };

  useEffect(() => {
    let app: PIXI.Application;

    const loadModels = async () => {
      if (!canvasRef.current) return;
      setLoading(true);

      // Initialize PIXI Application
      app = new PIXI.Application({
        view: canvasRef.current,
        resizeTo: canvasRef.current.parentElement || undefined,
        backgroundAlpha: 0,
      });

      // Load left model
      const leftModelUrl = modelMap[leftModelName];
      const leftModel = await Live2DModel.from(leftModelUrl, {
        autoInteract: false,
      });
      leftModelRef.current = leftModel; // Store in ref

      // Load right model
      const rightModelUrl = modelMap[rightModelName];
      const rightModel = await Live2DModel.from(rightModelUrl, {
        autoInteract: false,
      });
      rightModelRef.current = rightModel;

      // Calculate positions and scaling
      const canvasWidth = app.view.width;
      const canvasHeight = app.view.height;

      // Scale and position left model
      const leftModelRatio = leftModel.width / leftModel.height;
      leftModel.height = canvasHeight;
      leftModel.width = leftModel.height * leftModelRatio;
      leftModel.x = canvasWidth / 4 - leftModel.width / 2;
      leftModel.y = 0;

      // Scale and position right model
      const rightModelRatio = rightModel.width / rightModel.height;
      rightModel.height = canvasHeight;
      rightModel.width = rightModel.height * rightModelRatio;
      rightModel.x = (3 * canvasWidth) / 4 - rightModel.width / 2;
      rightModel.y = 0;

      // Add models to stage
      app.stage.addChild(leftModel as unknown as PIXI.DisplayObject);
      app.stage.addChild(rightModel as unknown as PIXI.DisplayObject);

      // Initialize MotionSync for both models
      leftMotionSync.current = new MotionSync(leftModel.internalModel);
      await leftMotionSync.current.loadMotionSyncFromUrl(
        leftModelUrl.replace(/.model(.)?.json/, ".motionsync3.json")
      );

      rightMotionSync.current = new MotionSync(rightModel.internalModel);
      await rightMotionSync.current.loadMotionSyncFromUrl(
        rightModelUrl.replace(/.model(.)?.json/, ".motionsync3.json")
      );

      setLoading(false);
    };

    loadModels();

    // Cleanup function
    return () => {
      leftMotionSync.current?.reset();
      rightMotionSync.current?.reset();
      leftModelRef.current?.destroy();
      rightModelRef.current?.destroy();
      app?.destroy();
    };
  }, [leftModelName, rightModelName]);

  return (
    <div className="size-full flex">
      <div className="flex-1 relative">
        <canvas ref={canvasRef} />
        {loading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Spin />
          </div>
        )}
      </div>

      <div className="w-[300px] flex flex-col gap-2 justify-center p-4">
        <Card title="Controls" className="w-full">
          <div className="flex flex-col gap-2">
            <div>Default Animation:</div>
            <Space>
              <Button
                onClick={() => {
                  leftMotionSync.current?.play("/live2d-motionSync/Test.wav");
                  rightMotionSync.current?.play("/live2d-motionSync/Test.wav");
                }}
              >
                Play Both
              </Button>
              <Button
                danger
                onClick={() => {
                  leftMotionSync.current?.reset();
                  rightMotionSync.current?.reset();
                }}
              >
                Stop All
              </Button>
            </Space>

            {/* <div>Custom Text:</div>
            <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to speak"
            /> */}

            <Space className="flex-wrap">
              <Button
                onClick={() =>
                  leftMotionSync.current?.play("/live2d-motionSync/sayhi.wav")
                }
              >
                Play Left
              </Button>
              <Button
                onClick={() =>
                  rightMotionSync.current?.play("/live2d-motionSync/Test.wav")
                }
              >
                Play Right
              </Button>
            </Space>
            <Space className="flex-wrap">
              <Button
                onClick={() => {
                  MotionTesting();
                }}
              >
                MotionTest Left
              </Button>
              <Button
                onClick={() => {
                  MotionTesting();
                }}
              >
                MotionTest Right
              </Button>
            </Space>
          </div>
        </Card>
      </div>
    </div>
  );
}
