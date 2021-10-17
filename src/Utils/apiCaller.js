import { getRandomCli } from "./Common";

export default async function apiCaller(urlParams) {
  try {
    // URL set up
    const APIURL = `https://api.temperatur.nu/tnu_1.17.php?${urlParams}&cli=${getRandomCli(12)}`;
    // Fetching data
    const response = await fetch(APIURL);
    return response;
  } catch (error) {
    console.error(error);
    return error;
  }
}
