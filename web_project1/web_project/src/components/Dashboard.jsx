import { useEffect, useState } from "react";
import "../styles/Dashboard.css";

export default function Dashboard({ user }) {
  const [pendingCount, setPendingCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const isAdmin = user?.role === "admin" || user?.user === "admin";
  if (!isAdmin) return null;

  const recomputeTotals = () => {
    let total = 0;
    let pending = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("Todos_")) {
        try {
          const items = JSON.parse(localStorage.getItem(key) || "[]");
          total += items.length;
          pending += items.filter(t => !t.done).length;
        } catch (e) {
          console.error("Error leyendo", key, e);
        }
      }
    }
    setTotalCount(total);
    setPendingCount(pending);
  };

  useEffect(() => {
    recomputeTotals();
  }, []);

  const clearCompletedAll = () => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("Todos_")) {
        try {
          const items = JSON.parse(localStorage.getItem(key) || "[]");
          const remaining = items.filter(t => !t.done);
          localStorage.setItem(key, JSON.stringify(remaining));
        } catch (e) {
          console.error("Error filtrando completadas en", key, e);
        }
      }
    }
    recomputeTotals();
    window.dispatchEvent(new Event("todos:changed")); // avisar a ToDo
  };

  const clearAllTasks = () => {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith("Todos_")) keys.push(k);
    }
    keys.forEach(k => localStorage.setItem(k, JSON.stringify([])));
    recomputeTotals();
    window.dispatchEvent(new Event("todos:changed")); // avisar a ToDo
  };

  return (
    <div className="dashboard-container">

      <div className="dashboard-stats">
        <p>All users pending tasks: {pendingCount}</p>
        <p>All users total tasks: {totalCount}</p>
      </div>

      <div className="dashboard-actions">
        <button onClick={clearCompletedAll}>
          Delete all users completed tasks
        </button>
        <button onClick={clearAllTasks}>
          Delete all users tasks
        </button>
      </div>
    </div>
  );
}
