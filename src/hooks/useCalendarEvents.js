import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";

/**
 * 날짜가 있는 일정을 Supabase(calendar_events 테이블)와 동기화하는 훅.
 * seedEvents: [{ id, title, start, end?, description }] — FullCalendar 이벤트 형식.
 */
export function useCalendarEvents(domain, seedEvents) {
  const [events, setEvents] = useState(seedEvents);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let cancelled = false;

    async function load() {
      const { data, error } = await supabase
        .from("calendar_events")
        .select("id, title, start_date, end_date, description")
        .eq("domain", domain)
        .order("sort_order", { ascending: true });

      if (cancelled) return;

      if (error) {
        console.error("calendar_events 조회 실패:", error.message);
        setLoading(false);
        return;
      }

      if (!data || data.length === 0) {
        const seedRows = seedEvents.map((e, index) => ({
          id: e.id,
          domain,
          title: e.title,
          start_date: e.start,
          end_date: e.end ?? null,
          description: e.description ?? "",
          sort_order: index,
        }));
        const { error: insertError } = await supabase
          .from("calendar_events")
          .upsert(seedRows, { onConflict: "id" });
        if (insertError) console.error("calendar_events 초기화 실패:", insertError.message);
        if (!cancelled) {
          setEvents(seedEvents);
          setLoading(false);
        }
        return;
      }

      if (!cancelled) {
        setEvents(
          data.map((row) => ({
            id: row.id,
            title: row.title,
            start: row.start_date,
            end: row.end_date ?? undefined,
            description: row.description,
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

  async function addEvent(newEvent) {
    setEvents((prev) => [...prev, newEvent]);
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.from("calendar_events").insert({
      id: newEvent.id,
      domain,
      title: newEvent.title,
      start_date: newEvent.start,
      end_date: newEvent.end ?? null,
      description: newEvent.description ?? "",
      sort_order: events.length,
    });
    if (error) {
      console.error("calendar_events 추가 실패:", error.message);
      setEvents((prev) => prev.filter((e) => e.id !== newEvent.id));
    }
  }

  return { events, loading, persistent: isSupabaseConfigured, addEvent };
}
