import { config, fields, collection } from "@keystatic/core";
import { block } from "@keystatic/core/content-components";
import { createElement } from "react";
import { toGiphyEmbedUrl } from "./src/lib/giphy";

type EnvRecord = Record<string, unknown>;

const importMetaEnv: EnvRecord =
  typeof import.meta !== "undefined" && import.meta.env
    ? (import.meta.env as unknown as EnvRecord)
    : {};
const processEnv: EnvRecord =
  typeof globalThis !== "undefined" &&
  "process" in globalThis &&
  (globalThis as { process?: { env?: EnvRecord } }).process?.env
    ? ((globalThis as { process?: { env?: EnvRecord } }).process?.env ??
      {})
    : {};

const readEnv = (key: string): string | undefined => {
  const processValue = processEnv[key];
  if (typeof processValue === "string" && processValue.length > 0) {
    return processValue;
  }
  const importMetaValue = importMetaEnv[key];
  if (typeof importMetaValue === "string" && importMetaValue.length > 0) {
    return importMetaValue;
  }
  return undefined;
};

const isProduction =
  typeof importMetaEnv.PROD === "boolean"
    ? importMetaEnv.PROD
    : readEnv("NODE_ENV") === "production";
const keystaticStorageKind = readEnv("KEYSTATIC_STORAGE_KIND");
const siteEnv = readEnv("SITE");
const localPreviewBaseEnv = readEnv("KEYSTATIC_LOCAL_PREVIEW_BASE_URL");
const useLocalKeystaticStorage =
  keystaticStorageKind === "local" ||
  (keystaticStorageKind !== "github" && !isProduction);
const normalizedSite =
  typeof siteEnv === "string" && siteEnv.length > 0
    ? siteEnv.replace(/\/$/, "")
    : "https://unemployed.money";
const localPreviewBase =
  typeof localPreviewBaseEnv === "string" && localPreviewBaseEnv.length > 0
    ? localPreviewBaseEnv.replace(/\/$/, "")
    : "";
const postsPreviewUrl = useLocalKeystaticStorage
  ? `${localPreviewBase}/posts/{slug}?preview=1`
  : `${normalizedSite}/posts/{slug}?preview=1`;
const giphyComponent = block({
  label: "Giphy Embed",
  description: "Paste a Giphy URL to embed it in the post body.",
  schema: {
    url: fields.url({
      label: "Giphy URL",
      description: "Accepts giphy.com/gifs, giphy.com/embed, or media.giphy.com",
      validation: { isRequired: true },
    }),
    caption: fields.text({
      label: "Caption",
      description: "Optional caption below the embed.",
    }),
  },
  ContentView: (props) => {
    const embedUrl = toGiphyEmbedUrl(props.value.url ?? "");
    return createElement(
      "div",
      {
        style: {
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "0.5rem",
          padding: "0.65rem",
          fontSize: "0.82rem",
          lineHeight: 1.4,
        },
      },
      embedUrl ? `Giphy embed ready: ${embedUrl}` : "Paste a valid Giphy URL",
    );
  },
});

export default config({
  storage: useLocalKeystaticStorage
    ? {
        kind: "local",
      }
    : {
        kind: "github",
        repo: "obiknows/unemployed-money",
      },
  ui: {
    brand: {
      name: "Unemployed Money",
      mark: () =>
        // Direct escape hatch from /keystatic back to the public site.
        createElement(
          "a",
          {
            href: "/",
            "aria-label": "Back to site",
            style: {
              position: "fixed",
              bottom: "1rem",
              left: "1rem",
              zIndex: 2147483647,
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              padding: "0.35rem 0.6rem",
              borderRadius: "0.5rem",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              background: "rgba(20, 20, 24, 0.78)",
              color: "inherit",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              fontSize: "0.8rem",
              fontWeight: 600,
              textDecoration: "none",
              lineHeight: 1,
            },
          },
          createElement(
            "span",
            {
              "aria-hidden": "true",
              style: {
                fontSize: "0.95rem",
                opacity: 0.85,
              },
            },
            "‹",
          ),
          "Back to site",
        ),
    },
  },
  collections: {
    posts: collection({
      label: "Trade Journal",
      slugField: "title",
      path: "src/content/posts/*",
      previewUrl: postsPreviewUrl,
      columns: ["date", "updatedAt", "type", "draft", "featured"],
      format: { contentField: "content" },
      schema: {
        title: fields.slug({
          name: {
            label: "Title",
            description: "Your voice. Emojis welcome.",
          },
          slug: {
            label: "Slug",
            description: "SEO-friendly URL. Click Regenerate after title edits.",
            generate: (name) =>
              name
                .toLowerCase()
                .trim()
                .replace(/['’]/g, "")
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, ""),
          },
        }),
        date: fields.date({
          label: "Date",
          description: "Use YYYY-MM-DD. Defaults to today.",
          defaultValue: { kind: "today" },
          validation: { isRequired: true },
        }),
        updatedAt: fields.datetime({
          label: "Updated",
          description: "Optional last-updated timestamp for sorting/filtering.",
        }),
        description: fields.text({
          label: "Meta Description",
          description: "SEO. 1-2 sentences, factual, keyword rich.",
          multiline: true,
        }),
        type: fields.select({
          label: "Post Type",
          options: [
            { label: "Trade Journal", value: "journal" },
            { label: "Analysis", value: "analysis" },
            { label: "Portfolio Update", value: "portfolio" },
            { label: "AI / Infra", value: "infra" },
            { label: "Meta", value: "meta" },
          ],
          defaultValue: "journal",
        }),
        tags: fields.array(fields.text({ label: "Tag" }), {
          label: "Tags",
          description:
            "Tickers, strategies, macro events. e.g. SPY, 0DTE, FOMC",
          itemLabel: (props) => props.value,
        }),
        featured: fields.checkbox({
          label: "Featured",
          description: "Pin to the homepage featured section",
          defaultValue: false,
        }),
        coverPhoto: fields.text({
          label: "Cover image URL",
          description:
            "Featured card image — full https URL or site path e.g. /images/covers/foo.jpg",
        }),
        draft: fields.checkbox({
          label: "Draft",
          description: "Check to hide from the site",
          defaultValue: false,
        }),
        content: fields.mdx({
          label: "Content",
          components: {
            Giphy: giphyComponent,
          },
          options: {
            image: {
              directory: "src/assets/images/posts",
              publicPath: "../../assets/images/posts/",
            },
          },
        }),
      },
    }),
  },
});
