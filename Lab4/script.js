"use strict";
const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const itemsLeft = document.querySelector("#items-left");
const filterButtons = document.querySelectorAll(".filter");
const clearCompletedButton = document.querySelector("#clear-completed");
const clearAllButton = document.querySelector("#clear-all");
let todos = [
    { id: 1, title: "See Lecture", completed: false },
    { id: 2, title: "Solve assignment", completed: false },
];
let currentFilter = "All";
let nextId = 3;
const trashIcon = `
  <svg viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="1.7"
    stroke-linecap="round" stroke-linejoin="round"
    aria-hidden="true">
    <path d="M3 6h18" />
    <path d="M8 6V4h8v2" />
    <path d="m19 6-1 14H6L5 6" />
    <path d="M10 11v5M14 11v5" />
  </svg>
`;
const checkIcon = `
  <svg viewBox="0 0 16 16" fill="none"
    stroke="currentColor" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round"
    aria-hidden="true">
    <path d="m3 8 3 3 7-7" />
  </svg>
`;
function getVisibleTodos() {
    switch (currentFilter) {
        case "Active":
            return todos.filter((todo) => !todo.completed);
        case "Completed":
            return todos.filter((todo) => todo.completed);
        default:
            return todos;
    }
}
function updateItemsLeft() {
    const remaining = todos.filter((todo) => !todo.completed).length;
    itemsLeft.textContent =
        `${remaining} ${remaining === 1 ? "item" : "items"} left`;
}
function createTodoElement(todo) {
    const li = document.createElement("li");
    li.className = "todo-item";
    const checkbox = document.createElement("button");
    checkbox.type = "button";
    checkbox.className = "checkbox";
    checkbox.classList.toggle("checked", todo.completed);
    checkbox.setAttribute("aria-label", todo.completed ? "Mark as active" : "Mark as completed");
    checkbox.setAttribute("aria-pressed", String(todo.completed));
    if (todo.completed) {
        checkbox.innerHTML = checkIcon;
    }
    checkbox.addEventListener("click", () => {
        todo.completed = !todo.completed;
        render();
    });
    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.title;
    text.classList.toggle("completed", todo.completed);
    text.title = "Double-click to edit";
    text.addEventListener("dblclick", () => {
        startEditing(todo, li);
    });
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-btn";
    deleteButton.innerHTML = trashIcon;
    deleteButton.setAttribute("aria-label", `Delete ${todo.title}`);
    deleteButton.addEventListener("click", () => {
        todos = todos.filter((item) => item.id !== todo.id);
        render();
    });
    li.append(checkbox, text, deleteButton);
    return li;
}
function startEditing(todo, li) {
    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.className = "edit-input";
    editInput.value = todo.title;
    editInput.setAttribute("aria-label", "Edit todo");
    const originalTitle = todo.title;
    const text = li.querySelector(".todo-text");
    if (!text)
        return;
    li.replaceChild(editInput, text);
    editInput.focus();
    editInput.select();
    let finished = false;
    function finishEditing(save) {
        if (finished)
            return;
        finished = true;
        if (save && editInput.value.trim()) {
            todo.title = editInput.value.trim();
        }
        else if (!save) {
            todo.title = originalTitle;
        }
        render();
    }
    editInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            finishEditing(true);
        }
        if (event.key === "Escape") {
            finishEditing(false);
        }
    });
    editInput.addEventListener("blur", () => {
        finishEditing(true);
    });
}
function render() {
    todoList.replaceChildren();
    const visibleTodos = getVisibleTodos();
    if (visibleTodos.length === 0) {
        const empty = document.createElement("li");
        empty.className = "empty-state";
        empty.textContent =
            todos.length === 0
                ? "No todos yet. Add one to get started!"
                : "No todos in this filter.";
        todoList.appendChild(empty);
    }
    else {
        visibleTodos.forEach((todo) => {
            todoList.appendChild(createTodoElement(todo));
        });
    }
    filterButtons.forEach((button) => {
        const isActive = button.dataset.filter === currentFilter;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });
    updateItemsLeft();
}
form.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = input.value.trim();
    if (!title) {
        input.focus();
        return;
    }
    todos.push({
        id: nextId++,
        title,
        completed: false,
    });
    input.value = "";
    currentFilter = "All";
    render();
    input.focus();
});
filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const filter = button.dataset.filter;
        if (filter === "All" ||
            filter === "Active" ||
            filter === "Completed") {
            currentFilter = filter;
            render();
        }
    });
});
clearCompletedButton.addEventListener("click", () => {
    todos = todos.filter((todo) => !todo.completed);
    render();
});
clearAllButton.addEventListener("click", () => {
    todos = [];
    render();
});
render();
