import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const Model = ({
  header,
  onHide,
  onUpdate,
  children,
  show,
  disabled,
  updateButton,
  size = "lg",
  footer = true,
  className,
}) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className={`${className}`}
      size={size}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">{header}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      {footer && (
        <Modal.Footer>
          <Button disabled={disabled} className="p-2" onClick={onUpdate}>
            {updateButton}
          </Button>
          <Button className="p-2" onClick={onHide}>
            Close
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default Model;
