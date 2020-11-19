import React, { useContext } from "react";

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { InputsContext } from "../contexts/InputsContext";

import styled from "@emotion/styled";


export default function CurrencySelectionModal(props) {

  // Inputs state
  const inputs = useContext(InputsContext);
  const { dispatch } = inputs;

  const toggleModalVisibility = () => {
    dispatch({ type: 'TOGGLE_ADD_LIQUIDITY_MODAL' });
  };

  return (
    <>
      <Modal show={inputs.state.addLiquidityModal.isVisible} onHide={toggleModalVisibility}>
        <Modal.Header closeButton>
          <Modal.Title>Select currency</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>stuff here</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleModalVisibility}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
