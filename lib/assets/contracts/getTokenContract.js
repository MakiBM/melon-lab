import contract from "truffle-contract";
import ERC20Json from "@melonproject/protocol/build/contracts/ERC20.json";
import { currentProvider } from "../../utils/setup";
import getAddress from "../utils/getAddress";

const getTokenContract = async symbol => {
  const Token = contract(ERC20Json);
  Token.setProvider(currentProvider);
  const tokenAddress = getAddress(symbol);
  return Token.at(tokenAddress);
};

export default getTokenContract;
