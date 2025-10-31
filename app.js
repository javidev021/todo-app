// Elementos del DOM
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

// 🔹 Cargar tareas guardadas al iniciar
document.addEventListener("DOMContentLoaded", loadTasks);

// 🔹 Agregar tarea
addTaskBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  if (taskText === "") return;

  addTask(taskText);
  saveTask(taskText);

  taskInput.value = "";
});

// 🔹 Agregar tarea al DOM
function addTask(taskText) {
  const li = document.createElement("li");
  li.innerHTML = `
    <span>${taskText}</span>
    <button>Eliminar</button>
  `;

  // Eliminar tarea
  li.querySelector("button").addEventListener("click", () => {
    li.remove();
    deleteTask(taskText);
  });

  taskList.appendChild(li);
}

// 🔹 Guardar tarea en localStorage
function saveTask(taskText) {
  const tasks = getTasks();
  tasks.push(taskText);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// 🔹 Obtener tareas guardadas
function getTasks() {
  const tasks = localStorage.getItem("tasks");
  return tasks ? JSON.parse(tasks) : [];
}

// 🔹 Cargar tareas al inicio
function loadTasks() {
  const tasks = getTasks();
  tasks.forEach(addTask);
}

// 🔹 Eliminar tarea del localStorage
function deleteTask(taskText) {
  const tasks = getTasks().filter((t) => t !== taskText);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
