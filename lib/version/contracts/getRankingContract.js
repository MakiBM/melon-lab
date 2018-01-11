import Api from "@parity/api";

import addressBook from "@melonproject/protocol/addressBook.json";
import RankingAbi from "../../../abi/Ranking.json";
import setup from "../../utils/setup";

/**
 * Get deployed version contract instance
 */
const getRankingContract = () => {
  const api = new Api(setup.provider);
  return api.newContract(RankingAbi, addressBook.kovan.Ranking);
};

export default getRankingContract;
