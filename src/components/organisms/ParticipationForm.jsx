import React from "react";
import { Field } from "redux-form";
import { List, Button, Card, Menu } from "semantic-ui-react";

import renderInput from "../utils/renderInput";

const participationTypeSelector = ({ input: { onChange, value } }) => (
  <div>
    <Menu text style={{ display: "flex", justifyContent: "center" }}>
      <Menu.Item
        name="Invest"
        active={value === "Invest"}
        onClick={() => onChange("Invest")}
      />
      <div style={{ marginTop: "0.7em" }}>|</div>
      <Menu.Item
        name="Redeem"
        active={value === "Redeem"}
        onClick={() => onChange("Redeem")}
      />
    </Menu>
  </div>
);

const ParticipationForm = ({ setup, handleSubmit, displayNumber }) => (
  <form onSubmit={handleSubmit} name="participation">
    <Card id="participation" centered>
      <Card.Content>
        <Card.Header>Participation</Card.Header>
        {setup ? null : (
          <Field name="type" component={participationTypeSelector} />
        )}
        <List>
          <List.Item>
            <List.Content>
              <Field
                label="Quantity"
                name="amount"
                component={renderInput}
                type="number"
                format={displayNumber}
              />
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <Field
                label="Price"
                name="price"
                component={renderInput}
                type="number"
                format={displayNumber}
                disabled
              />
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              <Field
                label="Total"
                name="total"
                component={renderInput}
                format={displayNumber}
                type="number"
              />
            </List.Content>
          </List.Item>
        </List>

        <Button basic color="black" style={{ width: "100%" }}>
          Submit request
        </Button>
      </Card.Content>
    </Card>
  </form>
);

export default ParticipationForm;
