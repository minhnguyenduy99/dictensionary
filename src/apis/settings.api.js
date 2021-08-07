import { getAPIConfig } from "./config-key";
import { configApiHeader } from "./utils";

export default {
  apiHost: process.env.VUE_APP_API_ENDPOINT,
  assignApp(appId) {
    const fullRequestURL = `${this.apiHost}/apps/assign/${appId}`;
    return fetch(fullRequestURL, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((body) => {
        const { data } = body;
        return data;
      })
      .catch((err) => {
        console.error(err);
        return false;
      });
  },
  removeApp(appId) {
    const fullRequestURL = `${this.apiHost}/apps/unassign/${appId}`;

    return fetch(fullRequestURL, {
      method: "POST",
      headers: configApiHeader(getAPIConfig()),
    })
      .then((response) => response.json())
      .then((body) => {
        const { data } = body;
        return data;
      })
      .catch((err) => {
        console.error(err);
        return false;
      });
  },
};
