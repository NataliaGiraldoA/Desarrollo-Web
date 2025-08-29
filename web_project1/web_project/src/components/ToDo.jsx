import { useEffect } from "react";
import { useState } from "react";
import { useMemo } from "react"; //Controla que la lista quede linkeada al usuario
import "../styles/ToDo.css";

export default function ToDo({ user }) {
    const storageKey = useMemo(() => `Todos_${user?.user || "anon"}`, [user],
    );

    const filterStorageKey = useMemo(() => `Filter_${user?.user || "anon"}`, [user]);

    const [items, setItems] = useState([]);
    const [texto, setTexto] = useState("");
    const [isLoaded, setIsLoaded] = useState(false);
    const [filter, setFilter] = useState("all");
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState("");
    const isAdmin = user?.role === "admin";

    const startEditing = (id, text) => {
        setEditingId(id);
        setEditingText(text);
    };

    const saveEditing = (id) => {
        setItems(prev => prev.map(it => it.id === id ? { ...it, text: editingText } : it));
        setEditingId(null);
        setEditingText("");
    };

    const filteredItems = useMemo(() => {
        if (filter === "all") return items;
        if (filter === "pending") return items.filter(i => !i.done);
        if (filter === "completed") return items.filter(i => i.done);
    }, [items, filter]);


    //Cargar tareas
    useEffect(() => {
        console.log("Cargando tareas de:", storageKey);
        const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
        const savedFilter = localStorage.getItem(filterStorageKey) || "all";
        setItems(saved);
        setFilter(savedFilter);
        setIsLoaded(true);
    }, [storageKey, filterStorageKey]);


    useEffect(() => {
        if (!isLoaded) return;
        console.log("Guardando tareas de:", storageKey, items);
        localStorage.setItem(storageKey, JSON.stringify(items));
    }, [items, storageKey]);

    useEffect(() => {
        if (!isLoaded) return;
        localStorage.setItem(filterStorageKey, filter);
    }, [filter, filterStorageKey, isLoaded]);

    const addToDo = (e) => {
        e.preventDefault();
        localStorage.setItem(storageKey, JSON.stringify(items));
        const txt = texto.trim();

        if (!txt) return;
        setItems(prev => [
            //Buscar que significan los tres puntos
            ...prev, { id: crypto.randomUUID(), text: txt, done: false, ts: Date.now() },
        ]);

        setTexto("");
    }

    const toogleToDo = (id) => {

        setItems(prev => prev.map(it => it.id === id ? { ...it, done: !it.done } : it));
    };

    const removeToDo = (id) => {
        setItems(prev => prev.filter(it => it.id !== id));
    };

    const clearCompleted = () => {
        setItems(prev => prev.filter(it => !it.done));
    };

    const pending = items.filter(i => !i.done).length;

    return (
        <div className="todo-container">
            <h2>My Tasks</h2>
            <form onSubmit={addToDo} className="form-task">
                <div>
                    <input className="input-task"
                        value={texto}
                        onChange={(e) => setTexto(e.target.value)}
                        placeholder="New task"
                        aria-label="New task"

                    />
                </div>

                <button type="submit">Add Task</button>
            </form>
            <div className="filters">
                <button onClick={() => setFilter("all")} disabled={filter === "all"}>All</button>
                <button onClick={() => setFilter("pending")} disabled={filter === "pending"}>Pending</button>
                <button onClick={() => setFilter("completed")} disabled={filter === "completed"}>Completed</button>
            </div>

            <ul className="lista-tarea">
                {filteredItems.length == 0 && (
                    <h3>There are no pending tasks</h3>
                )}
                {filteredItems.map(item => (
                    <li key={item.id} className="items-map">

                        <input type="checkbox"
                            checked={item.done}
                            onChange={() => toogleToDo(item.id)}
                            aria-label={`Marcar "${item.text}"`}

                        />

                        {editingId === item.id ? (
                            <input
                                value={editingText}
                                onChange={(e) => setEditingText(e.target.value)}
                                onBlur={() => saveEditing(item.id)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        saveEditing(item.id);
                                    }
                                    if (e.key === 'Escape') {
                                        setEditingId(null);
                                        setEditingText("");
                                    }
                                }}
                                autoFocus
                            />

                        ) : (
                            <span
                                className="text-checkbox"
                                onDoubleClick={() => startEditing(item.id, item.text)}
                            >
                                {item.text}
                            </span>
                        )}

                        <div className="admin-delete">
                        {isAdmin && (
                            <button onClick={() =>
                            removeToDo(item.id)}
                            aria-label="Delete task"
                        >
                            Delete
                        </button>)}
                        </div>

                    </li>

                ))}

                <div className="pendientes">
                    <span>Pending tasks: {pending}</span>
                    {isAdmin &&(
                        <button onClick={() => clearCompleted()}>Delete completed tasks</button>
                    )}
                    
                </div>
            </ul>

        </div>
    );
}