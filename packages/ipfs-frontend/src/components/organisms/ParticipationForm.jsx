import React from "react";
import { Field } from "redux-form";
import { List, Button, Card, Menu } from "semantic-ui-react";
import NumberInput from "../molecules/NumberInput";

const participationTypeSelector = ({
  input: { onChange, value },
  quoteAsset,
}) => (
  <div>
    <Menu text style={{ display: "flex", justifyContent: "center" }}>
      <Menu.Item
        name="Invest"
        active={value === "Invest"}
        onClick={() => onChange("Invest")}
      />
      <div style={{ marginTop: "0.7em" }}>|</div>
      <Menu.Item
        name={`Redeem ${quoteAsset}`}
        active={value === "Redeem"}
        onClick={() => onChange("Redeem")}
      />
      <div style={{ marginTop: "0.7em" }}>|</div>
      <Menu.Item
        name="Slice redeem"
        active={value === "Slices"}
        onClick={() => onChange("Slices")}
      />
    </Menu>
  </div>
);

const ParticipationForm = ({
  setup,
  handleSubmit,
  displayNumber,
  dataValid,
  quoteAsset,
  participationType,
}) => (
  <Card id="participation" centered>
    <Card.Content>
      <Card.Header>Participation</Card.Header>
      <form onSubmit={handleSubmit} name="participation">
        {setup ? (
          <p />
        ) : (
          <Field
            name="type"
            component={participationTypeSelector}
            quoteAsset={quoteAsset}
          />
        )}
        <List>
          <List.Item>
            <List.Content>
              <Field
                label="Quantity (Shares)"
                name="amount"
                component={NumberInput}
                type="number"
                format={displayNumber}
                disabled={!dataValid}
              />
            </List.Content>
          </List.Item>
          {participationType === "Slices" ? (
            <div />
          ) : (
            <div>
              <List.Item>
                <List.Content>
                  <Field
                    label={`Price (${quoteAsset})`}
                    name="price"
                    component={NumberInput}
                    type="number"
                    format={displayNumber}
                    disabled
                  />
                </List.Content>
              </List.Item>
              <List.Item>
                <List.Content>
                  <Field
                    label={`Total (${quoteAsset})`}
                    name="total"
                    component={NumberInput}
                    format={displayNumber}
                    type="number"
                    disabled={!dataValid}
                  />
                </List.Content>
              </List.Item>
            </div>
          )}
        </List>

        {!dataValid ? (
          <p style={{ color: "rgb(209, 102, 102)" }}>
            Invest/Redeem not possible when price feed down
          </p>
        ) : null}

        <Button
          basic
          color="black"
          style={{ width: "100%" }}
          disabled={!dataValid}
        >
          Submit request
        </Button>
      </form>
    </Card.Content>
  </Card>
);

export default ParticipationForm;
