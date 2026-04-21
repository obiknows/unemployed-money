const GIPHY_ID_PATTERN = /^[A-Za-z0-9]+$/;

const isLikelyGiphyId = (value: string): boolean =>
  value.length >= 6 && GIPHY_ID_PATTERN.test(value);

export function extractGiphyId(raw: string): string | undefined {
  if (typeof raw !== "string") return undefined;
  const input = raw.trim();
  if (!input) return undefined;
  if (isLikelyGiphyId(input)) return input;

  try {
    const url = new URL(input);
    const host = url.hostname.toLowerCase();
    const parts = url.pathname.split("/").filter(Boolean);

    if (host.endsWith("giphy.com")) {
      if (parts[0] === "embed" && parts[1] && isLikelyGiphyId(parts[1])) {
        return parts[1];
      }

      if (parts[0] === "media" && parts[1] && isLikelyGiphyId(parts[1])) {
        return parts[1];
      }

      if (parts[0] === "gifs" && parts.length > 1) {
        const slug = parts.at(-1);
        if (slug) {
          const maybeId = slug.split("-").at(-1);
          if (maybeId && isLikelyGiphyId(maybeId)) return maybeId;
        }
      }
    }

    if (host.includes("media.giphy.com") && parts[0] === "media") {
      const maybeId = parts[1];
      if (maybeId && isLikelyGiphyId(maybeId)) return maybeId;
    }
  } catch {
    return undefined;
  }

  return undefined;
}

export function toGiphyEmbedUrl(raw: string): string | undefined {
  const id = extractGiphyId(raw);
  return id ? `https://giphy.com/embed/${id}` : undefined;
}

export function toGiphyGifUrl(raw: string): string | undefined {
  const id = extractGiphyId(raw);
  return id ? `https://media.giphy.com/media/${id}/giphy.gif` : undefined;
}
