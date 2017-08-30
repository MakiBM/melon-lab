import React from "react";
import { List, Card, Icon, Divider } from "semantic-ui-react";

const Factsheet = props =>
  (<Card centered id="factsheet">
    <Card.Content>
      <Card.Header>
        <strong>μέλλω Capital </strong>
      </Card.Header>
      <br />
      <Card.Meta>
        - Actively managed portfolio with <strong>crypto only</strong> exposure
        -
      </Card.Meta>
      <br />
      <List>
        <List.Item as="a">
          <Icon name="right triangle" />
          <List.Content>
            <List.Header>Inception date: 07/07/2017</List.Header>
          </List.Content>
        </List.Item>
        <List.Item as="a">
          <Icon name="right triangle" />
          <List.Content>
            <List.Header>
              AUM: {props.aum} ETH
            </List.Header>
          </List.Content>
        </List.Item>
        <List.Item as="a">
          <Icon name="right triangle" />
          <List.Content>
            <List.Header>
              Share Price: {props.sharePrice}
            </List.Header>
          </List.Content>
        </List.Item>
        <Divider />
        <List.Item as="a">
          <Icon name="right triangle" />
          <List.Content>
            <List.Header>
              Management Reward: {props.managementReward}%
            </List.Header>
          </List.Content>
        </List.Item>
        <List.Item as="a">
          <Icon name="right triangle" />
          <List.Content>
            <List.Header>
              Performance Reward: {props.performanceReward}%
            </List.Header>
          </List.Content>
        </List.Item>
        <Divider />
        <List.Item as="a">
          <Icon name="right triangle" />
          <List.Content>
            <List.Header>
              Unclaimed rewards: {props.unclaimedRewards} MLN
            </List.Header>
          </List.Content>
        </List.Item>
        <List.Item as="a">
          <Icon name="right triangle" />
          <List.Content>
            <List.Header>Settings</List.Header>
          </List.Content>
        </List.Item>
        <Divider />
        <List.Item as="a">
          <Icon name="right triangle" />
          <List.Content>
            <List.Header>Contact Manager</List.Header>
          </List.Content>
        </List.Item>
      </List>
    </Card.Content>
  </Card>);

export default Factsheet;
