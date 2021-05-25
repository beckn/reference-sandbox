import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Form, Col, Card, Button } from "react-bootstrap";
import {
  fetchPlatformSettings,
  submitPlatformSettings,
} from "../redux/platform_settings/actions";

function BAPSettings(props) {
  const { platform_settings } = useSelector((state) => ({
    platform_settings: state.platform_settings,
  }));

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPlatformSettings(props.platform.platform_endpoint));
  }, [dispatch, props.platform.platform_endpoint]);

  useEffect(() => {
    if (platform_settings.settings?.delay) {
      setValue("delay", platform_settings.settings.delay);
    }
  }, [platform_settings.settings.delay, setValue]);

  const onSubmit = async (data) => {
    dispatch(submitPlatformSettings(props.platform?.platform_endpoint, data));
  };

  const syncWithDB = async () => {
    const data = {
      bpp_id: props.platform.platform_name,
    };
    if (props.platform.platform_type === "BAP") {
      data.bap_uri = props.platform.platform_endpoint;
    } else {
      data.bpp_uri = props.platform.platform_endpoint;
    }
    await dispatch(
      submitPlatformSettings(props.platform.platform_endpoint, data)
    );
  };

  const onReset = async () => {
    await dispatch(fetchPlatformSettings(props.platform.platform_endpoint));
    reset({ delay: platform_settings.delay });
  };
  let form_body;
  const delay_form = (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Row>
        <Col xs="auto" className="my-1">
          <Form.Label>Delay in milliseconds</Form.Label>
        </Col>
        <Col>
          <Form.Control
            key={`delayinput${platform_settings.settings?.delay}`}
            defaultValue={
              platform_settings.settings?.delay
                ? platform_settings.settings.delay
                : "0"
            }
            type="number"
            isInvalid={!!errors.delay}
            {...register("delay", { required: true, min: 0 })}
          />
        </Col>
      </Form.Row>
      <Form.Row className="d-flex justify-content-end">
        <Col xs="auto" className="mt-3">
          <Button onClick={onReset}>Refetch values</Button>
        </Col>
        <Col xs="auto" className="mt-3">
          <Button type="submit">Submit values</Button>
        </Col>
      </Form.Row>
    </Form>
  );
  const platform_uri =
    props.platform.platform_type === "BAP"
      ? platform_settings.settings.bap_uri
      : platform_settings.settings.bpp_uri;

  const platform_id =
    props.platform.platform_type === "BAP"
      ? platform_settings.settings.bap_id
      : platform_settings.settings.bpp_id;

  const settings_display = (
    <div>
      <div className="container">
        <div className="row">
          <div className="col">Gateway URI set : </div>
          <div className="col">{platform_settings.settings.bg_uri}</div>
        </div>
        <div className="row">
          <div className="col">{props.platform.platform_type} ID set : </div>
          <div className="col">{platform_id}</div>
        </div>
        <div className="row">
          <div className="col">{props.platform.platform_type} URI set : </div>
          <div className="col">{platform_uri}</div>
        </div>
        <div className="row">
          <div className="col">Port set : </div>
          <div className="col">{platform_settings.settings.port}</div>
        </div>
      </div>
      <div className="d-flex justify-content-end">
        <Button onClick={syncWithDB}>Sync with DB</Button>
      </div>
    </div>
  );

  if (platform_settings.loading) {
    form_body = <div>Fetching platform settings</div>;
  } else if (platform_settings.error) {
    form_body = (
      <div>
        Error fetching platform settings
        <Button onClick={onReset}>Retry</Button>
      </div>
    );
  } else if(props.platform.platform_type === "BPP"){
    form_body = [delay_form, settings_display];
  } else {
    form_body = [settings_display];
  }
  return (
    <Card body className="FormCard">
      {form_body}
    </Card>
  );
}

export default BAPSettings;
