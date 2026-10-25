import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let todos = [
  { id: 1, task: "Learn Express", completed: false },
  { id: 2, task: "Build a CRUD API", completed: true },
];
let nextId = 3;

// READ all
app.get("/todos", (req, res) => {
  res.json(todos);
});

// Bonus: active todos (must come BEFORE /todos/:id)
app.get("/todos/active", (req, res) => {
  res.json(todos.filter((t) => !t.completed));
});

// READ one
app.get("/todos/:id", (req, res) => {
  const todo = todos.find((t) => t.id === Number(req.params.id));
  if (!todo) return res.status(404).json({ error: "Todo not found" });
  res.json(todo);
});

// CREATE (validation: "task" is required)
app.post("/todos", (req, res) => {
  const { task } = req.body || {};
  if (!task || typeof task !== "string" || !task.trim()) {
    return res.status(400).json({ error: "task is required" });
  }
  const todo = { id: nextId++, task: task.trim(), completed: false };
  todos.push(todo);
  res.status(201).json(todo);
});

// UPDATE
app.put("/todos/:id", (req, res) => {
  const todo = todos.find((t) => t.id === Number(req.params.id));
  if (!todo) return res.status(404).json({ error: "Todo not found" });

  const { task, completed } = req.body || {};
  if (task !== undefined) todo.task = task;
  if (completed !== undefined) todo.completed = completed;
  res.json(todo);
});

// DELETE
app.delete("/todos/:id", (req, res) => {
  const index = todos.findIndex((t) => t.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Todo not found" });
  const [removed] = todos.splice(index, 1);
  res.json({ message: "Deleted", todo: removed });
});

// Bad JSON handler
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON" });
  }
  res.status(500).json({ error: "Something went wrong" });
});

app.get("/", (req, res) => {
  res.send("Todo API is running. Try /todos");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});