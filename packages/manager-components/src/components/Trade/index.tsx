import React, { StatelessComponent } from 'react';
import { TabContent, Tabs } from '~/blocks/Tabs';
import OrderForm from '~/components/OrderForm';
import withActiveState from '~/containers/Trade';

import styles from './styles.css';

export interface OrderFormProps {
  activeTabIndex: string;
  setTabIndex(index: number);
  form: OrderForm;
}

export const Trade: StatelessComponent<OrderFormProps> = ({
  activeTabIndex,
  setTabIndex,
  form,
}) => {
  return (
    <Tabs
      handleTabClick={index => setTabIndex(index)}
      activeTabIndex={activeTabIndex}
    >
      <style jsx>{styles}</style>
      <TabContent title="Take">
        <OrderForm {...form} strategy="Market" />
      </TabContent>
      <TabContent title="Place">
        <OrderForm {...form} strategy="Limit" />
      </TabContent>
    </Tabs>
  );
};

export default (withActiveState)(Trade);
