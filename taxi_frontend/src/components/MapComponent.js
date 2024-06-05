//key: "AIzaSyAdQXU3eRdihBwLvweY47GyyL8nBC3Dv6c"

import React from "react";
import GoogleMapReact from "google-map-react";
import { Container, Row, Col, Table } from "react-bootstrap";

const Marker = ({ text }) => (
  <div style={{ color: "black", fontWeight: "bold", textAlign: "center" }}>
    <img
      src="https://maps.google.com/mapfiles/ms/icons/red-dot.png"
      alt={text}
      style={{ marginBottom: "5px" }}
    />
    <div>{text}</div>
  </div>
);

const MapComponent = ({ pickupLocation, dropoffLocation }) => {
  const defaultProps = {
    center: {
      lat: (pickupLocation.latitude + dropoffLocation.latitude) / 2,
      lng: (pickupLocation.longitude + dropoffLocation.longitude) / 2,
    },
    zoom: 11,
  };

  return (
    <Container>
      <Row>
        <Col>
          <h3 className="mt-3 main-headings">Key Location Stats</h3>
          <Table striped bordered className="my-3 map-img">
            <thead>
              <tr>
                <th className="col-text">Drop Off Number</th>
                <th className="col-text">Pick Up Number</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{dropoffLocation.count}</td>
                <td>{pickupLocation.count}</td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col>
          <h3 className="mt-3 main-headings">Top Pick Up & Drop Off Spots</h3>
        </Col>
      </Row>
      <div style={{ height: "400px", width: "100%", marginTop: "20px" }}>
        <GoogleMapReact
          bootstrapURLKeys={{
            key: "AIzaSyAdQXU3eRdihBwLvweY47GyyL8nBC3Dv6c",
          }}
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
        >
          <Marker
            lat={pickupLocation.latitude}
            lng={pickupLocation.longitude}
            // text={`Pickup: ${pickupLocation.count}`}
            text={`Pickup`}
          />
          <Marker
            lat={dropoffLocation.latitude}
            lng={dropoffLocation.longitude}
            // text={`Dropoff: ${dropoffLocation.count}`}
            text={`Dropoff`}
          />
        </GoogleMapReact>
      </div>
    </Container>
  );
};

export default MapComponent;
