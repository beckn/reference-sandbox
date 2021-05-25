import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Form, Button, Card } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { fetchAuth } from "../redux/auth/actions";
import { useDispatch, useSelector } from "react-redux";

export default function LoginForm(props) {
  const { auth } = useSelector((state) => ({
    auth: state.auth,
  }));

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const history = useHistory();
  const dispatch = useDispatch();
  
  useEffect(() => {
    if(auth.token !== "") {
      history.push("/")
    }
  }, [auth.token, history]);

  const onSubmit = async (data) => {
    console.log(data);
    dispatch(fetchAuth(data));
  };

  console.log("auth",auth);


  return (
    <Card body className="FormCard">
      <Card.Title className="FormTitle">Log In</Card.Title>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group>
          <Form.Label>User Name</Form.Label>
          <Form.Control
            placeholder="Enter user name"
            {...register("email", { required: true })}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            {...register("password", { required: true })}
            isInvalid={!!errors.password}
            required
          />
        </Form.Group>

        <Form.Group className="d-flex justify-content-between">
          <Button variant="primary" type="submit">
            Submit
          </Button>
          <div>{auth.error.toString()}</div>
          
        </Form.Group>
      </Form>
    </Card>
  );
}
