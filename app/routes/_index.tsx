import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigation } from "@remix-run/react";
import { useState } from "react";
import { deletePostById, getAllPosts, type Post } from "~/lib/posts/post.service";
import { getAccommodations } from "~/lib/accommodations/accommodation.service";
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
import { AccommodationCarousel } from "~/components/accommodation-carousel";

export const meta: MetaFunction = () => {
  return [
    { title: "Remix Blog" },
    { name: "description", content: "Welcome to Remix Blog!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const [posts, accommodations] = await Promise.all([
    getAllPosts(),
    getAccommodations({ pageSize: 10, pageNumber: 1 }),
  ]);
  
  return json({ 
    posts, 
    accommodations 
  });
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
      return json(
        { error: error instanceof Error ? error.message : "Post not found" },
        { status: 404 }
      );
    }
  }

  return json({ error: "Invalid action" }, { status: 400 });
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
  const { posts, accommodations } = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  return (
    <div className="bg-background min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Remix Blog
            </Link>
            <Link
              to="/admin/new"
              className={cn(buttonVariants({ variant: "default" }))}
            >
              New Post
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-background border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Welcome to{" "}
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Remix Blog
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Discover amazing accommodations and read our latest posts
              </p>
            </div>
          </div>
        </section>

        {/* Accommodations Section */}
        {accommodations.length > 0 && (
          <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <AccommodationCarousel accommodations={accommodations} />
          </section>
        )}

        {/* Posts Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Latest Posts</h2>
              <p className="text-muted-foreground mt-2">
                Explore our collection of articles and stories
              </p>
            </div>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-16 md:py-24">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
                <p className="text-muted-foreground mb-6">
                  Get started by creating your first blog post
                </p>
                <Link
                  to="/admin/new"
                  className={cn(buttonVariants({ variant: "default", size: "lg" }))}
                >
                  Create your first post
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => {
                const isDeleting = navigation.state === "submitting" && 
                  navigation.formData?.get("postId") === post.id;
                
                return (
                  <Card 
                    key={post.id} 
                    className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border-2 hover:border-primary/20"
                  >
                    {post.imageUrl ? (
                      <Link to={`/posts/${post.slug}`}>
                        <div className="w-full h-56 overflow-hidden relative">
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </Link>
                    ) : (
                      <div className="w-full h-56 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                        <svg
                          className="w-16 h-16 text-primary/30"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                    )}
                    <CardHeader className="pb-3">
                      <Link to={`/posts/${post.slug}`}>
                        <CardTitle className="line-clamp-2 text-xl group-hover:text-primary transition-colors">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-3 mt-3 text-sm">
                          {post.content.substring(0, 150)}
                          {post.content.length > 150 ? "..." : ""}
                        </CardDescription>
                      </Link>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>
                          {new Date(post.createdAt).toLocaleString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2 pt-4">
                      <Link
                        to={`/admin/edit/${post.slug}`}
                        onClick={(e) => e.stopPropagation()}
                        className={cn(buttonVariants({ variant: "outline", size: "sm" }), "flex-1")}
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
        </section>
      </main>
    </div>
  );
}


