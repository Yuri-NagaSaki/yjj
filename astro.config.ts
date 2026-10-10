import {
  defineConfig,
  envField,
  fontProviders,
  svgoOptimizer,
} from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import rehypeCallouts from "rehype-callouts";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";
import config from "./astro-paper.config";

function googleSansCodeVariant(
  weight: 300 | 400 | 500 | 600 | 700,
  style: "normal" | "italic"
) {
  return {
    weight,
    style,
    src: [
      `./node_modules/@fontsource/google-sans-code/files/google-sans-code-latin-${weight}-${style}.woff2`,
      `./node_modules/@fontsource/google-sans-code/files/google-sans-code-latin-${weight}-${style}.woff`,
    ] as [string, string],
  };
}

const googleSansCodeVariants = [
  googleSansCodeVariant(300, "normal"),
  googleSansCodeVariant(300, "italic"),
  googleSansCodeVariant(400, "normal"),
  googleSansCodeVariant(400, "italic"),
  googleSansCodeVariant(500, "normal"),
  googleSansCodeVariant(500, "italic"),
  googleSansCodeVariant(600, "normal"),
  googleSansCodeVariant(600, "italic"),
  googleSansCodeVariant(700, "normal"),
  googleSansCodeVariant(700, "italic"),
] as [
  ReturnType<typeof googleSansCodeVariant>,
  ...ReturnType<typeof googleSansCodeVariant>[],
];

export default defineConfig({
  site: config.site.url,
  integrations: [
    mdx(),
    sitemap({
      filter: page =>
        config.features?.showArchives !== false || !page.endsWith("/archives/"),
    }),
  ],
  i18n: {
    locales: ["zh-CN"],
    defaultLocale: "zh-CN",
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    processor: unified({
      remarkPlugins: [
        remarkToc,
        [remarkCollapse, { test: "Table of contents" }],
      ],
      rehypePlugins: [rehypeCallouts],
    }),
    shikiConfig: {
      themes: { light: "min-light", dark: "night-owl" },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName({ style: "v2", hideDot: false }),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  fonts: [
    {
      name: "Google Sans Code",
      cssVariable: "--font-google-sans-code",
      // Files come from the Fontsource package installed by pnpm.
      // Workers Builds cannot reach fonts.gstatic.com.
      provider: fontProviders.local(),
      fallbacks: ["monospace"],
      options: { variants: googleSansCodeVariants },
    },
  ],
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
  experimental: {
    svgOptimizer: svgoOptimizer(),
  },
});
