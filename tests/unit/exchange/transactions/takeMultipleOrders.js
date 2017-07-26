import BigNumber from "bignumber.js";

import matchedOrders from "../../../fixtures/matchedOrders";

import takeMultipleOrders from "../../../../lib/exchange/transactions/takeMultipleOrders";

// eslint-disable-next-line global-require
jest.mock("truffle-contract", () => require("../../../mocks/truffle-contract"));

test("buy 1.5 MLN from two orders: one full and one partial", async () => {
  const result = await takeMultipleOrders(
    matchedOrders,
    "0xMANAGER",
    "0xVAULT",
    new BigNumber(1.5),
  );

  expect(result).toBeTruthy();
  expect(result.remainingQuantity.eq(0)).toBeTruthy();
  expect(result.transactions).toHaveLength(2);
});
