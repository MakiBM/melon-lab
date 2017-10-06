import {
  performCalculations,
  getFundInformations,
} from "@melonproject/melon.js";
import { types, creators } from "./duck";

const factsheetMiddleware = store => next => action => {
  const { type } = action;

  switch (type) {
    case types.REQUEST_INFORMATIONS: {
      performCalculations(store.getState().general.fundAddress)
        .then(response => {
          store.dispatch(
            creators.updateInformations({
              aum: response.gav.toString(),
              sharePrice: response.sharePrice.toString(),
              managementReward: response.managementReward.toString(),
              performanceReward: response.performanceReward.toString(),
              unclaimedRewards: response.unclaimedRewards.toString(),
              totalSupply: response.totalSupply.toString(),
            }),
          );
          return getFundInformations(store.getState().general.fundAddress);
        })
        .then(fundInformations => {
          const rawDate = fundInformations.creationDate;
          const formattedDate = `${rawDate.getDate()}/${rawDate.getMonth() +
            1}/${rawDate.getFullYear()}`;
          store.dispatch(
            creators.updateInformations({
              name: fundInformations.name,
              inception: formattedDate,
            }),
          );
        })
        .catch(err => {
          throw err;
        });
      break;
    }
    default:
  }

  return next(action);
};

export default factsheetMiddleware;
