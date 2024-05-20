import Lottie from "react-lottie";
import animationData from "@/lib/lotties/success.json";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  onComplete: () => void;
}>;

export const SuccessAnimation: React.FC<Props> = ({ onComplete }) => {
  const options = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
    onComplete: onComplete,
  };

  return <Lottie options={options}></Lottie>;
};
