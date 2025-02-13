import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import userData from "./userData";
import { getClientId } from "./ClientId/clientManager";
import logToFirebase from "./logToFirebase.js";
import "./InfoCard.css";
import Accordion from "./Accordion";


function InfoCard() {
    const { username } = useParams();
    const user = userData[username];

    useEffect(() => {
        const fetchClientId = async () => {
            let clientId = await getClientId(); 
            logToFirebase(clientId, "페이지 방문", `Info 페이지 (${username})`, username);
        };
        fetchClientId();

        // 페이지 나가기 이벤트 추가
        const handleUnload = async () => {
            const clientId = localStorage.getItem("clientId"); // 이미 저장된 값 가져오기
            logToFirebase(clientId, "페이지 나가기", `Info 페이지 (${username})`, username);
        };

        window.addEventListener("beforeunload", handleUnload);
        return () => window.removeEventListener("beforeunload", handleUnload);
    }, [username]);

    if (!user) {
        return <h1>해당 사용자의 정보를 찾을 수 없습니다.</h1>;
    }

    return (
        <div className="info-container">
            <div className="image" />
            <h2>{user.name}'s<br />Information</h2>
            {Object.entries(user.info).map(([key, value]) => (
                <Accordion key={key} title={key} content={value} />
            ))}
        </div>
    );
}

export default InfoCard;