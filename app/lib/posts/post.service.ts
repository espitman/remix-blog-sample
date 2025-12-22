import { db } from "../db/index.server";
import type { CreatePostData, UpdatePostData, ValidationResult } from "./post.types";

export type { Post, CreatePostData, UpdatePostData } from "./post.types";

/**
 * Get all posts ordered by creation date (newest first)
 */
export async function getAllPosts() {
  return db.post.findMany({
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Get a post by slug
 * @throws {Error} If post not found
 */
export async function getPostBySlug(slug: string) {
  const post = await db.post.findUnique({
    where: { slug },
  });

  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }

  return post;
}

/**
 * Get a post by ID
 */
export async function getPostById(id: string) {
  return db.post.findUnique({
    where: { id },
  });
}

/**
 * Check if a slug already exists
 */
export async function slugExists(slug: string): Promise<boolean> {
  const post = await db.post.findUnique({
    where: { slug },
  });
  return post !== null;
}

/**
 * Validate post data
 */
export function validatePostData(data: {
  title: unknown;
  slug: unknown;
  content: unknown;
  imageUrl?: unknown;
}): ValidationResult {
  const { title, slug, content, imageUrl } = data;

  if (!title || !slug || !content) {
    return {
      isValid: false,
      error: "Title, slug, and content are required",
    };
  }

  if (
    typeof title !== "string" ||
    typeof slug !== "string" ||
    typeof content !== "string"
  ) {
    return {
      isValid: false,
      error: "Invalid form data",
    };
  }

  // imageUrl is optional, but if provided must be a string
  if (imageUrl !== undefined && imageUrl !== null && typeof imageUrl !== "string") {
    return {
      isValid: false,
      error: "Image URL must be a valid string",
    };
  }

  return {
    isValid: true,
    data: { 
      title, 
      slug, 
      content,
      imageUrl: imageUrl && typeof imageUrl === "string" ? imageUrl : null,
    },
  };
}

/**
 * Create a new post
 */
export async function createPost(data: CreatePostData) {
  // Check if slug already exists
  if (await slugExists(data.slug)) {
    throw new Error("A post with this slug already exists");
  }

  return db.post.create({
    data,
  });
}

/**
 * Update a post by slug
 */
export async function updatePost(
  currentSlug: string,
  data: UpdatePostData
) {
  // Check if post exists
  const currentPost = await getPostBySlug(currentSlug);
  if (!currentPost) {
    throw new Error("Post not found");
  }

  // Check if new slug already exists (and it's not the current post)
  if (data.slug !== currentSlug) {
    if (await slugExists(data.slug)) {
      throw new Error("A post with this slug already exists");
    }
  }

  return db.post.update({
    where: { slug: currentSlug },
    data,
  });
}

/**
 * Delete a post by ID
 */
export async function deletePostById(id: string) {
  const post = await getPostById(id);
  if (!post) {
    throw new Error("Post not found");
  }

  return db.post.delete({
    where: { id },
  });
}

/**
 * Delete a post by slug
 */
export async function deletePostBySlug(slug: string) {
  const post = await getPostBySlug(slug);
  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }

  return db.post.delete({
    where: { slug },
  });
}

