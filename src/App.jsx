import { useMemo, useState } from "react";

const FILTERS = ["All", "Completed", "Pending"];

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState("All");

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      return;
    }

    const newTask = {
      id: crypto.randomUUID(),
      title: trimmed,
      completed: false,
    };

    setTasks((prevTasks) => [newTask, ...prevTasks]);
    setTitle("");
  };

  const toggleTask = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const filteredTasks = useMemo(() => {
    if (filter === "Completed") {
      return tasks.filter((task) => task.completed);
    }
    if (filter === "Pending") {
      return tasks.filter((task) => !task.completed);
    }
    return tasks;
  }, [filter, tasks]);

  const pendingCount = useMemo(
    () => tasks.filter((task) => !task.completed).length,
    [tasks]
  );

  return (
    <div className="app">
      <header className="app__header">
        <div>
          <p className="app__eyebrow">Task Management</p>
          <h1>Task Manager</h1>
          <p className="app__subtitle">Keep track of what matters today.</p>
        </div>
        <div className="app__pending">
          <span>Pending</span>
          <strong>{pendingCount}</strong>
        </div>
      </header>

      <form className="task-form" onSubmit={handleSubmit}>
        <label className="task-form__label" htmlFor="task-title">
          New task
        </label>
        <div className="task-form__controls">
          <input
            id="task-title"
            className="task-form__input"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Add a new task"
          />
          <button className="task-form__button" type="submit">
            Add Task
          </button>
        </div>
      </form>

      <section className="filters">
        {FILTERS.map((filterOption) => (
          <button
            key={filterOption}
            type="button"
            className={`filters__button${
              filterOption === filter ? " filters__button--active" : ""
            }`}
            onClick={() => setFilter(filterOption)}
          >
            {filterOption}
          </button>
        ))}
      </section>

      <section className="task-list" aria-live="polite">
        {filteredTasks.length === 0 ? (
          <p className="task-list__empty">No tasks to show.</p>
        ) : (
          <ul>
            {filteredTasks.map((task) => (
              <li
                key={task.id}
                className={`task-item${task.completed ? " task-item--done" : ""}`}
              >
                <label className="task-item__label">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                  />
                  <span>{task.title}</span>
                </label>
                <button
                  type="button"
                  className="task-item__delete"
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
