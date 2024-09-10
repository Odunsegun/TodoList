
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
const formattedDate = today.toISOString().split('T')[0]; // Get  format
taskDateInput.value = formattedDate;


const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".add-todo");
const todoList = document.querySelector(".todo-list");

todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", todoAction);



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
    
    const counters = JSON.parse(localStorage.getItem('counters')) || {};

    // Set counters on page load
    const menuItemss = document.querySelectorAll(".menu-item");
    menuItemss.forEach(item => {
        const emoji = item.querySelector('.emoji') ? item.querySelector('.emoji').textContent : '';
        const categoryText = item.querySelector('.menu-item-text').textContent.trim();
        const numberList = item.querySelector('.number-list');
        
        // Set initial value from localStorage
        if (numberList) {
            const counterValue = counters[categoryText] || 0;
            numberList.textContent = counterValue;
        }
    });

    const createNewListBtn = document.getElementById("createNewListBtn");
    const newListForm = document.getElementById("newListForm");
    const addNewListBtn = document.getElementById("addNewListBtn");
    const newListInput = document.getElementById("newListInput");
    const menuList = document.querySelector(".menu-list"); // Ensure this targets the correct element

    // Toggle visibility of new list form on click of "Create new list" button
    createNewListBtn.addEventListener("click", () => {
        newListForm.style.display = newListForm.style.display === "none" ? "block" : "none";
    });

    // Add new list to sidebar when "Add List" button is clicked
    addNewListBtn.addEventListener("click", () => {
        const newListName = newListInput.value.trim();
        if (newListName) {
            // Create new list item
            const newListItem = document.createElement("li");
            newListItem.classList.add("menu-item");

            const newContentDiv = document.createElement("div");
            newContentDiv.classList.add("menu-item-content");

            const newEmojiSpan = document.createElement("span");
            newEmojiSpan.classList.add("emoji");
            newEmojiSpan.textContent = "🆕"; // Example emoji for the new list

            const newListBtn = document.createElement("button");
            newListBtn.classList.add("menu-item-text");
            newListBtn.textContent = newListName;

            // Append new elements
            newContentDiv.appendChild(newEmojiSpan);
            newContentDiv.appendChild(newListBtn);
            newListItem.appendChild(newContentDiv);
            menuList.appendChild(newListItem); // Appends to the sidebar

            // Clear the input field and hide the form
            newListInput.value = "";
            newListForm.style.display = "none";
        }
    });
    

    loadTodos();
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

    const dateTimeContainer = document.createElement("span");
    dateTimeContainer.classList.add("task-datetime");
    dateTimeContainer.innerText = `Date - ${taskDate} ${taskTimeStart} - ${taskTimeEnd}`;

    todoItem.innerText = `${categoryEmoji} ${taskTitle}`;
    todoItem.classList.add("todo-item");

    todoDiv.appendChild(todoItem);
    todoDiv.appendChild(dateTimeContainer); // Append the date and time container


    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
    deleteButton.classList.add("deleted");
    todoDiv.appendChild(deleteButton);

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

        const edit = document.createElement("button");
    });
}


function removeTodoFromLocalStorage(todoForm) {
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    const todoIndex = Array.from(todoList.children).indexOf(todoForm);
    todos.splice(todoIndex, 1);
    localStorage.setItem("todos", JSON.stringify(todos));
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

