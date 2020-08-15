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
export function timeChecker(temperatureTimestamp) {
  let diff = Date.now() - Date.parse(temperatureTimestamp);

  // Check if difference between now and lastUpdate timestamp is above 30 minutes and if so, alert the user
  if (diff > 1800000) {
    console.error(
      "A big difference in timestamps detected! Temperature last updated " +
        diff / 1000 +
        " seconds ago."
    );
  }
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
  favoritesList = favouritesString ? favouritesString.split(',') : [];
  console.log(favoritesList);
  return favoritesList;
}

// Add new favorite location
export function addFavorite(location) {
  let current = getFavorites();

  try {
    if (current.includes(location) || current.length >= 5) {
      throw (
        `Det gick inte att lägga till ${location}, favoritlistan är full (max 5) eller så finns mätpunkten redan med.`
      );
    } else {
      if (current.length === 0) {
        current = [location]
      }
      else {
        current.push(location);
      }
      saveFavorites(current);
      console.log(`Add ${location}`);
    }
  } catch (error) {
    alert(error);
  }
}

// Remove location from favorites
export function removeFavorite(location) {
  let current = getFavorites();
  if (current.includes(location)) {
    console.log("fail");
  }
  console.log(`Remove ${location}`);
}
