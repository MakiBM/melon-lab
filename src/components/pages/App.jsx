import React from "react";
import { Image, Container } from "semantic-ui-react";
import WrongNetwork from "../organisms/WrongNetwork";
import NoMetamask from "../organisms/NoMetamask";
import LockedAccount from "../organisms/LockedAccount";
import InsufficentFunds from "../organisms/InsufficentFunds";
import SetupContainer from "../../containers/Setup";
import ParticipationContainer from "../../containers/Participation";
import { onboardingPath } from "../../reducers/app";
import FundContainer from "../../containers/Fund";
import RankingContainer from "../../containers/Ranking";
import NewUserContainer from "../../containers/NewUser";
import { types } from "../../actions/routes";

const mapOnboardingStateToMainContainer = {
  [onboardingPath.NO_PROVIDER]: NoMetamask,
  [onboardingPath.NO_CONNECTION]: NoMetamask,
  [onboardingPath.WRONG_NETWORK]: WrongNetwork,
  [onboardingPath.LOCKED_ACCOUNT]: LockedAccount,
  [onboardingPath.INSUFFICENT_ETH]: InsufficentFunds,
  [onboardingPath.INSUFFICENT_MLN]: InsufficentFunds,
  [onboardingPath.NO_FUND_CREATED]: SetupContainer,
  [onboardingPath.NOT_INVESTED_IN_OWN_FUND]: ParticipationContainer,
};

const routeContainerMap = {
  [types.RANKING]: RankingContainer,
  [types.NEW_USER]: NewUserContainer,
  [types.FUND]: FundContainer,
};

const getMainComponent = ({
  onboardingState,
  mlnBalance,
  ethBalance,
  route,
}) => {
  if (route === types.SETUP) {
    const Main = mapOnboardingStateToMainContainer[onboardingState];
    return Main ? (
      <Main mlnBalance={mlnBalance} ethBalance={ethBalance} setup />
    ) : null;
  }
  const Main = routeContainerMap[route];
  return Main ? <Main /> : <div />;
};

const App = props => (
  <div className="App">
    <Container>
      <div className="App-header" style={{ margin: "2em" }}>
        <Image src="./melon-logo.png" size="small" centered />
      </div>
      {getMainComponent(props)}
    </Container>
  </div>
);

export default App;
