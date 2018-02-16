// @flow
import setup from '../../utils/setup';
import sendTransaction from '../../utils/parity/sendTransaction';
import getFundContract from '../contracts/getFundContract';
import ensure from '../../utils/generic/ensure';

import type { Address } from '../../assets/schemas/Address';

const toggleSubscription = async (
  environment,
  { fundAddress },
): Promise<boolean> => {
  const fundContract = await getFundContract(environment, fundAddress);
  const owner = await fundContract.instance.owner.call();
  ensure(
    owner.toLowerCase() === environment.account.address.toLowerCase(),
    'Not owner of fund',
  );

  const preSubscriptionAllowed = await fundContract.instance.isSubscribeAllowed.call();

  if (preSubscriptionAllowed === true) {
    await sendTransaction(fundContract, 'disableSubscription', [], environment);
  } else if (preSubscriptionAllowed === false) {
    await sendTransaction(fundContract, 'enableSubscription', [], environment);
  }

  const postSubscriptionAllowed = await fundContract.instance.isSubscribeAllowed.call();

  ensure(
    preSubscriptionAllowed !== postSubscriptionAllowed,
    'Toggle subscription was not successful',
  );
  return postSubscriptionAllowed;
};

export default toggleSubscription;
