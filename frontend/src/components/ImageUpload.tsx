
import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";

type ImageUploadProps = {
  value?: string;
  onChange: (image: string) => void;
  label?: string;
};

export default function ImageUpload({
  value,
  onChange,
  label = "Upload image",
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  function handleFile(file?: File) {
    if (!file) return;

    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be smaller than 10 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();

      image.onload = () => {
        const maxDimension = 1000;
        const scale = Math.min(
          1,
          maxDimension / Math.max(image.width, image.height)
        );

        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);

        const context = canvas.getContext("2d");

        if (!context) {
          setError("Could not process this image.");
          return;
        }

        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        const compressed = canvas.toDataURL("image/jpeg", 0.78);
        onChange(compressed);
      };

      image.onerror = () => setError("This image could not be opened.");

      image.src = String(reader.result);
    };

    reader.onerror = () => setError("Could not read the selected file.");
    reader.readAsDataURL(file);
  }

  return (
    <div className="image-upload">
      <span className="image-upload-label">{label}</span>

      {value ? (
        <div className="image-preview">
          <img src={value} alt="Selected preview" />

          <button
            type="button"
            className="image-remove"
            onClick={() => {
              onChange("");
              if (inputRef.current) inputRef.current.value = "";
            }}
            aria-label="Remove image"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="image-upload-box"
          onClick={() => inputRef.current?.click()}
        >
          <ImagePlus size={25} />
          <strong>Choose an image</strong>
          <small>JPG, PNG or WebP · Maximum 10 MB</small>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        hidden
        onChange={(event) => handleFile(event.target.files?.[0])}
      />

      {error && <p className="form-error">{error}</p>}
    </div>
  );
}
