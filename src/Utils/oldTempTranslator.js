// Create a random CLI for testing
// TODO: Remove this and get a proper CLI from temperatur.nu
function getRandomCli(length) {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// Functions for deciding type of request
function setLocationId(locationId) {
  // Set up access to the API
  const CLI = getRandomCli(12);
  const APIURL =
    "https://api.temperatur.nu/tnu_1.15.php?p=" +
    locationId +
    "&verbose&amm=true&cli=" +
    CLI;

  getTemperatureData(APIURL);
}

function setPositionId(lat, long) {
  // Set up access to the API
  const CLI = getRandomCli(12);
  const APIURL =
    "https://api.temperatur.nu/tnu_1.15.php?lat=" +
    lat +
    "&lon=" +
    long +
    "&verbose&amm=true&cli=" +
    CLI;

  getTemperatureData(APIURL);
}

// Collect a list of locations from temperatur.nu
function getLocationList() {
  // Set up URL and CLI for the request
  const CLI = getRandomCli(12);
  const APIURL = "https://api.temperatur.nu/tnu_1.15.php?cli=" + CLI;

  // Set up API request
  let request = new XMLHttpRequest();
  request.open("GET", APIURL, true);
  // Handle API result
  request.onload = function () {
    let parser, xmlDoc, locationList;
    parser = new DOMParser();
    xmlDoc = parser.parseFromString(this.response, "text/xml");

    // Set up empty string to fill with data for the HTML select element
    locationList = [];

    // Iterate results and input into string
    for (let i = 1; i < xmlDoc.getElementsByTagName("id").length; i++) {
      let row = {
        id: xmlDoc.getElementsByTagName("id")[i - 1].innerHTML,
        title: xmlDoc.getElementsByTagName("title")[i].innerHTML,
        temp: xmlDoc.getElementsByTagName("temp")[i].innerHTML,
      };
      locationList.push(row);
    }
    console.table(locationList);
  };

  request.send();
}

// This function collects data from temperatur.nu API
function getTemperatureData(APIURL) {
  // Set up API request
  let request = new XMLHttpRequest();
  request.open("GET", APIURL, true);
  // Handle API return
  request.onload = function () {
    let parser, xmlDoc;
    parser = new DOMParser();
    xmlDoc = parser.parseFromString(this.response, "text/xml");

    // Set default values for fail safe handling
    let emptyText = "N/A";
    let title = emptyText;
    let minTemp = emptyText;
    let maxTemp = emptyText;
    let minTempTime = emptyText;
    let maxTempTime = emptyText;
    let avgTemp = emptyText;
    let ammTimeSpan = emptyText;
    let lastUpdate = emptyText;
    let sourceInfo = emptyText;
    let sourceUrl = "http://www.temperatur.nu";

    // Get values from XML response
    let locationTitle = xmlDoc.getElementsByTagName("title")[1].childNodes[0]
      .nodeValue;
    let locationTitleArray = locationTitle.split("/");
    let id = xmlDoc.getElementsByTagName("id")[0].childNodes[0].nodeValue;
    let locationLat = xmlDoc.getElementsByTagName("lat")[0].childNodes[0]
      .nodeValue;
    let locationLong = xmlDoc.getElementsByTagName("lon")[0].childNodes[0]
      .nodeValue;
    let temperature = xmlDoc.getElementsByTagName("temp")[0].childNodes[0]
      .nodeValue;

    // Check if location title is longer than 1 word
    if (locationTitleArray.length > 0) {
      title = "";
      for (let i = 0; i < locationTitleArray.length; i++) {
        title += locationTitleArray[i] + "<br>";
      }
    } else {
      title = locationTitle;
    }

    // Check  if content exists before trying to populate
    if (xmlDoc.getElementsByTagName("min")[0].childNodes.length > 0) {
      minTemp = xmlDoc.getElementsByTagName("min")[0].childNodes[0].nodeValue;
    }
    if (xmlDoc.getElementsByTagName("max")[0].childNodes.length > 0) {
      maxTemp = xmlDoc.getElementsByTagName("max")[0].childNodes[0].nodeValue;
    }
    if (xmlDoc.getElementsByTagName("average")[0].childNodes.length > 0) {
      avgTemp = xmlDoc.getElementsByTagName("average")[0].childNodes[0]
        .nodeValue;
    }
    if (xmlDoc.getElementsByTagName("minTime")[0].childNodes.length > 0) {
      minTempTime = xmlDoc.getElementsByTagName("minTime")[0].childNodes[0]
        .nodeValue;
    }
    if (xmlDoc.getElementsByTagName("maxTime")[0].childNodes.length > 0) {
      maxTempTime = xmlDoc.getElementsByTagName("maxTime")[0].childNodes[0]
        .nodeValue;
    }
    if (xmlDoc.getElementsByTagName("ammRange")[0].childNodes.length > 0) {
      ammTimeSpan = xmlDoc.getElementsByTagName("ammRange")[0].childNodes[0]
        .nodeValue;
    }
    if (xmlDoc.getElementsByTagName("lastUpdate")[0].childNodes.length > 0) {
      lastUpdate = xmlDoc.getElementsByTagName("lastUpdate")[0].childNodes[0]
        .nodeValue;
    }
    if (xmlDoc.getElementsByTagName("sourceInfo")[0].childNodes.length > 0) {
      sourceInfo = xmlDoc.getElementsByTagName("sourceInfo")[0].childNodes[0]
        .nodeValue;
    }
    if (
      (sourceUrl = xmlDoc.getElementsByTagName("url")[0].childNodes.length > 0)
    ) {
      sourceUrl = xmlDoc.getElementsByTagName("url")[0].childNodes[0].nodeValue;
    }

    // Check timestamp and report if it's old
    timeChecker(lastUpdate);

    // Get text color based on temperature
    document.getElementById(
      "temperatureResults"
    ).style.color = colorTemperature(temperature);

    // Populate page elements
    /* 
    document.getElementById("cityTitle").innerHTML =
      "<a href='https://www.openstreetmap.org/?mlat=" +
      locationLat +
      "&mlon=" +
      locationLong +
      "#map=10/" +
      locationLat +
      "/" +
      locationLong +
      "' target='_blank' style='text-decoration: none;'>" +
      title +
      "</a>";
    document.getElementById("temperatureResults").innerHTML =
      "<a href='" +
      sourceUrl +
      "' style='text-decoration:none;'>" +
      temperature +
      "&deg;C</a>";
    document.getElementById("minMaxAvgResults").innerHTML =
      "Min: " +
      minTemp +
      "&deg;C &bull; Max: " +
      maxTemp +
      "&deg;C &bull; Medel: " +
      avgTemp +
      "&deg;C";
    document.getElementById("minMaxAvgResults").title =
      "Lägsta temperatur uppmätt: " +
      minTempTime +
      "\nHögsta temperatur uppmätt: " +
      maxTempTime;
    document.getElementById("ammTimeSpan").innerHTML = ammTimeSpan;
    document.getElementById("sourceInfo").innerHTML =
      sourceInfo +
      "&nbsp;K&auml;lla: <a href='" +
      sourceUrl +
      "'>temperatur.nu</a>" +
      "<br>";
    document.getElementById("lastUpdate").innerHTML =
      "Senast uppdaterat: " + lastUpdate;
    document.getElementById("pageTimestamp").innerHTML =
      " - Sidan genererad: " +
      new Date().toLocaleDateString("sv-SE") +
      " " +
      new Date().toLocaleTimeString("sv-SE");
    // Set document title
    document.title = temperature + " i " + locationTitle + " just nu";

    // Set up fallback location if accuracy is lost
    if (sessionStorage.getItem("locationId") == "gps") {
      fallbackLocation = id;
      sessionStorage.setItem("locationId", "gps");
    } else {
      fallbackLocation = id;
      sessionStorage.setItem("locationId", id);
    }

    // Populate debug information
    document.getElementById("debugInfo").innerHTML =
      "Positionsdata: lat " +
      latResult +
      " - lon " +
      longResult +
      "<br>Exakthet (radie i meter): " +
      accuracyResult +
      "<br>Backup-plats: " +
      fallbackLocation +
      "<br>Data sparat i webbl&auml;saren: " +
      sessionStorage.getItem("locationId");
   */
  };

  request.send();
}

// This function collects browser positioning data
let getPosition = function (position) {
  let latResult = position.coords.latitude;
  let longResult = position.coords.longitude;
  let accuracyResult = position.coords.accuracy;
  if (accuracyResult < 10000) {
    console.log(
      "Good accuracy: " +
        accuracyResult +
        " m, at " +
        new Date().toLocaleTimeString()
    );
    setPositionId(latResult, longResult);
  } else {
    console.log(
      "Bad accuracy: " +
        accuracyResult +
        " m, at " +
        new Date().toLocaleTimeString()
    );
    //setLocationId(fallbackLocation);
  }
  //console.log(position);
};

// Handle geolocation error
let positionErrorHandler = function (error) {
  console.log(error);
  //setLocationId(fallbackLocation);
  document.getElementById("debugInfo").innerHTML = error.message;
};

// Check and color grade temperature results
function colorTemperature(tempResult) {
  // Set default color
  let textColor = "#3a3a3a";

  // Check temperature and set color based on results
  if (tempResult < 0) {
    textColor = "#bfe2fc";
  }
  if (tempResult < -6) {
    textColor = "#7fc6f8";
  }
  if (tempResult < -12) {
    textColor = "#3fa9f5";
  }
  if (tempResult < -18) {
    textColor = "#2a71cd";
  }
  if (tempResult < -24) {
    textColor = "#153996";
  }
  if (tempResult >= 0) {
    textColor = "#f9c0c0";
  }
  if (tempResult > 6) {
    textColor = "#f78181";
  }
  if (tempResult > 12) {
    textColor = "#f44040";
  }
  if (tempResult > 18) {
    textColor = "#e80303";
  }
  if (tempResult > 24) {
    textColor = "#ab0202";
  }

  return textColor;
}

// Check if timestamp is old
function timeChecker(temperatureTimestamp) {
  let diff = Date.now() - Date.parse(temperatureTimestamp);

  // Check if difference between now and lastUpdate timestamp is above 30 minutes and if so, alert the user
  if (diff > 1800000) {
    console.log(
      "A big difference in timestamps detected! Temperature last updated " +
        diff / 1000 +
        " seconds ago."
    );
    document.getElementById("lastUpdate").className = "w3-text-red";
  } else {
    document.getElementById("lastUpdate").className = "";
  }
}
