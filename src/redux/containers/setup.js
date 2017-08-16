import { connect } from "react-redux";
import Setup from "../../components/newUser/setup";
import { creators } from "../ducks/setup";

const mapStateToProps = state => ({
  ...state.setup,
});

const mapDispatchToProps = dispatch => ({
  onCreate: () => {
    dispatch(creators.create());
  },
  onChange: event => {
    dispatch(creators.change({ [event.target.name]: event.target.value }));
  },
});

const SetupContainer = connect(mapStateToProps, mapDispatchToProps)(Setup);

export default SetupContainer;
