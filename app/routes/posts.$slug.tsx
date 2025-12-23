import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
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
import { ArrowRight } from "lucide-react";

export async function loader({ params }: LoaderFunctionArgs) {
  const post = await getPostBySlug(params.slug!);
  return json({ post });
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

  return json({ error: "Invalid action" }, { status: 400 });
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
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              وبلاگ Remix
            </Link>
            <Link
              to="/admin/new"
              className={cn(buttonVariants())}
            >
              پست جدید
            </Link>
          </div>
        </div>
      </nav>

      <main className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-6">
          <Link
            to="/"
            className={cn(buttonVariants({ variant: "ghost" }), "flex items-center gap-2")}
          >
            بازگشت به همه پست‌ها
            <ArrowRight className="w-4 h-4" />
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
              <CardTitle className="text-4xl flex-1 text-right">{post.title}</CardTitle>
              <div className="flex gap-2">
                <Link
                  to={`/admin/edit/${post.slug}`}
                  className={cn(buttonVariants({ size: "sm" }))}
                >
                  ویرایش
                </Link>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm" disabled={isDeleting}>
                      حذف
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="text-right">
                    <DialogHeader>
                      <DialogTitle>آیا مطمئن هستید؟</DialogTitle>
                      <DialogDescription>
                        آیا مطمئن هستید که می‌خواهید "{post.title}" را حذف کنید؟ این عمل قابل بازگشت نیست.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={isDeleting}
                      >
                        انصراف
                      </Button>
                      <Form method="post">
                        <input type="hidden" name="intent" value="delete" />
                        <Button
                          type="submit"
                          variant="destructive"
                          disabled={isDeleting}
                          onClick={() => setOpen(false)}
                        >
                          {isDeleting ? "در حال حذف..." : "حذف"}
                        </Button>
                      </Form>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2 text-right">
              {new Date(post.createdAt).toLocaleString("fa-IR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap leading-relaxed text-right">
              {post.content}
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}


