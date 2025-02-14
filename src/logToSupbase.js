import { supabase } from "./supabase";

async function logToSupabase(clientId, action, details, username) {
    if (!clientId) {
        console.warn("clientId 없음! Supabase에 저장 불가");
        return;
    }

    let totalLogs = 0;

    // 🔄 `userRequests` 테이블에서 해당 사용자의 요청 횟수 조회
    const { data, error } = await supabase
        .from("userRequests")
        .select("totalCount")
        .eq("clientId", clientId)
        .single();

    if (error && error.code !== "PGRST116") { // 데이터가 없을 경우를 대비
        console.error("❌ Supabase에서 데이터 가져오기 실패:", error);
        return;
    }

    if (data) {
        totalLogs = data.totalCount || 0;
    }
    console.log(totalLogs)
    // 🔥 요청 횟수 제한 검사 (100 이상이면 중단)
    if (totalLogs >= 100) {
        console.warn(`🚫 요청 제한 초과: clientId ${clientId}` + totalLogs);
        return;
    }

    // 🔥 요청 횟수 업데이트
    if (totalLogs > 0) {
        const { error: updateError } = await supabase
            .from("userRequests")
            .update({ totalCount: totalLogs + 1 })
            .eq("clientId", clientId);

        if (updateError) {
            console.error("❌ Supabase `totalCount` 업데이트 실패:", updateError);
            return;
        }
    } else {
        const { error: insertError } = await supabase
            .from("userRequests")
            .insert([{ clientId, totalCount: 1 }]);

        if (insertError) {
            console.error("❌ Supabase 새 문서 생성 실패:", insertError);
            return;
        }
    }

    // 🔹 `logs` 테이블에 데이터 추가
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
