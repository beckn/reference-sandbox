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
      setValue( 'delay', platform_settings.settings.delay);
    }
  }, [platform_settings.settings.delay, setValue]);

  const onSubmit = async (data) => {
    dispatch(submitPlatformSettings(props.platform?.platform_endpoint, data));
  };

  const syncWithDB = async () => {
    const data = {
      bpp_id: props.platform.platform_name,
      bap_uri: props.platform.platform_endpoint,
    }
    await dispatch(submitPlatformSettings(props.platform.platform_endpoint, data));
  };

  const onReset = async () => {
    await dispatch(fetchPlatformSettings(props.platform.platform_endpoint));
    reset({ delay: platform_settings.delay });
  };
  let form_body;
  console.log(platform_settings, platform_settings.settings.delay, platform_settings.settings?.delay
    ? platform_settings.settings.delay
    : "0")
  if (platform_settings.loading) {
    form_body = <div>Fetching platform settings</div>;
  } else if (platform_settings.error) {
    form_body = (
      <div>
        Error fetching platform settings
        <Button onClick={onReset}>Refetch values</Button>
      </div>
    );
  } else {
    form_body = (
      <div>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Row>
            <Col xs="auto" className="my-1">
              <Form.Label>Delay in milliseconds</Form.Label>
            </Col>
            <Col>
              <Form.Control
                key = {`delayinput${platform_settings.settings?.delay}`}
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
        <div className="container">
          <div className="row">
            <div className="col">Gateway URI set : </div>
            <div className="col">{platform_settings.settings.bg_uri}</div>
          </div>
          <div className="row">
            <div className="col">BPP ID set : </div>
            <div className="col">{platform_settings.settings.bpp_id}</div>
          </div>
          <div className="row">
            <div className="col">BPP URI set : </div>
            <div className="col">{platform_settings.settings.bpp_uri}</div>
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
  }
  return (
    <Card body className="FormCard">
      {form_body}
    </Card>
  );
}

export default BAPSettings;
