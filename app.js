// Elementos del DOM
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

// Cargar tareas al iniciar
document.addEventListener("DOMContentLoaded", loadTasks);

// Agregar nueva tarea
addTaskBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  if (taskText === "") return;

  const newTask = { text: taskText, completed: false };
  addTask(newTask);
  saveTask(newTask);

  taskInput.value = "";
});

// Agregar tarea al DOM
function addTask(task) {
  const li = document.createElement("li");
  if (task.completed) li.classList.add("completed");

  li.innerHTML = `
    <span>${task.text}</span>
    <button>Eliminar</button>
  `;

  // Marcar como completada
  li.querySelector("span").addEventListener("click", () => {
    li.classList.toggle("completed");
    toggleTaskStatus(task.text);
  });

  // Eliminar tarea
  li.querySelector("button").addEventListener("click", () => {
    li.remove();
    deleteTask(task.text);
  });

  taskList.appendChild(li);
}

// Guardar tarea
function saveTask(task) {
  const tasks = getTasks();
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Obtener tareas
function getTasks() {
  const tasks = localStorage.getItem("tasks");
  return tasks ? JSON.parse(tasks) : [];
}

// Cargar tareas al inicio
function loadTasks() {
  const tasks = getTasks();
  tasks.forEach(addTask);
}

// Eliminar tarea
function deleteTask(taskText) {
  const tasks = getTasks().filter((t) => t.text !== taskText);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Cambiar estado de completado
function toggleTaskStatus(taskText) {
  const tasks = getTasks();
  const updatedTasks = tasks.map((t) =>
    t.text === taskText ? { ...t, completed: !t.completed } : t
  );
  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
}
