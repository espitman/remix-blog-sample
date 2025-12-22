import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigation } from "@remix-run/react";
import { useState } from "react";
import { deletePostBySlug, getPostBySlug } from "~/lib/posts/post.service";
import { Button, buttonVariants } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils/cn";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

export async function loader({ params }: LoaderFunctionArgs) {
  const post = await getPostBySlug(params.slug!);
  return Response.json({ post });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "delete") {
    try {
      await deletePostBySlug(params.slug!);
      return redirect("/");
    } catch (error) {
      throw error;
    }
  }

  return Response.json({ error: "Invalid action" }, { status: 400 });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [{ title: "Post Not Found" }];
  }
  return [{ title: data.post.title }];
};

export default function PostSlug() {
  const { post } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);
  const isDeleting = navigation.state === "submitting" && 
    navigation.formData?.get("intent") === "delete";

  return (
    <div className="bg-background">
      <nav className="border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="text-2xl font-bold">
              Remix Blog
            </Link>
            <Link
              to="/admin/new"
              className={cn(buttonVariants())}
            >
              New Post
            </Link>
          </div>
        </div>
      </nav>

      <main className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-6">
          <Link
            to="/"
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            ← Back to all posts
          </Link>
        </div>

        <Card>
          {post.imageUrl && (
            <div className="w-full h-64 md:h-96 overflow-hidden rounded-t-lg">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <CardHeader>
            <div className="flex justify-between items-start gap-4">
              <CardTitle className="text-4xl flex-1">{post.title}</CardTitle>
              <div className="flex gap-2">
                <Link
                  to={`/admin/edit/${post.slug}`}
                  className={cn(buttonVariants({ size: "sm" }))}
                >
                  Edit
                </Link>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm" disabled={isDeleting}>
                      Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you sure?</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete "{post.title}"? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={isDeleting}
                      >
                        Cancel
                      </Button>
                      <Form method="post">
                        <input type="hidden" name="intent" value="delete" />
                        <Button
                          type="submit"
                          variant="destructive"
                          disabled={isDeleting}
                          onClick={() => setOpen(false)}
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </Button>
                      </Form>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap leading-relaxed">
              {post.content}
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}


