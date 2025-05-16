"use client";

import { useState, ChangeEvent } from "react";

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const onFileUpload = async () => {
    if (!file) return alert("No file selected");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/imgur", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert("Upload berhasil!");
        console.log("Link gambar:", data.link);
        console.log("Delete hash:", data.deletehash);
        setImgUrl(data.link);
      } else {
        alert("Gagal upload");
        console.error(data);
      }
    } catch (err) {
      alert("Error upload");
      console.error(err);
    }
  };

  const deleteImage = async (deletehash: string) => {
    const res = await fetch("/api/imgur", {
      method: "DELETE",
      body: JSON.stringify({ deletehash }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    console.log("Hasil delete:", data);
  };

  return (
    <>
      <input type="file" onChange={onFileChange} />
      <button onClick={onFileUpload}>Upload</button>
      <button onClick={() => deleteImage("qcAn08Gv3KnpFFm")}>Delete</button>
      {imgUrl !== undefined && <img src={imgUrl} alt="miaw" />}
    </>
  );
}
