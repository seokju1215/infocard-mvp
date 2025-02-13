import React, { useState } from "react";
import "./Accordion.css";
import { getClientId } from "./ClientId/clientManager";
import logToFirebase from "./logToFirebase.js";
import { useParams } from "react-router-dom";

const Accordion = ({ title, content }) => {
  const { username } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const handleClick = async () => {
    const clientId = await getClientId();
    const action = isOpen ? "Accordion 닫기" : "Accordion 열기";
    alert(clientId + action + title + username);
    logToFirebase(clientId, action, title, username);
    alert("logToFirebase 실행")
    setIsOpen(!isOpen);
  };


  return (
    <div className="accordion" onClick={handleClick}>
      <div className={`accordion-header ${isOpen ? "open" : ""}`}  onClick={() => setIsOpen(!isOpen)}>
        <span className={`icon ${isOpen ? "rotated" : ""}`}>&#9654;</span>
        <span className="title">{title}</span>
      </div>

      <div className={`accordion-content ${isOpen ? "open" : ""}`}>
        <p>{content}</p>
      </div>
    </div>
  );
};

export default Accordion;