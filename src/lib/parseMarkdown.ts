import { marked } from "marked";
import parseTitle from "./parseTitle";
import trimContent from "./trimContent";
import { markedSmartypants } from "marked-smartypants";
import hooks from "./markedHooks";
import addBlankLines from "./addBlankLines";
import linkFootnotes from "./linkFootnotes";
import expandRefs from "./expandRefs";
import getExcerpt from "./getExcerpt";
import extractImage from "./extractImage";
import matter from "gray-matter";
import { Status, getStatus, Image } from "./makePost";

marked.use(markedSmartypants());
marked.use({ hooks });

const MARKED_OPTIONS = {
  mangle: false,
  headerIds: false,
} as const;

export type ParsedMarkdown = {
  title: string;
  content: string;
  excerpt: string;
  image: Image | undefined;
  frontmatter: Record<string, unknown>;
  slug: string | undefined;
  date: Date | undefined;
  author: string | undefined;
  tags: string[];
  status: Status | undefined;
};

function parseFrontmatter(markdown: string) {
  return matter(markdown) as matter.GrayMatterFile<string> & {
    data: Record<string, unknown>;
  };
}

function getImage({ image }: Record<string, unknown>): Image | undefined {
  if (typeof image === "string") {
    return { src: image, alt: undefined, extracted: false };
  }

  if (typeof image === "object" && image !== null) {
    const src =
      "src" in image && typeof image.src === "string" ? image.src : undefined;
    const alt =
      "alt" in image && typeof image.alt === "string" ? image.alt : undefined;

    if (!src) return undefined;

    return {
      src,
      alt,
      extracted: false,
    };
  }

  return undefined;
}

export default function parseMarkdown(markdown: string): ParsedMarkdown {
  const { data: fm, content: rawContent } = parseFrontmatter(markdown);
  const blanked = addBlankLines(rawContent);
  const trimmed = trimContent(blanked);
  const linked = linkFootnotes(trimmed);
  const expanded = expandRefs(linked);
  const content = marked.parse(expanded, MARKED_OPTIONS);
  const title = typeof fm.title === "string" ? fm.title : parseTitle(markdown);
  const excerpt =
    typeof fm.excerpt === "string" ? fm.excerpt : getExcerpt(content);
  const image = getImage(fm) ?? extractImage(content);
  const slug = typeof fm.slug === "string" ? fm.slug : undefined;
  const date = fm.date instanceof Date ? fm.date : undefined;
  const author = typeof fm.author === "string" ? fm.author : undefined;
  const tags = Array.isArray(fm.tags) ? fm.tags : [];
  const status = getStatus(fm.status);

  return {
    title,
    content,
    excerpt,
    image,
    frontmatter: fm,
    slug,
    date,
    author,
    tags,
    status,
  };
}
