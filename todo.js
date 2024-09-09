
let selectedCategory = null;
const parentDiv = document.getElementById("parentDiv");


const personal_name = document.getElementById("personal-name");
parentDiv.insertBefore(personal_name, parentDiv.firstChild);



    // Get today's date and format it
const today = new Date();
const dateString = today.toDateString();
    
    // Display current date dynamically
const currentDateElement = document.getElementById('currentDate');

    // Set the default date input to today's date (YYYY-MM-DD format)
const taskDateInput = document.getElementById('taskDate');
const formattedDate = today.toISOString().split('T')[0]; // Get YYYY-MM-DD format
taskDateInput.value = formattedDate;



const goodDay = document.createElement("h3");
goodDay.innerHTML = `<p> Today, ${dateString}.</p>`;

parentDiv.insertBefore(goodDay, personal_name.nextElementSibling);


document.addEventListener("DOMContentLoaded", () => {
   
    const dropdownToggle = document.querySelector(".dropdown-toggle");
    const dropdownMenu = document.querySelector(".dropdown-menu-list");

    const menuItems = document.querySelectorAll(".sidebar .menu-item");
    menuItems.forEach(item => {
        const menuItemText = item.querySelector('.menu-item-text').textContent;
        const menuItemEmoji = item.querySelector('.emoji') ? item.querySelector('.emoji').textContent : '';
        const listItem = document.createElement('li');
        listItem.textContent = `${menuItemEmoji} ${menuItemText}`;
        listItem.dataset.emoji = menuItemEmoji;
        listItem.classList.add('dropdown-item');

        listItem.addEventListener('click', () => {
            selectedCategory = {
                emoji: listItem.dataset.emoji,
                text: listItem.dataset.text
            };
            selectListButton.textContent = `Selected: ${selectedCategory.emoji} ${selectedCategory.text}`;
        });
        
        dropdownMenu.appendChild(listItem);
    });

    const taskForm = document.getElementById('taskForm');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const addTimeBtn = document.getElementById('addTimeBtn');
    const timeForm = document.getElementById('timeForm');
    

    addTimeBtn.addEventListener('click', () => {
        if (timeForm.style.display == 'none') {
            timeForm.style.display = 'flex';
            addTimeBtn.textContent = 'No Time';
        } else{
            timeForm.style.display = 'none';
            addTimeBtn.textContent = 'Set Time';
        }
    })

    // Add event listener for "Add Task" button to toggle visibility
    addTaskBtn.addEventListener('click', () => {
        if (taskForm.style.display === 'none') {
            taskForm.style.display = 'flex';  // Show the form
            addTaskBtn.textContent = 'Hide Task'; // Change button text
        } else {
            taskForm.style.display = 'none';  // Hide the form
            addTaskBtn.textContent = 'Add Task';  // Revert button text
        }
    });
    
    // save usename
    const nameInput = document.querySelector('#username');
    const username = localStorage.getItem('username') || '';

	nameInput.value = username;

	nameInput.addEventListener('change', (e) => {
		localStorage.setItem('username', e.target.value);
	})
    
    todos = JSON.parse(localStorage.getItem("todos")) || [];

    

    loadTodos();
});



const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".add-todo");
const todoList = document.querySelector(".todo-list");

todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", todoAction);

/*
function incrementMenuCounter(selectedCategory) {
    // Get all the menu items
    const menuItems = document.querySelectorAll('.menu-item-content');

    menuItems.forEach(item => {
        const emojiSpan = item.querySelector('.emoji');
        const textButton = item.querySelector('.menu-item-text');
        const counterSpan = item.querySelector('.number-list');

        // Check if the selectedCategory emoji or text matches the current menu item
        if (emojiSpan && textButton) {
            if (emojiSpan.innerText === selectedCategory.emoji || textButton.innerText === selectedCategory.text) {
                // Increment the number-list counter
                const currentCount = parseInt(counterSpan.innerText);
                counterSpan.innerText = currentCount + 1;
            }
        }
    });
}*/

editButton.addEventListener('click', (event) => {
    event.preventDefault();  // Prevent page refresh
    editTask(todoItem, taskTitle, taskDate, taskTimeStart, taskTimeEnd);
});

