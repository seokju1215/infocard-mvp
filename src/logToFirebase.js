import { collection, addDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

const requestLimit = {}; // 🔹 사용자별 요청 횟수를 저장하는 객체

// ✅ Firestore에서 `userRequests`를 체크하고, `logs` 컬렉션에 저장
async function logToFirebase(clientId, action, details, username) {
    if (!clientId) {
        console.warn("🚨 clientId가 없습니다. Firestore에 로그를 저장하지 않습니다.");
        return;
    }
    alert("logToFirebase 실행");
    const now = Date.now();
    
    // 🔹 Firestore에서 해당 사용자의 요청 횟수 가져오기 (`userRequests` 컬렉션 사용)
    const userDocRef = doc(db, "userRequests", clientId);
    const userDocSnap = await getDoc(userDocRef);

    let totalLogs = 0;
    if (userDocSnap.exists()) {
        totalLogs = userDocSnap.data().totalCount || 0; // 🔹 totalCount 필드가 없는 경우 기본값 0 설정
    }

    console.log(`🔍 Firestore 조회 완료 (${clientId}) → 총 요청 횟수: ${totalLogs}`);

    // 🔹 100번 넘었으면 Firestore에 저장하지 않음
    if (totalLogs >= 100) {
        console.warn(`🚨 요청 차단: ${clientId} (최대 100번 요청 초과, logs 컬렉션 저장 안함)`);
        return;
    }

    // 🔹 1초 내 요청 횟수 검사 (메모리에서 제한)
    if (!requestLimit[clientId]) {
        requestLimit[clientId] = { count: 0, timestamp: now };
    }

    const userLogs = requestLimit[clientId];

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

    // 🔹 Firestore에서 `totalCount` 업데이트
    try {
        if (userDocSnap.exists()) {
            await updateDoc(userDocRef, { totalCount: totalLogs + 1 });
            console.log(`✅ Firestore 업데이트 완료 (${clientId}) → 새로운 총 요청 횟수: ${totalLogs + 1}`);
        } else {
            await setDoc(userDocRef, { totalCount: 1 });
            console.log(`📢 Firestore 새 문서 생성 (${clientId}) → 요청 횟수: 1`);
        }

        // 🔹 `logs` 컬렉션에 저장 (100개 이하일 때만)
        const logEntry = {
            clientId,
            visitTime: new Date().toISOString(),
            action,
            details,
            username
        };

        await addDoc(collection(db, "logs"), logEntry);
        console.log("📢 Firestore `logs` 컬렉션에 로그 즉시 저장 완료:", logEntry);

    } catch (error) {
        alert("❌ Firestore 로그 저장 실패: " + error.message);
        console.error("❌ Firestore 로그 저장 실패:", error);
    }
}

export default logToFirebase;