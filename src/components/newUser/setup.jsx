import React from "react";
import { List, Input, Button, Card } from "semantic-ui-react";

const Setup = props =>
  (<div>
    <h2>Welcome to the Melon Protocol.</h2>
    <p className="App-intro">To get started, let's create your Melon fund.</p>
    <Card centered>
      <Card.Content>
        <Card.Header>Setup your fund</Card.Header>
        <br />
        <List>
          <List.Item as="a">
            <List.Content>
              <Input
                name="name"
                placeholder={props.name}
                onChange={props.onChange}
              />
            </List.Content>
          </List.Item>
          <List.Item as="a">
            <List.Content>
              <Input placeholder={props.managementFee} />
            </List.Content>
          </List.Item>
          <List.Item as="a">
            <List.Content>
              <Input placeholder={props.performanceFee} />
            </List.Content>
          </List.Item>
        </List>
      </Card.Content>
      <Card.Content extra>
        <div className="ui two buttons">
          <Button basic color="black" onClick={props.onCreate}>
            Create and deploy my fund!
          </Button>
        </div>
      </Card.Content>
    </Card>
  </div>);

export default Setup;
