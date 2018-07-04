import React from 'react';
import { Card } from 'semantic-ui-react';

import { tracks } from '@melonproject/melon.js';

import Factsheet from '../../containers/Factsheet';
import Holdings from '../../containers/Holdings';
import Administration from '../../containers/Administration';
import Orderbook from '../../containers/Orderbook';
import RecentTrades from '../../containers/RecentTrades';
import TradeHistory from '../../containers/TradeHistory';
import GetStarted from '../../containers/GetStarted';
import Participation from '../../containers/Participation';
import ExecuteRequest from '../../containers/ExecuteRequest';
import TradeHelper from '../../containers/TradeHelper';
import OpenOrders from '../../containers/OpenOrders';
import Layout from '@melonproject/manager-components/design/Layout';
import Trade from '@melonproject/manager-components/components/Trade/container';

const Fund = ({
  isManager,
  fundAddress,
  canInvest,
  pendingRequest,
  isCompetition,
  orderForm,
  onSubmit,
}) => (
  <div className="App">
    <br />
    <div>
      <Card.Group>
        <Factsheet />
        {!isCompetition && isManager ? <Administration /> : <GetStarted />}
        {!isCompetition && canInvest && !pendingRequest ? (
          <Participation />
        ) : (
          <div />
        )}
        {!isCompetition && canInvest && pendingRequest ? (
          <ExecuteRequest />
        ) : (
          <div />
        )}
        {!isCompetition && !canInvest ? <Card /> : <div />}
      </Card.Group>
      <br />
      <Holdings address={fundAddress} />
      <br />
      {isManager ? (
        <div>
          <h3>Trade</h3>
          <Trade form={{ ...orderForm, onSubmit: onSubmit }} />
        </div>
      ) : (
        <div />
      )}
      <br />
      <Orderbook />
      <br />
      <OpenOrders address={fundAddress} />
      <br />
      <RecentTrades />
      <br />
      <TradeHistory address={fundAddress} />
    </div>
    <br />
  </div>
);

export default Fund;
