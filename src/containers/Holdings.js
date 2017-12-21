import { connect } from "react-redux";
import { actions } from "../actions/holdings";
import { actions as appActions } from "../actions/app";
import { actions as orderbookActions } from "../actions/orderbook";
import { actions as recentTradesActions } from "../actions/recentTrades";
import { actions as tradeHelperActions } from "../actions/tradeHelper";

import { lifecycle } from "recompose";
import Holdings from "../components/organisms/Holdings";
import displayNumber from "../utils/displayNumber";

const mapStateToProps = state => ({
  holdings: state.holdings.holdings.map(asset => ({
    name: asset.name,
    balance: displayNumber(asset.balance),
    price: displayNumber(asset.price),
    percentage: displayNumber(
      asset.balance
        .times(asset.price)
        .div(state.fund.nav)
        .times(100),
    ),
  })),
});

const mapDispatchToProps = dispatch => ({
  getHoldings: fundAddress => {
    dispatch(actions.getHoldings(fundAddress));
  },
  selectAsset: asset => {
    if (asset !== "MLN-T") {
      dispatch(appActions.updateAssetPair({ base: asset, quote: "MLN-T" }));
      // Here need to reload orderbook, recent trades and trade helper data
      dispatch(orderbookActions.getOrderbook());
      dispatch(recentTradesActions.getRecentTrades());
      // dispatch(tradeHelperActions.tradeInfoRequested());
    }
  },
});

const HoldingsLifecycle = lifecycle({
  componentDidMount() {
    this.props.getHoldings(this.props.fundAddress);
  },
})(Holdings);

const HoldingsContainter = connect(mapStateToProps, mapDispatchToProps)(
  HoldingsLifecycle,
);

export default HoldingsContainter;
