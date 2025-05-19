// import { randomUUID } from "crypto";
// import { mkdir, writeFile } from "fs/promises";
// import path from "path";
// import { NextResponse } from "next/server";
// import { db } from "@/lib/db";

// export const dynamic = "force-dynamic";
// export const runtime  = "nodejs";   // đảm bảo Node runtime trên Vercel

// export async function POST(
//   req: Request,
//   { params }: { params: { moduleId: string } }
// ) {
//   console.log("📌 moduleId:", params.moduleId);
//   const form = await req.formData();
//   const file = form.get("file") as File | null;
//   if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

//   try {
//     const buffer     = Buffer.from(await file.arrayBuffer());
//     const uploadsDir = path.join(process.cwd(), "public", "exam-files");
//     await mkdir(uploadsDir, { recursive: true });

//     const ext       = path.extname(file.name) || ".xlsx";
//     const filename  = `${randomUUID()}${ext}`;
//     await writeFile(path.join(uploadsDir, filename), new Uint8Array(buffer));

//     const url = `/exam-files/${filename}`;

//     /* ✅ chỉ ghi module có id = params.id */
//     await db.module.update({
//       where: { id: params.moduleId },
//       data:  { examFilePath: url },
//     });

//     return NextResponse.json({ url });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ error: "Upload failed" }, { status: 500 });
//   }
// }

import { randomUUID } from "crypto";
import { mkdir, writeFile, rm } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime  = "nodejs";

export async function POST(
  req: Request,
  { params }: { params: { moduleId: string } }   // <— segment tên moduleId
) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  /* ——— lấy đường dẫn cũ trước để lát nữa xoá ——— */
  const current = await db.module.findUnique({
    where: { id: params.moduleId },
    select: { examFilePath: true },
  });
  const oldPath = current?.examFilePath
    ? path.join(process.cwd(), "public", current.examFilePath)
    : null;

  try {
    /* 1. ghi file mới */
    const buffer     = Buffer.from(await file.arrayBuffer());
    const uploadsDir = path.join(process.cwd(), "public", "exam-files");
    await mkdir(uploadsDir, { recursive: true });

    const ext      = path.extname(file.name) || ".xlsx";
    const filename = `${randomUUID()}${ext}`;
    const newPath  = path.join(uploadsDir, filename);

     await writeFile(path.join(uploadsDir, filename), new Uint8Array(buffer));

    const url = `/exam-files/${filename}`;

    /* 2. cập-nhật DB với file mới */
    await db.module.update({
      where: { id: params.moduleId },
      data:  { examFilePath: url },
    });

    /* 3. xoá file cũ (nếu có) – ignore lỗi nếu không tồn tại */
    if (oldPath) {
      rm(oldPath).catch(() => {});
    }

    return NextResponse.json({ url });
  } catch (err: any) {
    console.error("Upload failed:", err);
    return NextResponse.json(
      { error: err?.message ?? "Upload failed" },
      { status: 500 }
    );
  }
}
