import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fontData, experimental_getFontFileURL } from "astro:assets";
import type { Font } from "satori";
import { getFontPathByWeight } from "@/utils/getFontPathByWeight";

const notoSansSc = readFileSync(
  join(process.cwd(), "src/assets/fonts/NotoSansSC-Regular.otf")
);

export const ogFontFamily = "Google Sans Code, Noto Sans SC";

/** Latin from the local Fontsource package; Chinese from the vendored Noto file. */
export async function loadOgFonts(requestUrl: URL): Promise<Font[]> {
  const fonts = fontData["--font-google-sans-code"];
  const regularFontPath = getFontPathByWeight(fonts, 400, { format: "woff" });
  const boldFontPath = getFontPathByWeight(fonts, 700, { format: "woff" });

  if (regularFontPath === undefined || boldFontPath === undefined) {
    throw new Error("Cannot find the font path.");
  }

  const [regularData, boldData] = await Promise.all([
    fetch(experimental_getFontFileURL(regularFontPath, requestUrl)).then(res =>
      res.arrayBuffer()
    ),
    fetch(experimental_getFontFileURL(boldFontPath, requestUrl)).then(res =>
      res.arrayBuffer()
    ),
  ]);

  return [
    {
      name: "Google Sans Code",
      data: regularData,
      weight: 400 as const,
      style: "normal" as const,
    },
    {
      name: "Google Sans Code",
      data: boldData,
      weight: 700 as const,
      style: "normal" as const,
    },
    {
      name: "Noto Sans SC",
      data: notoSansSc,
      weight: 400 as const,
      style: "normal" as const,
    },
    {
      name: "Noto Sans SC",
      data: notoSansSc,
      weight: 700 as const,
      style: "normal" as const,
    },
  ];
}
