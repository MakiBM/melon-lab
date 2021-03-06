// @flow
import BigNumber from 'bignumber.js';

import takeOrder from './takeOrder';

/**
 * Takes multiple orders from fund at `fundAddress` upon to `fillTakerTokenAmount`
 * @param orders sorted and filtered orders by matchOrders
 */
const takeMultipleOrders = async (
  environment,
  { orders, fundAddress, fillTakerTokenAmount, exchangeNumber = 0 },
): Promise<BigNumber> =>
  orders.reduce(async (accumulatorPromise: Promise<*>, currentOrder: any) => {
    let remainingQuantity = await accumulatorPromise;
    if (remainingQuantity.gt(0)) {
      const result = await takeOrder(environment, {
        fundAddress,
        exchangeAddress: currentOrder.exchangeContractAddress,
        maker: currentOrder.maker,
        taker: currentOrder.taker,
        makerAssetSymbol: currentOrder.sell.symbol,
        takerAssetSymbol: currentOrder.buy.symbol,
        feeRecipient: currentOrder.feeRecipient,
        makerQuantity: currentOrder.sell.howMuch,
        takerQuantity: currentOrder.buy.howMuch,
        makerFee: currentOrder.makerFee,
        takerFee: currentOrder.takerFee,
        timestamp: currentOrder.expiration,
        salt: currentOrder.salt,
        fillTakerTokenAmount: remainingQuantity,
        identifier: currentOrder.id,
        signature: currentOrder.signature,
      });
      remainingQuantity = remainingQuantity.minus(result.executedQuantity);
    }

    return remainingQuantity;
  }, Promise.resolve(new BigNumber(fillTakerTokenAmount)));

export default takeMultipleOrders;
