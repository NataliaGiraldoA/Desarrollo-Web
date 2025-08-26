import { useEffect } from "react";
import { useState } from "react";
import { useMemo } from "react"; //Controla que la lista quede linkeada al usuario
import "../styles/ToDo.css";

export default function ToDo({ user }) {
    const storageKey = useMemo(() => `Todos_${user?.user || "anon"}`, [user],
    );

    const [items, setItems] = useState([]);
    const [texto, setTexto] = useState("");
    const [isLoaded, setIsLoaded] = useState(false);

    //Cargar tareas
    useEffect(() => {
        console.log("Cargando tareas de:", storageKey);
        const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
        setItems(saved);
        setIsLoaded(true);
    }, [storageKey]);


    useEffect(() => {
        if (!isLoaded) return;
        console.log("Guardando tareas de:", storageKey, items);
        localStorage.setItem(storageKey, JSON.stringify(items));
    }, [items, storageKey]);

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

            <ul className="lista-tarea">
                {items.length == 0 && (
                    <h3>There are no pending tasks</h3>
                )}
                {items.map(item => (
                    <li key={item.id} className="items-map">

                        <input type="checkbox"
                            checked={item.done}
                            onChange={() => toogleToDo(item.id)}
                            aria-label={`Marcar "${item.text}"`}

                        />

                        <span className="text-checkbox">{item.text}</span>

                        <button onClick={() =>
                            removeToDo(item.id)}
                            aria-label="Delete task"
                        >
                            Delete
                        </button>

                    </li>

                ))}

                <div className="pendientes">
                    <span>Pending tasks: {pending}</span>
                    <button onClick={() => clearCompleted()}>Delete completed tasks</button>
                </div>
            </ul>

        </div>
    );
}