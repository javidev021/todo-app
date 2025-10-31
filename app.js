// app.js - módulo
const SELECTORS = {
  form: '#task-form',
  input: '#task-input',
  list: '#task-list',
  filter: '#filter',
  clearCompleted: '#clear-completed',
  remaining: '#remaining'
};

const STORAGE_KEY = 'todo_app_tasks_v1';

function createId(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,8); }

function readTasks(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }catch(e){ console.error('Error leyendo storage', e); return []; }
}

function writeTasks(tasks){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function getFiltered(tasks, filter){
  if(filter === 'active') return tasks.filter(t => !t.completed);
  if(filter === 'completed') return tasks.filter(t => t.completed);
  return tasks;
}

function render(tasks, filter){
  const listEl = document.querySelector(SELECTORS.list);
  listEl.innerHTML = '';
  const visible = getFiltered(tasks, filter);
  visible.forEach(t => {
    const li = document.createElement('li');
    li.className = 'task' + (t.completed ? ' completed' : '');
    li.setAttribute('data-id', t.id);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = !!t.completed;
    checkbox.addEventListener('change', () => toggleTask(t.id));

    const label = document.createElement('div');
    label.className = 'label';
    label.textContent = t.title;

    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.title = 'Eliminar';
    delBtn.textContent = '🗑️';
    delBtn.addEventListener('click', () => removeTask(t.id));

    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(delBtn);
    listEl.appendChild(li);
  });

  const remaining = tasks.filter(t => !t.completed).length;
  document.querySelector(SELECTORS.remaining).textContent = `${remaining} tarea(s) pendientes`;
}

let tasks = readTasks();
let currentFilter = document.querySelector(SELECTORS.filter)?.value ?? 'all';

function addTask(title){
  const t = { id: createId(), title: title.trim(), completed: false, createdAt: Date.now() };
  tasks.unshift(t);
  writeTasks(tasks);
  render(tasks, currentFilter);
}

function toggleTask(id){
  tasks = tasks.map(t => t.id === id ? {...t, completed: !t.completed} : t);
  writeTasks(tasks);
  render(tasks, currentFilter);
}

function removeTask(id){
  tasks = tasks.filter(t => t.id !== id);
  writeTasks(tasks);
  render(tasks, currentFilter);
}

function clearCompleted(){
  tasks = tasks.filter(t => !t.completed);
  writeTasks(tasks);
  render(tasks, currentFilter);
}

function bind(){
  const form = document.querySelector(SELECTORS.form);
  const input = document.querySelector(SELECTORS.input);
  const filter = document.querySelector(SELECTORS.filter);
  const clearBtn = document.querySelector(SELECTORS.clearCompleted);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = input.value || '';
    if(!v.trim()) return;
    addTask(v);
    input.value = '';
    input.focus();
  });

  filter.addEventListener('change', (e) => {
    currentFilter = e.target.value;
    render(tasks, currentFilter);
  });

  clearBtn.addEventListener('click', () => {
    clearCompleted();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  bind();
  render(tasks, currentFilter);
});
