import React, { useEffect, useState } from "react";
import { Table, Card, Alert, Button, Form, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import LoadingSpinner from "../Components/LoadingSpinner";

export default function LocationList({ locationList, getLocationList }) {
  const [locations, setLocations] = useState(locationList);
  const [hasErrors] = useState(null);
  const [isLoading] = useState(false);

  useEffect(() => {
    // setLoading(true);
    // getLocationList();
    setLocations(locationList);
  }, [locationList]);

  const submitHandler = (event) => {
    event.preventDefault();
  };

  const changeHandler = (event) => {
    let val = event.target.value;
    if (val.length >= 1) {
      const searchArray = locationList.filter(({ title }) =>
        title.includes(val)
      );
      setLocations(searchArray);
    } else {
      setLocations(locationList);
    }
  };

  return (
    <>
      {hasErrors ? <Alert variant="danger">{hasErrors.message}</Alert> : ""}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <>
            <Form onSubmit={submitHandler}>
              <Form.Row className="align-items-center">
                <Col>
                  <Form.Control
                    type="text"
                    placeholder="Sök mätplats"
                    onChange={changeHandler}
                    disabled={isLoading}
                    className="mr-sm-2"
                  />
                </Col>
                <Col xs="auto">
                  <Button title="Sök" className="mx-1">
                    Sök
                  </Button>
                </Col>
                <Col xs="auto">
                  <Button
                    title="Ladda om listan"
                    onClick={() => getLocationList()}
                  >
                    <i class="fas fa-redo"></i>
                  </Button>
                </Col>
              </Form.Row>
            </Form>
          </>
          <Card className="my-3">
            <Table borderless responsive>
              <thead>
                <tr>
                  <th>Plats</th>
                  <th>Temperatur</th>
                </tr>
              </thead>
              <tbody>
                {locations.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <Link to={`/plats/${row.id}`} className="text-muted">
                        {row.title}
                      </Link>
                    </td>
                    <td>{row.temp}&deg;C</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </>
      )}
    </>
  );
}
