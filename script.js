const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('todo-list');
const selectionBar = document.getElementById('selection-bar');
const selectionCount = document.getElementById('selection-count');
const deleteSelectedBtn = document.getElementById('delete-selected-btn');

const saved = localStorage.getItem('todos');
const todos = saved ? JSON.parse(saved) : [];

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function updateSelectionBar() {
    const count = todos.filter((todo) => todo.completed).length;
    selectionBar.hidden = count === 0;
    selectionCount.textContent = count + (count === 1 ? ' task selected' : ' tasks selected');
}

function createTodoNode(todo) {
    const li = document.createElement('li');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = !!todo.completed;
    checkbox.setAttribute('aria-label', 'Mark ' + todo.text + ' as complete and select for bulk deletion');
    checkbox.addEventListener('change', () => {
        todo.completed = checkbox.checked;
        textSpan.style.textDecoration = todo.completed ? 'line-through' : '';
        saveTodos();
        updateSelectionBar();
    });

    const textSpan = document.createElement('span');
    textSpan.textContent = todo.text;
    if (todo.completed) {
        textSpan.style.textDecoration = 'line-through';
    }

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'edit-btn';
    editBtn.textContent = 'Edit';
    editBtn.setAttribute('aria-label', 'Edit ' + todo.text);
    editBtn.addEventListener('click', () => {
        const newText = prompt('Edit task', todo.text);
        if (newText !== null && newText.trim()) {
            todo.text = newText.trim();
            saveTodos();
            render();
        }
    });

    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'delete-btn';
    delBtn.textContent = 'Delete';
    delBtn.setAttribute('aria-label', 'Delete ' + todo.text);
    delBtn.addEventListener('click', () => {
        const index = todos.indexOf(todo);
        if (index !== -1) {
            todos.splice(index, 1);
        }
        selectedTodos.delete(todo);
        render();
        saveTodos();
    });

    li.appendChild(checkbox);
    li.appendChild(textSpan);
    li.appendChild(editBtn);
    li.appendChild(delBtn);
    return li;
}

function render() {
    list.innerHTML = '';
    todos.forEach((todo) => {
        list.appendChild(createTodoNode(todo));
    });

    updateSelectionBar();
}

function addTodo() {
    const text = input.value.trim();
    if (!text) return;

    todos.push({ text: text, completed: false });
    input.value = '';
    render();
    saveTodos();
}

function deleteSelectedTodos() {
    const completedTodos = todos.filter((todo) => todo.completed);
    if (completedTodos.length === 0) return;

    for (let i = todos.length - 1; i >= 0; i--) {
        if (todos[i].completed) {
            todos.splice(i, 1);
        }
    }

    render();
    saveTodos();
}

addBtn.addEventListener('click', addTodo);
input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') addTodo();
});
deleteSelectedBtn.addEventListener('click', deleteSelectedTodos);

render();
