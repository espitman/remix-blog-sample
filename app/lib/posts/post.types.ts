export type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreatePostData = {
  title: string;
  slug: string;
  content: string;
  imageUrl?: string | null;
};

export type UpdatePostData = {
  title: string;
  slug: string;
  content: string;
  imageUrl?: string | null;
};

export type ValidationResult = {
  isValid: boolean;
  error?: string;
  data?: CreatePostData;
};

