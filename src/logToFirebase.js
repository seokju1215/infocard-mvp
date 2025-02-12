// logToFirebase.js
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

// ✅ Firestore에 데이터 저장하는 함수
async function logToFirebase (clientId, action, details) {
    const visitTime = new Date().toISOString();

    try {
        await addDoc(collection(db, "logs"), {
            clientId,
            visitTime,
            action,
            details
        });
        console.log("📢 Firebase Firestore에 데이터 저장 완료!");
    } catch (error) {
        console.error("❌ Firestore 저장 실패:", error);
    }
};

export default logToFirebase;