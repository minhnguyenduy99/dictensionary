export default (config) => {
  const { appKey, appId } = config;
  return {
    "x-dictensionary-api-app-id": appId,
    "x-dictensionary-api-key": appKey,
    "Content-Type": "application/json",
  };
};
