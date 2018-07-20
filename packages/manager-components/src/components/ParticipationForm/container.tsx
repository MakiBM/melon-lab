import { withFormik } from 'formik';
import { compose, withHandlers } from 'recompose';
import * as Yup from 'yup';
import {
  divide,
  greaterThan,
  max,
  min,
  multiply,
  equals,
} from '../../utils/functionalBigNumber';
import ParticipationForm from './index';

const calculateParticipationPrice = (sharePrice, type) => {
  if (!equals(sharePrice, 1)) {
    if (type === 'Invest') {
      return multiply(sharePrice, 1.05);
    }
    return multiply(sharePrice, 0.95);
  }

  return sharePrice;
};

const calculateInputs = (props, field, value) => {
  const { values } = props;

  const totalValue = field === 'total' ? value : values.total;
  const quantityValue = field === 'quantity' ? value : values.quantity;
  const priceValue = field === 'price' ? value : values.price;

  if (field === 'type') {
    const participationPrice = calculateParticipationPrice(
      values.price,
      values.type,
    );

    if (!equals(values.price, participationPrice)) {
      props.setFieldValue('price', participationPrice);
    }
  } else if (field === 'quantity' || field === 'price') {
    const total = multiply(quantityValue, priceValue);

    if (values.total !== total) {
      props.setFieldValue('total', total);
    }
  } else if (field === 'total' || field === 'price') {
    const quantity = divide(totalValue, priceValue);

    if (values.quantity !== quantity) {
      props.setFieldValue('quantity', quantity);
    }
  }
};

const validation = props => {
  const numberFormat = (0).toFixed(props.decimals);
  const minNumber = numberFormat.slice(0, -1) + '1';

  return Yup.object().shape({
    total: Yup.number()
      .min(minNumber, `Minimum total is ${minNumber}`)
      .required('Total is required.'),
    quantity: Yup.number()
      .min(minNumber, `Minimum quantity is ${minNumber}`)
      .required('Quantity is required.'),
    price: Yup.number()
      .min(minNumber, `Minimum price is ${minNumber}`)
      .required('Price is required.'),
  });
};

const withFormValidation = withFormik({
  mapPropsToValues: props => ({ ...props.initialValues }),
  validationSchema: props => validation(props),
  enableReinitialize: true,
  handleSubmit: (values, form) => {
    console.log(values)
    if (form.props.onSubmit) {
      form.props.onSubmit(values);
    }
  },
});

const withFormHandler = compose(
  withHandlers({
    onChange: props => (values, event) => {
      props.setFieldValue(event.target.name, values.value);
      calculateInputs(props, event.target.name, values.value);
    },
  }),
);

export default compose(
  withFormValidation,
  withFormHandler,
)(ParticipationForm);
