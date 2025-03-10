import React, {useEffect} from "react";
import {useNavigate,useParams } from "react-router-dom";
import userData from "../user/userData";
import './InterPage.css';
import { getClientId } from "../ClientId/clientManager";
import logToSupabase from "../api/logToSupbase.js";


function Interpage(){
    const { username } = useParams(); // URL에서 사용자 이름 가져오기
    const user = userData[username]; // 사용자 정보 불러오기
    const navigate = useNavigate();
    const handleGenderSelect = async (gender) => {
        let clientId = await getClientId();
        if (clientId.includes("-남성") || clientId.includes("-여성")) {
          } else {
            // 성별이 없을 때만 추가
            clientId = `${clientId}-${gender}`;
            localStorage.setItem("clientId", clientId);
          }
        navigate(`/${username}/info`);
      };
      useEffect(() => {
        const fetchClientId = async () => {
            let clientId = await getClientId(); 
            logToSupabase(clientId, "페이지 방문", `Inter 페이지 (${username})`, username);
        };
        fetchClientId();

        // 페이지 나가기 이벤트 추가
        const handleUnload = async () => {
            const clientId = localStorage.getItem("clientId"); // 이미 저장된 값 가져오기
            logToSupabase(clientId, "페이지 나가기", `Inter 페이지 (${username})`, username);
        };

        window.addEventListener("beforeunload", handleUnload);
        return () => window.removeEventListener("beforeunload", handleUnload);
    }, [username]);


    if (!user) { 
        return <h1>해당 사용자의 정보를 찾을 수 없습니다.</h1>;
      }

    return (
        <div className="container">
            <h3>{user.name} 님의 <br/> 정보 / TMI</h3>
            <h4>잠시, 본인의 성별을 알려주세요</h4>
            <p>성별을 알려주셔야 {user.name}님의 정보를 볼 수 있어요.</p>
            <div className = "button-section">
                <div className = "box-button" onClick={()=>{handleGenderSelect("남성");}}>남성</div>
                <div className = "box-button" onClick={()=>{handleGenderSelect("여성")}}>여성</div>
            </div>
            <p>선택된 정보는 익명으로 유지되며 {user.name}님이 볼 수 없어요.<br/> </p>
        </div>
    );
}

export default Interpage;