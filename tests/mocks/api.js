import BigNumber from "bignumber.js";

import orderBook from "../fixtures/blockChainOrders";
import recentTrades from "../fixtures/recentTrades";

const contract = {
  offers: jest.fn(
    id =>
      new Promise(resolve => {
        resolve(orderBook.find(o => o.id === id).data);
      }),
  ),
  getOrder: jest.fn(
    (consigned, id) =>
      new Promise(resolve => {
        resolve(orderBook.find(o => o.id === id).data);
      }),
  ),
  takeOrder: jest.fn(
    () =>
      new Promise(resolve =>
        resolve({ logs: [{ event: "OrderUpdated", args: { id: 1 } }] }),
      ),
  ),
  makeOrder: jest.fn(
    () =>
      new Promise(resolve =>
        resolve({ logs: [{ event: "OrderUpdated", args: { id: 1 } }] }),
      ),
  ),
  balanceOf: jest.fn(
    (/* ofAddress */) =>
      new Promise(resolve => {
        resolve(new BigNumber(10000000000000000000));
      }),
  ),
  totalSupply: jest.fn(
    () =>
      new Promise(resolve => {
        resolve(new BigNumber(1000000000000000000000));
      }),
  ),
  transfer: jest.fn(
    (/* toAddress, quantity { from: fromAddress } */) =>
      new Promise(resolve => {
        resolve({ logs: [{ event: "Transfer", args: { id: 1 } }] });
      }),
  ),
  approve: jest.fn(
    (/* toAddress, quantity, { from: fromAddress } */) =>
      new Promise(resolve => {
        resolve({ logs: [{ event: "Approval", args: { id: 1 } }] });
      }),
  ),
  transferFrom: jest.fn(
    (/* fromAddress, toAddress, quantity */) =>
      new Promise(resolve => {
        resolve({ logs: [{ event: "Transfer", args: { id: 1 } }] });
      }),
  ),
  allowance: jest.fn(
    (/* ownerAddress, spenderAddress */) =>
      new Promise(resolve => {
        resolve(new BigNumber(6000000000000000000));
      }),
  ),
  /* universe methods */
  /* **************** */
  numAssignedAssets: jest.fn(
    () => new Promise(resolve => resolve(new BigNumber(10))),
  ),
  getMelonAsset: jest.fn(() => new Promise(resolve => resolve("0xMLN"))),
  getReferenceAsset: jest.fn(() => new Promise(resolve => resolve("0xETH"))),
  assetAt: jest.fn(i => new Promise(resolve => resolve(`0xTOKEN_${i}`))),
  exchangeAt: jest.fn(() => new Promise(resolve => resolve("0xEXCHANGE"))),
  priceFeedAt: jest.fn(() => new Promise(resolve => resolve("0xPRICEFEED"))),
  setupFund: jest.fn(
    () =>
      new Promise(resolve =>
        resolve({
          logs: [
            {
              event: "FundUpdated",
              args: {
                id: new BigNumber(1),
              },
            },
          ],
        }),
      ),
  ),
  getFundById: jest.fn(() => new Promise(resolve => resolve("0xVAULT"))),
  getFundByManager: jest.fn(() => new Promise(resolve => resolve("0xVAULT"))),
  getLastOrderId: jest.fn(
    () => new Promise(resolve => resolve(new BigNumber(8))),
  ),
  LogTake: jest.fn(() => ({
    get: jest.fn(callback => callback(null, recentTrades)),
  })),
  isActive: jest.fn(() => new Promise(resolve => resolve(true))),
  getOwner: jest.fn(() => new Promise(resolve => resolve("0xMANAGER"))),
  avatar: jest.fn(() => new Promise(resolve => resolve(true))),
  info: jest.fn(
    () =>
      new Promise(resolve =>
        resolve([
          "0xMANAGER",
          "Test Fund",
          "MLN-T",
          new BigNumber(18),
          new BigNumber(1505292372),
          new BigNumber(0),
        ]),
      ),
  ),
  getName: jest.fn(() => new Promise(resolve => resolve("TESTFUND"))),
  getDecimals: jest.fn(
    () => new Promise(resolve => resolve(new BigNumber(18))),
  ),
  getDataFeed: jest.fn(() => new Promise(resolve => resolve("0xDATAFEED"))),
  getExchange: jest.fn(() => new Promise(resolve => resolve("0xSIMPLEMARKET"))),
  getCreationTime: jest.fn(
    () => new Promise(resolve => resolve(new BigNumber(1505292372))),
  ),
  isShutDown: jest.fn(() => new Promise(resolve => resolve(false))),
  owner: jest.fn(() => new Promise(resolve => resolve("0xMANAGER"))),
  numRegisteredAssets: jest.fn(
    () => new Promise(resolve => resolve(new BigNumber(18))),
  ),
  getRegisteredAssetAt: jest.fn(() => new Promise(resolve => resolve("0x"))),
  information: jest.fn(
    () =>
      new Promise(resolve =>
        resolve([
          "0x64C4406C58C512f326d83065a72F12884105520b",
          "Status Network Token",
          new BigNumber(18),
          "https://status.im/",
        ]),
      ),
  ),
  getQuoteAsset: jest.fn(
    () =>
      new Promise(resolve =>
        resolve("0x2a20ff70596e431ab26C2365acab1b988DA8eCCF"),
      ),
  ),
};

contract.setupFund.estimateGas = jest.fn(() => 650000);
contract.approve.estimateGas = jest.fn(() => 50000);
contract.transferFrom.estimateGas = jest.fn(() => 50000);
contract.transfer.estimateGas = jest.fn(() => 50000);
contract.takeOrder.estimateGas = jest.fn(() => 50000);
contract.makeOrder.estimateGas = jest.fn(() => 50000);

const api = {
  newContract: jest.fn(),
  // setProvider: jest.fn(),
  // at: jest.fn(() => contract),
  // deployed: jest.fn(() => contract),
};

const constructor = jest.fn(() => api);
constructor.mockInspect = { contract, api };

export default constructor;
