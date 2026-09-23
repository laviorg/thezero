import fs from "node:fs";
import path from "node:path";

export type ImageSize = { width: number; height: number };

const cache = new Map<string, ImageSize | null>();

function validSize(width: number, height: number): ImageSize | undefined {
  if (!Number.isFinite(width) || !Number.isFinite(height)) return undefined;
  if (width < 1 || height < 1 || width > 20000 || height > 20000) return undefined;
  return { width, height };
}

export function parseImageSize(buf: Buffer): ImageSize | undefined {
  if (buf.length >= 24 && buf[0] === 0x89 && buf.toString("ascii", 1, 4) === "PNG") {
    return validSize(buf.readUInt32BE(16), buf.readUInt32BE(20));
  }

  if (buf.length >= 10 && buf.toString("ascii", 0, 3) === "GIF") {
    return validSize(buf.readUInt16LE(6), buf.readUInt16LE(8));
  }

  if (
    buf.length >= 30 &&
    buf.toString("ascii", 0, 4) === "RIFF" &&
    buf.toString("ascii", 8, 12) === "WEBP"
  ) {
    const chunk = buf.toString("ascii", 12, 16);
    if (chunk === "VP8X") {
      return validSize(1 + buf.readUIntLE(24, 3), 1 + buf.readUIntLE(27, 3));
    }
    if (chunk === "VP8 ") {
      return validSize(buf.readUInt16LE(26) & 0x3fff, buf.readUInt16LE(28) & 0x3fff);
    }
    if (chunk === "VP8L") {
      const bits = buf.readUInt32LE(21);
      return validSize((bits & 0x3fff) + 1, ((bits >> 14) & 0x3fff) + 1);
    }
  }

  if (buf.length >= 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let offset = 2;
    while (offset + 9 < buf.length) {
      if (buf[offset] !== 0xff) {
        offset += 1;
        continue;
      }
      const marker = buf[offset + 1];
      if (marker === undefined) break;
      if (marker === 0xd8 || marker === 0xd9) {
        offset += 2;
        continue;
      }
      if (offset + 3 >= buf.length) break;
      const size = buf.readUInt16BE(offset + 2);
      if (size < 2) break;
      if (
        marker === 0xc0 ||
        marker === 0xc1 ||
        marker === 0xc2 ||
        marker === 0xc3
      ) {
        return validSize(buf.readUInt16BE(offset + 7), buf.readUInt16BE(offset + 5));
      }
      offset += 2 + size;
    }
  }

  return undefined;
}

/** Dimensions of a file under `public/`, or undefined for remote / missing files. */
export function readLocalImageSize(src?: string): ImageSize | undefined {
  if (!src || !src.startsWith("/") || src.startsWith("//")) return undefined;
  const key = src.split("?")[0] ?? src;
  const cached = cache.get(key);
  if (cached !== undefined) return cached ?? undefined;

  const filePath = path.join(process.cwd(), "public", key.replace(/^\//, ""));
  let size: ImageSize | undefined;
  try {
    const fd = fs.openSync(filePath, "r");
    try {
      const header = Buffer.alloc(256 * 1024);
      const bytes = fs.readSync(fd, header, 0, header.length, 0);
      size = parseImageSize(header.subarray(0, bytes));
    } finally {
      fs.closeSync(fd);
    }
  } catch {
    size = undefined;
  }
  cache.set(key, size ?? null);
  return size;
}
