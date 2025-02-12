import { generateClientId } from "./GenerateClientId";


export const getClientId = async () => {
  let clientId = localStorage.getItem("clientId");

  if (!clientId) {
    clientId = await generateClientId();
    localStorage.setItem("clientId", clientId);
  }

  return clientId;
};