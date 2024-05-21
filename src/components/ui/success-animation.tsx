import Lottie from "react-lottie";
import animationData from "@/lib/lotties/success.json";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{}>;

export const SuccessAnimation: React.FC<Props> = () => {
  const options = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return <Lottie options={options}></Lottie>;
};
