import { supabase } from "./supabase";

const requestLimit = {}; // 🔹 사용자별 요청 횟수를 저장하는 객체

async function logToSupabase(clientId, action, details, username) {
    alert("✅ logToSupabase 실행됨");
    console.log("🚀 logToSupabase 함수 실행 시작");

    if (!clientId) {
        alert("🚨 clientId 없음! Supabase에 저장 불가");
        console.warn("🚨 clientId 없음! Supabase에 저장 불가");
        return;
    }

    const now = Date.now();

    alert("📢 Supabase 접근 시도 (userRequests 테이블) → " + clientId);
    console.log("📢 Supabase 접근 시도 (userRequests 테이블)", clientId);

    let totalLogs = 0;

    // 🔄 `userRequests` 테이블에서 해당 사용자의 요청 횟수 조회 (Firestore의 `getDoc` 대체)
    alert("🔄 Supabase에서 `userRequests` 데이터 가져오기 시작...");
    console.log("🔄 Supabase에서 `userRequests` 데이터 가져오기 시작...");

    const { data, error } = await supabase
        .from("userRequests")
        .select("totalCount")
        .eq("clientId", clientId)
        .single();

    if (error && error.code !== "PGRST116") { // 데이터가 없을 경우를 대비
        alert("❌ Supabase에서 데이터 가져오기 실패: " + error.message);
        console.error("❌ Supabase에서 데이터 가져오기 실패:", error);
        return;
    }

    if (data) {
        totalLogs = data.totalCount || 0;
    }

    alert(`📊 Supabase 조회 완료 (${clientId}) → 총 요청 횟수: ${totalLogs}`);
    console.log(`📊 Supabase 조회 완료 (${clientId}) → 총 요청 횟수: ${totalLogs}`);

    // 🔥 요청 횟수 업데이트 (Firestore의 `updateDoc`, `setDoc` 대체)
    alert("🔥 Supabase `totalCount` 업데이트 시작...");
    console.log("🔥 Supabase `totalCount` 업데이트 시작...");

    if (totalLogs > 0) {
        const { error: updateError } = await supabase
            .from("userRequests")
            .update({ totalCount: totalLogs + 1 })
            .eq("clientId", clientId);

        if (updateError) {
            alert("❌ Supabase `totalCount` 업데이트 실패: " + updateError.message);
            console.error("❌ Supabase `totalCount` 업데이트 실패:", updateError);
            return;
        }
    } else {
        const { error: insertError } = await supabase
            .from("userRequests")
            .insert([{ clientId, totalCount: 1 }]);

        if (insertError) {
            alert("❌ Supabase 새 문서 생성 실패: " + insertError.message);
            console.error("❌ Supabase 새 문서 생성 실패:", insertError);
            return;
        }
    }

    alert(`✅ Supabase 업데이트 완료! 새로운 총 요청 횟수: ${totalLogs + 1}`);
    console.log(`✅ Supabase 업데이트 완료 (${clientId}) → 새로운 총 요청 횟수: ${totalLogs + 1}`);

    // 🔹 `logs` 테이블에 데이터 추가 (Firestore `addDoc` 대체)
    const logEntry = {
        clientId,
        visitTime: new Date().toISOString(),
        action,
        details,
        username
    };

    alert("📝 Supabase에 로그 추가 시도...");
    console.log("📝 Supabase에 로그 추가 시도 중...", logEntry);

    const { error: logError } = await supabase.from("logs").insert([logEntry]);

    if (logError) {
        alert("❌ Supabase `logs` 테이블에 로그 저장 실패: " + logError.message);
        console.error("❌ Supabase `logs` 테이블에 로그 저장 실패:", logError);
    } else {
        alert("✅ Supabase에 로그 저장 완료! clientId: " + clientId);
        console.log("📢 Supabase `logs` 테이블에 로그 즉시 저장 완료:", logEntry);
    }
}

export default logToSupabase;