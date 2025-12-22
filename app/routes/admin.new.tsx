import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import { createPost, validatePostData } from "~/lib/posts/post.service";
import { Button, buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils/cn";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Alert, AlertDescription } from "~/components/ui/alert";

export const meta: MetaFunction = () => {
  return [{ title: "Create New Post - Remix Blog" }];
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
    return Response.json({ error: validation.error }, { status: 400 });
  }

  try {
    await createPost(validation.data);
    return redirect("/");
  } catch (error) {
    return Response.json(
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
            <Link to="/" className="text-2xl font-bold">
              Remix Blog
            </Link>
            <Link
              to="/"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Back to Posts
            </Link>
          </div>
        </div>
      </nav>

      <main className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-4xl">Create New Post</CardTitle>
            <CardDescription>
              Fill in the details below to create a new blog post.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form method="post" className="space-y-6">
              {actionData?.error && (
                <Alert variant="destructive">
                  <AlertDescription>{actionData.error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Title
                </label>
                <Input
                  id="title"
                  name="title"
                  required
                  placeholder="Enter post title"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="slug" className="text-sm font-medium">
                  Slug (URL-friendly identifier)
                </label>
                <Input
                  id="slug"
                  name="slug"
                  required
                  placeholder="e.g., my-first-post"
                  pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                  title="Slug must contain only lowercase letters, numbers, and hyphens"
                />
                <p className="text-xs text-muted-foreground">
                  Use lowercase letters, numbers, and hyphens only
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="imageUrl" className="text-sm font-medium">
                  Image URL (Optional)
                </label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-muted-foreground">
                  Enter a URL for the post image
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="content" className="text-sm font-medium">
                  Content
                </label>
                <Textarea
                  id="content"
                  name="content"
                  required
                  rows={12}
                  placeholder="Write your post content here..."
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Post"}
                </Button>
                <Link
                  to="/"
                  className={cn(buttonVariants({ variant: "outline" }))}
                >
                  Cancel
                </Link>
              </div>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}


