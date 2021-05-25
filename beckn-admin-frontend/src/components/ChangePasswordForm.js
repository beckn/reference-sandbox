import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Form, Button, Card } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { changePassword } from "../utils/auth";
import { clearAuth } from "../redux/auth/actions";

export default function ChangePasswordForm(props) {
  const [serverError, setSrverError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const history = useHistory();
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    const result = await changePassword(data.old_password, data.password);
    if(result?.status === "error") {
      setSrverError(result?.message.toString());
    } else {
      alert("Password updated. Please login with new password.")
      dispatch(clearAuth());
      history.push('/login')
    }
  };

  const password = useRef({});
  password.current = watch("password", "");

  return (
    <Card body className="FormCard">
      <Card.Title className="FormTitle">Log In</Card.Title>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group>
          <Form.Label>Old Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            {...register("old_password", { required: true })}
            isInvalid={!!errors.old_password}
            required
          />
          {errors.old_password && <p>{errors.old_password.message}</p>}
        </Form.Group>

        <Form.Group>
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            {...register("password", {
              required: true,
              minLength: {
                value: 8,
                message: "Password must have at least 8 characters",
              },
            })}
            isInvalid={!!errors.password}
            required
          />
          {errors.password && <p>{errors.password.message}</p>}
        </Form.Group>

        <Form.Group>
          <Form.Label>Re-enter Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            {...register("new_password_repeat", {
              required: true,
              validate: (value) =>
                value === password.current || "The passwords do not match",
            })}
            isInvalid={!!errors.new_password_repeat}
            required
          />
          {errors.new_password_repeat && (
            <p>{errors.new_password_repeat.message}</p>
          )}
        </Form.Group>

        <Form.Group className="d-flex justify-content-between">
          <Button variant="primary" type="submit">
            Submit
          </Button>
          <div>{serverError}</div>
        </Form.Group>
      </Form>
    </Card>
  );
}
