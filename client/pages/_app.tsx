import { gql } from "@apollo/client";
import type { AppContext, AppProps } from "next/app";
import App from "next/app";
import { apolloClient } from "../lib/apollo";
import GlobalProvider from "../providers/GlobalProvider";
import "../styles/globals.scss";

const GET_GLOBAL = gql`
  {
    global {
      data {
        attributes {
          siteUrl
          siteName
          siteIcon {
            data {
              attributes {
                url
              }
            }
          }
          middleNavLinks {
            id
            text
            url
            isButton
          }
          rightNavLinks {
            id
            text
            url
            isButton
          }
          footerLinks {
            id
            text
            url
            isButton
          }
        }
      }
    }
  }
`;

function MyApp({ Component, pageProps }: AppProps) {
  const { data } = pageProps;

  return (
    <GlobalProvider value={data.global.data}>
      <Component {...pageProps} />
    </GlobalProvider>
  );
}

MyApp.getInitialProps = async (ctx: AppContext) => {
  // Calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(ctx);
  // Fetch global site settings from Strapi
  const { data } = await apolloClient.query({ query: GET_GLOBAL });
  // Pass the data to our page via props
  return { ...appProps, pageProps: { data } };
};

export default MyApp;