document.addEventListener("DOMContentLoaded", () => {
    const counters = JSON.parse(localStorage.getItem('counters')) || {};

    // Set counters on page load
    const menuItems = document.querySelectorAll(".menu-item");
    menuItems.forEach(item => {
        const emoji = item.querySelector('.emoji') ? item.querySelector('.emoji').textContent : '';
        const categoryText = item.querySelector('.menu-item-text').textContent.trim();
        const numberList = item.querySelector('.number-list');
        
        // Set initial value from localStorage
        if (numberList) {
            const counterValue = counters[categoryText] || 0;
            numberList.textContent = counterValue;
        }
    });
});

function updateCounter(selectedCategory, increment = true) {
    const counters = JSON.parse(localStorage.getItem('counters')) || {};
    const categoryText = selectedCategory.text;

    // Update the counter value
    if (!counters[categoryText]) {
        counters[categoryText] = 0;
    }
    
    counters[categoryText] += increment ? 1 : -1;

    // Store the updated counters in localStorage
    localStorage.setItem('counters', JSON.stringify(counters));

    // Update the displayed number
    const menuItems = document.querySelectorAll(".menu-item");
    menuItems.forEach(item => {
        const emoji = item.querySelector('.emoji') ? item.querySelector('.emoji').textContent : '';
        const categoryTextElement = item.querySelector('.menu-item-text').textContent.trim();
        const numberList = item.querySelector('.number-list');
        
        if (selectedCategory.emoji === emoji && selectedCategory.text === categoryTextElement) {
            numberList.textContent = counters[categoryText];
        }
    });

}

function addTodo(event) {
    event.preventDefault();

    const taskTitle = document.getElementById('taskTitle').value;
    const taskDate = document.getElementById('taskDate').value;
    const taskTimeStart = document.getElementById('taskTimeStart').value;
    const taskTimeEnd = document.getElementById('taskTimeEnd').value;

    const categoryEmoji = selectedCategory?.emoji || '';  // Default to an empty string if no emoji
    const categoryText = selectedCategory?.text || 'No Category';  // Default text if no category

    const todoForm = document.createElement("form");
    todoForm.classList.add("todo-form-container");
    const todoCheck = document.createElement("input");
    todoCheck.type = "checkbox";
    todoCheck.classList.add("todo-form-input");

    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    const todoItem = document.createElement("li");

    todoItem.innerText = `${categoryEmoji} ${taskTitle} ${taskDate} ${taskTimeStart}  ${taskTimeEnd}`;
    todoItem.classList.add("todo-item");

    todoDiv.appendChild(todoItem);

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
    deleteButton.classList.add("deleted");
    todoDiv.appendChild(deleteButton);

    const editButton = document.createElement("button");
    editButton.innerHTML = '<i class="fas fa-edit"></i>';
    editButton.classList.add("edit");
    todoDiv.appendChild(editButton);

    const moreButton = document.createElement("button");
    moreButton.innerHTML = '<i class="bx bx-dots-vertical-rounded"></i>';
    moreButton.classList.add("more");
    todoDiv.appendChild(moreButton);

    todoForm.appendChild(todoCheck);
    todoForm.appendChild(todoDiv);
    todoList.appendChild(todoForm);

    saveTodoToLocalStorage(taskTitle, taskDate, taskTimeStart, taskTimeEnd, selectedCategory);

    // Increment the counter in the corresponding menu item if category is selected
    if (selectedCategory) {
        updateCounter(selectedCategory, true);  // Increment
    }

    document.getElementById('taskTitle').value = "";
    document.getElementById('taskDate').value = "";
    document.getElementById('taskTimeStart').value = "";
    document.getElementById('taskTimeEnd').value = "";

     // Add edit functionality
     editButton.addEventListener('click', () => editTask(todoItem, taskTitle, taskDate, taskTimeStart, taskTimeEnd));
}


function editTask(todoItem, taskTitle, taskDate, taskTimeStart, taskTimeEnd) {
    // Create input fields for editing
    const titleInput = document.createElement('input');
    titleInput.value = taskTitle;

    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.value = taskDate;

    const timeStartInput = document.createElement('input');
    timeStartInput.type = 'time';
    timeStartInput.value = taskTimeStart;

    const timeEndInput = document.createElement('input');
    timeEndInput.type = 'time';
    timeEndInput.value = taskTimeEnd;

    // Create a save button for saving changes
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.classList.add('save');

    // Replace the task item with inputs
    todoItem.innerHTML = '';
    todoItem.appendChild(titleInput);
    todoItem.appendChild(dateInput);
    todoItem.appendChild(timeStartInput);
    todoItem.appendChild(timeEndInput);
    todoItem.appendChild(saveButton);

    // Save the new values
    saveButton.addEventListener('click', () => {
        todoItem.innerHTML = `${selectedCategory?.emoji || ''} ${titleInput.value} ${dateInput.value} ${timeStartInput.value} ${timeEndInput.value}`;
        updateTodoInLocalStorage(taskTitle, titleInput.value, dateInput.value, timeStartInput.value, timeEndInput.value);
    });
}

