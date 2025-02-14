import { supabase } from "./supabase";

const requestLimit = {}; // 🔹 사용자별 요청 횟수를 저장하는 객체

async function logToSupabase(clientId, action, details, username) {

    if (!clientId) {
        console.warn("clientId 없음! Supabase에 저장 불가");
        return;
    }

    const now = Date.now();

    let totalLogs = 0;

    // 🔄 `userRequests` 테이블에서 해당 사용자의 요청 횟수 조회 (Firestore의 `getDoc` 대체)

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


    // 🔥 요청 횟수 업데이트 (Firestore의 `updateDoc`, `setDoc` 대체)

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

    // 🔹 `logs` 테이블에 데이터 추가 (Firestore `addDoc` 대체)
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