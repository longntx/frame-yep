import { FabricJSCanvas } from 'fabricjs-react';

const Canvas = ({ onReady, ER_background }) => {
  const largeScreenClass =
    'md:h-[480px] md:w-[480px] lg:h-[480px] lg:w-[480px] xl:h-[480px] xl:w-[480px]';
  const smallScreenCLass =
    'h-[380px] w-[380px] xsm:h-[300px] xsm:w-[300px] xx-sm:w-[250px] xx-sm:h-[250px]';
  return (
    <div
      className={`mx-auto flex justify-center ${smallScreenCLass} ${largeScreenClass} relative`}
      id="avatar"
    >
      {ER_background && (
        <div
          className={`frame ${smallScreenCLass} ${largeScreenClass} absolute`}
        />
      )}
      {!ER_background && (
        <div
          className={`rs-frame ${smallScreenCLass} ${largeScreenClass} absolute`}
        />
      )}
      <FabricJSCanvas
        className={`sample-canvas ${smallScreenCLass} ${largeScreenClass} absolute`}
        onReady={onReady}
      />
    </div>
  );
};

export default Canvas;
