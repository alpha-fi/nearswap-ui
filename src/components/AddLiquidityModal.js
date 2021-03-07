import React, { useContext, useState } from "react";

import { calcNearAddLiquidity, convertToE24Base5Dec, incAllowance, addLiquidity, convertToDecimals } from "../services/near-nep21-util";

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { InputsContext } from "../contexts/InputsContext";
import styled from "@emotion/styled";

const InputBox = styled("div")`
  color: ${props => props.theme.body};
  border: 1px solid #dee2e6;
  border-radius: 20px;
  .form-control:focus {
    color: #212543;
  }
`;

export default function CurrencySelectionModal() {

  // Inputs state
  const inputs = useContext(InputsContext);
  const { dispatch } = inputs;

  const [tokenInputAmount, setTokenInputAmount] = useState("");

  const toggleModalVisibility = () => {
    dispatch({ type: 'TOGGLE_ADD_LIQUIDITY_MODAL' });
    setTokenInputAmount("");
  };

  async function handleInput(event) {
    let inputAmount = event.target.value;
    setTokenInputAmount(inputAmount);
    let token = {
      address: inputs.state.addLiquidityModal.selectedTokenName,
      amount: inputAmount
    }
    let requiredNear = await calcNearAddLiquidity(token);
    dispatch({type:'UPDATE_ADD_LIQUIDITY_REQUIRED_NEAR_AMOUNT', payload: {requiredNearAmount: requiredNear}})
  }

  function increaseAllowance() {
    let token = {
      address: inputs.state.addLiquidityModal.selectedTokenName,
      amount: tokenInputAmount
    }
    incAllowance(token);
  }

  function handleAddLiquidity() {
    let token = {
      address: inputs.state.addLiquidityModal.selectedTokenName
    }
    addLiquidity(token, tokenInputAmount, String(0.0)); // this weird casting is needed otherwise it will convert to int and fail
  }

  return (
    <Modal show={inputs.state.addLiquidityModal.isVisible} onHide={toggleModalVisibility}>
      <Modal.Header closeButton>
        <Modal.Title>Add liquidity</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InputBox className="py-2">
          <label className="ml-4 mb-1 mt-0">
            <small className="text-secondary">{inputs.state.addLiquidityModal.selectedTokenSymbol} Amount</small>
          </label>
          <div className="px-2">
            <div className="input-group-lg mb-1">
              <input
                type="text"
                value={tokenInputAmount}
                className="form-control border-0 bg-transparent"
                placeholder="0.0"
                onChange={handleInput}
              />
            </div>
          </div>
          <label className="ml-4 mb-1 mt-0">
          <small className="text-secondary">
            decimals: {inputs.state.addLiquidityModal.decimals}
          </small>
        </label>
        </InputBox>
        <p className="mt-2 mb-1 text-center lead">+ {convertToDecimals(inputs.state.addLiquidityModal.requiredNearAmount, 24)} NEAR</p>
        <Row className="text-center pt-2">
          <Col>
            <small className="text-secondary">Allowance</small>
          </Col>
          <Col>
            <small className="text-secondary">{inputs.state.addLiquidityModal.selectedTokenSymbol} per NEAR</small>
          </Col>
          <Col>
            <small className="text-secondary">NEAR per {inputs.state.addLiquidityModal.selectedTokenSymbol}</small>
          </Col>
        </Row>
        <Row className="text-center pb-2">
          <Col className="align-self-center">
            {inputs.state.addLiquidityModal.selectedTokenAllowance}
            <br/>
            {((tokenInputAmount > 0) && (inputs.state.addLiquidityModal.selectedTokenAllowance < tokenInputAmount))
              && <Button
                    size="sm"
                    variant="warning"
                    onClick={increaseAllowance}
                    ><small>Increase to {tokenInputAmount}</small></Button>
            }
          </Col>
          <Col className="align-self-center">
            {convertToDecimals(inputs.state.addLiquidityModal.tokenPerNear, 24)}
          </Col>
          <Col className="align-self-center">
            {convertToDecimals(inputs.state.addLiquidityModal.nearPerToken, 24)}
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="warning"
          onClick={handleAddLiquidity}
          disabled={((tokenInputAmount <= 0) || (inputs.state.addLiquidityModal.selectedTokenAllowance < tokenInputAmount))}
        >
          Add liquidity
        </Button>
        <Button variant="secondary" onClick={toggleModalVisibility}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
