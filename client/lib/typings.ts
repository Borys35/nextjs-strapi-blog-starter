export interface PostType {
  id: string;
  attributes: {
    title: string;
    content: string;
    publishedAt: string;
    slug: string;
    author: { data: AuthorType };
    cover: { data: ImageType };
  };
}

export interface CategoryType {
  id: string;
  attributes: {
    name: string;
    description: string;
    slug: string;
    cover: { data: ImageType };
  };
}

export interface AuthorType {
  id: string;
  attributes: {
    name: string;
    slug: string;
    avatar: { data: ImageType };
  };
}

export interface ImageType {
  attributes: {
    url: string;
  };
}
