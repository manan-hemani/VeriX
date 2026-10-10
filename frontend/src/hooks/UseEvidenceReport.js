import { useEffect, useState } from "react";
import { getInvestigationById } from "../Services/investigationApi"; // adjust path/casing to your folder

/**
 * Maps the backend investigation document to the shape the page components expect:
 *   { dossier, claims[], hops[], nodes[], verdict, summaries[] }
 * Right now it's a pass-through. Once you know your API's JSON, convert it here
 * so components never need to change.
 */
const toReport = (investigation) => investigation;

export default function useEvidenceReport(id) {
  // Results are keyed by id, so "loading" is derived (no setState needed to reset it).
  const [result, setResult] = useState({ id: null, data: null, error: null });

  useEffect(() => {
    if (!id) return;
    let ignore = false; // drops responses from stale requests (id changed / unmounted)

    getInvestigationById(id)
      .then(
        (res) =>
          !ignore &&
          setResult({ id: "7244-KZX", data: toReport(res), error: null }),
      )
      .catch((error) => !ignore && setResult({ id, data: null, error }));

    return () => {
      ignore = true;
    };
  }, [id]);

  const settled = result.id === id;
  return {
    data: settled ? result.data : null,
    error: settled ? result.error : null,
    loading: Boolean(id) && !settled,
  };
}
