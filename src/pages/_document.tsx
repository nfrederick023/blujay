import Document, { Head, Html, Main, NextScript } from "next/document";

import { ReactElement } from "react";
import React from "react";

class MyDocument extends Document {
  render(): ReactElement {
    return (
      <Html>
        <Head>
          <link rel="icon" href="/images/favicon.ico" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Montserrat:wght@900"
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700"
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500"
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Montserrat"
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css"
            integrity="sha512-SzlrxWUlpfuzQ+pcUCosxcglQRNAq/DZjVsC0lE40xsADsfeQoEypE+enwcOiGjk/bSuGGKHEyjSoQ1zVisanQ=="
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
