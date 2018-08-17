import AppContainer from '~/legacy/containers/App';
import withReduxStore from '~/wrappers/withReduxStore';
import { Provider as ReduxProvider } from 'react-redux';

const Index = ({ redux, ...props }) => (
  <ReduxProvider store={redux}>
    <AppContainer {...props} />
  </ReduxProvider>
);

export default withReduxStore(Index);
