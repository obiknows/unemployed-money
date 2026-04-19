import { config, fields, collection } from "@keystatic/core";

export default config({
  storage: {
    kind: "local",
  },
  collections: {
    posts: collection({
      label: "Trade Journal",
      slugField: "slug",
      path: "src/content/posts/*",
      format: { contentField: "content" },
      schema: {
        title: fields.text({
          label: "Title",
          description: "Your voice. Emojis welcome.",
        }),
        slug: fields.text({
          label: "Slug",
          description: "SEO-friendly URL. e.g. spy-puts-fomc-july-2022",
        }),
        date: fields.date({
          label: "Date",
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
