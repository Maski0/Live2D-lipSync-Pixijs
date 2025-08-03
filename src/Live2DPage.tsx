import * as PIXI from "pixi.js";
import { Live2DModel } from "pixi-live2d-display";
import { useEffect, useRef, useState } from "react";
import { MotionSync } from "live2d-motionsync";
import { Button, Card, Spin, Select } from "antd";
import { modelMap } from "./models";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).PIXI = PIXI;

export default function Live2DPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const motion_Sync = useRef<MotionSync>();

  const ModelName = "kei";

  const [loading, setLoading] = useState(true);
  const [selectedAudio, setSelectedAudio] = useState<string | undefined>(
    undefined
  );

  const audioFiles = [
    { label: "Kei (English)", value: "/01_kei_en.wav" },
    { label: "Kei (Japanese)", value: "/01_kei_jp.wav" },
    { label: "Kei (Korean)", value: "/01_kei_ko.wav" },
    { label: "Kei (Chinese)", value: "/01_kei_zh.wav" },
    { label: "Say Hi", value: "/sayhi.wav" },
  ];

  const ModelRef = useRef<Live2DModel | null>(null);

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
      const ModelUrl = modelMap[ModelName];
      const Model = await Live2DModel.from(ModelUrl, {
        autoInteract: false,
      });
      ModelRef.current = Model; // Store in ref

      // Calculate positions and scaling
      const canvasWidth = app.view.width;
      const canvasHeight = app.view.height;

      // Scale and position left model
      const ModelRatio = Model.width / Model.height;
      Model.height = canvasHeight;
      Model.width = Model.height * ModelRatio;
      Model.x = canvasWidth / 2 - Model.width / 2; // center the model
      Model.y = 0;

      // Add models to stage
      app.stage.addChild(Model as unknown as PIXI.DisplayObject);

      // Initialize MotionSync for both models
      motion_Sync.current = new MotionSync(Model.internalModel);
      await motion_Sync.current.loadMotionSyncFromUrl(
        ModelUrl.replace(/.model(.)?.json/, ".motionsync3.json")
      );

      setLoading(false);
    };

    loadModels();

    // Cleanup function
    return () => {
      motion_Sync.current?.reset();
      ModelRef.current?.destroy();
      app?.destroy();
    };
  }, [ModelName]);

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
        <Card title="Controls" className="w-full bg-blue-200/50 rounded-lg">
          <div className="flex flex-col gap-2">
            <div>Default :</div>
            <Button
              danger
              onClick={() => {
                motion_Sync.current?.reset();
              }}
            >
              Stop All
            </Button>

            <div>Audio Files :</div>
            <Select
              placeholder="Select an audio file"
              onChange={(value) => {
                setSelectedAudio(value);
              }}
              options={audioFiles}
              value={selectedAudio}
            />
            <Button
              onClick={() => {
                if (selectedAudio) {
                  motion_Sync.current?.play(selectedAudio);
                }
              }}
              disabled={!selectedAudio}
            >
              Play Selected
            </Button>
            <div className="text-sm text-gray-500 mt-2 border border-red-500 p-2 rounded-lg bg-red-500/10">
              Note: This model is provided by Live2D Samples and does not have a .motionsync3.json file, which would improve the lipsync.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
