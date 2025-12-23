import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import { createPost, validatePostData } from "~/lib/posts/post.service";
import { Button, buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils/cn";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { ArrowRight } from "lucide-react";

export const meta: MetaFunction = () => {
  return [{ title: "ایجاد پست جدید - وبلاگ Remix" }];
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const title = formData.get("title");
  const slug = formData.get("slug");
  const content = formData.get("content");
  const imageUrl = formData.get("imageUrl");

  // Validate form data
  const validation = validatePostData({ title, slug, content, imageUrl });
  if (!validation.isValid || !validation.data) {
    return json({ error: validation.error }, { status: 400 });
  }

  try {
    await createPost(validation.data);
    return redirect("/");
  } catch (error) {
    return json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create post. Please try again.",
      },
      { status: 400 }
    );
  }
}

export default function AdminNew() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="bg-background">
      <nav className="border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              وبلاگ Remix
            </Link>
            <Link
              to="/"
              className={cn(buttonVariants({ variant: "outline" }), "flex items-center gap-2")}
            >
              بازگشت به پست‌ها
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      <main className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-4xl text-right">ایجاد پست جدید</CardTitle>
            <CardDescription className="text-right">
              جزئیات زیر را پر کنید تا یک پست وبلاگ جدید ایجاد کنید.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form method="post" className="space-y-6">
              {actionData?.error && (
                <Alert variant="destructive">
                  <AlertDescription className="text-right">{actionData.error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium text-right block">
                  عنوان
                </label>
                <Input
                  id="title"
                  name="title"
                  required
                  placeholder="عنوان پست را وارد کنید"
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="slug" className="text-sm font-medium text-right block">
                  شناسه URL (Slug)
                </label>
                <Input
                  id="slug"
                  name="slug"
                  required
                  placeholder="مثال: my-first-post"
                  pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                  title="Slug باید فقط شامل حروف کوچک، اعداد و خط تیره باشد"
                  className="text-right"
                />
                <p className="text-xs text-muted-foreground text-right">
                  فقط از حروف کوچک، اعداد و خط تیره استفاده کنید
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="imageUrl" className="text-sm font-medium text-right block">
                  آدرس تصویر (اختیاری)
                </label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  className="text-right"
                />
                <p className="text-xs text-muted-foreground text-right">
                  آدرس URL تصویر پست را وارد کنید
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="content" className="text-sm font-medium text-right block">
                  محتوا
                </label>
                <Textarea
                  id="content"
                  name="content"
                  required
                  rows={12}
                  placeholder="محتوای پست خود را اینجا بنویسید..."
                  className="text-right"
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "در حال ایجاد..." : "ایجاد پست"}
                </Button>
                <Link
                  to="/"
                  className={cn(buttonVariants({ variant: "outline" }))}
                >
                  انصراف
                </Link>
              </div>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}


