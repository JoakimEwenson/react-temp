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
  locationListAge,
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
                  <InputGroup.Text className="bg-dark">
                    <svg
                      className="searchbarIcon"
                      fill="none"
                      stroke="white"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
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
            {(new Date().getTime() - locationListAge) / 1000 > 180000 ? (
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
                </Button>
              </Col>
            ) : (
              ""
            )}
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
                    <>
                      <svg
                        className="favlistIcon uiIconFavorited"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={() => {
                          let tempFavs = removeFavorite(row.id);
                          setUserFavorites(tempFavs);
                        }}
                        title="Ta bort från favoriter"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        ></path>
                      </svg>
                    </>
                  ) : (
                    <>
                      <svg
                        className="favlistIcon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={() => {
                          let tempFavs = addFavorite(row.id);
                          setUserFavorites(tempFavs);
                        }}
                        title="Lägg till i favoriter"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        ></path>
                      </svg>
                    </>
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
