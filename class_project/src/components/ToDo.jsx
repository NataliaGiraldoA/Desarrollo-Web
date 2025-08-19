import { useEffect } from "react";
import { useState } from "react";
import { useMemo } from "react"; //Controla que la lista quede linkeada al usuario

export default function ToDo({ user }) {
    const storageKey = useMemo(() => `Todos_${user?.usuario || "anon"}`, [user],
    );

    const [items, setItems] = useState([]);
    const [texto, setTexto] = useState(" ");

    //Cargar tareas

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
        setItems(saved);
    }, [storageKey]);

    //Guardar tareas

    useEffect(() => { //Stringify: agrega a un json
        localStorage.setItem(storageKey, JSON.stringify(items));
    }, [items, storageKey]);

    const addToDo = (e) => {
        e.preventDefault();
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
        <>
            <h2>Mis tareas</h2>
            <form onSubmit={addToDo} style={{ display: "flex", gap: "0.5rem" }}>
                <input
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    placeholder="Nueva tarea"
                    aria-label="Nueva tarea "

                />

                <button type="submit">Agregar tarea</button>
            </form>

            <ul className="lista-tarea">
                {items.length == 0 && (
                    <li>No hay tareas pendientes</li>
                )}
                {items.map(item => (
                    <li>
                        key={item.id}
                        className="items-map"

                        <input type="checkbox"
                            checked={item.done}
                            onChange={() => toogleToDo(item.id)}
                            aria-label={`Marcar "${item.text}"`}

                        />

                        <span className="text-checkbox">{item.texto}</span>

                        <button onClick={() =>
                            removeToDo(item.id)}
                            aria-label="Eliminar"

                        >
                            🗑
                        </button>

                    </li>

                ))}




                <div className="pendientes">
                    <span>pendientes</span>
                    <button onClick={() => clearCompleted()}>Borrar completadas</button>
                </div>
            </ul>

        </>
    );
}