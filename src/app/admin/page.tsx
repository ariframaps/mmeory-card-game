"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FlipCard from "@/components/FlipCard";

export default function AdminLoginPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [show, setshow] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (show) {
      // trigger flip when show becomes true
      setIsFlipped(true);

      // auto flip back after animation (optional)
      const timeout = setTimeout(() => {
        setIsFlipped(false);
      }, 1000); // adjust as needed

      return () => clearTimeout(timeout);
    }
  }, [show]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !phone) {
      alert("Nama dan nomor HP wajib diisi");
      return;
    }

    const adminPhone = process.env.NEXT_PUBLIC_ADMIN_PHONE;
    if (phone === adminPhone) {
      localStorage.setItem("isAdmin", "true");
      localStorage.setItem("adminName", name);
      router.push("/admin/dashboard");
    } else {
      alert("Nomor HP salah. Bukan admin!");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Login Admin</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="text"
          placeholder="Nama"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          type="tel"
          placeholder="Nomor HP"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border p-2 w-full"
        />
        <button
          type="submit"
          className="bg-gray-800 text-white px-4 py-2 w-full rounded">
          Login
        </button>
      </form>

      <div className="flex flex-row w-full items-center justify-between gap-4 p-5 bg-black rounded-lg mt-5">
        <>
          <button className="bg-white" onClick={() => setshow((prev) => !prev)}>
            Toggle
          </button>
          <FlipCard show={show} />
        </>
      </div>
    </div>
  );
}
