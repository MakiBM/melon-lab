// @flow
import approve from '../../assets/transactions/approve';
import findEventInLog from '../../utils/ethereum/findEventInLog';
import getAddress from '../../assets/utils/getAddress';
import getConfig from '../../version/calls/getConfig';
import getOrder from '../../exchange/calls/getOrder';
import getSimpleMarketContract from '../contracts/getSimpleMarketContract';
import rush from '../../utils/generic/rush';
import sendTransaction from '../../utils/parity/sendTransaction';
import toProcessable from '../../assets/utils/toProcessable';

import type { Environment } from '../../utils/environment/Environment';
import type { Order } from '../schemas/Order';

type Argument = Object &
  Order & {
    timeout: number,
  };

/**
 * Make an order directly on the deployed SimpleMarket
 * @param {Order} argument order and more
 * @param argument.timeout wait time for the transaction
 */
const makeOrderFromAccount = async (
  environment: Environment,
  {
    sell: { howMuch: sellHowMuch, symbol: sellSymbol },
    buy: { howMuch: buyHowMuch, symbol: buySymbol },
    timeout = 50 * 1000,
  }: Argument,
): Promise<Order> => {
  const config = await getConfig(environment);
  const simpleMarketContract = await getSimpleMarketContract(environment);
  const approvePromise = approve(environment, {
    symbol: sellSymbol,
    spender: simpleMarketContract.address,
    quantity: sellHowMuch,
  });

  await rush(
    approvePromise,
    `Approve took longer that 30 seconds. ${sellHowMuch.toString()} ${sellSymbol} ${
      simpleMarketContract.address
    }`,
    timeout,
  );

  const args = [
    toProcessable(config, sellHowMuch, sellSymbol),
    getAddress(config, sellSymbol),
    toProcessable(config, buyHowMuch, buySymbol),
    getAddress(config, buySymbol),
    0,
  ];

  const receipt = await sendTransaction(
    simpleMarketContract,
    'offer',
    args,
    environment,
    {},
  );

  const updateLog = findEventInLog('LogItemUpdate', receipt);
  const orderId = updateLog.params.id.value;

  if (!receipt || !orderId)
    throw new Error(
      `Error with make on Simple Market: \n ${JSON.stringify(
        receipt,
        null,
        4,
      )}`,
    );
  const createdOrder = await getOrder(environment, { id: orderId });
  return createdOrder;
};

export default makeOrderFromAccount;
