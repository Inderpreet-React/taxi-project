// PopularTime.js
import React from "react";
import { Card } from "react-bootstrap";

const PopularTime = ({ popularTime }) => {
  const formattedTime = `${popularTime.hour}:00`;

  return (
    <>
      <h3 className="main-headings popular-time">Rush Hour Hotspot</h3>

      <Card className="my-4">
        <Card.Body>
          <Card.Title></Card.Title>
          <Card.Text>
            <p>
              <strong>Time:</strong> {formattedTime}
            </p>
            <p>
              <strong>Count:</strong> {popularTime.count}
            </p>
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  );
};

export default PopularTime;
