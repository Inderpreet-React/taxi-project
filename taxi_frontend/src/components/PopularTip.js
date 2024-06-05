// PopularTip.js
import React from "react";
import { Card } from "react-bootstrap";

const PopularTip = ({ avgTipAmount }) => {
  return (
    <>
      <h3 className="main-headings">Average Tip Amount</h3>
      <Card className="my-4">
        <Card.Body>
          <Card.Text>
            <strong>Tip Amount:</strong> ${avgTipAmount.toFixed(2)}
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  );
};

export default PopularTip;
