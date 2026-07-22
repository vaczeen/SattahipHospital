"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Resize from "react-image-file-resizer";
import { removeFiles, uploadFiles } from "@/lib/inventory-api/Product";
import useEcomStore from "@/store/ecom-store";
import { LoaderCircle,Upload } from "lucide-react";

const Uploadfile = ({ form, setForm }) => {
  const token = useEcomStore((state) => state.token);
  const [isLoading, setIsLoading] = useState(false);

  const handleOnchange = (e) => {
    setIsLoading(true);
    const files = e.target.files;
    if (files) {
      setIsLoading(true);
      let allFiles = form.images;
      for (let i = 0; i < files.length; i++) {
        console.log(files[i]);
        const file = files[i];
        if (!file.type.startsWith("image/")) {
          toast.error(`File ${file.name} is not a Picture`);
          continue;
        }
        //Image Resize
        Resize.imageFileResizer(
          files[i],
          720,
          720,
          "JPEG",
          100,
          0,
          (data) => {
            //endpoint backend
            uploadFiles(token, data)
              .then((res) => {
                console.log(res);
                allFiles.push(res.data);
                setForm({
                  ...form,
                  images: allFiles,
                });
                setIsLoading(false);
                toast.success("Upload image Success!!");
              })
              .catch((error) => {
                console.log(error);
                setIsLoading(false);
              });
          },
          "base64"
        );
      }
    }
    console.log(form);
  };

  const handleDelete = (public_id) => {
    // console.log(public_id);
    const images = form.images;
    removeFiles(token, public_id)
      .then((res) => {
        const filterImages = images.filter((item) => {
          return item.public_id !== public_id;
        });
        console.log("filterImages", filterImages);
        setForm({
          ...form,
          images: filterImages,
        });
        toast.error(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="my-4">
      <div className="flex mx-4 gap-4 my-4">
        {isLoading && (
          <LoaderCircle className="w-10 h-10 animate-spin text-gray-800 justify-center" />
        )}
        {form.images.map((item, index) => (
          <div className="relative" key={index}>
            <img
              className="w-64 h-40 hover:scale-105 rounded-lg"
              src={item.url}
            />
            <span
              onClick={() => handleDelete(item.public_id)}
              className="absolute top-0 right-0 bg-red-800 p-1 rounded-md"
            >
              <a href="#">X</a>
            </span>
          </div>
        ))}
      </div>

      <div>
        <input   id="fileUpload"
        onChange={handleOnchange}
        type="file"
        name="images"
        multiple
        className="hidden"/>
      </div>

       <label
        htmlFor="fileUpload"
        className="cursor-pointer inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-md"
      >
        <Upload className="w-5 h-5" />
        อัพโหลดรูปภาพ
      </label>
    </div>
  );
};

export default Uploadfile;

