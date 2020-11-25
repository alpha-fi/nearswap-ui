import React, { useContext, useState } from "react";

import { calcNearAddLiquidity, convertToE24Base5Dec, incAllowance } from "../services/near-nep21-util";

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { InputsContext } from "../contexts/InputsContext";

import { BsCaretDownFill } from "react-icons/bs";

import styled from "@emotion/styled";
const InputBox = styled("div")`
  color: ${props => props.theme.body};
  border: 1px solid #dee2e6;
  border-radius: 20px;
  .form-control:focus {
    color: #212543;
  }
`;

export default function CurrencySelectionModal(props) {

  // Inputs state
  const inputs = useContext(InputsContext);
  const { dispatch } = inputs;

  const [tokenInputAmount, setTokenInputAmount] = useState();

  const toggleModalVisibility = () => {
    dispatch({ type: 'TOGGLE_ADD_LIQUIDITY_MODAL' });
  };

  async function calcNearAmt(event) {
    let inputAmount = event.target.value;
    setTokenInputAmount(inputAmount);
    let token = {
      address: inputs.state.addLiquidityModal.selectedTokenName,
      amount: event.target.value
    }
    let amt = await calcNearAddLiquidity(token);
    dispatch({type:'UPDATE_ADD_LIQUIDITY_REQUIRED_NEAR_AMOUNT', payload: {requiredNearAmount: amt}})
  }

  function increaseAllowance(event) {
    console.log("increase allowance called in add liquidity")
    // incAllowance(inputs.state.swap.in)
  }

  return (
    <>
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
                  onChange={calcNearAmt}
                />
              </div>
            </div>
          </InputBox>
          <p className="mt-2 mb-1 text-center lead">+ {convertToE24Base5Dec(inputs.state.addLiquidityModal.requiredNearAmount)} NEAR</p>
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
                      >Increase to {tokenInputAmount}</Button>
              }
            </Col>
            <Col className="align-self-center">
              {convertToE24Base5Dec(tokenInputAmount / inputs.state.addLiquidityModal.requiredNearAmount)}
            </Col>
            <Col className="align-self-center">
              {convertToE24Base5Dec(inputs.state.addLiquidityModal.requiredNearAmount / tokenInputAmount)}
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="warning" onClick={toggleModalVisibility} disabled>
            Add liquidity
          </Button>
          <Button variant="secondary" onClick={toggleModalVisibility}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
