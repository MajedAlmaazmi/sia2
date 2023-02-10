import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/layout";
import {
  Readex_Pro,
  Amiri,
  Tajawal,
  Noto_Sans_Arabic,
  Noto_Kufi_Arabic,
  Vazirmatn,
  Alexandria,
  Markazi_Text,
  Noto_Naskh_Arabic,
  El_Messiri,
  Changa,
} from "@next/font/google";

// If loading a variable font, you don't need to specify the font weight
const inter = Noto_Kufi_Arabic({
  weight: "variable",
  subsets: ["arabic"],
});
export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={inter.className}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </div>
  );
}
