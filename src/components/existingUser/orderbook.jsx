import React from "react";
import { Table } from "semantic-ui-react";

const OrderBook = props =>
  (<div>
    <p className="App-intro">Orderbook for MLN/ETH</p>
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Cum. Vol.</Table.HeaderCell>
          <Table.HeaderCell>Vol.</Table.HeaderCell>
          <Table.HeaderCell>Bid</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {props.buyOrders.map((order, i) =>
          (<Table.Row key={i}>
            <Table.Cell>
              {order.cumulativeVolume}
            </Table.Cell>
            <Table.Cell>
              {order.buy.howMuch}
            </Table.Cell>
            <Table.Cell>
              {order.price}
            </Table.Cell>
          </Table.Row>),
        )}
      </Table.Body>
    </Table>
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Ask</Table.HeaderCell>
          <Table.HeaderCell>Vol.</Table.HeaderCell>
          <Table.HeaderCell>Cum. Vol.</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {props.sellOrders.map((order, i) =>
          (<Table.Row key={i}>
            <Table.Cell>
              {order.price}
            </Table.Cell>
            <Table.Cell>
              {order.sell.howMuch}
            </Table.Cell>
            <Table.Cell>
              {order.cumulativeVolume}
            </Table.Cell>
          </Table.Row>),
        )}
      </Table.Body>
    </Table>
  </div>);

export default OrderBook;
