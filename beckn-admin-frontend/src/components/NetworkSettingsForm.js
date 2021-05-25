import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Form, Col, Card, Button } from "react-bootstrap";
import {
  fetchNetworkSettings,
  submitNetworkSettings,
} from "../redux/network_settings/actions";
import { syncPlatformSettings } from "../utils/platforms";
import SyncDBResults from "./SyncDBResults";

function NetworkSettingsForm(props) {
  const { network_settings } = useSelector((state) => ({
    network_settings: state.network_settings,
  }));

  const [syncResults, setSyncResults] = useState({});
  const [syncResultsStatus, setSyncResultsStatus] = useState("loaded");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchNetworkSettings());
  }, [dispatch]);

  useEffect(() => {
    if (network_settings.settings?.bg_uri) {
      setValue("bg_uri", network_settings.settings.bg_uri);
    }
  }, [network_settings.settings.bg_uri, setValue]);

  const onSubmit = async (data) => {
    console.log(data);
    dispatch(submitNetworkSettings(data));
  };

  const syncWithDB = async () => {
    setSyncResultsStatus("loading");
    const data = await syncPlatformSettings();
    setSyncResultsStatus("loaded");
    setSyncResults(data);
  };

  const onReset = async () => {
    await dispatch(fetchNetworkSettings());
    reset({ bg_uri: network_settings.settings.bg_uri });
  };

  const loader = syncResultsStatus ==="loading" ? <div>Loading...</div> : <></>

  let form_body;
  const additionalApplets = [];
  const syncDB = (
    <Card body className="FormCard" key="syncResults">
      <div className="d-flex justify-content-end pb-3">
        <Button onClick={syncWithDB}>Sync all settings with db</Button>
      </div>
      {loader}
      <SyncDBResults syncResults={syncResults.data} />
    </Card>
  );
  additionalApplets.push(syncDB);
  console.log(network_settings, network_settings.settings.bg_uri);
  console.log(
    "result",
    network_settings.settings?.bg_uri ? network_settings.settings.bg_uri : ""
  );
  if (network_settings.loading) {
    form_body = <div>Fetching network settings</div>;
  } else if (network_settings.error) {
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
              <Form.Label>Beckn Gateway URL</Form.Label>
            </Col>
            <Col>
              <Form.Control
                defaultValue={
                  network_settings.settings?.bg_uri
                    ? network_settings.settings.bg_uri
                    : ""
                }
                isInvalid={!!errors.delay}
                {...register("bg_uri", {
                  required: true,
                  min: 0,
                  pattern: /(?:^|[ \t])((https?:\/\/)?(?:localhost|[\w-]+(?:\.[\w-]+)+)(:\d+)?(\/\S*)?)/gm,
                })}
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
      </div>
    );
  }
  return (
    <div>
      <Card body className="FormCard">
        {form_body}
      </Card>
      {additionalApplets}
    </div>
  );
}

export default NetworkSettingsForm;
