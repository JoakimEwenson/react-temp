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