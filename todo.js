
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


function enableTodoEdit(todoForm, todoItem, originalText) {
    // Replace text with an input field
    const inputField = document.createElement("input");
    inputField.type = "text";
    inputField.value = originalText;
    inputField.className = "todo-edit-input"; // Add a class for styling
    todoItem.innerHTML = ""; // Clear current text
    todoItem.appendChild(inputField); // Add input field to list item
    inputField.focus(); // Automatically focus on the input field

    // Handle saving of the updated text
    inputField.addEventListener("blur", function () {
        const updatedText = inputField.value.trim();
        if (updatedText) {
            todoItem.textContent = updatedText; // Update the text content
            updateTodoInLocalStorage(todoForm, updatedText); // Update local storage
        } else {
            todoItem.textContent = originalText; // Revert if empty
        }
    });

    // Handle pressing "Enter" key to save changes
    inputField.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            inputField.blur(); // Trigger the blur event to save changes
        }
    });
}

// Update the local storage for the updated to-do text
function updateTodoInLocalStorage(todoForm, updatedText) {
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    const todoIndex = Array.from(todoList.children).indexOf(todoForm);
    if (todoIndex >= 0) {
        todos[todoIndex].taskTitle = updatedText; // Update the task title in local storage
        localStorage.setItem("todos", JSON.stringify(todos)); // Save back to local storage
    }
}

