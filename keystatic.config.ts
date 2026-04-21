import { config, fields, collection } from "@keystatic/core";
import { createElement } from "react";

const keystaticStorageKind = process.env.KEYSTATIC_STORAGE_KIND;
const useLocalKeystaticStorage =
  keystaticStorageKind === "local" ||
  (keystaticStorageKind !== "github" && process.env.NODE_ENV !== "production");

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
            style: {
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              textDecoration: "none",
              fontWeight: 700,
            },
          },
          "Back to site",
        ),
    },
  },
  collections: {
    posts: collection({
      label: "Trade Journal",
      slugField: "title",
      path: "src/content/posts/*",
      previewUrl: "/posts/{slug}?preview=1",
      columns: ["title", "date", "updatedAt", "type", "draft", "featured"],
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
