import Head from "next/head";
import { FC } from "react";

export interface SEOProps {
  title: string;
  description: string;
}

const SEO: FC<SEOProps> = ({ title, description }) => {
  const pageTitle = `${title} - Blog Starter`;

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content="http://localhost:3000/" />
      <meta property="og:type" content="website" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default SEO;
