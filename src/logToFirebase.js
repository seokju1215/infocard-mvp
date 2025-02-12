import { db } from "./firebase";
import { collection, addDoc, writeBatch, doc } from "firebase/firestore";

let requestCount = 0;
const MAX_REQUESTS = 100;
const TIME_WINDOW_MS = 10000; // 10초 동안 최대 100번 요청 가능

let logQueue = [];
const BATCH_SIZE = 100;  // 배치 크기: 100개씩 저장

// 10초마다 요청 카운트 초기화
setInterval(() => {
    requestCount = 0;
}, TIME_WINDOW_MS);

// 10초마다 배치 저장 실행
setInterval(saveBatchLogs, 10000);

// ✅ Firestore에 배치 쓰기 (100개씩 모아서 저장)
async function saveBatchLogs() {
    if (logQueue.length === 0) return; // 저장할 데이터가 없으면 종료

    const batch = writeBatch(db);
    const logsCollection = collection(db, "logs");

    logQueue.forEach((logData) => {
        const logDoc = doc(logsCollection);
        batch.set(logDoc, logData);
    });

    try {
        await batch.commit();
        console.log(`📢 Firestore에 ${logQueue.length}개 로그 배치 저장 완료!`);
        logQueue = [];  // 저장 후 큐 초기화
    } catch (error) {
        console.error("❌ Firestore 배치 저장 실패:", error);
    }
}

// ✅ Firestore에 로그 저장하는 함수 (Rate Limiting + Batch 적용)
async function logToFirebase(clientId, action, details) {
    // 1️⃣ Rate Limiting: 10초 동안 100번 이상 요청 시 차단
    if (requestCount >= MAX_REQUESTS) {
        console.warn("🚨 요청이 너무 많습니다! Firestore 저장을 차단합니다.");
        return;
    }
    requestCount++;  // 요청 수 증가

    // 2️⃣ Batch Write: 100개씩 모아서 저장
    logQueue.push({
        clientId,
        visitTime: new Date().toISOString(),
        action,
        details
    });

    if (logQueue.length >= BATCH_SIZE) {
        await saveBatchLogs();  // 100개 모이면 한 번에 저장
    }
}

export default logToFirebase;