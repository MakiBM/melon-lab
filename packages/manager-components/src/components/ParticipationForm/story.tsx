import { storiesOf } from '@storybook/react';
import React from 'react';
import ParticipationForm from './container';

const initialProps = {
  initialValues: {
    price: 1.0000,
    type: 'Invest',
  },
  decimals: 4,
  setup: true,
  dataValid: true,
  quoteAsset: 'WETH-T',
  fund: {
    sharePrice: 5
  }
};

storiesOf('Components|Participation Form', module).add('Default', () => {
  return <ParticipationForm {...initialProps} />;
});
