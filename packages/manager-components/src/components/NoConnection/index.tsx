import React, { StatelessComponent } from 'react';

import styles from './styles.css';

const NoConnection: StatelessComponent = () => {
  return (
    <div className="no-connection">
      <style jsx>{styles}</style>
      <h3>Welcome to the future of investment funds</h3>
      <p>
        It seems like you are not connected to the ethereum network. Check your
        internet connection. If you are running your own node, make you are
        synced and have enough peers connected.
      </p>
    </div>
  );
};

export default NoConnection;
