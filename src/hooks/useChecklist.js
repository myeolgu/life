import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";

/**
 * 체크리스트를 Supabase(checklist_items 테이블)와 동기화하는 훅.
 * Supabase가 설정되어 있지 않으면 로컬 상태로만 동작한다 (새로고침 시 초기값으로 리셋).
 *
 * @param {string} domain - 체크리스트 그룹 키 (예: "progress", "finance")
 * @param {{id: string, label: string, done?: boolean, group?: string}[]} seedItems - 기본 항목.
 *   group을 주면 화면에서 그 값으로 항목을 묶어 표시할 수 있다 (예: "남편"/"아내"/"공통").
 */
export function useChecklist(domain, seedItems) {
  const [items, setItems] = useState(seedItems);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let cancelled = false;

    async function load() {
      const { data, error } = await supabase
        .from("checklist_items")
        .select("id, label, done, group_label, updated_at")
        .eq("domain", domain)
        .order("sort_order", { ascending: true });

      if (cancelled) return;

      if (error) {
        console.error("checklist_items 조회 실패:", error.message);
        setLoading(false);
        return;
      }

      if (!data || data.length === 0) {
        const seedRows = seedItems.map((item, index) => ({
          id: item.id,
          domain,
          label: item.label,
          done: item.done ?? false,
          group_label: item.group ?? null,
          sort_order: index,
        }));
        const { error: insertError } = await supabase
          .from("checklist_items")
          .upsert(seedRows, { onConflict: "id" });
        if (insertError) {
          console.error("checklist_items 초기화 실패:", insertError.message);
        }
        if (!cancelled) {
          setItems(seedItems);
          setLoading(false);
        }
        return;
      }

      if (!cancelled) {
        setItems(
          data.map((row) => ({
            id: row.id,
            label: row.label,
            done: row.done,
            group: row.group_label ?? undefined,
            updatedAt: row.updated_at,
          }))
        );
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domain]);

  async function toggle(id) {
    const target = items.find((item) => item.id === id);
    if (!target) return;
    const nextDone = !target.done;
    const nextUpdatedAt = new Date().toISOString();

    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, done: nextDone, updatedAt: nextUpdatedAt } : item)));

    if (!isSupabaseConfigured) return;
    const { error } = await supabase
      .from("checklist_items")
      .update({ done: nextDone, updated_at: nextUpdatedAt })
      .eq("id", id);
    if (error) {
      console.error("checklist_items 업데이트 실패:", error.message);
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, done: !nextDone, updatedAt: target.updatedAt } : item)));
    }
  }

  return { items, toggle, loading, persistent: isSupabaseConfigured };
}