// Attach double-click event listener to each todo form container
function attachEditFunctionality(todoForm, todoItem) {
    const originalText = todoItem.textContent.trim();
    todoForm.addEventListener("dblclick", function () {
        enableTodoEdit(todoForm, todoItem, originalText);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const dropdownToggle = document.querySelector(".dropdown-toggle");
    const dropdownMenu = document.querySelector(".dropdown-menu-list");
    const addTimeBtn = document.getElementById('addTimeBtn');
    const timeForm = document.getElementById('timeForm');

    dropdownToggle.addEventListener("click", () => {
        const dropdownContent = document.querySelector(".dropdown-content");
        dropdownContent.classList.toggle("on");
    });

    addTimeBtn.addEventListener('click', () => {
        timeForm.style.display = timeForm.style.display === 'flex' ? 'none' : 'flex';
        addTimeBtn.textContent = timeForm.style.display === 'flex' ? 'No Time' : 'Set Time';
    });
    const menuItems = document.querySelectorAll(".sidebar .menu-item");


    const taskForm = document.getElementById('taskForm');
    const addTaskBtn = document.getElementById('addTaskBtn');
     
    taskForm.style.display = 'none';

    // Add event listener for "Add Task" button to toggle visibility
    addTaskBtn.addEventListener('click', () => {
        if (taskForm.style.display === 'none') {
            taskForm.style.display = 'flex';  // Show the form
            addTaskBtn.textContent = '+ Create new task'; // Change button text
        } else {
            taskForm.style.display = 'none';  // Hide the form
            addTaskBtn.textContent = '+ Create new task';  // Revert button text
        }
        checkForTaskForm(); // Check for form when the button is clicked
    });

    saveChangesBtn.addEventListener('click', () => {
        taskForm.style.display = 'none';  // Hide the form
        addTaskBtn.textContent = '+ Create new task';  // Revert button text
    });
    
    //hint for username

    // save usename
    const nameInput = document.querySelector('#username');
    const username = localStorage.getItem('username') || '';

	nameInput.value = username;

	nameInput.addEventListener('change', (e) => {
		localStorage.setItem('username', e.target.value);
	})

    //hint for username
    const yourname = document.getElementById("username");
    const greetinghint = document.getElementById("greetingHint");

    yourname.addEventListener('input', () => {
        if(yourname.value.trim() !== ""){
            //greetinghint.style.opacity = '0';
            greetinghint.classList.add("hidden");
        }else{
            //greetinghint.style.opacity = '1';
            greetinghint.classList.remove("hidden");
        }})
    
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

    // Load existing lists from local storage
    loadListsFromLocalStorage();

    // Toggle visibility of new list form on click of "Create new list" button
    createNewListBtn.addEventListener("click", () => {
        newListForm.style.display = newListForm.style.display === "none" ? "block" : "none";
    });

    // Add new list to sidebar when "Add List" button is clicked
    addNewListBtn.addEventListener("click", () => {
        const newListName = newListInput.value.trim();
        const newListEmoji = newListEmojiInput.value.trim();
        if (newListName) {
            // Create new list item
            const newListItem = document.createElement("li");
            newListItem.classList.add("menu-item");
    
            const newContentDiv = document.createElement("div");
            newContentDiv.classList.add("menu-item-content");
    
            // Append emoji only if the user has provided one
            if (newListEmoji) {
                const newEmojiSpan = document.createElement("span");
                newEmojiSpan.classList.add("emoji");
                newEmojiSpan.textContent = newListEmoji; // Use user-provided emoji
                newContentDiv.appendChild(newEmojiSpan); // Append emoji span correctly
            }
    
            const newListBtn = document.createElement("button");
            newListBtn.classList.add("menu-item-text");
            newListBtn.textContent = newListName;

            const deleteButton = document.createElement("button");
            deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
            deleteButton.classList.add("deleted");
        
            deleteButton.addEventListener("click", () => {
            newListItem.remove(); // Remove the list item from sidebar
            updateDropdown(); // Update dropdown after deletion
        });
    
            // Append the list button (text)
            newContentDiv.appendChild(newListBtn);
            newContentDiv.appendChild(deleteButton);
            newListItem.appendChild(newContentDiv);
            menuList.appendChild(newListItem); // Appends to the sidebar
    
            // Clear the input fields and hide the form
            newListInput.value = "";
            newListEmojiInput.value = "";
            newListForm.style.display = "none";
        }
    });    

    updateDropdown();

    loadTodos();

    checkForTaskForm();

});


function checkForTaskForm() {
    const taskHint = document.getElementById("taskHint");
    if (todoList.querySelector("form")) {
        taskHint.classList.add("hidden"); // Hide the task hint when a form is present
    } else {
        taskHint.classList.remove("hidden"); // Show the task hint if no form is present
    }
}

checkForTaskForm();



// Function to load lists from local storage and add them to the sidebar
function loadListsFromLocalStorage() {
    const lists = JSON.parse(localStorage.getItem('lists')) || [];
    lists.forEach(list => {
        addListToSidebar(list.name, list.emoji);
    });
    updateDropdown(); // Update dropdown to reflect the loaded lists
}

// Function to add a list item to the sidebar
function addListToSidebar(listName, listEmoji) {
    const menuList = document.querySelector(".menu-list");
    const newListItem = document.createElement("li");
    newListItem.classList.add("menu-item");

    const newContentDiv = document.createElement("div");
    newContentDiv.classList.add("menu-item-content");

    // Append emoji only if the user has provided one
    if (listEmoji) {
        const newEmojiSpan = document.createElement("span");
        newEmojiSpan.classList.add("emoji");
        newEmojiSpan.textContent = listEmoji; // Use user-provided emoji
        newContentDiv.appendChild(newEmojiSpan); // Append emoji span correctly
    }

    const newListBtn = document.createElement("button");
    newListBtn.classList.add("menu-item-text");
    newListBtn.textContent = listName;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-list-btn");
    deleteButton.addEventListener("click", () => {
        newListItem.remove(); // Remove the list item from sidebar
        removeListFromLocalStorage(listName); // Remove the list from local storage
        updateDropdown(); // Update dropdown after deletion
    });

    // Append the list button (text)
    newContentDiv.appendChild(newListBtn);
    newContentDiv.appendChild(deleteButton);
    newListItem.appendChild(newContentDiv);
    menuList.appendChild(newListItem); // Appends to the sidebar
}

// Function to save a new list to local storage
function saveListToLocalStorage(listName, listEmoji) {
    let lists = JSON.parse(localStorage.getItem('lists')) || [];
    lists.push({ name: listName, emoji: listEmoji });
    localStorage.setItem('lists', JSON.stringify(lists));
}

// Function to remove a list from local storage
function removeListFromLocalStorage(listName) {
    let lists = JSON.parse(localStorage.getItem('lists')) || [];
    lists = lists.filter(list => list.name !== listName);
    localStorage.setItem('lists', JSON.stringify(lists));
}

// Function to update the dropdown menu with current lists
function updateDropdown() {
    const dropdownMenu = document.querySelector(".dropdown-menu-list");
    dropdownMenu.innerHTML = ""; // Clear the existing dropdown items

    // Get all current lists from the sidebar
    const menuItems = document.querySelectorAll(".menu-item");

    menuItems.forEach(item => {
        const menuItemText = item.querySelector('.menu-item-text').textContent;
        const menuItemEmoji = item.querySelector('.emoji') ? item.querySelector('.emoji').textContent : '';
      
        if (menuItemText === "Completed" || menuItemText === "Create new list") {
            return;
        }
      
        const listItem = document.createElement('li');
        listItem.textContent = `${menuItemEmoji} ${menuItemText}`;
        listItem.dataset.emoji = menuItemEmoji;
        listItem.classList.add('dropdown-item');
        
        // Check if there is a checkbox for this menu item
        const checkbox = item.querySelector('input[type="checkbox"]');
        if (checkbox) {
            const checkboxClone = checkbox.cloneNode(true); // Clone the checkbox
            checkboxClone.disabled = false; // Enable the checkbox for dropdown
            
            // Append the checkbox to the dropdown list item
            listItem.prepend(checkboxClone);
            
            // Apply styles based on the checkbox's ID
            if (checkbox.id === 'personal1') {
                checkboxClone.style.border = '1px solid blue';
                checkboxClone.style.padding = '6px';
                checkboxClone.style.marginBottom = '0px';
                checkboxClone.style.marginRight = '6px';
                checkboxClone.style.marginLeft = '4px';
    
            } else if (checkbox.id === 'work1') {
                checkboxClone.style.border = '1px solid green';
                checkboxClone.style.padding = '6px';
                checkboxClone.style.marginBottom = '0px';
                checkboxClone.style.marginRight = '6px';
                checkboxClone.style.marginLeft = '4px';
            }
        }
        


        listItem.addEventListener('click', () => {
            selectedCategory = {
                emoji: listItem.dataset.emoji,
                text: menuItemText
            };
            selectListButton.textContent = `Selected: ${selectedCategory.emoji} ${selectedCategory.text}`;
        });

        dropdownMenu.appendChild(listItem);
    });
}

updateDropdown();

function addTodo(event) {
    event.preventDefault();

    const taskTitle = document.getElementById('taskTitle').value;
    const taskDate = document.getElementById('taskDate').value;
    let taskTimeStart = document.getElementById('taskTimeStart').value;
    let taskTimeEnd = document.getElementById('taskTimeEnd').value;

    const categoryEmoji = selectedCategory?.emoji || '';  // Default to an empty string if no emoji
    const categoryText = selectedCategory?.text || 'No Category';  // Default text if no category

    if (!taskTitle) return; // Prevent empty tasks

    // Only set default times if both start and end times are empty
    if (!taskTimeStart && !taskTimeEnd) {
        const currentTime = new Date();
        const currentHours = currentTime.getHours();
        const currentMinutes = currentTime.getMinutes();

        // Set default start time to current time in HH:MM format
        taskTimeStart = `${String(currentHours).padStart(2, '0')}:${String(currentMinutes).padStart(2, '0')}`;

        // Set default end time to one hour from current time
        const endTime = new Date(currentTime.getTime() + 60 * 60 * 1000);  // Add 1 hour in milliseconds
        const endHours = endTime.getHours();
        const endMinutes = endTime.getMinutes();

        taskTimeEnd = `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
    }

    const todoForm = document.createElement("form");
    todoForm.classList.add("todo-form-container");

    const todoCheck = document.createElement("input");
    todoCheck.type = "checkbox";
    todoCheck.classList.add("todo-form-input");

    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");

    const todoItem = document.createElement("li");

    // Check if the selected category is "Personal" or "Work"
    if (categoryText === "Personal" || categoryText === "Work") {
        // Create a checkbox for "Personal" or "Work"
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("todo-category-checkbox");

        if (categoryText === "Personal") {
            checkbox.id = "personal1";  // Assign ID for styling
        } else if (categoryText === "Work") {
            checkbox.id = "work1";  // Assign ID for styling
        }

        // Append the checkbox to the todo item
        todoItem.appendChild(checkbox);

        // Append the task title text after the checkbox
        const textNode = document.createTextNode(` ${taskTitle}`);
        todoItem.appendChild(textNode);
    } else {
        // Use emoji for other categories
        todoItem.innerText = `${categoryEmoji} ${taskTitle}`;
    }
    
    todoItem.classList.add("todo-item");
    todoDiv.appendChild(todoItem);

    // Conditionally add the time container only if time fields are not empty
    if (taskTimeStart && taskTimeEnd) {
        const timeContainer = document.createElement("div");
        timeContainer.classList.add("task-time-container");

        // Add Time Range
        const timeRange = document.createElement("span");
        timeRange.classList.add("time-range");
        timeRange.innerHTML = `<i class='bx bx-time'></i> ${taskTimeStart} - ${taskTimeEnd}`;
        timeContainer.appendChild(timeRange);

        todoDiv.appendChild(timeContainer); // Append the date and time container
    }

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
    deleteButton.classList.add("deleted");
    deleteButton.style.display = 'none';  // Initially hidden
    todoDiv.appendChild(deleteButton);

    const moreButton = document.createElement("button");
    moreButton.innerHTML = '<i class="bx bx-dots-vertical-rounded"></i>';
    moreButton.classList.add("more");
    moreButton.addEventListener("click", (e) => {
        e.preventDefault();  // Prevent default button behavior
        deleteButton.style.display = deleteButton.style.display === "none" ? "inline-block" : "none";  // Toggle display
    });
    todoDiv.appendChild(moreButton);

    todoForm.appendChild(todoCheck);
    todoForm.appendChild(todoDiv);
    todoList.appendChild(todoForm);

    // Save to local storage
    saveTodoToLocalStorage(taskTitle, taskDate, taskTimeStart, taskTimeEnd, selectedCategory);

    // Increment the counter in the corresponding menu item if category is selected
    if (selectedCategory) {
        updateCounter(selectedCategory, true);  // Increment
    }

    // Clear input fields
    document.getElementById('taskTitle').value = "";
    document.getElementById('taskTimeStart').value = "";
    document.getElementById('taskTimeEnd').value = "";
}




// Function to decrement the counter for a specific category using emoji or checkbox ID
function decrementCounter(emojiOrCheckbox) {
    const counters = JSON.parse(localStorage.getItem('counters')) || {};

    // Ensure the category exists in counters
    if (!counters[emojiOrCheckbox]) {
        counters[emojiOrCheckbox] = 0;  // Initialize if not present
    }

    // Decrement the counter
    counters[emojiOrCheckbox] -= 1;

    // Ensure counter doesn't go below 0
    if (counters[emojiOrCheckbox] < 0) counters[emojiOrCheckbox] = 0;

    // Store the updated counters in localStorage
    localStorage.setItem('counters', JSON.stringify(counters));

    // Update the displayed number
    const menuItems = document.querySelectorAll(".menu-item");
    menuItems.forEach(item => {
        const emoji = item.querySelector('.emoji') ? item.querySelector('.emoji').textContent : '';
        const checkboxId = item.querySelector('input[type="checkbox"]')?.id;
        const numberList = item.querySelector('.number-list');

        if (emojiOrCheckbox === emoji || emojiOrCheckbox === checkboxId) {
            numberList.textContent = counters[emojiOrCheckbox];
        }
    });
}

function updateCounter(selectedCategory, increment = true) {
    const counters = JSON.parse(localStorage.getItem('counters')) || {};
    const emojiOrCheckbox = selectedCategory.emoji || selectedCategory.checkbox;  // Use emoji or checkbox as identifier

    // Update the counter value
    if (!counters[emojiOrCheckbox]) {
        counters[emojiOrCheckbox] = 0;  // Initialize if not present
    }
    
    // Increment or decrement the counter
    counters[emojiOrCheckbox] += increment ? 1 : -1;

    // Ensure counter doesn't go below 0
    if (counters[emojiOrCheckbox] < 0) counters[emojiOrCheckbox] = 0;

    // Store the updated counters in localStorage
    localStorage.setItem('counters', JSON.stringify(counters));

    // Update the displayed number
    const menuItems = document.querySelectorAll(".menu-item");
    menuItems.forEach(item => {
        const emoji = item.querySelector('.emoji') ? item.querySelector('.emoji').textContent : '';
        const checkboxId = item.querySelector('input[type="checkbox"]')?.id;
        const numberList = item.querySelector('.number-list');

        if (emojiOrCheckbox === emoji || emojiOrCheckbox === checkboxId) {
            numberList.textContent = counters[emojiOrCheckbox];
        }
    });
}

function todoAction(event) {
    const item = event.target;

    // If the delete button is pressed, remove the task and decrement the counter
    if (item.classList.contains("deleted")) {
        const todoForm = item.closest('form'); // Get the form (which contains the todo task)
        const todoItem = todoForm.querySelector('.todo-item'); // Find the task's content
        
        // Extract category from the todo item by checking if it has an emoji or checkbox
        const todoCategoryEmoji = todoItem.textContent.trim().charAt(0); // Assume the first character is the emoji
        const checkboxId = item.closest('form').querySelector('input[type="checkbox"]')?.id;

        const emojiOrCheckbox = checkboxId || todoCategoryEmoji; // Prefer checkbox ID if available

        if (emojiOrCheckbox) {
            // Decrement the counter
            decrementCounter(emojiOrCheckbox); // Use the new decrement function
        }

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

        const completedCheckbox = document.querySelector('#completed1'); // Using the checkbox input as identifier
        
        if (todoText.classList.contains("completed")) {
            todoText.classList.add("scribble");

            if (completedCheckbox) {
                const selectedCategory = {
                    emoji: '',  // Empty since we're not using emoji
                    checkbox: completedCheckbox.id  // Use checkbox ID
                };
                updateCounter(selectedCategory, true); // Increment "Completed" counter
            }
        
        } else {
            todoText.classList.remove("scribble");

            if (completedCheckbox) {
                const selectedCategory = {
                    emoji: '',
                    checkbox: completedCheckbox.id
                };
                updateCounter(selectedCategory, false); // Decrement "Completed" counter
            }
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

    todos.forEach((todo) => {
        const todoForm = document.createElement("form");
        todoForm.classList.add("todo-form-container");

        const todoCheck = document.createElement("input");
        todoCheck.type = "checkbox";
        todoCheck.classList.add("todo-form-input");

        const todoDiv = document.createElement("div");
        todoDiv.classList.add("todo");

        const todoItem = document.createElement("li");
        todoItem.innerText = `${todo.category?.emoji || ''} ${todo.taskTitle}`;
        todoItem.classList.add("todo-item");
        
        const timeContainer = document.createElement("div");
        timeContainer.classList.add("task-time-container");

        // Add Time Range
        const timeRange = document.createElement("span");
        timeRange.classList.add("time-range");
        timeRange.innerHTML = `<i class='bx bx-time'></i> ${todo.taskTimeStart} - ${todo.taskTimeEnd}`;
        timeContainer.appendChild(timeRange);

        todoDiv.appendChild(todoItem);
        todoDiv.appendChild(timeContainer);  // Append the time container correctly

        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.classList.add("deleted");
        deleteButton.style.display = 'none';  // Initially hidden
        todoDiv.appendChild(deleteButton);

        const moreButton = document.createElement("button");
        moreButton.innerHTML = '<i class="bx bx-dots-vertical-rounded"></i>';
        moreButton.classList.add("more");
        moreButton.addEventListener("click", (e) => {
            e.preventDefault();  // Prevent default button behavior
            deleteButton.style.display = deleteButton.style.display === "none" ? "inline-block" : "none";  // Toggle display
        });
        todoDiv.appendChild(moreButton);

        todoForm.appendChild(todoCheck);
        todoForm.appendChild(todoDiv);
        todoList.appendChild(todoForm);

        // Attach the editing functionality to the todo item
        attachEditFunctionality(todoForm, todoItem);
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
    toggle = body.querySelector(".toggle"),
    sidebarHint = document.getElementById("sidebarHint");

let hasOpenedOnce = false; // Track if the sidebar has been opened once

toggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");

    if (sidebar.classList.contains("close")) {
        // Show the arrow and text only if it hasn't been opened yet
        if (!hasOpenedOnce) {
            sidebarHint.style.opacity = "1";
            sidebarHint.style.visibility = "visible";
        }
    } else {
        // When the sidebar is opened, hide the hint and mark as opened once
        sidebarHint.style.opacity = "0";
        sidebarHint.style.visibility = "hidden";
        hasOpenedOnce = true; // Mark that the sidebar has been opened once
    }
});

// Initialize visibility based on the sidebar's initial state
if (sidebar.classList.contains("close")) {
    sidebarHint.style.opacity = "1"; // Show the arrow and text initially
    sidebarHint.style.visibility = "visible";
} else {
    sidebarHint.style.opacity = "0"; // Hide the arrow and text initially
    sidebarHint.style.visibility = "hidden";
}


const main = document.querySelector("main"),
dropdown = main.querySelector(".dropdown"),
selectListButton = main.querySelector(".on");

selectListButton.addEventListener("click", () => {
    dropdown.classList.toggle("off");
});

