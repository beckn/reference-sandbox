import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, Button, Card, Tooltip, OverlayTrigger } from "react-bootstrap";
import { useHistory } from "react-router-dom";

import { submitNewPlatformForm, editPlatformForm } from "../utils/platforms";

export default function PlatformDetailsForm(props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [serverError, setserverError] = useState("");
  const history = useHistory();

  const onSubmit = async (data) => {
    let result;
    if (props.record) {
      result = await editPlatformForm({ id: props.record.id, ...data });
    } else {
      result = await submitNewPlatformForm(data);
    }
    if (result.status === "complete") {
      history.push("/platforms");
    } else {
      setserverError(result.message);
    }
  };

  const title = props.record
    ? "Edit Platform Details"
    : "New Platform Registration";

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Mock flag should be ticked only for mock platforms that are part of the sandbox
    </Tooltip>
  );

  return (
    <Card body className="FormCard">
      <Card.Title className="FormTitle">{title}</Card.Title>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group>
          <Form.Label>Platform Name</Form.Label>
          <Form.Control
            defaultValue={props.record ? props.record.platform_name : ""}
            placeholder="Enter Platform Name"
            {...register("platform_name", { required: true, maxLength: 80 })}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Platform Endpoint</Form.Label>
          <Form.Control
            defaultValue={props.record ? props.record.platform_endpoint : ""}
            placeholder="Enter Platform Endpoint"
            {...register("platform_endpoint", {
              required: true,
              maxLength: 80,
              pattern: /(?:^|[ \t])((https?:\/\/)?(?:localhost|[\w-]+(?:\.[\w-]+)+)(:\d+)?(\/\S*)?)/gm,
            })}
            required
            isInvalid={!!errors.platform_endpoint}
          />
          <Form.Control.Feedback type="invalid" tooltip>
            Please enter a valid URL
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label>Public Key</Form.Label>
          <Form.Control
            defaultValue={props.record ? props.record.public_key : ""}
            as="textarea"
            rows={3}
            placeholder="Enter public key of the platform"
            {...register("public_key", { required: true })}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Domain</Form.Label>
          <Form.Control
            defaultValue={props.record ? props.record.domain : ""}
            placeholder="Enter domin of the platform"
            {...register("domain", { required: true })}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Country</Form.Label>
          <Form.Control
            defaultValue={props.record ? props.record.country : ""}
            placeholder="Enter country of the platform"
            {...register("country", { required: true })}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>City</Form.Label>
          <Form.Control
            defaultValue={props.record ? props.record.city : ""}
            placeholder="Enter city of the platform"
            {...register("city", { required: true })}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Select Platform Type</Form.Label>
          <div className="d-flex flex-row">
            <Form.Control
              defaultValue={props.record ? props.record.platform_type : "BAP"}
              as="select"
              {...register("platform_type", { required: true })}
              required
              style={{ width: "300px" }}
            >
              <option value="BAP">BAP</option>
              <option value="BPP">BPP</option>
            </Form.Control>

            <OverlayTrigger
              placement="top"
              delay={{ show: 150, hide: 400 }}
              overlay={renderTooltip}
            >
              <Form.Check
                defaultChecked={props.record ? props.record.is_mock : false}
                type="checkbox"
                id={`default-checkbox`}
                label={`Is mock server?`}
                style={{ paddingLeft: "50px" }}
                {...register("is_mock")}
              />
            </OverlayTrigger>
            <Form.Check
              defaultChecked={props.record ? props.record.active : true}
              type="checkbox"
              id={`default-checkbox2`}
              label={`Active?`}
              style={{ paddingLeft: "50px" }}
              {...register("active")}
            />
          </div>
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
