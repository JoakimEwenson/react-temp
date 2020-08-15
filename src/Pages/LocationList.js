import React, { useEffect, useState } from "react";
import { Table, Card, Alert, Button } from "react-bootstrap";
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


  return (
    <>
      {hasErrors ? <Alert variant="danger">{hasErrors.message}</Alert> : ""}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="text-center mx-auto p-3">
            <Button onClick={() => getLocationList()}>Ladda om listan</Button>
          </div>
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
