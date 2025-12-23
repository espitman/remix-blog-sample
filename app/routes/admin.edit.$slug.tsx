import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { getPostBySlug, updatePost, validatePostData } from "~/lib/posts/post.service";
import { Button, buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils/cn";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { ArrowRight } from "lucide-react";

export async function loader({ params }: LoaderFunctionArgs) {
  const post = await getPostBySlug(params.slug!);
  return json({ post });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [{ title: "پست یافت نشد" }];
  }
  return [{ title: `ویرایش ${data.post.title} - وبلاگ Remix` }];
};

export async function action({ request, params }: ActionFunctionArgs) {
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
    await updatePost(params.slug!, validation.data);
    return redirect(`/posts/${validation.data.slug}`);
  } catch (error) {
    return json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update post. Please try again.",
      },
      { status: error instanceof Error && error.message.includes("not found") ? 404 : 400 }
    );
  }
}

export default function AdminEdit() {
  const { post } = useLoaderData<typeof loader>();
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
              to={`/posts/${post.slug}`}
              className={cn(buttonVariants({ variant: "outline" }), "flex items-center gap-2")}
            >
              بازگشت به پست
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      <main className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-4xl text-right">ویرایش پست</CardTitle>
            <CardDescription className="text-right">
              جزئیات پست وبلاگ خود را در زیر به‌روزرسانی کنید.
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
                  defaultValue={post.title}
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
                  defaultValue={post.slug}
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
                  defaultValue={post.imageUrl || ""}
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
                  defaultValue={post.content}
                  placeholder="محتوای پست خود را اینجا بنویسید..."
                  className="text-right"
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "در حال به‌روزرسانی..." : "به‌روزرسانی پست"}
                </Button>
                <Link
                  to={`/posts/${post.slug}`}
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

