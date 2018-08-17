import isDev from 'electron-is-dev';
import Document, { Head, Main, NextScript } from 'next/document';
import flush from 'styled-jsx/server';

const sprites = require('svg-sprite-loader/runtime/sprite.build').stringify();

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    const { html, head, errorHtml, chunks } = renderPage();
    return { html, head, errorHtml, chunks, styles: flush() };
  }

  public render() {
    const csp = isDev ?
      `default-src 'self' 'unsafe-inline'; connect-src http://localhost:3000 ${process.env.JSON_RPC_ENDPOINT}; font-src data: http://localhost:3000;` :
      `default-src 'self' 'unsafe-inline'; connect-src ${process.env.JSON_RPC_ENDPOINT}; font-src data: file:;`;
    
    return (
      <html lang="en">
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
          <meta name="theme-color" content="#000000" />
          <meta httpEquiv="Content-Security-Policy" content={csp} />
          <link rel="manifest" href="./static/manifest.json" />
          <link rel="shortcut icon" href="./static/favicon.png?v=2" />
          <link rel="stylesheet" href="./static/css/semantic.min.css" />
          <link rel="stylesheet" href="./static/css/overwrites.css" />
          <title>Melon Olympiad</title>
        </Head>
        <body>
          <div dangerouslySetInnerHTML={{ __html: sprites }} />
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
