import { FabricJSCanvas } from 'fabricjs-react';

const Canvas = ({ onReady, ER_background }) => {
  const largeScreenClass =
    'md:h-[480px] md:w-[480px] lg:h-[600px] lg:w-[600px] xl:h-[700px] xl:w-[700px]';
  const smallScreenCLass =
    'h-[380px] w-[380px] xsm:h-[300px] xsm:w-[300px] xx-sm:w-[250px] xx-sm:h-[250px]';
  return (
    <div
      className={`mx-auto flex justify-center ${smallScreenCLass} ${largeScreenClass} relative`}
      id="avatar"
    >
      <div
        className={`${ER_background ? 'frame' : 'RSframe'} ${smallScreenCLass} ${largeScreenClass} absolute`}
      />
      <FabricJSCanvas
        className={`sample-canvas ${smallScreenCLass} ${largeScreenClass} absolute`}
        onReady={onReady}
      />
    </div>
  );
};

export default Canvas;
