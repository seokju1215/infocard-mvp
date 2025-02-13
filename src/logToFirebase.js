import { collection, addDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

const requestLimit = {}; // 🔹 사용자별 요청 횟수를 저장하는 객체

async function logToFirebase(clientId, action, details, username) {
    alert("✅ logToFirebase 실행됨");
    console.log("🚀 logToFirebase 함수 실행 시작");

    if (!clientId) {
        alert("🚨 clientId 없음! Firestore에 저장 불가");
        console.warn("🚨 clientId 없음! Firestore에 저장 불가");
        return;
    }

    const now = Date.now();
    
    alert("📢 Firestore 접근 시도 (userRequests 컬렉션) → " + clientId);
    console.log("📢 Firestore 접근 시도 (userRequests 컬렉션)", clientId);
    const userDocRef = doc(db, "userRequests", clientId);
    
    let totalLogs = 0;
    try {
        alert("🔄 Firestore에서 `userRequests` 문서 가져오기 시작...");
        console.log("🔄 Firestore에서 `userRequests` 문서 가져오기 시작...");
        const userDocSnap = await getDoc(userDocRef);
        alert("✅ Firestore 문서 가져오기 완료!");
        console.log("✅ Firestore 문서 가져오기 완료!");

        if (userDocSnap.exists()) {
            totalLogs = userDocSnap.data().totalCount || 0;
        }
        console.log(`📊 Firestore 조회 완료 (${clientId}) → 총 요청 횟수: ${totalLogs}`);
    } catch (error) {
        alert("❌ Firestore에서 문서를 가져오는 중 오류 발생: " + error.message);
        console.error("❌ Firestore에서 문서를 가져오는 중 오류 발생:", error);
        return;
    }

    alert("🔥 Firestore `totalCount` 업데이트 시작...");
    try {
        if (totalLogs > 0) {
            await updateDoc(userDocRef, { totalCount: totalLogs + 1 });
            alert("✅ Firestore 업데이트 완료! 새 요청 횟수: " + (totalLogs + 1));
            console.log(`✅ Firestore 업데이트 완료 (${clientId}) → 새로운 총 요청 횟수: ${totalLogs + 1}`);
        } else {
            await setDoc(userDocRef, { totalCount: 1 });
            alert("📢 Firestore 새 문서 생성 → 요청 횟수: 1");
            console.log(`📢 Firestore 새 문서 생성 (${clientId}) → 요청 횟수: 1`);
        }
    } catch (error) {
        alert("❌ Firestore `totalCount` 업데이트 실패: " + error.message);
        console.error("❌ Firestore `totalCount` 업데이트 실패:", error);
        return;
    }

    const logEntry = {
        clientId,
        visitTime: new Date().toISOString(),
        action,
        details,
        username
    };

    alert("📝 Firestore에 로그 추가 시도...");
    console.log("📝 Firestore에 로그 추가 시도 중...", logEntry);

    try {
        await addDoc(collection(db, "logs"), logEntry);
        alert("✅ Firestore에 로그 저장 완료! clientId: " + clientId);
        console.log("📢 Firestore `logs` 컬렉션에 로그 즉시 저장 완료:", logEntry);
    } catch (error) {
        alert("❌ Firestore `logs` 컬렉션에 로그 저장 실패: " + error.message);
        console.error("❌ Firestore `logs` 컬렉션에 로그 저장 실패:", error);
    }
}
export default logToFirebase;