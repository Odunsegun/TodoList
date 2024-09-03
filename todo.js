const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".add-todo");
const todoList = document.querySelector(".todo-list");


todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", todoAction);

function addTodo(event) {
    event.preventDefault();

    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");

    const todolist = document.createElement("li");
    todolist.innerText = todoInput.value; 
    todolist.classList.add("todo-item");
    todoDiv.appendChild(todolist);

    const createButton = document.createElement("button");
    createButton.innerHTML = '<i class="fas fa-check-circle"></i>';
    createButton.classList.add("created");
    todoDiv.appendChild(createButton);

    const exterminateButton = document.createElement("button");
    exterminateButton.innerHTML = '<i class="fas fa-trash"></i>';
    exterminateButton.classList.add("deleted");
    todoDiv.appendChild(exterminateButton);

    

    todoList.appendChild(todoDiv);
    todoInput.value = "";
}


function todoAction(event) {
    const item = event.target;
    const todo = item.parentElement;

    if (item.classList.contains("deleted")) {
        todo.classList.add("slide");
        todo.addEventListener("transitionend", () => todo.remove());
    } else if (item.classList.contains("created")) {
        todo.classList.toggle("completed");
    }
}

