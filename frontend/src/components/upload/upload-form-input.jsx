import { useState } from "react";
import { Button } from "@/components/ui/button";
import { z } from "zod";

const MAX_SIZE = 50 * 1024 * 1024; // 50MB

const ALLOWED_TYPES = [
  "application/pdf",
  "audio/mpeg",
  "audio/wav",
  "video/mp4",
  "video/webm",
  "video/ogg",
];
const uploadSchema = z.object({
  file: z
    .instanceof(File, { message: "Invalid file" })
    .refine((file) => file.size <= MAX_SIZE, {
      message: "File too large (max 50MB)",
    })
    .refine((file) => ALLOWED_TYPES.includes(file.type), {
      message: "Unsupported file type",
    }),
});

export default function UploadFormInput({ onSubmit }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  // 📥 Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const validation = uploadSchema.safeParse({ file: selectedFile });

    if (!validation.success) {
      setError(
        validation.error.flatten().fieldErrors.file?.[0] || "Invalid file",
      );
      setFile(null);
      return;
    }

    setError("");
    setFile(selectedFile);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) return;
    onSubmit?.(file);
  };
  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <div className="flex justify-end items-center gap-1.5">
        <input
          id="file"
          type="file"
          name="file"
          accept="audio/*,video/*,application/pdf"
          required
          onChange={handleFileChange}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}

      {file && (
        <p className="text-sm text-gray-600">Selected file: {file.name}</p>
      )}
      <Button type="submit" disabled={!file}>
        Upload your file
      </Button>
    </form>
  );
}
