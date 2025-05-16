import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;

  if (!IMGUR_CLIENT_ID) {
    return NextResponse.json({ error: "Client ID not found" }, { status: 500 });
  }

  const imgurRes = await fetch("https://api.imgur.com/3/image", {
    method: "POST",
    headers: {
      Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
    },
    body: buffer,
  });

  const data = await imgurRes.json();

  if (!imgurRes.ok) {
    return NextResponse.json({ error: data }, { status: 500 });
  }

  return NextResponse.json({
    link: data.data.link,
    deletehash: data.data.deletehash,
  });
}

export async function DELETE(req: NextRequest) {
  const { deleteHash } = await req.json();

  const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;
  if (!IMGUR_CLIENT_ID) {
    return NextResponse.json({ error: "Client ID not found" }, { status: 500 });
  }

  const res = await fetch(`https://api.imgur.com/3/image/${deleteHash}`, {
    method: "DELETE",
    headers: {
      Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    console.log(data);
    return NextResponse.json({ error: data }, { status: 500 });
  }

  return NextResponse.json({ message: "Deleted successfully", data });
}
