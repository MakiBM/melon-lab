// @flow
import setup from "../../utils/setup";
import toReadable from "../../assets/utils/toReadable";
import getSymbol from "../../assets/utils/getSymbol";
import getConfig from "../../version/calls/getConfig";
import getExchangeAdapterContract from "../contracts/getExchangeAdapterContract";

import type { Order, RawOrder } from "../schemas/Order";

/**
 * Gets the normalised order from the exchange specified by `id`.
 * Only if the order is active, it has the fields `buy` and `sell`
 */
const getOrder = async (id: number): Promise<Order> => {
  const exchangeAdapterContract = await getExchangeAdapterContract();

  const config = await getConfig();

  const isActive: boolean = await exchangeAdapterContract.isActive(
    config.exchangeAddress,
    id,
  );
  const owner: string = await exchangeAdapterContract.getOwner(
    config.exchangeAddress,
    id,
  );
  const order: RawOrder = await exchangeAdapterContract.getOrder(
    config.exchangeAddress,
    id,
  );

  const [sellWhichToken, buyWhichToken, sellHowMuch, buyHowMuch] = order;

  const enhancedOrder = {
    id: id instanceof setup.web3.BigNumber ? id.toNumber() : id,
    owner,
    isActive,
  };

  // inactive orders have token set to 0x0000... so only enhance active orders
  if (isActive) {
    const sellSymbol = getSymbol(sellWhichToken);
    const buySymbol = getSymbol(buyWhichToken);

    enhancedOrder.sell = {
      symbol: sellSymbol,
      howMuch: toReadable(sellHowMuch, sellSymbol),
    };

    enhancedOrder.buy = {
      symbol: buySymbol,
      howMuch: toReadable(buyHowMuch, buySymbol),
    };
  }
  return enhancedOrder;
};

export default getOrder;
