const GITHUB_MEDIA_BASE =
  "https://media.githubusercontent.com/media/AIGC-ding/0709---/main/public";

export function resolveVideoUrl(source) {
  if (!source || !import.meta.env.PROD || !source.startsWith("/assets/")) {
    return source;
  }

  return `${GITHUB_MEDIA_BASE}${source}`;
}
