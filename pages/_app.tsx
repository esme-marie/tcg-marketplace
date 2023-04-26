import Header from "../components/Header";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <header>
        <Header Logo={undefined} />
      </header>
      <div className={poppins.className}>
        <Component {...pageProps} />
      </div>
    </>
  );
}
