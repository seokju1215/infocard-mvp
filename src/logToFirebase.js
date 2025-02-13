import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

// ✅ Firestore에 즉시 로그 저장
async function logToFirebase(clientId, action, details, username) {
    try {
        const logEntry = {
            clientId,
            visitTime: new Date().toISOString(),
            action,
            details,
            username
        };
        await addDoc(collection(db, "logs"), logEntry);
        console.log("📢 Firestore에 로그 즉시 저장 완료:", logEntry);
    } catch (error) {
        console.error("❌ Firestore 로그 저장 실패:", error);
    }
}

export default logToFirebase;