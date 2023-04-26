import { RotatingLines } from "react-loader-spinner";

import type { NextComponentType, NextPageContext } from "next";

interface Props {}

const Loader: NextComponentType<NextPageContext, {}, Props> = (
  _props: Props
) => {
  return (
    <div>
      <RotatingLines
        strokeColor="#ff4c41"
        strokeWidth="5"
        animationDuration="0.75"
        width="96"
        visible={true}
      />
    </div>
  );
};

export default Loader;
