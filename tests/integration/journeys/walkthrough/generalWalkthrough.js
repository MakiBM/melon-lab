import BigNumber from "bignumber.js";

import setup from "../../../../lib/utils/setup";
import getConfig from "../../../../lib/version/calls/getConfig";
import trace from "../../../../lib/utils/trace";
import getBalance from "../../../../lib/assets/calls/getBalance";
import setupFund from "../../../../lib/version/transactions/setupFund";
import getFundForManager from "../../../../lib/version/calls/getFundForManager";
import getParticipation from "../../../../lib/participation/calls/getParticipation";
import subscribe from "../../../../lib/participation/transactions/subscribe";
import executeRequest from "../../../../lib/participation/transactions/executeRequest";
import awaitDataFeedUpdates from "../../../../lib/datafeeds/events/awaitDataFeedUpdates";
import makeOrderFromFund from "../../../../lib/fund/transactions/makeOrderFromFund";
import makeOrder from "../../../../lib/exchange/transactions/makeOrder";
import cancelOrder from "../../../../lib/exchange/transactions/cancelOrder";
import getOrderbook from "../../../../lib/exchange/calls/getOrderbook";
import takeOrderFromFund from "../../../../lib/fund/transactions/takeOrderFromFund";
// import redeem from "../../../../lib/participation/transactions/redeem";

const INITIAL_SUBSCRIBE_QUANTITY = 30;
// const REDEEM_QUANTITY = 5;

const shared = { etherBalance: {}, participation: {}, melonBalance: {} };

const randomString = (length = 4) =>
  Math.random().toString(36).substr(2, length);

it(
  "Create fund, invest, take order, redeem",
  async () => {
    console.log("\n");

    expect(setup.web3.eth.syncing).toBeFalsy();

    shared.etherBalance.initial = setup.web3.fromWei(
      setup.web3.eth.getBalance(setup.defaultAccount),
    );
    expect(shared.etherBalance.initial.toFixed()).toBeGreaterThan(
      INITIAL_SUBSCRIBE_QUANTITY,
    );
    trace({
      message: `Start walkthrough with defaultAccount: ${setup.defaultAccount}`,
      data: setup,
    });
    trace({ message: `Etherbalance: Ξ${shared.etherBalance.initial} ` });
    shared.melonBalance.initial = await getBalance("MLN-T");
    trace({ message: `Melon Balance: Ⓜ  ${shared.melonBalance.initial} ` });

    shared.config = await getConfig();
    trace({
      message: `Got config w exchange at ${shared.config
        .exchangeAddress}, and datafeed at ${shared.config.dataFeedAddress}`,
      data: shared.config,
    });

    shared.vaultName = `test-${randomString()}`;
    shared.vault = await setupFund(shared.vaultName);
    expect(shared.vault.name).toBe(shared.vaultName);
    expect(shared.vault.id).toBeGreaterThanOrEqual(0);
    expect(shared.vault.address).toBeTruthy();
    expect(shared.vault.timestamp instanceof Date).toBeTruthy();
    trace({
      message: `vaultCreated: ${shared.vault.name} (${shared.vault
        .id}) at ${shared.vault.address}`,
      data: shared,
    });

    const vaultAddress = await getFundForManager(setup.defaultAccount);
    expect(vaultAddress).toBe(shared.vault.address);

    shared.participation.initial = await getParticipation(
      shared.vault.address,
      setup.defaultAccount,
    );
    expect(shared.participation.initial.personalStake.toNumber()).toBe(0);
    expect(shared.participation.initial.totalSupply.toNumber()).toBe(0);

    shared.subscriptionRequest = await subscribe(
      shared.vault.address,
      new BigNumber(INITIAL_SUBSCRIBE_QUANTITY),
      new BigNumber(INITIAL_SUBSCRIBE_QUANTITY),
    );

    trace({
      message: `Subscribe requested. shares: ${shared.subscriptionRequest
        .numShares}`,
      data: shared,
    });

    await awaitDataFeedUpdates(2);

    shared.executedSubscriptionRequest = await executeRequest(
      shared.subscriptionRequest.id,
      shared.vault.address,
    );

    shared.participation.invested = await getParticipation(
      shared.vault.address,
      setup.defaultAccount,
    );

    expect(shared.participation.invested.personalStake.toNumber()).toBe(
      INITIAL_SUBSCRIBE_QUANTITY,
    );
    expect(shared.participation.invested.totalSupply.toNumber()).toBe(
      INITIAL_SUBSCRIBE_QUANTITY,
    );

    trace({
      message: `Subscribe request executed. Personal stake: ${shared
        .participation.invested.personalStake}`,
    });

    // shared.redemptionRequest = await redeem(
    //   "0x9b4dc478f3a16e1a35ad5edc35444e3c673a9567",
    //   // shared.vault.address,
    //   REDEEM_QUANTITY,
    //   REDEEM_QUANTITY,
    // );

    // trace({
    //   message: `Redeem requested. shares: ${shared.redemptionRequest
    //     .numShares}`,
    //   data: shared,
    // });

    // await awaitDataFeedUpdates(2);

    // shared.executedRedeemRequest = await executeRequest(
    //   shared.redemptionRequest.id,
    //   "0x9b4dc478f3a16e1a35ad5edc35444e3c673a9567",
    //   // shared.vault.address,
    // );

    // shared.participation.invested = await getParticipation(
    //   shared.vault.address,
    //   setup.defaultAccount,
    // );

    // expect(shared.participation.invested.personalStake.toNumber()).toBe(
    //   INITIAL_SUBSCRIBE_QUANTITY,
    // );
    // expect(shared.participation.invested.totalSupply.toNumber()).toBe(
    //   INITIAL_SUBSCRIBE_QUANTITY,
    // );

    // trace({
    //   message: `Redeem request executed. Personal stake: ${shared.participation
    //     .invested.personalStake}`,
    // });

    shared.simpleOrder = await makeOrder(
      new BigNumber(1),
      "ETH-T",
      new BigNumber(2),
      "MLN-T",
    );

    trace({
      message: `Regular account made order with id: ${shared.simpleOrder.id}`,
    });

    shared.simpleOrderToBeCanceled = await makeOrder(
      new BigNumber(1),
      "ETH-T",
      new BigNumber(2),
      "MLN-T",
    );

    shared.canceledOrder = await cancelOrder(
      shared.simpleOrderToBeCanceled.id,
      setup.defaultAccount,
    );

    trace({
      message: `Regular account made an order with id : ${shared
        .simpleOrderToBeCanceled.id} and then canceled it.`,
    });

    shared.orderFromFund = await makeOrderFromFund(
      shared.vault.address,
      // "0x00c8775b2932abbff70d0278765f53b2710470cf",
      "MLN-T",
      "ETH-T",
      new BigNumber(1),
      new BigNumber(1),
    );

    trace({
      message: `Fund placed an order with id: ${shared.orderFromFund.id.toNumber()}`,
    });

    shared.orderBook = await getOrderbook("MLN-T", "ETH-T");
    trace({
      message: `Got orderbook for MLN-T/ETH-T with length: ${shared.orderBook
        .length}`,
      data: shared,
    });

    shared.takenOrder = await takeOrderFromFund(
      shared.simpleOrder.id,
      "0x00c8775b2932abbff70d0278765f53b2710470cf",
      new BigNumber(1.5),
    );

    trace({
      message: `Fund took order; executed quantity: ${shared.takenOrder
        .executedQuantity}`,
      data: shared,
    });
  },
  10 * 60 * 1000,
);
