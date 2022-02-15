export interface PostType {
  id: string;
  attributes: {
    title: string;
    content: string;
    publishedAt: string;
    slug: string;
    author: { data: AuthorType };
    category: { data: CategoryType };
    cover: { data: ImageType };
  };
}

export interface CategoryType {
  id: string;
  attributes: {
    name: string;
    description: string;
    slug: string;
    posts: { data: PostType[] };
    cover: { data: ImageType };
  };
}

export interface AuthorType {
  id: string;
  attributes: {
    name: string;
    slug: string;
    description: string;
    avatar: { data: ImageType };
    posts: { data: PostType[] };
  };
}

export interface ImageType {
  attributes: {
    url: string;
    width: number;
    height: number;
    alternativeText: string;
  };
}

interface LinkType {
  id: string;
  text: string;
  url: string;
  isButton: boolean;
}

export type SocialPlatform =
  | "facebook"
  | "twitter"
  | "mail"
  | "medium"
  | "dev"
  | "instagram";

export interface SocialType {
  id: string;
  socialPlatform: SocialPlatform;
  url: string;
}

export interface GlobalType {
  attributes: {
    siteUrl: string;
    siteName: string;
    siteIcon: { data: ImageType };
    middleNavLinks: LinkType[];
    rightNavLinks: LinkType[];
    footerLinks: LinkType[];
    socials: SocialType[];
  };
}

export interface HomeType {
  attributes: {
    heading: string;
    subheading: string;
    newsletterHeading: string;
    newsletterSubheading: string;
    mainImage: { data: ImageType };
    featuredPosts: { data: PostType[] };
  };
}

export interface AboutType {
  attributes: {
    heading: string;
    content: string;
  };
}
