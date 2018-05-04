import React from 'react';
import { Field } from 'redux-form';
import { List, Button, Card, Checkbox } from 'semantic-ui-react';

import renderInput from '../utils/renderInput';

// Explicitely decompose props here.
const Setup = ({ loading, handleSubmit, networkId, config }) => (
  <form onSubmit={handleSubmit}>
    <Card centered>
      <Card.Content>
        <div className={`ui ${loading ? 'active' : ''} inverted dimmer`}>
          <div className="ui text loader">
            Deploying your fund to the Ethereum blockchain
          </div>
        </div>

        <br />
        <Card.Header>Setup your fund</Card.Header>

        <List>
          <List.Item>
            <List.Content>
              <Field
                name="name"
                component={renderInput}
                className="left-input"
              />
            </List.Content>
          </List.Item>
          <br />
          <h4>Melon Default Configuration:</h4>
          <p>
            For this version, the modules that your fund will use are predefined
            ie. you do not need to choose a module. For your record, below are
            the predefined modules for this version.
          </p>
          <List.Item>
            <List.Content>Performance fee: 0%</List.Content>
          </List.Item>
          <List.Item>
            <List.Content>Management fee: 0%</List.Content>
          </List.Item>

          <List.Item>
            <List.Content>
              <strong>Exchange:</strong>
              <br />
              <Checkbox label="OasisDex" />
              <br />
              <Checkbox label="ZeroEx" />
              <br />
              <br />
            </List.Content>
          </List.Item>

          <List.Item
            as="a"
            href={`https://${
              networkId === '42' ? 'kovan.' : ''
            }etherscan.io/address/${config.priceFeedAddress}`}
            target="_blank"
          >
            <List.Content>
              Pricefeed: <strong>Thomson Reuters Pricefeed</strong>
            </List.Content>
          </List.Item>

          <List.Item>
            <List.Content>
              Asset Registrar: <strong>Melon Main Net Asset Universe</strong> (4
              assets registered)
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content
              href={`https://${
                networkId === '42' ? 'kovan.' : ''
              }etherscan.io/address/${config.complianceAddress}`}
              target="_blank"
            >
              Compliance (invest/redeem):{' '}
              <strong>Only manager can invest (in MLN)</strong>
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content
              href={`https://${
                networkId === '42' ? 'kovan.' : ''
              }etherscan.io/address/${config.riskManagementAddress}`}
              target="_blank"
            >
              Risk Management:{' '}
              <strong>Make/Take order permitted with 10% deviation </strong>{' '}
              from the reference price provided by above pricefeed.
            </List.Content>
          </List.Item>
        </List>

        <Button basic color="black" style={{ width: '100%' }}>
          Create and deploy my fund!
        </Button>
      </Card.Content>
    </Card>
  </form>
);

export default Setup;
