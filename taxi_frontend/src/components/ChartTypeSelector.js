import React from "react";
import { Form } from "react-bootstrap";

const ChartTypeSelector = ({
  chartTypes,
  selectedChartType,
  onSelectChartType,
}) => {
  return (
    <Form.Group controlId="chartTypeSelector" className="mb-4">
      <Form.Label className="main-headings">
        Visualize Data Chart Insights
      </Form.Label>
      <Form.Control
        as="select"
        value={selectedChartType}
        onChange={(e) => onSelectChartType(e.target.value)}
        className="custom-select"
      >
        {chartTypes.map((chartType, index) => (
          <option key={index} value={chartType}>
            {chartType}
          </option>
        ))}
      </Form.Control>
    </Form.Group>
  );
};

export default ChartTypeSelector;
