import React, { useEffect, useState } from "react";
import {
  Table,
  Card,
  Alert,
  Button,
  Form,
  Col,
  InputGroup,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import LoadingSpinner from "../Components/LoadingSpinner";
import { removeFavorite, addFavorite } from "../Utils/Common";

export default function LocationList({
  locationList,
  getLocationList,
  userFavorites,
  setUserFavorites,
}) {
  document.title = "Listar alla mätpunkter";
  const [locations, setLocations] = useState(locationList);
  const [hasErrors] = useState(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setLocations(locationList);
    setLoading(false);
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
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text>
                        <i className="fas fa-search-location"></i>
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      type="text"
                      className="mr-sm-2"
                      placeholder="Sök mätplats"
                      onChange={changeHandler}
                      disabled={isLoading}
                      autoFocus
                    />
                  </InputGroup>
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
                    <i className="fas fa-redo"></i>
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
                    <td>
                    {userFavorites.includes(row.id) ? (
                      <i className="fas fa-heart" style={{ color: "red" }} onClick={() => {
                        let tempFavs = removeFavorite(row.id);
                        setUserFavorites(tempFavs);
                      }}></i>
                    ) : (
                      <i className="fas fa-heart" onClick={() => {
                        let tempFavs = addFavorite(row.id);
                        setUserFavorites(tempFavs);
                      }}></i>
                    )}
                    </td>
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
