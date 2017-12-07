// @flow
import Api from "@parity/api";

import addressBook from "@melonproject/protocol/address-book.json";
import setup from "../../utils/setup";
import ParticipationOpenAbi from "../../../abi/ParticipationOpen.json";

/**
 * Get deployed participation contract instance
 */
const getParticipationContract = async () => {
  const api = new Api(setup.provider);
  return api.newContract(ParticipationOpenAbi, addressBook.kovan.Participation);
};

export default getParticipationContract;
