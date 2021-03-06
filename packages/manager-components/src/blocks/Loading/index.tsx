import React, { Fragment, StatelessComponent } from 'react';

import styles from './styles.css';

export interface LoadingProps {
  loading?: boolean;
  dataAvailable?: boolean;
}

const Loading: StatelessComponent<LoadingProps> = ({
  children,
  loading = true,
  dataAvailable = true,
}) => {
  return (
    <span>
      <style jsx>{styles}</style>
      {loading ? (
        <Fragment>
          <span className="loading__item">.</span>
          <span className="loading__item">.</span>
          <span className="loading__item">.</span>
        </Fragment>
      ) : (
        <Fragment>
          {dataAvailable ? (
            <Fragment>{children}</Fragment>
          ) : (
            <span className="loading__invalid">{children}</span>
          )}
        </Fragment>
      )}
    </span>
  );
};

export default Loading;
