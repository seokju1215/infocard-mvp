import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import userData from "./userData";
import { getClientId } from "./ClientId/clientManager";
import logToSupabase from "./logToSupbase.js";
import "./InfoCard.css";
import Accordion from "./Accordion";



function InfoCard() {
    const { username } = useParams();
    const user = userData[username];

    useEffect(() => {
        const fetchClientId = async () => {
            let clientId = await getClientId();
            logToSupabase(clientId, "페이지 방문", `Info 페이지 (${username})`, username);
        };
        fetchClientId();

        // 페이지 나가기 이벤트 추가
        const handleUnload = () => {
            const clientId = localStorage.getItem("clientId");
            if (!clientId) return;

            const logEntry = {
                clientId,
                visitTime: new Date().toISOString(),
                action: "페이지 나가기",
                details: `Info 페이지 (${username})`,
                username
            };

            const SUPABASE_URL = "https://lpyhiwqtathursomrtbw.supabase.co";
            const SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxweWhpd3F0YXRodXJzb21ydGJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk0MzE1NjcsImV4cCI6MjA1NTAwNzU2N30.8mVa2_pRK17ZUIvgfcFKQR1IikWQtZGqx46TTS-r27A";

            const headers = {
                "Content-Type": "application/json",
                "apikey": SUPABASE_API_KEY,
                "Authorization": `Bearer ${SUPABASE_API_KEY}`
            };

            const blob = new Blob([JSON.stringify(logEntry)], { type: "application/json" });
            fetch(`${SUPABASE_URL}/rest/v1/logs?apikey=${SUPABASE_API_KEY}`, {
                method: "POST",
                body: blob,
                headers: { "Content-Type": "application/json" },
                keepalive: true  // 페이지가 닫혀도 요청 유지
            });
        };
        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                handleUnload();
            }
        };


        window.addEventListener("beforeunload", handleUnload);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            window.removeEventListener("beforeunload", handleUnload);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
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