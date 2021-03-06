import React from 'react';
import Layout from '../src/design/Layout';
import { configure, addDecorator } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';

const stories = require.context('../src', true, /\/story\.(tsx?)$/);

const CenterDecorator = storyFn => {
  const a = storyFn()
  return <Layout>{a}</Layout>;
};
addDecorator(CenterDecorator);

configure(() => {
  return stories.keys().forEach(stories);
}, module);

setOptions({
  hierarchySeparator: /\/|\./, // matches a . or /
  hierarchyRootSeparator: /\|/, //matches a |
  name: 'Melonport',
  url: '#',
});
