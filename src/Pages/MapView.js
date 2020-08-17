import React from "react";
import { Card } from "react-bootstrap";
import { Popup } from "react-map-gl";
import ReactMapGL from "react-map-gl";

export default function MapView() {
  return (
    <Card className="my-3">
      <ReactMapGL
        mapboxApiAccessToken="pk.eyJ1IjoiamV3ZW5zb24iLCJhIjoiY2tkeWkxdDAxMndjaTJ0b2Rpc3p2a3pweSJ9.r_KppxmTaSixudgMmFpW7A"
        mapStyle="mapbox://styles/jewenson/ckbtk7ve70z1t1iqlcryenuzz"
        {...viewport}
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
      >
        <Popup
          closeButton={false}
          key={locationData.id}
          latitude={parseFloat(locationData.lat)}
          longitude={parseFloat(locationData.lon)}
        >
          <div className="p-1 text-center">
            <i className="fas fa-temperature-high"></i>
            <br />
            <span
              className="temperatureSmall"
              style={{ color: colorTemperature(locationData.temp) }}
            >
              {locationData.temp}&deg;C
            </span>
          </div>
        </Popup>
      </ReactMapGL>
    </Card>
  );
}
