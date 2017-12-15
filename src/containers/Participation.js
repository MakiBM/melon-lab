import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import { actions } from "../actions/participation";
import Participation from "../components/organisms/ParticipationForm";
import { actions as fundActions } from "../actions/fund";
import { multiply, divide } from "../utils/functionalBigNumber";

const mapStateToProps = state => ({
  loading: state.app.transactionInProgress,
  onboardingState: state.app.onboardingState,
  usersFund: state.app.usersFund,
  fundAddress: state.fund.address,
});

const onSubmit = (values, dispatch) => {
  if (values.type === "subscribe") {
    dispatch(actions.subscribe(values));
  } else {
    dispatch(actions.redeem(values));
  }
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  requestFund: fundAddress => dispatch(fundActions.infoRequested(fundAddress)),
  onChange: (event, value) => {
    if (event.target.name === "total") {
      ownProps.change("amount", divide(value, ownProps.initialValues.price));
    } else {
      ownProps.change("total", multiply(value, ownProps.initialValues.price));
    }
  },
});

const ParticipationRedux = connect(mapStateToProps, mapDispatchToProps)(
  Participation,
);

const ParticipationForm = reduxForm({
  form: "participation",
  enableReinitialize: true,
  onSubmit,
})(ParticipationRedux);

// A bit hacky, but it brings in inital values
const ParticipationFormRedux = connect(state => ({
  initialValues: {
    type: "subscribe",
    amount: 1,
    price: state.fund.sharePrice,
    total: multiply(1, state.fund.sharePrice),
  },
}))(ParticipationForm);

export default ParticipationFormRedux;
