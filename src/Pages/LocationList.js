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
        title.toLowerCase().includes(val.toLowerCase())
      );
      setLocations(searchArray);
    } else {
      setLocations(locationList);
    }
  };

  return (
    <>
      {hasErrors ? (
        <Alert variant="danger" className="my-3">
          {hasErrors.message}
        </Alert>
      ) : (
        ""
      )}
      <>
        <Form onSubmit={submitHandler} className="my-3">
          <Form.Row className="align-items-center">
            <Col>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text className="bg-dark" style={{ border: 0 }}>
                    <i className="fas fa-search-location"></i>
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  type="search"
                  className="mr-sm-2"
                  placeholder="Sök mätplats"
                  onChange={changeHandler}
                  disabled={isLoading}
                />
              </InputGroup>
            </Col>
            <Col xs="auto">
              <Button title="Sök" className="btn btn-secondary mx-1">
                Sök
              </Button>
            </Col>
            <Col xs="auto">
              <Button
                title="Ladda om listan"
                onClick={() => {
                  getLocationList();
                }}
                className="btn btn-secondary"
              >
                <i className="fas fa-sync-alt"></i>
              </Button>
            </Col>
          </Form.Row>
        </Form>
      </>
      <Card className="my-3">
        <p className="pt-1 text-center">
          <b>Sortering:</b>
          <br />
          <small className="text-muted">
            <span
              className="sortLink"
              onClick={() => {
                setLoading(true);
                setLocations(locationList);
                setLoading(false);
              }}
            >
              Alfabetiskt
            </span>
            {" "}|{" "}
            <span
              className="sortLink"
              onClick={() => {
                setLoading(true);
                const filtered = locations.filter(({ temp }) => parseFloat(temp));
                const sorted = filtered.sort((a, b) => {
                  return parseFloat(a.temp) - parseFloat(b.temp);
                });
                setLocations(sorted);
                setLoading(false);
              }}
            >
              Lägsta temperatur överst
            </span>
            {" "}|{" "}
            <span
              className="sortLink"
              onClick={() => {
                setLoading(true);
                const filtered = locations.filter(({ temp }) => parseFloat(temp));
                const sorted = filtered.sort((a, b) => {
                  return parseFloat(b.temp) - parseFloat(a.temp);
                });
                setLocations(sorted);
                setLoading(false);
              }}
            >
              Högsta temperatur överst
            </span>
          </small>
        </p>
      </Card>
      {isLoading ? <LoadingSpinner /> : ""}
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
                    <i
                      className="fas fa-star uiIcon"
                      style={{ color: "orange" }}
                      onClick={() => {
                        let tempFavs = removeFavorite(row.id);
                        setUserFavorites(tempFavs);
                      }}
                    ></i>
                  ) : (
                    <i
                      className="far fa-star uiIcon"
                      onClick={() => {
                        let tempFavs = addFavorite(row.id);
                        setUserFavorites(tempFavs);
                      }}
                    ></i>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </>
  );
}
