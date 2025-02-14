import { supabase } from "./supabase";

async function logToSupabase(clientId, action, details, username) {
    if (!clientId) {
        console.warn("clientId 없음! Supabase에 저장 불가");
        return;
    }

    // ✅ 1️⃣ Local Storage에서 캐시된 요청 횟수 확인
    let cachedTotalLogs = localStorage.getItem(`logCount_${clientId}`);
    
    if (cachedTotalLogs !== null) {
        cachedTotalLogs = parseInt(cachedTotalLogs, 10);
    }

    let totalLogs = cachedTotalLogs || 0;

    // ✅ 2️⃣ Local Storage에 값이 없으면 Supabase에서 조회 후 저장
    if (cachedTotalLogs === null) {
        const { data, error } = await supabase
            .from("userRequests")
            .select("totalCount")
            .eq("clientId", clientId)
            .single();

        if (error && error.code !== "PGRST116") {
            console.error("❌ Supabase에서 데이터 가져오기 실패:", error);
            return;
        }

        if (data) {
            totalLogs = data.totalCount || 0;
            localStorage.setItem(`logCount_${clientId}`, totalLogs);
        }
    }

    console.log(`🔹 현재 로그 횟수: ${totalLogs}`);

    // ✅ 3️⃣ 100번 초과하면 DB 접근 없이 차단
    if (totalLogs >= 100) {
        console.warn(`🚫 요청 제한 초과: clientId ${clientId}`);
        return;
    }

    // ✅ 4️⃣ 요청 횟수 증가
    totalLogs += 1;
    localStorage.setItem(`logCount_${clientId}`, totalLogs);

    // ✅ 5️⃣ Supabase 데이터 업데이트
    const { error: dbError } = await supabase
        .from("userRequests")
        .upsert([{ clientId, totalCount: totalLogs }], { onConflict: ['clientId'] });

    if (dbError) {
        console.error("❌ Supabase `totalCount` 업데이트 실패:", dbError);
        return;
    }

    // ✅ 6️⃣ 로그 기록
    const logEntry = {
        clientId,
        visitTime: new Date().toISOString(),
        action,
        details,
        username
    };

    const { error: logError } = await supabase.from("logs").insert([logEntry]);

    if (logError) {
        console.error("❌ Supabase `logs` 테이블에 로그 저장 실패:", logError);
    }
}

export default logToSupabase;