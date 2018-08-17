import App, { Container } from 'next/app';
import { ApolloProvider } from 'react-apollo';
import React from 'react';
import ReactModal from 'react-modal';
import withApollo from '~/wrappers/withApollo';

const debug = require('debug')('melon-lab:manager-interface:index');

if (typeof window !== 'undefined') {
  debug('Starting frontend:', {
    release: {
      'manager-interface': __MANAGER_INTERFACE_VERSION__,
      'smart-contracts': __SMART_CONTRACTS_VERSION__,
      'melon.js': __MELON_JS_VERSION__,
    },
  });

  console.log(
    '%c👋🤓',
    'background: rgba(0,0,0,.87); color: #fffdf3; font-size: 30px',
  );

  console.log(
    '%cHello nerd. Checking out the internals of the ipfs-frontend? We like that! If you want to work with us, send us a message: team@melonport.com.',
    'background: rgba(0,0,0,.87); color: #fffdf3; font-size: 12px',
  );

  window.eval = global.eval = () => {
    throw new Error(`Sorry, this app does not support window.eval().`);
  };

  if (process.env.NODE_ENV !== 'development') {
    window.onbeforeunload = () =>
      "Your session will be terminated. Did you save your mnemonic and/or JSON wallet?";
  }

  ReactModal.setAppElement('#__next');
}


class MelonApp extends App {
  public render() {
    const { Component, apollo, pageProps } = this.props;

    return (
      <Container>
        <ApolloProvider client={apollo}>
          <Component {...pageProps} />
        </ApolloProvider>
      </Container>
    );
  }
}

export default withApollo(MelonApp);
