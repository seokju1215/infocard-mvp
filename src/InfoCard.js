import React from "react";
import { useParams } from "react-router-dom";
import userData from "./userData";
import './InfoCard.css';
import Accordion from "./Accordion";

function InfoCard() {
    const { username } = useParams(); // URL에서 사용자 이름 가져오기
    const user = userData[username]; // 사용자 정보 불러오기

    if (!user) {
        return < h1>해당 사용자의 정보를 찾을 수 없습니다.</h1>;
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