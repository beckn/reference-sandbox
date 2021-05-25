import React from "react";
import { useForm } from "react-hook-form";
import { Form, Button, Card } from "react-bootstrap";

function BAPTriggerForm(props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <div>
      <Card body className="FormCard">
        <Card.Title className="FormTitle">New Node Registration</Card.Title>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Card>
    </div>
  );
}

export default BAPTriggerForm;
