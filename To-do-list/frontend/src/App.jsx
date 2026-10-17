
import { useEffect, useRef, useState } from "react";
import "./App.css";

const API = "http://localhost:5000/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [filter, setFilter] = useState("All");
  const [message, setMessage] = useState("");
  const notified = useRef(new Set());
  const alarmed = useRef(new Set());

  // Load tasks from MongoDB
  async function loadTasks() {
    try {
      const response = await fetch(API);
      if (!response.ok) throw new Error("Could not load tasks");
      const data = await response.json();
      setTasks(data);
    } catch {
      setMessage("Cannot connect to backend. Make sure server.js is running.");
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  // Ask permission for browser notifications
  async function enableNotifications() {
    if (!("Notification" in window)) {
      setMessage("Your browser does not support notifications.");
      return;
    }

    const permission = await Notification.requestPermission();

    setMessage(
      permission === "granted"
        ? "Notifications enabled!"
        : "Please allow notifications in your browser settings."
    );
  }

  // Check task times while this page is open
  useEffect(() => {
    function checkDueTasks() {
      const now = Date.now();

      tasks.forEach((task) => {
        if (!task.dueDate || task.completed) return;

        const due = new Date(task.dueDate).getTime();
        if (Number.isNaN(due)) return;

        // Notify once when the due time arrives
        if (due <= now && due > now - 60000) {
          if (!notified.current.has(task._id)) {
            notified.current.add(task._id);

            if (
              "Notification" in window &&
              Notification.permission === "granted"
            ) {
              new Notification("⏰ Task reminder", {
                body: `Time to complete: ${task.title}`,
              });
            }

            if (!alarmed.current.has(task._id)) {
              alarmed.current.add(task._id);

              // Short sound alarm
              try {
                const AudioContextClass =
                  window.AudioContext || window.webkitAudioContext;
                if (AudioContextClass) {
                  const audio = new AudioContextClass();
                  const oscillator = audio.createOscillator();
                  const gain = audio.createGain();

                  oscillator.connect(gain);
                  gain.connect(audio.destination);
                  oscillator.frequency.value = 880;
                  gain.gain.value = 0.15;
                  oscillator.start();

                  setTimeout(() => {
                    oscillator.stop();
                    audio.close();
                  }, 700);
                }
              } catch {
                // Browser may block automatic audio.
              }
            }
          }
        }
      });
    }

    checkDueTasks();
    const timer = setInterval(checkDueTasks, 10000);
    return () => clearInterval(timer);
  }, [tasks]);

  // Add task
  async function addTask(event) {
    event.preventDefault();

    if (!title.trim()) {
      setMessage("Please enter a task name.");
      return;
    }

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          dueDate: dueDate ? new Date(dueDate).toISOString() : null,
          priority,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not add task");

      setTasks((current) => [data, ...current]);
      setTitle("");
      setDueDate("");
      setPriority("Medium");
      setMessage("Task added successfully!");
    } catch (error) {
      setMessage(error.message);
    }
  }

  // Mark task complete or pending
  async function toggleTask(task) {
    try {
      const response = await fetch(`${API}/${task._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed }),
      });

      const updated = await response.json();
      if (!response.ok) throw new Error(updated.message || "Update failed");

      setTasks((current) =>
        current.map((item) => (item._id === task._id ? updated : item))
      );

      if (!task.completed) {
        setMessage("🎉 Great job! You earned 10 points!");
      }
    } catch (error) {
      setMessage(error.message);
    }
  }

  // Delete task
  async function deleteTask(id) {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      const response = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Could not delete task");

      setTasks((current) => current.filter((task) => task._id !== id));
      setMessage("Task deleted.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  const completed = tasks.filter((task) => task.completed).length;
  const pending = tasks.length - completed;
  const progress = tasks.length
    ? Math.round((completed / tasks.length) * 100)
    : 0;
  const points = completed * 10;

  const visibleTasks = tasks.filter((task) => {
    if (filter === "Completed") return task.completed;
    if (filter === "Pending") return !task.completed;
    if (filter === "Today") {
      if (!task.dueDate) return false;
      return (
        new Date(task.dueDate).toDateString() === new Date().toDateString() &&
        !task.completed
      );
    }
    return true;
  });

  function formatDate(value) {
    if (!value) return "No deadline";
    return new Date(value).toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  return (
    <main className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">✓</div>
          <div>
            <h1>DayBloom</h1>
            <p>One step at a time towards good habits. </p>
          </div>
        </div>
        <button className="notify-button" onClick={enableNotifications}>
          🔔 Remind
        </button>
      </header>

      <section className="welcome">
        <div>
          <p className="eyebrow">YOUR PERSONAL PRODUCTIVITY SPACE</p>
          <h2>Make your day Productive.✨</h2>
          <p>Small steps every day lead to big achievements.</p>
        </div>
        <div className="welcome-emoji">🌷</div>
      </section>

      {message && (
        <div className="message" role="status">
          {message}
          <button onClick={() => setMessage("")} aria-label="Dismiss message">
            ×
          </button>
        </div>
      )}

      <section className="stats">
        <article className="stat-card">
          <span className="stat-icon purple">📋</span>
          <p>Total tasks</p>
          <strong>{tasks.length}</strong>
        </article>
        <article className="stat-card">
          <span className="stat-icon green">✓</span>
          <p>Completed</p>
          <strong>{completed}</strong>
        </article>
        <article className="stat-card">
          <span className="stat-icon orange">⏳</span>
          <p>Pending</p>
          <strong>{pending}</strong>
        </article>
        <article className="stat-card">
          <span className="stat-icon pink">🏆</span>
          <p>Reward points</p>
          <strong>{points}</strong>
        </article>
      </section>

      <section className="progress-card">
        <div className="progress-heading">
          <div>
            <h3>Your progress</h3>
            <p>{progress === 100 && tasks.length
              ? "Amazing! You completed every task!"
              : "Keep going. "}</p>
          </div>
          <strong className="percentage">{progress}%</strong>
        </div>
        <div
          className="progress-track"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="reward-row">
          <span>🌱 Starter: 0 points</span>
          <span>🌼 Achiever: 50 points</span>
          <span>🌟 Champion: 100 points</span>
        </div>
        <p className="reward-status">
          {points >= 100
            ? "🌟 Champion unlocked!"
            : points >= 50
            ? "🌼 Don't worry keep going!"
            : `Complete ${Math.max(0, 5 - completed)} more tasks to reach 50 points.`}
        </p>
      </section>

      <div className="content-grid">
        <section className="panel add-panel">
          <div className="section-heading">
            <span className="heading-icon">✚</span>
            <div>
              <h3>Create a task</h3>
              <p>Plan your whole day with small tasks.</p>
            </div>
          </div>

          <form onSubmit={addTask}>
            <label htmlFor="task-title">Task name</label>
            <input
              id="task-title"
              type="text"
              placeholder="e.g. Complete assignment"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />

            <label htmlFor="task-time">Date and time</label>
            <input
              id="task-time"
              type="datetime-local"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
            />
            <small>When to complete the task.</small>

            <label htmlFor="task-priority">Priority</label>
            <select
              id="task-priority"
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
            >
              <option value="Low">🟢 Low</option>
              <option value="Medium">🟡 Medium</option>
              <option value="High">🔴 High</option>
            </select>

            <button className="add-button" type="submit">
              + Add task
            </button>
          </form>
        </section>

        <section className="panel tasks-panel">
          <div className="section-heading task-title-heading">
            <div>
              <h3>My tasks</h3>
              <p>You can do this, one task at a time.</p>
            </div>
            <span className="task-count">{pending} left</span>
          </div>

          <div className="filters">
            {["All", "Today", "Pending", "Completed"].map((item) => (
              <button
                key={item}
                className={filter === item ? "filter active" : "filter"}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="task-list">
            {visibleTasks.length === 0 ? (
              <div className="empty-state">
                <span>🌿</span>
                <h4>No tasks here yet</h4>
                <p>Add a task and make a little progress today.</p>
              </div>
            ) : (
              visibleTasks.map((task) => (
                <article
                  className={`task-item ${task.completed ? "is-complete" : ""}`}
                  key={task._id}
                >
                  <button
                    className={`check-button ${task.completed ? "checked" : ""}`}
                    onClick={() => toggleTask(task)}
                    aria-label={task.completed ? "Mark as pending" : "Mark as complete"}
                  >
                    {task.completed ? "✓" : ""}
                  </button>

                  <div className="task-info">
                    <h4>{task.title}</h4>
                    <p className="task-date">🕒 {formatDate(task.dueDate)}</p>
                    <span className={`priority ${task.priority?.toLowerCase() || "medium"}`}>
                      {task.priority || "Medium"} priority
                    </span>
                    {task.completed && <span className="earned"> +10 points 🎉</span>}
                  </div>

                  <button
                    className="delete-button"
                    onClick={() => deleteTask(task._id)}
                    aria-label={`Delete ${task.title}`}
                    title="Delete task"
                  >
                    🗑️
                  </button>
                </article>
              ))
            )}
          </div>
        </section>
      </div>

      <footer>Helps make your day more productive, by helping you design everyday plans.</footer>
    </main>
  );
}

export default App;
