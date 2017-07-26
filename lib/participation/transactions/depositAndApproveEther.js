import contract from "truffle-contract";
import ERC20Json from "@melonproject/protocol/build/contracts/ERC20.json";

import { currentProvider } from "../../utils/setup";
import getAddress from "../../assets/utils/getAddress";

/*
  @param quantity: BigNumber
*/
const depositAndApproveEther = async (
  fromAddress,
  toBeApprovedAddress,
  quantity,
) => {
  const EtherToken = contract(ERC20Json);
  EtherToken.setProvider(currentProvider);
  const etherTokenContract = EtherToken.at(getAddress("ETH-T"));
  await etherTokenContract.deposit({ from: fromAddress, value: quantity });
  await etherTokenContract.approve(toBeApprovedAddress, quantity, {
    from: fromAddress,
  });
};

export default depositAndApproveEther;
