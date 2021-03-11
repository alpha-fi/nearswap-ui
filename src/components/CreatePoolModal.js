import React, { useContext, useState } from "react";

import { incAllowance, createPool, getAllowance } from "../services/near-nep21-util";

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { InputsContext } from "../contexts/InputsContext";
import styled from "@emotion/styled";
import { BsArrowDown } from "react-icons/bs";
import { AiOutlinePlusSquare } from "react-icons/ai";

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
  const [tokenAddress, setTokenAddress] = useState("");
  const [nearAmount, setNearAmount] = useState("");

  const toggleModalVisibility = () => {
    dispatch({ type: 'TOGGLE_CREATE_POOL_MODAL' });
    setTokenInputAmount("");
    setTokenAddress("");
    setNearAmount("");
  };

  async function handleTokenInput(event) {
    let inputAmount = event.target.value;
    setTokenInputAmount(inputAmount);
  }

  async function handleTokenAddressInput(event) {
    let input = event.target.value;
    setTokenAddress(input);
    let token = {
      address: inputs.state.createPoolModal.tokenAddress
    }
    let allowance = await getAllowance(token);
    dispatch({
      type:'UPDATE_CREATE_POOL_TOKEN_ALLOWANCE',
      payload: {tokenAllowance: allowance}
    })
  }

  async function handleNearAmount(event) {
    let input = event.target.value;
    setNearAmount(input);
  }

  function increaseAllowance() {
    let token = {
      address: inputs.state.createPoolModal.tokenAddress,
      amount: tokenInputAmount
    }
    incAllowance(token);
  }

  function handleCreatePool() {
    createPool(
      inputs.state.createPoolModal.tokenAddress,
      inputs.state.createPoolModal.initialToken,
      inputs.state.createPoolModal.initialNear
    );
  }

  return (
    <Modal show={inputs.state.createPoolModal.isVisible} onHide={toggleModalVisibility}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Pool</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InputBox className="py-2">
          <label className="ml-4 mb-1 mt-0">
            <small className="text-secondary">Token Address</small>
          </label>
          <div className="px-2">
            <div className="input-group-lg mb-1">
              <input
                type="text"
                value={tokenAddress}
                className="form-control border-0 bg-transparent"
                placeholder="0.0"
                onChange={handleTokenAddressInput}
              />
            </div>
          </div>
        </InputBox>

        <div className="text-center my-2">
        <span style={{ cursor: 'pointer' }}><BsArrowDown /></span>
        </div>

        <InputBox className="py-2">
          <label className="ml-4 mb-1 mt-0">
            <small className="text-secondary">Token Amount</small>
          </label>
          <div className="px-2">
            <div className="input-group-lg mb-1">
              <input
                type="text"
                value={tokenInputAmount}
                className="form-control border-0 bg-transparent"
                placeholder="0.0"
                onChange={handleTokenInput}
              />
            </div>
          </div>
        </InputBox>

        <div className="text-center my-2">
        <span style={{ cursor: 'pointer' }}><AiOutlinePlusSquare /></span>
        </div>

        <InputBox className="py-2">
          <label className="ml-4 mb-1 mt-0">
            <small className="text-secondary">Near Amount</small>
          </label>
          <div className="px-2">
            <div className="input-group-lg mb-1">
              <input
                type="text"
                value={nearAmount}
                className="form-control border-0 bg-transparent"
                placeholder="0.0"
                onChange={handleNearAmount}
              />
            </div>
          </div>
        </InputBox>

        <Row className="text-center pt-2">
          <Col>
            <small className="text-secondary">Allowance</small>
          </Col>
          <Col>
            <small className="text-secondary">{inputs.state.createPoolModal.tokenAddress} per NEAR</small>
          </Col>
          <Col>
            <small className="text-secondary">NEAR per {inputs.state.createPoolModal.tokenAddress}</small>
          </Col>
        </Row>
        <Row className="text-center pb-2">
          <Col className="align-self-center">
            {inputs.state.createPoolModal.tokenAllowance}
            <br/>
            {((tokenInputAmount > 0) && (inputs.state.createPoolModal.tokenAllowance < tokenInputAmount))
              && <Button
                    size="sm"
                    variant="warning"
                    onClick={increaseAllowance}
                    ><small>Increase to {tokenInputAmount}</small></Button>
            }
          </Col>
          <Col className="align-self-center">
            {(inputs.state.createPoolModal.tokenPerNear)}
          </Col>
          <Col className="align-self-center">
            {(inputs.state.createPoolModal.nearPerToken)}
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="warning"
          onClick={handleCreatePool}
          disabled={((tokenInputAmount <= 0) || (inputs.state.createPoolModal.tokenAllowance < tokenInputAmount))}
        >
        Add New Pool
        </Button>
        <Button variant="secondary" onClick={toggleModalVisibility}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
