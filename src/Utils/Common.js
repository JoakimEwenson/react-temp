// Create a random CLI for testing
// TODO: Remove this and get a proper CLI from temperatur.nu
export function getRandomCli(length) {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// Check and color grade temperature results
export function colorTemperature(temperature) {
  const tempResult = parseInt(temperature);
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
export function isOldTimeStamp(temperatureTimestamp) {
  let diff = Date.now() - Date.parse(temperatureTimestamp.replace(/ /, 'T'));
  //console.log(`Now: ${Date.now()}, parsed timestamp: ${Date.parse(temperatureTimestamp)}`);

  // Check if difference between now and lastUpdate timestamp is above 30 minutes and if so, alert the user
  if (diff > 1800000) {
/*     console.error(
      `A big difference in timestamps detected! Temperature last updated  ${parseInt(
        diff / 1000 / 60
      )} minutes ago.` 
    );*/
    return true;
  }
  return false;
}

/*
 * Section for handling favorites
 */

// Save favorites to LocalStorage
export function saveFavorites(favoritesList) {
  let favouritesString = "";
  if (favoritesList.length > 0) {
    favouritesString = favoritesList.join(",");
  }
  localStorage.setItem("favoritesList", favouritesString);
}

// Fetch favorites from LocalStorage
export function getFavorites() {
  let favouritesString, favoritesList;
  if (localStorage.getItem("favoritesList")) {
    favouritesString = localStorage.getItem("favoritesList");
  }
  favoritesList = favouritesString ? favouritesString.split(",") : [];
  //console.log(favoritesList);
  return favoritesList;
}

// Add new favorite location
export function addFavorite(location) {
  let current = getFavorites();

  try {
    if (current.includes(location)) {
      throw new Error(
        `Det gick inte att lägga till ${location}, mätpunkten finns redan med i listan.`
      );
    } else if (current.length >= 5) {
      throw new Error(
        `Det gick inte att lägga till ${location}, favoritlistan har redan maximala 5 mätplatser.`
      );
    } else {
      if (current.length === 0) {
        current = [location];
      } else {
        current.push(location);
      }
      saveFavorites(current);
      //console.log(`Add ${location}`);
    }
  } catch (error) {
    alert(error);
  }

  return current;
}

// Remove location from favorites
export function removeFavorite(location) {
  let current = getFavorites();

  try {
    if (current.includes(location)) {
      current = current.filter((loc) => loc !== location);
      saveFavorites(current);
    }
  } catch (error) {
    alert(error);
  }
  //console.log(`Removed ${location}`);
  //console.log({ current });
  return current;
}

/*
 * Section for handling home page
 */

export function setHome(location) {
  try {
    localStorage.setItem("userHome", location);
    //console.log(`Set home to ${location}`);
  } catch (error) {
    console.error(error);
  }
}

export function removeHome(location) {
  try {
    localStorage.removeItem("userHome");
    //console.log("Home removed...");
  } catch (error) {
    console.error(error);
  }
}

export function getHome() {
  //console.log(`Your home is ${localStorage.getItem("userHome")}`);
  return localStorage.getItem("userHome");
}
