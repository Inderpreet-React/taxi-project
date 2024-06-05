import React from "react";
import { Form } from "react-bootstrap";

const TableSelector = ({ tables, selectedTable, onSelectTable }) => {
  return (
    <Form.Group controlId="tableSelector" className="mb-4">
      <Form.Label className="main-headings">Explore Taxi Trip Data</Form.Label>
      <Form.Control
        as="select"
        value={selectedTable}
        onChange={(e) => onSelectTable(e.target.value)}
        className="custom-select"
      >
        {tables.map((table, index) => (
          <option key={index} value={table}>
            {table}
          </option>
        ))}
      </Form.Control>
    </Form.Group>
  );
};

export default TableSelector;
