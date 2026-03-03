import { getTranslations, getLocale } from "next-intl/server";
import { getForumCategories } from "@/lib/forum/actions";
import { CategoryCard } from "@/components/community/forum/category-card";

export default async function ForumPage() {
  const t = await getTranslations("forum");
  const locale = await getLocale();
  const categories = await getForumCategories();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            locale={locale}
          />
        ))}
      </div>
    </div>
  );
}
