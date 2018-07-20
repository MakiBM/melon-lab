import { connect } from 'react-redux';
import { reduxForm, change } from 'redux-form';
import { actions } from '../actions/participation';
// import Participation from '../components/organisms/ParticipationForm';
import Participation from '@melonproject/manager-components/components/ParticipationForm/container';
import { actions as fundActions } from '../actions/fund';
import { multiply, divide, equals } from '../utils/functionalBigNumber';
import displayNumber from '../utils/displayNumber';

const calculateParticipationPrice = (sharePrice, type) => {
  // console.log(sharePrice, type);
  if (!equals(sharePrice, 1)) {
    if (type === 'Invest') {
      return multiply(sharePrice, 1.05);
    }
    return divide(sharePrice, 1.05);
  }

  return sharePrice;
};

const mapStateToProps = state => {
  const initialType =
    state.form.participation && state.form.participation.values
      ? state.form.participation.values.type
      : 'Invest';

  const ParticipationPrice = displayNumber(
    calculateParticipationPrice(state.fund.sharePrice, initialType),
  )

  return {
    onboardingState: state.app.onboardingState,
    usersFund: state.app.usersFund,
    fundAddress: state.fund.address,
    dataValid: state.ethereum.isDataValid,
    initialValues: {
      type: initialType,
      quantity: displayNumber(1.0),
      price:
        state.fund.sharePrice === '...'
          ? '...'
          : ParticipationPrice,
      total:
        state.fund.sharePrice === '...'
          ? '...'
          : ParticipationPrice,
    },
    displayNumber,
    quoteAsset: state.app.assetPair.quote,
    decimals: 4,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  requestFund: fundAddress => dispatch(fundActions.infoRequested(fundAddress)),
  onSubmit: values => {
    if (values.type === 'Invest') {
      dispatch(actions.invest({ ...values, directlyExecute: ownProps.setup }));
    } else if (values.type === 'Slices') {
      dispatch(actions.redeemAllOwnedAssets(values));
    }
  },
});

const ParticipationForm = reduxForm({
  form: 'participation',
  enableReinitialize: true,
})(Participation);

const ParticipationRedux = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ParticipationForm);

export default ParticipationRedux;
