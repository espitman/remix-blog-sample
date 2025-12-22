import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { createPost, validatePostData } from "~/lib/post.server";

export const meta: MetaFunction = () => {
  return [{ title: "Create New Post - Remix Blog" }];
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const title = formData.get("title");
  const slug = formData.get("slug");
  const content = formData.get("content");

  // Validation
  if (!title || !slug || !content) {
    return json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  if (typeof title !== "string" || typeof slug !== "string" || typeof content !== "string") {
    return json(
      { error: "Invalid form data" },
      { status: 400 }
    );
  }

  // Check if slug already exists
  const existingPost = await db.post.findUnique({
    where: { slug },
  });

  if (existingPost) {
    return json(
      { error: "A post with this slug already exists" },
      { status: 400 }
    );
  }

  try {
    await db.post.create({
      data: {
        title,
        slug,
        content,
      },
    });

    return redirect("/");
  } catch (error) {
    return json(
      { error: "Failed to create post. Please try again." },
      { status: 500 }
    );
  }
}

export default function AdminNew() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <a href="/" className="text-2xl font-bold text-gray-900">
              Remix Blog
            </a>
            <a
              href="/"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Back to Posts
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Create New Post</h1>

        <Form method="post" className="bg-white rounded-lg shadow-md p-8">
          {actionData?.error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm">{actionData.error}</p>
            </div>
          )}

          <div className="mb-6">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter post title"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="slug"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Slug (URL-friendly identifier)
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., my-first-post"
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              title="Slug must contain only lowercase letters, numbers, and hyphens"
            />
            <p className="mt-1 text-xs text-gray-500">
              Use lowercase letters, numbers, and hyphens only
            </p>
          </div>

          <div className="mb-6">
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Content
            </label>
            <textarea
              id="content"
              name="content"
              required
              rows={12}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Write your post content here..."
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating..." : "Create Post"}
            </button>
            <a
              href="/"
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </a>
          </div>
        </Form>
      </main>
    </div>
  );
}


