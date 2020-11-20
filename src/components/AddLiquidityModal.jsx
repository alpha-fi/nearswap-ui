import React, { useContext, useState } from "react";

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

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

  const toggleModalVisibility = () => {
    dispatch({ type: 'TOGGLE_ADD_LIQUIDITY_MODAL' });
  };

  const [nearAmt, setNearAmt] = useState(0.0);

  return (
    <>
      <Modal show={inputs.state.addLiquidityModal.isVisible} onHide={toggleModalVisibility}>
        <Modal.Header closeButton>
          <Modal.Title>Add liquidity</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputBox className="py-2">
            <label className="ml-4 mb-1 mt-0">
              <small className="text-secondary">{inputs.state.addLiquidityModal.selectedTokenName} Amount</small>
            </label>
            <div className="px-2">
              <div className="input-group-lg mb-1">
                <input type="text" className="form-control border-0 bg-transparent" placeholder="0.0"/>
              </div>
            </div>
          </InputBox>
          <p className="ml-2 mt-1 mb-0 text-secondary">+ {nearAmt} NEAR</p>
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
