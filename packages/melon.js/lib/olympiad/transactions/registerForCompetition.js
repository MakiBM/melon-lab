// @flow
import BigNumber from 'bignumber.js';
import getConfig from '../../version/calls/getConfig';
import getOlympiadContract from '../contracts/getOlympiadContract';
import getVersionContract from '../../version/contracts/getVersionContract';
import findEventInLog from '../../utils/ethereum/findEventInLog';
import sendTransaction from '../../utils/parity/sendTransaction';
import toReadable from '../../assets/utils/toReadable';
import toProcessable from '../../assets/utils/toProcessable';
import ensure from '../../utils/generic/ensure';

/**
 * Calling this function will register the sender on the competition contract and will allocate to his fund an amount of MLN in proportion of his buyInValue in ETH.
 */
const registerForCompetition = async (
    environment,
    { fundAddress, signature, buyInValue },
): Promise<any> => {
    const config = await getConfig(environment);
    const etherTokenSymbol = config.nativeAssetSymbol;
    const olympiadContract = await getOlympiadContract(environment);
    const isCompetitionActive = await olympiadContract.instance.isCompetitionActive.call(
        {},
        [],
    );
    ensure(isCompetitionActive, 'Olympiad is inactive.');

    const termsAndConditionsAreSigned = await olympiadContract.instance.termsAndConditionsAreSigned.call(
        {},
        [environment.account.address, signature.v, signature.r, signature.s],
    );
    ensure(termsAndConditionsAreSigned, 'Invalid signature of T&Cs');

    const isWhitelisted = await olympiadContract.instance.isWhitelisted.call({}, [
        environment.account.address,
    ]);

    ensure(
        isWhitelisted,
        'Sender is not whitelisted. Please perform KYC/AML checks with Bitcoin Suisse',
    );

    const currentTotalBuyin = await olympiadContract.instance.currentTotalBuyin.call();
    const totalMaxBuyin = await olympiadContract.instance.totalMaxBuyin.call();
    ensure(
        currentTotalBuyin.add(buyInValue).lte(totalMaxBuyin),
        'Max total buy in has been reached.',
    );



    const whitelistantToMaxBuyin = await olympiadContract.instance.whitelistantToMaxBuyin.call(
        {},
        [environment.account.address],
    );

    ensure(
        new BigNumber(buyInValue).lte(whitelistantToMaxBuyin),
        'The buy in amount exceeds your individual max cap (determined by Bitcoin Suisse).',
    );

    const versionContract = await getVersionContract(environment);
    const managerToFund = await versionContract.instance.getFundByManager.call(
        {},
        [environment.account.address],
    );
    ensure(
        fundAddress.toLowerCase() === managerToFund.toLowerCase(),
        'Sender must register with a fund he owns.',
    );
    const etherBalance = await environment.api.eth
        .getBalance(environment.account.address)
        .then(balance => toReadable(config, balance, config.nativeAssetSymbol));
    ensure(etherBalance.gt(buyInValue), 'Insufficient balance of ether');

    const registeredFundToRegistrant = await olympiadContract.instance.registeredFundToRegistrants.call(
        {},
        [fundAddress],
    );
    const registrantToRegistrantId = await olympiadContract.instance.registrantToRegistrantIds.call(
        {},
        [environment.account.address],
    );
    {/*ensure(
    registeredFundToRegistrant ===
    '0x0000000000000000000000000000000000000000' &&
    registrantToRegistrantId[1] === false,
    'Sender already registered.',
  );*/}

    const receipt = await sendTransaction(
        olympiadContract,
        'registerForCompetition',
        [fundAddress, signature.v, signature.r, signature.s],
        environment,
        { value: toProcessable(config, buyInValue, etherTokenSymbol) },
    );

    const registerLog = findEventInLog('Register', receipt);

    return {
        registrandId: registerLog.params.withId.value.toNumber(),
        fundAddress: registerLog.params.fund.value,
        managerAddress: registerLog.params.manager.value
    }
};

export default registerForCompetition;
