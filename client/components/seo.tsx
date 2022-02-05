import Head from "next/head";
import { FC } from "react";
import { API_URL } from "../lib/apollo";
import { useGlobal } from "../providers/GlobalProvider";

export interface SEOProps {
  title: string;
  description: string;
}

const SEO: FC<SEOProps> = ({ title, description }) => {
  const {
    attributes: { siteName, siteUrl, siteIcon },
  } = useGlobal();

  const pageTitle = `${title} - ${siteName}`;

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:type" content="website" />
      <link rel="icon" href={`${API_URL}${siteIcon.data.attributes.url}`} />
    </Head>
  );
};

export default SEO;
