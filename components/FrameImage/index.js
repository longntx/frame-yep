import { useFabricJSEditor } from 'fabricjs-react';
import React, { useRef, useState } from 'react';
import { useDebounceFn, useMemoizedFn } from 'ahooks';
import { fabric } from 'fabric';
import html2canvas from 'html2canvas';
import * as htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';
import Canvas from '../Canvas';

function FrameImage() {
  const fileRef = useRef();
  const { editor, onReady } = useFabricJSEditor();
  const [ErBackground, setErBackground] = useState(true);
  const largeScreenClass = 'lg:w-[480px] md:w-[480px]';
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
          const canvas = editor?.canvas;
          image.scaleToHeight(canvas.getHeight());
          image.scaleToWidth(canvas.getWidth());
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
    // if (fileRef && fileRef.current) {
    //   setTimeout(() => {
    //     html2canvas(document.getElementById('avatar'), {
    //       useCORS: true,
    //     }).then((c) => {
    //       const img = c.toDataURL('image/png', 4.0);
    //       downloadImage(img, `avatar-${new Date().valueOf()}.png`);
    //     });
    //   }, 150);
    // }
    if (fileRef && fileRef.current) {
      setTimeout(() => {
        htmlToImage
          .toBlob(document.getElementById('avatar'))
          .then(function (blob) {
            if (window.saveAs) {
              window.saveAs(blob, `avatar-${new Date().valueOf()}.png`);
            } else {
              saveAs(blob, `avatar-${new Date().valueOf()}.png`);
            }
          });
      }, 100);
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
        <form className="flex justify-start items-center mx-auto mb-2">
          <div className="flex items-center mr-4">
            <input
              id="ER"
              type="radio"
              name="employeeRole"
              className="hidden"
              defaultChecked
              onChange={(e) => {
                setErBackground(e.target.checked);
              }}
            />
            <label htmlFor="ER" className="flex items-center cursor-pointer">
              <span className="w-4 h-4 inline-block mr-1 rounded-full border border-grey" />
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
                setErBackground(!e.target.checked);
              }}
            />
            <label htmlFor="RS" className="flex items-center cursor-pointer">
              <span className="w-4 h-4 inline-block mr-1 rounded-full border border-grey" />
              Rising Star
            </label>
          </div>
        </form>

        <Canvas ER_background={ErBackground} onReady={onReady} />
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
