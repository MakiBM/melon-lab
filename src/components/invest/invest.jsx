import React from "react";
import { List, Input, Button, Card } from "semantic-ui-react";

const Invest = props => (
  <div>
    <div className="ui segment">
      <br />
      <p className="App-intro">Now, time to invest in your fund!</p>
      <div className={`ui ${props.loading ? "active" : ""} inverted dimmer`}>
        <div className="ui text loader">Investing in your fund ...</div>
      </div>
      <Card centered>
        <Card.Content>
          <Card.Header>Invest</Card.Header>
          <br />
          <List>
            <List.Item as="a">
              <List.Content>
                <Input
                  name="amount"
                  placeholder="Amount"
                  value={props.amount}
                  onChange={props.onChange}
                  label="Amount"
                />
              </List.Content>
            </List.Item>
            <List.Item as="a">
              <List.Content>
                <Input
                  readOnly
                  name="price"
                  value={props.price}
                  label="Share Price"
                />
              </List.Content>
            </List.Item>
            <List.Item as="a">
              <List.Content>
                <Input
                  name="total"
                  placeholder="Total"
                  value={props.total}
                  onChange={props.onChange}
                  label="Total"
                />
              </List.Content>
            </List.Item>
          </List>
        </Card.Content>
        <Card.Content extra>
          <div className="ui two buttons">
            <Button basic color="black" onClick={props.onInvest}>
              Invest
            </Button>
          </div>
        </Card.Content>
      </Card>
    </div>
  </div>
);

export default Invest;
