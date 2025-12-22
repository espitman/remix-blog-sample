import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { getPostBySlug, updatePost, validatePostData } from "~/lib/posts/post.service";
import { Button, buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils/cn";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Alert, AlertDescription } from "~/components/ui/alert";

export async function loader({ params }: LoaderFunctionArgs) {
  const post = await getPostBySlug(params.slug!);
  return Response.json({ post });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [{ title: "Post Not Found" }];
  }
  return [{ title: `Edit ${data.post.title} - Remix Blog` }];
};

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const title = formData.get("title");
  const slug = formData.get("slug");
  const content = formData.get("content");

  // Validate form data
  const validation = validatePostData({ title, slug, content });
  if (!validation.isValid || !validation.data) {
    return Response.json({ error: validation.error }, { status: 400 });
  }

  try {
    await updatePost(params.slug!, validation.data);
    return redirect(`/posts/${validation.data.slug}`);
  } catch (error) {
    return Response.json(
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
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="text-2xl font-bold">
              Remix Blog
            </Link>
            <Link
              to={`/posts/${post.slug}`}
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Back to Post
            </Link>
          </div>
        </div>
      </nav>

      <main className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-4xl">Edit Post</CardTitle>
            <CardDescription>
              Update the details of your blog post below.
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
                  defaultValue={post.title}
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
                  defaultValue={post.slug}
                  placeholder="e.g., my-first-post"
                  pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                  title="Slug must contain only lowercase letters, numbers, and hyphens"
                />
                <p className="text-xs text-muted-foreground">
                  Use lowercase letters, numbers, and hyphens only
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
                  defaultValue={post.content}
                  placeholder="Write your post content here..."
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Updating..." : "Update Post"}
                </Button>
                <Link
                  to={`/posts/${post.slug}`}
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

