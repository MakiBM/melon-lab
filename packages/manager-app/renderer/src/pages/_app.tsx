import App, { Container } from 'next/app';
import ReactModal from 'react-modal';

if (typeof window !== 'undefined') {
  window.eval = global.eval = () => {
    throw new Error('Sorry, this app does not support window.eval().');
  };

  ReactModal.setAppElement('#__next');
}

class MelonApp extends App {
  public render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <Component {...pageProps} />
      </Container>
    );
  }
}

export default MelonApp;
