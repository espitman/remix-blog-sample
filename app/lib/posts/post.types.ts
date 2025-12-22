export type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreatePostData = {
  title: string;
  slug: string;
  content: string;
};

export type UpdatePostData = {
  title: string;
  slug: string;
  content: string;
};

export type ValidationResult = {
  isValid: boolean;
  error?: string;
  data?: CreatePostData;
};

