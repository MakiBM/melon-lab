import BigNumber from "bignumber.js";
import { setup, subscribe, redeem } from "@melonproject/melon.js";
import { types, creators } from "./duck";
import { creators as generalCreators } from "../general";
import { creators as executeRequestCreators } from "../executeRequest/duck";

const participationMiddleware = store => next => action => {
  const { type } = action;

  const currentState = store.getState().participation;

  switch (type) {
    case types.INVEST: {
      if (currentState.participationType === "Invest") {
        subscribe(
          store.getState().general.fundAddress,
          new BigNumber(currentState.amount),
          new BigNumber(currentState.total),
          new BigNumber(0.1),
          setup.web3.eth.accounts[0],
        )
          .then(request => {
            console.log("Subscription receipt: ", request);
            store.dispatch(
              executeRequestCreators.update({
                requestId: request.id,
              }),
            );
            store.dispatch(
              creators.change({
                loading: false,
                amount: "Amount",
                price: "Price per share",
                total: "Total",
              }),
            );
            store.dispatch(generalCreators.update({ pendingRequest: true }));
          })
          .catch(err => {
            throw err;
          });
      } else if (currentState.participationType === "Redeem") {
        redeem(
          store.getState().general.fundAddress,
          new BigNumber(currentState.amount),
          new BigNumber(currentState.total),
          new BigNumber(0.1),
          setup.web3.eth.accounts[0],
        )
          .then(request => {
            console.log("Redeem receipt ", request);
            store.dispatch(
              executeRequestCreators.update({
                requestId: request.id,
              }),
            );
            store.dispatch(
              creators.change({
                loading: false,
                amount: "Amount",
                price: "Price per share",
                total: "Total",
              }),
            );
            store.dispatch(generalCreators.update({ pendingRequest: true }));
          })
          .catch(err => {
            throw err;
          });
      }
      break;
    }
    default:
  }

  return next(action);
};

export default participationMiddleware;
