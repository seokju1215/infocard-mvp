import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

const requestLimit = {}; // 🔹 사용자별 요청 횟수를 저장하는 객체

// ✅ Firestore에 즉시 로그 저장 (1초에 10번 이상 요청 차단 + 최대 100번 제한)
async function logToFirebase(clientId, action, details, username) {
    if (!clientId) {
        console.warn("🚨 clientId가 없습니다. 로그를 저장하지 않습니다.");
        return;
    }

    const now = Date.now();
    
    // 🔹 사용자의 요청 이력을 가져옴 (없으면 초기화)
    if (!requestLimit[clientId]) {
        requestLimit[clientId] = { count: 0, totalCount: 0, timestamp: now };
    }

    const userLogs = requestLimit[clientId];

    // 🔹 사용자의 총 로그 횟수 확인 (100번 초과 시 차단)
    if (userLogs.totalCount >= 100) {
        console.warn(`🚨 요청 차단: ${clientId} (최대 100번 요청 초과)`);
        return;
    }

    // 🔹 1초 내 요청 횟수 검사 (1초에 10번 초과 시 차단)
    if (now - userLogs.timestamp < 1000) {
        if (userLogs.count >= 10) {
            console.warn(`🚨 요청 차단: ${clientId} (1초에 10번 이상 요청)`);
            return;
        }
        userLogs.count++;
    } else {
        // 1초가 지나면 카운트 리셋
        userLogs.count = 1;
        userLogs.timestamp = now;
    }

    // 🔹 총 요청 횟수 증가
    userLogs.totalCount++;

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