import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigation } from "@remix-run/react";
import { useState } from "react";
import { deletePostById, getAllPosts } from "~/lib/posts/post.service";
import { Button, buttonVariants } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
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

export const meta: MetaFunction = () => {
  return [
    { title: "Remix Blog" },
    { name: "description", content: "Welcome to Remix Blog!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const posts = await getAllPosts();
  return Response.json({ posts });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const postId = formData.get("postId");

  if (intent === "delete" && postId && typeof postId === "string") {
    try {
      await deletePostById(postId);
      return redirect("/");
    } catch (error) {
      return Response.json(
        { error: error instanceof Error ? error.message : "Post not found" },
        { status: 404 }
      );
    }
  }

  return Response.json({ error: "Invalid action" }, { status: 400 });
}

function DeleteDialog({ postId, postTitle, isDeleting }: { postId: string; postTitle: string; isDeleting: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          disabled={isDeleting}
          onClick={(e) => e.stopPropagation()}
          className="flex-1"
        >
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{postTitle}"? This action cannot be undone.
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
          <Form method="post" className="inline">
            <input type="hidden" name="intent" value="delete" />
            <input type="hidden" name="postId" value={postId} />
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
  );
}

export default function Index() {
  const { posts } = useLoaderData<typeof loader>();
  const navigation = useNavigation();

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

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">All Posts</h1>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">No posts yet.</p>
            <Link
              to="/admin/new"
              className={cn(buttonVariants({ variant: "link" }))}
            >
              Create your first post
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const isDeleting = navigation.state === "submitting" && 
                navigation.formData?.get("postId") === post.id;
              
              return (
                <Card key={post.id} className="hover:shadow-lg transition-shadow">
                  {post.imageUrl && (
                    <Link to={`/posts/${post.slug}`}>
                      <div className="w-full h-48 overflow-hidden rounded-t-lg">
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </Link>
                  )}
                  <CardHeader>
                    <Link to={`/posts/${post.slug}`}>
                      <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                      <CardDescription className="line-clamp-3 mt-2">
                        {post.content.substring(0, 150)}
                        {post.content.length > 150 ? "..." : ""}
                      </CardDescription>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Link
                      to={`/admin/edit/${post.slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className={cn(buttonVariants({ variant: "default", size: "sm" }), "flex-1 text-center")}
                    >
                      Edit
                    </Link>
                    <DeleteDialog postId={post.id} postTitle={post.title} isDeleting={isDeleting} />
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}