function todoAction(event) {
    const item = event.target;

    // If the deleted button is pressed, remove the task and decrement the counter
    if (item.classList.contains("deleted")) {
        const todoForm = item.closest('form'); // Get the form (which contains the todo task)
        const todoItem = todoForm.querySelector('.todo-item'); // Find the task's content
        
        // Extract category from the todo item (assuming the emoji is first and category text is second)
        const todoCategory = todoItem.textContent.split(' ')[0]; // Emoji (e.g., 🏠)
        const todoCategoryText = todoItem.textContent.split(' ')[1]; // Category name (e.g., Home)

        // Create an object representing the selected category
        const selectedCategory = {
            emoji: todoCategory,
            text: todoCategoryText
        };

        // Decrement the counter for the corresponding category
        updateCounter(selectedCategory, false); // 'false' means we're decrementing

        // Remove the todo item from the UI
        todoForm.remove();

        // Also remove the task from localStorage if necessary
        removeTodoFromLocalStorage(todoForm);
    } 
    // Handle task completion (toggle "completed" and "scribble" class)
    else if (item.classList.contains("todo-form-input")) {
        const todoDiv = item.closest('form').querySelector('.todo');
        const todoText = todoDiv.querySelector('.todo-item');
        todoText.classList.toggle("completed");

        if (todoText.classList.contains("completed")) {
            todoText.classList.add("scribble");
        } else {
            todoText.classList.remove("scribble");
        }
    }
}

function saveTodoToLocalStorage(taskTitle, taskDate, taskTimeStart, taskTimeEnd, category) {
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    todos.push({ taskTitle, taskDate, taskTimeStart, taskTimeEnd, category });
    localStorage.setItem("todos", JSON.stringify(todos));
}



function loadTodos() {
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    todos.forEach(todo => {
        const todoForm = document.createElement("form");
        todoForm.classList.add("todo-form-container");
        const todoCheck = document.createElement("input");
        todoCheck.type = "checkbox";
        todoCheck.classList.add("todo-form-input");

        const todoDiv = document.createElement("div");
        todoDiv.classList.add("todo");

        const todoItem = document.createElement("li");
        todoItem.innerText = `${todo.category?.emoji || ''} ${todo.taskTitle} ${todo.taskDate} ${todo.taskTimeStart}  ${todo.taskTimeEnd}`;
        todoItem.classList.add("todo-item");
        todoDiv.appendChild(todoItem);

        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.classList.add("deleted");
        todoDiv.appendChild(deleteButton);

        const moreButton = document.createElement("button");
        moreButton.innerHTML = '<i class="bx bx-dots-vertical" ></i>';
        moreButton.classList.add("more");
        todoDiv.appendChild(moreButton);

        todoForm.appendChild(todoCheck);
        todoForm.appendChild(todoDiv);
        todoList.appendChild(todoForm);

        
    });
}


function removeTodoFromLocalStorage(todoForm) {
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    const todoIndex = Array.from(todoList.children).indexOf(todoForm);
    todos.splice(todoIndex, 1);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function updateTodoInLocalStorage(oldTitle, newTitle, newDate, newTimeStart, newTimeEnd) {
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    const todoIndex = todos.findIndex(todo => todo.taskTitle === oldTitle);
    
    if (todoIndex !== -1) {
        todos[todoIndex].taskTitle = newTitle;
        todos[todoIndex].taskDate = newDate;
        todos[todoIndex].taskTimeStart = newTimeStart;
        todos[todoIndex].taskTimeEnd = newTimeEnd;
        localStorage.setItem("todos", JSON.stringify(todos));
    }
}


const body = document.querySelector("header"),
sidebar = body.querySelector(".sidebar"),
toggle = body.querySelector(".toggle");

toggle.addEventListener("click", () =>{
    sidebar.classList.toggle("close");
});


const main = document.querySelector("main"),
dropdown = main.querySelector(".dropdown"),
selectListButton = main.querySelector(".on");

selectListButton.addEventListener("click", () => {
    dropdown.classList.toggle("off");
});