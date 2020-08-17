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
  isLoading,
  setLoading,
  locationList,
  getLocationList,
  userFavorites,
  setUserFavorites,
}) {
  document.title = "Listar alla mätpunkter";
  const [locations, setLocations] = useState(locationList);
  const [hasErrors] = useState(null);

  useEffect(() => {
    setLocations(locationList);
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
                  <InputGroup.Text>
                    <i className="fas fa-search-location"></i>
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  type="search"
                  id="locationSearchBar"
                  className="mr-sm-2"
                  placeholder="Sök mätplats"
                  onChange={changeHandler}
                  disabled={isLoading}
                />
              </InputGroup>
            </Col>
            <Col xs="auto">
              <Button
                title="Ladda om listan"
                onClick={() => {
                  getLocationList();
                }}
                className="btn btn-dark"
              >
                {isLoading ? (
                  <i className="fas fa-sync fa-spin mr-1"></i>
                ) : (
                  <i className="fas fa-sync-alt mr-1"></i>
                )}
                Uppdatera listan
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
                const filtered = locations.filter(({ title }) =>
                  title.toLowerCase()
                );
                const sorted = filtered.sort((a, b) => {
                  if (a.title < b.title) {
                    return -1;
                  }
                  if (a.title > b.title) {
                    return 1;
                  }
                  return 0;
                });
                setLocations(sorted);
                setLoading(false);
              }}
            >
              Alfabetiskt
            </span>{" "}
            |{" "}
            <span
              className="sortLink"
              onClick={() => {
                setLoading(true);
                const filtered = locations.filter(({ temp }) =>
                  parseFloat(temp)
                );
                const sorted = filtered.sort((a, b) => {
                  return parseFloat(a.temp) - parseFloat(b.temp);
                });
                setLocations(sorted);
                setLoading(false);
              }}
            >
              Lägsta temperatur överst
            </span>{" "}
            |{" "}
            <span
              className="sortLink"
              onClick={() => {
                setLoading(true);
                const filtered = locations.filter(({ temp }) =>
                  parseFloat(temp)
                );
                const sorted = filtered.sort((a, b) => {
                  return parseFloat(b.temp) - parseFloat(a.temp);
                });
                setLocations(sorted);
                setLoading(false);
              }}
            >
              Högsta temperatur överst
            </span>{" "}
            |{" "}
            <span
              className="sortLink"
              onClick={() => {
                setLocations(locationList);
                document.getElementById("locationSearchBar").value = "";
              }}
            >
              Ta bort filter
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
                  <Link to={`/plats/${row.id}`}>{row.title}</Link>
                </td>
                <td>{row.temp}&deg;C</td>
                <td>
                  {userFavorites.includes(row.id) ? (
                    <i
                      className="fas fa-star uiIcon uiIconFavorited"
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
