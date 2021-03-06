import React, { StatelessComponent } from 'react';
import Notification from '~/blocks/Notification';
import { CellBody, Row, Table, TableBody } from '~/blocks/Table';

import styles from './styles.css';

export interface StatisticsProps {
  rewardsSum?: string;
  investmentsSum?: string;
  redeemalsSum?: string;
  tradesCount?: string;
  highestSharePrice?: string;
  netAssetValue?: string;
}

export const Statistics: StatelessComponent<StatisticsProps> = ({
  rewardsSum,
  investmentsSum,
  redeemalsSum,
  tradesCount,
  highestSharePrice,
  netAssetValue,
}) => {
  return (
    <div className="statistics">
      <style jsx>{styles}</style>
      <h3>Statistics</h3>
      <Notification isWarning>In development</Notification>
      <div className="statistics__table">
        <Table>
          <TableBody>
            <Row>
              <CellBody>All time reward payout</CellBody>
              <CellBody>{rewardsSum} MLN</CellBody>
            </Row>
            <Row>
              <CellBody>All time investment</CellBody>
              <CellBody>{investmentsSum} MLN</CellBody>
            </Row>
            <Row>
              <CellBody>All time redeemals</CellBody>
              <CellBody>{redeemalsSum} MLN</CellBody>
            </Row>
            <Row>
              <CellBody>All time number of trades</CellBody>
              <CellBody>{tradesCount}</CellBody>
            </Row>
            <Row>
              <CellBody>All time high share price</CellBody>
              <CellBody>{highestSharePrice}</CellBody>
            </Row>
            <Row>
              <CellBody>All time net asset value</CellBody>
              <CellBody>{netAssetValue}</CellBody>
            </Row>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Statistics;
