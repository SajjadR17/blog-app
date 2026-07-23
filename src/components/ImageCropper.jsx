import { useState } from "react";
import Cropper from "react-easy-crop";
import "../styles/imageCropper.css";

const ImageCropper = ({
  image,
  onCropComplete,
  onCancel,
  onSave,
  uploading,
}) => {
  const [crop, setCrop] = useState({
    x: 0,
    y: 0,
  });

  const [zoom, setZoom] = useState(1);

  const handleCropComplete = (_, croppedAreaPixels) => {
    onCropComplete(croppedAreaPixels);
  };

  return (
    <div className="crop-overlay">
      <div className="crop-modal">
        <div className="crop-container">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </div>

        <div className="crop-controls">
          <label>Zoom</label>

          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
          />
        </div>

        <div className="crop-actions">
          <button className="crop-btn cancel" onClick={onCancel}>
            Cancel
          </button>

          <button className="crop-btn" onClick={onSave}>
            {uploading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
