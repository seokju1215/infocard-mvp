import React, { useState } from "react";
import "./Accordion.css";

const Accordion = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="accordion">
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