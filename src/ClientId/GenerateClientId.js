import { v4 as uuidv4 } from "uuid";

export const generateClientId = async () => {
  const browserInfo = navigator.userAgent;
  const osInfo = navigator.platform;
  const uniqueId = uuidv4(); // 랜덤 UUID 생성

  // IP 주소 가져오기
  const ipResponse = await fetch("https://api64.ipify.org?format=json");
  const ipData = await ipResponse.json();
  const ipAddress = ipData.ip;

  // Client ID 생성
  return `${browserInfo}-${osInfo}-${ipAddress}-${uniqueId}`;
};