import { Spin } from "antd";

export default function LoadingLayer() {
  return (
    <div className="flex justify-center items-center h-full">
      <Spin size="large"/>
    </div>
  );
}