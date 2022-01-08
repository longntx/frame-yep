import { useFabricJSEditor } from 'fabricjs-react';
import React, { useRef, useState } from 'react';
import { useDebounceFn, useMemoizedFn } from 'ahooks';
import { fabric } from 'fabric';
import html2canvas from 'html2canvas';
import Canvas from '../Canvas';
function FrameImage() {
  const fileRef = useRef();
  const { editor, onReady } = useFabricJSEditor();
  const [ER_background, setER_background] = useState(true);
  const largeScreenClass = 'lg:w-[600px] md:w-[480px]';
  const smallScreenCLass = 'w-[380px] xsm:w-[300px] xx-sm:w-[250px]';
  const handleFileChange = useMemoizedFn((e) => {
    if (e?.target.files && e?.target.files[0]) {
      editor?.deleteAll();
      const file = e?.target.files[0];
      fileRef.current = file;
      const reader = new FileReader();
      reader.onload = function (event) {
        const imgObj = new Image();
        imgObj.src = event.target.result;
        imgObj.onload = function () {
          const image = new fabric.Image(imgObj);
          image.scaleToHeight(480);
          image.scaleToHeight(480);
          const canvas = editor?.canvas;
          canvas.centerObject(image);
          canvas.add(image);
        };
      };
      reader.readAsDataURL(file);
    } else {
      editor?.deleteAll();
      fileRef.current = null;
    }
  });

  const { run: downloadFile } = useDebounceFn((fileRef) => {
    const canvas = editor?.canvas;
    canvas.discardActiveObject();
    canvas.requestRenderAll();
    if (fileRef && fileRef.current) {
      setTimeout(() => {
        html2canvas(document.getElementById('avatar'), {
          useCORS: true,
        }).then((c) => {
          const img = c.toDataURL('image/png', 4.0);
          downloadImage(img, `avatar-${new Date().valueOf()}.png`);
        });
      }, 150);
    }
  });

  const downloadImage = (data, filename = 'untitled.jpeg') => {
    const a = document.createElement('a');
    a.href = data;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.parentNode.removeChild(a);
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="frame-container flex flex-col px-2">
        <form className="flex justify-start items-center mb-2">
          <label className="mr-4 ">You are:</label>
          <div className="flex items-center mr-4">
            <input
              id="ER"
              type="radio"
              name="employeeRole"
              className="hidden"
              defaultChecked
              onChange={(e) => {
                setER_background(e.target.checked)
              }}
            />
            <label htmlFor="ER" className="flex items-center cursor-pointer">
              <span className="w-4 h-4 inline-block mr-1 rounded-full border border-grey"></span>
              Est-Rouge
            </label>
          </div>

          <div className="flex items-center mr-4 ">
            <input
              id="RS"
              type="radio"
              name="employeeRole"
              className="hidden"
              onChange={(e) => {
                setER_background(!e.target.checked)
              }}
            />
            <label htmlFor="RS" className="flex items-center cursor-pointer">
              <span className="w-4 h-4 inline-block mr-1 rounded-full border border-grey"></span>
              Rising Star
            </label>
          </div>
        </form>

        <Canvas
          ER_background={ER_background}
          onReady={onReady}
        />
        <div
          className={`${smallScreenCLass} ${largeScreenClass} z-50 flex items-center justify-between mx-auto mt-3`}
        >
          <form className="flex items-center">
            <label className="block cursor-pointer">
              <span className="sr-only">Choose file</span>
              <input
                onChange={handleFileChange}
                type="file"
                name="file-upload"
                id="file-upload"
                accept="image/*"
                className="block w-full text-sm text-gray-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-violet-50 file:text-violet-700
      hover:file:bg-violet-100
    "
              />
            </label>
          </form>
          <button
            onClick={() => downloadFile(fileRef)}
            className="bg-violet-400 hover:bg-violet-700 hover:text-white h-px-36 text-sm text-gray-500 text-violet-700 font-semibold py-2 px-4 rounded-full"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

export default FrameImage;
