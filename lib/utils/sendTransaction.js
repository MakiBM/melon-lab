// @flow
import Api from "@parity/api";
import setup from "./setup";
import gasBoost from "./gasBoost";
import constructTransactionObject from "./constructTransactionObject";

const sendTransaction = async (contract, method, parameters, opt = {}) => {
  const api = new Api(setup.provider);

  // / Prepare raw transaction
  const transactionCount = await api._eth.getTransactionCount(
    setup.defaultAccount,
  );
  const options = {
    from: setup.defaultAccount,
    to: contract.address,
    gasPrice: 20000000000,
    nonce: transactionCount.toNumber(),
    ...opt,
  };
  // / Estimate and adjust gas with gasBoost
  options.gasLimit = await gasBoost(
    contract.instance[method],
    parameters,
    options,
  );
  // / Construct raw transaction object
  const rawTransaction = constructTransactionObject(
    contract,
    method,
    parameters,
    options,
  );
  // / Sign transaction object with Wallet instance
  const signedTransaction = setup.wallet.sign(rawTransaction);

  // / Send raw signed transaction and wait for receipt
  const transactionHash = await api._eth.sendRawTransaction(signedTransaction);

  await contract._pollTransactionReceipt(transactionHash);
  const rawReceipt = await api._eth.getTransactionReceipt(transactionHash);
  console.log("LOGS RAW ", rawReceipt.logs);
  const decodedLogs = contract.parseEventLogs(rawReceipt.logs);
  console.log(decodedLogs);
  const transactionReceipt = { ...rawReceipt, logs: decodedLogs };

  return transactionReceipt;
};

export default sendTransaction;
