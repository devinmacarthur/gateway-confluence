import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import type { PlanSection, PlanSectionMeta } from "@/types/plan";

const CONTENT_DIR = path.join(process.cwd(), "src/content/plan");

export async function getPlanSection(
  slug: string,
  locale: string
): Promise<PlanSection> {
  let filePath = path.join(CONTENT_DIR, locale, `${slug}.mdx`);
  let fallback = false;

  try {
    await fs.access(filePath);
  } catch {
    filePath = path.join(CONTENT_DIR, "en", `${slug}.mdx`);
    fallback = true;
  }

  const source = await fs.readFile(filePath, "utf-8");
  const { data, content } = matter(source);

  return {
    slug,
    title: data.title ?? slug,
    section: data.section ?? 0,
    status: data.status ?? "draft",
    lastUpdated: data.lastUpdated ?? "",
    authors: data.authors ?? [],
    priority: data.priority ?? "medium",
    relatedSections: data.relatedSections ?? [],
    content,
    fallback,
    locale: fallback ? "en" : locale,
  };
}

export async function getAllPlanSections(
  locale: string
): Promise<PlanSectionMeta[]> {
  const enDir = path.join(CONTENT_DIR, "en");
  const files = await fs.readdir(enDir);
  const mdxFiles = files.filter((f) => f.endsWith(".mdx"));

  const sections: PlanSectionMeta[] = [];

  for (const file of mdxFiles) {
    const slug = file.replace(".mdx", "");
    let filePath = path.join(CONTENT_DIR, locale, file);

    try {
      await fs.access(filePath);
    } catch {
      filePath = path.join(enDir, file);
    }

    const source = await fs.readFile(filePath, "utf-8");
    const { data } = matter(source);

    sections.push({
      slug,
      title: data.title ?? slug,
      section: data.section ?? 0,
      status: data.status ?? "draft",
      priority: data.priority ?? "medium",
    });
  }

  return sections.sort((a, b) => a.section - b.section);
}

export async function getPlanSlugs(): Promise<string[]> {
  const enDir = path.join(CONTENT_DIR, "en");
  const files = await fs.readdir(enDir);
  return files
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(".mdx", ""));
}
