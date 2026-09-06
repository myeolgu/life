import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";

/**
 * 표/카드/텍스트 목록처럼 체크박스가 아닌 일반 콘텐츠를 Supabase(content_items 테이블)와
 * 동기화하는 범용 훅. 각 항목은 JSONB(data 컬럼)로 그대로 저장되므로 형태가 자유롭다
 * (매물 정보 한 덩어리, 시공 범위 표 행, 카드 목록 등 어디에나 쓸 수 있다).
 *
 * @param {string} domain - "interior" | "loan" | ...
 * @param {string} section - 같은 도메인 안에서 콘텐츠 종류를 구분하는 키 (예: "property", "scope")
 * @param {object[]} seedItems - 기본 데이터
 */
export function useContentItems(domain, section, seedItems) {
  const [items, setItems] = useState(seedItems);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let cancelled = false;

    async function load() {
      const { data, error } = await supabase
        .from("content_items")
        .select("id, data")
        .eq("domain", domain)
        .eq("section", section)
        .order("sort_order", { ascending: true });

      if (cancelled) return;

      if (error) {
        console.error("content_items 조회 실패:", error.message);
        setLoading(false);
        return;
      }

      if (!data || data.length === 0) {
        const seedRows = seedItems.map((item, index) => ({
          id: `${domain}:${section}:${index}`,
          domain,
          section,
          data: item,
          sort_order: index,
        }));
        const { error: insertError } = await supabase
          .from("content_items")
          .upsert(seedRows, { onConflict: "id" });
        if (insertError) console.error("content_items 초기화 실패:", insertError.message);
        if (!cancelled) {
          setItems(seedItems);
          setLoading(false);
        }
        return;
      }

      if (!cancelled) {
        setItems(data.map((row) => row.data));
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domain, section]);

  return { items, loading, persistent: isSupabaseConfigured };
}
