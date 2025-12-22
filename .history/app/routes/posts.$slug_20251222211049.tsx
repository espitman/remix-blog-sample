import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigation } from "@remix-run/react";
import { deletePostBySlug, getPostBySlug } from "~/lib/post.server";

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
  const isDeleting = navigation.state === "submitting" && 
    navigation.formData?.get("intent") === "delete";

  const handleDelete = (e: React.FormEvent<HTMLFormElement>) => {
    if (!window.confirm("Are you sure you want to delete this post?\n\nThis action cannot be undone.")) {
      e.preventDefault();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="text-2xl font-bold text-gray-900">
              Remix Blog
            </Link>
            <Link
              to="/admin/new"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              New Post
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-6">
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-700 inline-block"
          >
            ← Back to all posts
          </Link>
        </div>

        <article className="bg-white rounded-lg shadow-md p-8 md:p-12">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-4xl font-bold text-gray-900 flex-1">
              {post.title}
            </h1>
            <div className="ml-4 flex gap-2">
              <Link
                to={`/admin/edit/${post.slug}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
              >
                Edit
              </Link>
              <Form method="post" onSubmit={handleDelete}>
                <input type="hidden" name="intent" value="delete" />
                <button
                  type="submit"
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </Form>
            </div>
          </div>
          <p className="text-gray-500 text-sm mb-8">
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {post.content}
            </p>
          </div>
        </article>
      </main>
    </div>
  );
}


