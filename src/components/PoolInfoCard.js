import React, { useContext, useEffect } from "react";

import { convertToE24Base5Dec, getAllowance } from "../services/near-nep21-util";

import { TokenListContext } from "../contexts/TokenListContext";
import { InputsContext } from "../contexts/InputsContext";

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Table from 'react-bootstrap/Table';

import { CgSwap } from "react-icons/cg";

import styled from "@emotion/styled";
const Theme = styled("div")`
  background: ${props => props.theme.cardBackground};
  color: ${props => props.theme.body};
  border: 1px solid ${props => props.theme.cardBorder};
  border-radius: 20px;
  box-shadow: 0px 1px 0px 0px ${props => props.theme.cardShadow};
  .form-control:focus {
    color: ${props => props.theme.textInput};
  }
`;
const ColoredThemeText = styled("span")`
  color: ${props => props.theme.coloredText};
  text-shadow: 0px 1px 2px ${props => props.theme.coloredTextShadow};
`;

export default function PoolInfoCard(props) {

  // Token list state (used to get image)
  const tokenListState = useContext(TokenListContext);

  // Inputs state
  const inputs = useContext(InputsContext);

  async function handleAddLiquidityModal(tokenName, tokenSymbol) {
    let token = {address: tokenName};
    let allowance = await getAllowance(token);
    inputs.dispatch({ type: 'TOGGLE_ADD_LIQUIDITY_MODAL' });
    inputs.dispatch({ type: 'UPDATE_LIQUDITY_MODAL_SELECTED_CURRENCY', payload: {
      selectedTokenName: tokenName,
      selectedTokenSymbol: tokenSymbol,
      selectedTokenAllowance: allowance,
      nearPerToken: props.near_per_token,
      tokenPerNear: props.token_per_near
    }})
  }

  return (
    <>
      <Theme className="py-2 mb-2 mt-1">
        <label className="ml-4 mb-1 mt-0">
          <small><ColoredThemeText><b>NEAR-{props.name}</b></ColoredThemeText></small>
        </label>
        <div className="px-2 ml-3 mb-1">
          <Image rounded src={tokenListState.state.tokens[0].logoURI} width="23px" className="mr-2"/>
          {props.name} Pool
          <br/>
          <div className="my-1">
            <Row noGutters>
              <Col>
                <Table borderless size="sm" className="text-secondary mb-1" style={{ fontSize: '80%' }}>
                  <thead>
                    <tr>
                      <th>NEAR Amount</th>
                      <th className="amount">{convertToE24Base5Dec(props.ynear)}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Reserve Amount</td>
                      <td className="amount">{convertToE24Base5Dec(props.reserve)}</td>
                    </tr>
                    <tr>
                      <td><ColoredThemeText>My shares</ColoredThemeText></td>
                      <td className="amount"><ColoredThemeText>{convertToE24Base5Dec(props.my_shares)}</ColoredThemeText></td>
                    </tr>
                    <tr>
                      <td>Total shares</td>
                      <td className="amount">{convertToE24Base5Dec(props.total_shares)}</td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
              <Col className="my-auto text-center" xs={12} sm={4}>
                <Button variant="warning" size="sm" className="mr-1 mb-1" onClick={(e) => handleAddLiquidityModal(props.name, props.symbol)}>Add liquidity</Button>
                <Button variant="warning" size="sm" className="mr-1 mb-1" disabled>Swap</Button>
              </Col>
            </Row>
          </div>
        </div>
      </Theme>
    </>
  );
}
