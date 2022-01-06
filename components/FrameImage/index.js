import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react';
import { useMemoizedFn } from 'ahooks';
import { fabric } from 'fabric';
import { useRef } from 'react';
import * as htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
function FrameImage() {
  const fileRef = useRef();
  const { editor, onReady } = useFabricJSEditor();
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
  const downloadFile = (fileRef) => {
    if (fileRef && fileRef.current) {
      htmlToImage
        .toBlob(document.getElementById('avatar'))
        .then(function (blob) {
          saveAs(blob, `avatar-${new Date().valueOf()}.png`);
        });
    }
  };
  return (
    <>
      <div className="container mx-auto p-20">
        <div>
          <div className="w-480 h-480 mx-auto relative block" id="avatar">
            <div className="frame absolute" />
            <FabricJSCanvas
              className="sample-canvas absolute"
              onReady={onReady}
            />
          </div>
        </div>
        <div className="w-480 flex items-center justify-between px-2 mx-auto mt-3">
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
    </>
  );
}

export default FrameImage;
