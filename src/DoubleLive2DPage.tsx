import * as PIXI from "pixi.js";
import { Live2DModel } from "pixi-live2d-display";
import { useEffect, useRef, useState } from "react";
import { MotionSync } from "live2d-motionsync";
import { Button, Card, Space, Spin, Select } from "antd"; // Add Select here
import { modelMap, MaomotionList, HiyorimotionList } from "./models";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).PIXI = PIXI;

export default function Live2DPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const leftMotionSync = useRef<MotionSync>();
  const rightMotionSync = useRef<MotionSync>();

  const leftModelName = "mao";
  const rightModelName = "hiyori";

  const [loading, setLoading] = useState(true);

  const leftModelRef = useRef<Live2DModel | null>(null);
  const rightModelRef = useRef<Live2DModel | null>(null);

  // State for selected motions
  const [leftSelectedGroup, setLeftSelectedGroup] = useState<string>(
    Object.keys(MaomotionList)[0] || ""
  );
  const [leftSelectedIndex, setLeftSelectedIndex] = useState<number>(0);
  const [rightSelectedGroup, setRightSelectedGroup] = useState<string>(
    Object.keys(HiyorimotionList)[0] || ""
  );
  const [rightSelectedIndex, setRightSelectedIndex] = useState<number>(0);

  const playMotion = (
    model: Live2DModel | null,
    motionList: Record<string, string[]>,
    group: string,
    index: number
  ) => {
    if (model && motionList[group] && motionList[group][index]) {
      console.log(`Playing motion: ${group}, index: ${index}`);
      model.motion(group, index);
    } else {
      console.error("Model or motion not found:", {
        model,
        motionList,
        group,
        index,
      });
    }
  };

  const LeftMotionTesting = async () => {
    const leftModel = leftModelRef.current;
    console.log("This is getting called!  ", leftModel);
    if (leftModel) {
      console.log("Left Model is available!");
      playMotion(
        leftModel,
        MaomotionList,
        leftSelectedGroup,
        leftSelectedIndex
      );
    } else {
      console.error("Left Model is not loaded yet.");
    }
  };

  const RightMotionTesting = async () => {
    const rightModel = rightModelRef.current;
    console.log("This is getting called!  ", rightModel);
    if (rightModel) {
      console.log("Right Model is available!");
      playMotion(
        rightModel,
        HiyorimotionList,
        rightSelectedGroup,
        rightSelectedIndex
      );
    } else {
      console.error("Right Model is not loaded yet.");
    }
  };

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

      <div className="w-[400px] flex flex-col gap-2 justify-center p-4">
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

            <Space className="flex-wrap">
              <Button
                onClick={() => leftMotionSync.current?.play("/sayhi.wav")}
              >
                Play Left
              </Button>
              <Button
                onClick={() => rightMotionSync.current?.play("/01_kei_en.wav")}
              >
                Play Right
              </Button>
            </Space>

            {/* Mao Motion Controls */}
            <div>Mao Motions:</div>
            <Space>
              <Select
                value={leftSelectedGroup}
                style={{ width: 120 }}
                onChange={(value) => {
                  setLeftSelectedGroup(value);
                  setLeftSelectedIndex(0); // Reset index when group changes
                }}
              >
                {Object.keys(MaomotionList).map((group) => (
                  <Select.Option key={group} value={group}>
                    {group || "Default"}
                  </Select.Option>
                ))}
              </Select>
              <Select
                value={leftSelectedIndex}
                style={{ width: 120 }}
                onChange={(value) => setLeftSelectedIndex(value)}
                disabled={
                  !MaomotionList[leftSelectedGroup] ||
                  MaomotionList[leftSelectedGroup].length === 0
                }
              >
                {MaomotionList[leftSelectedGroup]?.map((motionName, index) => (
                  <Select.Option key={index} value={index}>
                    {motionName}
                  </Select.Option>
                ))}
              </Select>
            </Space>
            <Button onClick={LeftMotionTesting}>Play Mao Motion</Button>

            {/* Hiyori Motion Controls */}
            <div>Hiyori Motions:</div>
            <Space>
              <Select
                value={rightSelectedGroup}
                style={{ width: 120 }}
                onChange={(value) => {
                  setRightSelectedGroup(value);
                  setRightSelectedIndex(0); // Reset index when group changes
                }}
              >
                {Object.keys(HiyorimotionList).map((group) => (
                  <Select.Option key={group} value={group}>
                    {group || "Default"}
                  </Select.Option>
                ))}
              </Select>
              <Select
                value={rightSelectedIndex}
                style={{ width: 120 }}
                onChange={(value) => setRightSelectedIndex(value)}
                disabled={
                  !HiyorimotionList[rightSelectedGroup] ||
                  HiyorimotionList[rightSelectedGroup].length === 0
                }
              >
                {HiyorimotionList[rightSelectedGroup]?.map((motionName, index) => (
                  <Select.Option key={index} value={index}>
                    {motionName}
                  </Select.Option>
                ))}
              </Select>
            </Space>
            <Button onClick={RightMotionTesting}>Play Hiyori Motion</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
