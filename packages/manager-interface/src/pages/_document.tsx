import Document, { Head, Main, NextScript } from 'next/document';
import React from 'react';

const electron = process.env.ELECTRON;

export default class MyDocument extends Document {
  public static async getInitialProps(context) {
    const initialProps = await Document.getInitialProps(context);
    return { ...initialProps };
  }

  public render() {
    return (
      <html lang="en">
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <meta name="theme-color" content="#000000" />
          {electron && (
            <meta
              http-equiv="Content-Security-Policy"
              content="default-src 'self' 'unsafe-inline'; connect-src https://kovan.melonport.com kovan.melonport.com kovan.melonport.com:443; font-src data: file:;"
            />
          )}
          <link rel="manifest" href="./static/manifest.json" />
          <link rel="shortcut icon" href="./static/favicon.png?v=2" />
          <link rel="stylesheet" href="./static/css/semantic.min.css" />
          <link rel="stylesheet" href="./static/css/overwrites.css" />
          <script src="./static/tracking.js" />
          <title>Melon Olympiad</title>
        </Head>
        <body style={{ padding: '2em 1em' }}>
          <Main />
          <NextScript />

          <div
            style={{
              textAlign: 'center',
              marginTop: '2em',
              marginBottom: '2em',
            }}
          >
            Hosted with ❤ on IPFS |
            <a
              href="https://github.com/melonproject/ipfs-frontend/issues"
              target="_blank"
            >
              {' '}
              Report an issue
            </a>{' '}
            |
            <a href="https://www.melonport.com" target="_blank">
              {' '}
              Melonport
            </a>
          </div>
        </body>
      </html>
    );
  }
}
