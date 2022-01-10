import { useFabricJSEditor } from 'fabricjs-react';
import React, { useEffect, useRef, useState } from 'react';
import { useDebounceFn, useMemoizedFn } from 'ahooks';
import { fabric } from 'fabric';
import Canvas from '../Canvas';
import axios from 'axios';
import { saveAs } from 'file-saver';

function FrameImage() {
  const ER_BACKGROUND = 'images/1080_Frame_Facebook_YEPEst2021-03.png';
  const RS_BACKGROUND = 'images/1080_Frame_Facebook_YEPEst2021-05.png';
  const fileRef = useRef();
  const backgroundRef = useRef(ER_BACKGROUND);
  const { editor, onReady } = useFabricJSEditor();
  const [ErBackground, setErBackground] = useState(true);
  const [downloadableContent, setDownloadableContent] = useState(null);
  const largeScreenClass = 'lg:w-[480px] md:w-[480px]';
  const smallScreenCLass = 'w-[380px] xsm:w-[300px] xx-sm:w-[250px]';
  const handleFileChange = useMemoizedFn((e) => {
    setDownloadableContent(null);
    if (e?.target.files && e?.target.files[0]) {
      editor?.deleteAll();
      const file = e?.target.files[0];
      fileRef.current = file;
      const reader = new FileReader();
      reader.onload = function (event) {
        addImageToCanvasFromUrl(editor, event.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      editor?.deleteAll();
      fileRef.current = null;
    }
  });

  const addImageToCanvasFromUrl = (editorObj, url, isDownloading) => {
    const imgObj = new Image();
    imgObj.src = url;
    imgObj.onload = function () {
      const image = new fabric.Image(imgObj);
      const canvas = editorObj?.canvas;
      image.scaleToHeight(canvas.getHeight());
      image.scaleToWidth(canvas.getWidth());
      canvas.centerObject(image);
      canvas.add(image);
      if (isDownloading) {
        const dataUrl = canvas.toDataURL({
          format: 'png',
          multiplier: 720 / canvas.width,
          enableRetinaScaling: true,
          selectable: false,
        });
        setDownloadableContent({
          link: dataUrl,
          name: `avatar-${new Date().valueOf()}.png`,
        });
        removeLastObjects();
      }
    };
  };

  const { run: generateDownloadLink } = useDebounceFn((fileRef) => {
    const canvas = editor?.canvas;
    canvas.discardActiveObject();
    canvas.requestRenderAll();

    if (fileRef && fileRef.current) {
      addImageToCanvasFromUrl(editor, backgroundRef.current, true);
    }
  });

  const removeLastObjects = () => {
    const canvas = editor?.canvas;
    setTimeout(() => {
      canvas.remove(...[canvas.getObjects()[1]]);
    }, 100);
  };

  useEffect(() => {
    const canvas = editor?.canvas;
    if (canvas) {
      canvas.on('object:moving', function () {
        setDownloadableContent(null);
      });
      canvas.on('object:rotating', function () {
        setDownloadableContent(null);
      });
      canvas.on('object:scaling', function () {
        setDownloadableContent(null);
      });
      canvas.on('object:skewing', function () {
        setDownloadableContent(null);
      });
    }
  }, [editor?.canvas]);

  // function downloadBlob(blobUrl, name = 'file.txt') {
  //   // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
  //
  //   // Create a link element
  //   const link = document.createElement('a');
  //
  //   // Set link's href to point to the Blob URL
  //   link.href = blobUrl;
  //   link.download = name;
  //   link.style.cursor = 'pointer';
  //
  //   // Append link to the body
  //   document.body.appendChild(link);
  //
  //   // Dispatch click event on the link
  //   // This is necessary as link.click() does not work on the latest firefox
  //   link.dispatchEvent(
  //     new MouseEvent('touchstart', {
  //       bubbles: true,
  //       cancelable: true,
  //       view: window,
  //     }),
  //   );
  //
  //   // Remove link from body
  //   document.body.removeChild(link);
  // }

  const downloadAvatar = (data, name) => {
    axios
      .post('/api/download', { data, name })
      .then((res) => saveAs(res.data.image, res.data.name));
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
                backgroundRef.current = ER_BACKGROUND;
                setDownloadableContent(null);
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
                backgroundRef.current = RS_BACKGROUND;
                setDownloadableContent(null);
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
          {!downloadableContent && (
            <button
              onClick={() => generateDownloadLink(fileRef)}
              className="bg-violet-400 hover:bg-violet-400 hover:text-white h-px-36 text-sm text-gray-500 text-violet-700 font-semibold py-2 px-4 rounded-full"
            >
              Process
            </button>
          )}
          {/*{!downloadLink && (*/}
          {/*  <button className="bg-red-400 hover:bg-red-400 hover:text-white h-px-36 text-sm text-gray-500 text-violet-700 font-semibold py-2 px-4 rounded-full">*/}
          {/*    Download*/}
          {/*  </button>*/}
          {/*)}*/}
          {downloadableContent && (
            <button
              // href={downloadableContent.link}
              // download
              onClick={() =>
                // downloadBlob(downloadableContent.link, downloadableContent.name)
                downloadAvatar(
                  downloadableContent.link,
                  downloadableContent.name,
                )
              }
              className="cursor-pointer bg-green-400 hover:bg-green-700 hover:text-white h-px-36 text-sm text-gray-500 text-violet-700 font-semibold py-2 px-4 rounded-full"
            >
              Download
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default FrameImage;
