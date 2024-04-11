import { useEffect, useState } from "react";

export default function ImageResizer() {
  // Active Area states
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(null);

  // Pcontrol states
  const [width, setWidth] = useState(null);
  const [height, setHeight] = useState(null);
  const [lockAspectRatio, setLockAspectRatio] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Download link
  const [downloadUrl, setDownloadUrl] = useState("");

  // set default width and height from uploaded image
  useEffect(() => {
    if (image) {
      const img = new Image();
      img.src = imagePreview;
      img.onload = () => {
        setWidth(img.width);
        setHeight(img.height);
      };
    }
  }, [imagePreview]);

  // Calculate and set aspect ratio  if lock aspect ratio is checked
  useEffect(() => {
    if (lockAspectRatio) {
      setAspectRatio(width / height);
    }
  }, [width, height, lockAspectRatio]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDeleteImage = () => {
    setImage(null);
    setImagePreview(null);
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();

    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleWidthChange = (e) => {
    e.preventDefault();
    setWidth(e.target.value);

    if (lockAspectRatio) {
      setHeight(e.target.value / aspectRatio);
    }
  };
  const handleHeightChange = (e) => {
    e.preventDefault();
    setHeight(e.target.value);

    if (lockAspectRatio) {
      setWidth(e.target.value * aspectRatio);
    }
  };

  const handleLockAspectRatioChange = (e) => {
    setLockAspectRatio(!lockAspectRatio);
  };

  const handleFormData = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!image) {
      setErrorMessage("Please upload an image");
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
      setIsLoading(false);
      return;
    } else if (width <= 0 || height <= 0) {
      setErrorMessage("Please enter width and height");
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
      setIsLoading(false);
      return;
    }

    try {
      // image resizer pica
      const pica = require("pica")();

      // create canvas as pica.FROM element
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      // Create image element as pica.TO element
      const img = new Image();
      img.src = imagePreview;

      // resize image
      const resizedImage = await pica.resize(img, canvas);

      // convert resized image to blob
      const blob = await pica.toBlob(resizedImage, "image/png", 90, {
        alpha: true,
      });

      // create download link
      const downloadUrl = URL.createObjectURL(blob);
      setDownloadUrl(downloadUrl); // Set the download URL in the state

      // download image
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `re-rize_xyz_${width}x${height}.png`;
      link.click();

      console.log("Resized Successful", downloadUrl);

      setIsLoading(false);
      setImage(null);
      setImagePreview(downloadUrl);
    } catch (error) {
      console.error("Error resizing image:", error);
      setErrorMessage("Error resizing image");
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);

      setIsLoading(false);
      return;
    }
    setIsLoading(false);
  };

  return (
    <div className="">
      {errorMessage && (
        <p className="">
          {errorMessage}
        </p>
      )}
      <div className="">
        <div
          id="activeArea"
          className={` ${
            isDragging ? "" : " "
          } ${image ? "" : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {imagePreview && (
            <div className="">
              <img src={imagePreview} className="" width="" />
              <button
                onClick={handleDeleteImage}
                className=""
              >
                <div className="">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17,4V5H15V4H9V5H7V4A2,2,0,0,1,9,2h6A2,2,0,0,1,17,4Z" />
                    <path d="M20,6H4A1,1,0,0,0,4,8H5V20a2,2,0,0,0,2,2H17a2,2,0,0,0,2-2V8h1a1,1,0,0,0,0-2ZM11,17a1,1,0,0,1-2,0V11a1,1,0,0,1,2,0Zm4,0a1,1,0,0,1-2,0V11a1,1,0,0,1,2,0Z" />
                  </svg>
                </div>
              </button>
            </div>
          )}
        </div>
        <div
          id="dropLabel"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={` ${
            imagePreview ? "" : ""
          }`}
        >
          <div className="">
            <span className="">Drop your image here</span>
            <span>or</span>
          </div>
          <form className="" onSubmit={handleFormData}>
            <input
              className=""
              type="file"
              id="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            <label
              htmlFor="file"
              className={` `}
            >
              Upload image
            </label>
          </form>
        </div>
      </div>
      <div
        id="pcontrol"
        className=""
      >
        <form onSubmit={handleFormData} className="">
          <input
            id="width"
            type="number"
            inputMode="numeric"
            name="width"
            placeholder="Width"
            value={width}
            onChange={handleWidthChange}
            className=""
          />
          <label
            className=""
            title="Lock aspect ratio"
          >
            <input
              type="checkbox"
              onChange={handleLockAspectRatioChange}
              className=""
            />
            {lockAspectRatio ? <p>O</p> : <p>C</p>}
          </label>
          <input
            id="height"
            type="number"
            inputMode="numeric"
            name="height"
            placeholder="height"
            value={height}
            onChange={handleHeightChange}
            className=""
          />
          <button
            id="submit"
            type="submit"
            onSubmit={handleFormData}
            className=""
          >
            <span className="font-medium">
              {isLoading ? "Loading..." : "Generate"}
            </span>
          </button>
        </form>
        {downloadUrl && (
          <a
            href={downloadUrl}
            download={`@datmanmx_resize_${width}x${height}.png`}
            className=""
          >
            <span className="">
              Download{" "}
              <div>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <g id="Interface / Download">
                      {" "}
                      <path
                        id="Vector"
                        d="M6 21H18M12 3V17M12 17L17 12M12 17L7 12"
                        stroke="#000000"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>{" "}
                    </g>{" "}
                  </g>
                </svg>
              </div>
            </span>
          </a>
        )}
      </div>
    </div>
  );
}
