import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { Pie, Line, Bar, Radar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  RadialLinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  RadialLinearScale,
  BarElement
);

const chartComponents = {
  Pie: Pie,
  Line: Line,
  Bar: Bar,
  Radar: Radar,
  Doughnut: Doughnut,
};

const Statistics = ({ stats, chartData, selectedChartType }) => {
  const ChartComponent = chartComponents[selectedChartType];

  return (
    <div>
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Body className="journey-time">
              <span>
                <Card.Title className="sub-headings journey-card-title">
                  Journey Time Metrics
                </Card.Title>
                <Card.Text className="card-text journey-text">
                  Typical Journey: {stats.avgJourneyTime}
                </Card.Text>
                <Card.Text className="card-text journey-text">
                  Quickest Ride: {stats.minJourneyTime}
                </Card.Text>
                <Card.Text className="card-text journey-text">
                  Longest Ride: {stats.maxJourneyTime}
                </Card.Text>
              </span>
              <span>
                <img
                  src={require("../images/clock1.png")}
                  alt="Customer Support"
                  class="journey-icon"
                />
              </span>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body className="journey-time">
              <span>
                <Card.Title className="sub-headings journey-card-title">
                  Total Cost Metrics
                </Card.Title>
                <Card.Text className="card-text journey-text">
                  Typical Fare: {stats.avgTotalCost}
                </Card.Text>
                <Card.Text className="card-text journey-text">
                  Lowest Fare: {stats.minTotalCost}
                </Card.Text>
                <Card.Text className="card-text journey-text">
                  Highest Fare: {stats.maxTotalCost}
                </Card.Text>
              </span>
              <span>
                <img
                  src={require("../images/totalcost.png")}
                  alt="Customer Support"
                  class="journey-icon"
                />
              </span>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Journey Time {selectedChartType} Chart</Card.Title>
              <ChartComponent data={chartData.journeyTime} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Total Cost {selectedChartType} Chart</Card.Title>
              <ChartComponent data={chartData.totalCost} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Statistics;
