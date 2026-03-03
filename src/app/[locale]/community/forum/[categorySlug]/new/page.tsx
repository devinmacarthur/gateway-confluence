import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TopicForm } from "@/components/community/forum/topic-form";

export default async function NewTopicPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = await params;
  const t = await getTranslations("forum");

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>{t("newTopic")}</CardTitle>
        </CardHeader>
        <CardContent>
          <TopicForm categorySlug={categorySlug} />
        </CardContent>
      </Card>
    </div>
  );
}
