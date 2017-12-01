import { connect } from "react-redux";
import { lifecycle } from "recompose";
import { actions as fundActions } from "../actions/fund";

import Fund from "../components/pages/Fund";

const mapStateToProps = state => ({
  pendingRequest: state.general.pendingRequest,
  loading: state.app.transactionInProgress,
  isOwner: state.ethereum.account === state.fund.owner,
});

const mapDispatchToProps = dispatch => ({
  setFund: address => dispatch(fundActions.set(address)),
});

const FundLifecycle = lifecycle({
  componentDidMount() {
    this.props.setFund(this.props.match.params.fundAddress);
  },
})(Fund);

const FundContainer = connect(mapStateToProps, mapDispatchToProps)(
  FundLifecycle,
);

export default FundContainer;
