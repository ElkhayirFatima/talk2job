import UploadFormInput from "./upload-form-input";
import { axiosPrivate } from "../../api/axios";
import { useState } from "react";

export default function UploadForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const response = await axiosPrivate.post(
        "/api/upload", // endpoint backend to handle file upload
        formData,
      );

      console.log("Upload success:", response.data);

      const { fileId, url } = response.data;

      // redirect / show toast / next step
      // toast.success("File uploaded!");
    } catch (err) {
      if (!err?.response) {
        console.error("No Server Response");
      } else if (err.response?.status === 400) {
        console.error("Invalid File");
      } else {
        console.error("Upload Failed");
      }
    } finally {
      setLoading(false);
    }

    //validating the fields
    //schema with zod
    //upload the file to the server
    //return the file id/url
    //parse the file using chain
    //AI processing
    //save resuts to the database(MongoDB)
    //redirect to the [id] results page
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      {loading && <p className="text-sm text-gray-600">Uploading...</p>}
      <UploadFormInput onSubmit={handleSubmit} />
    </div>
  );
}
