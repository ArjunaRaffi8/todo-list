// Load tasks dari localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let editingIndex = null;

const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const removeAllButton = document.getElementById('removeAllButton');
const deleteSelectedButton = document.getElementById('deleteSelectedButton');
const tasksList = document.getElementById('tasksList');

// Function untuk render tasks
function renderTasks() {
    tasksList.innerHTML = '';
    
    // Show/hide buttons
    const hasSelectedTasks = tasks.some(task => task.selected);
    removeAllButton.style.display = tasks.length > 0 ? 'block' : 'none';
    deleteSelectedButton.style.display = hasSelectedTasks ? 'block' : 'none';
    
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        if (task.completed) {
            li.classList.add('completed');
        }
        
        if (editingIndex === index) {
            // Mode editing
            const taskContent = document.createElement('div');
            taskContent.className = 'task-content';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'task-checkbox';
            checkbox.checked = task.selected || false;
            checkbox.onclick = (e) => {
                e.stopPropagation();
                toggleSelect(index);
            };
            
            const editInput = document.createElement('input');
            editInput.type = 'text';
            editInput.className = 'edit-input';
            editInput.value = task.text;
            
            taskContent.appendChild(checkbox);
            taskContent.appendChild(editInput);
            
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'task-buttons';
            
            const saveBtn = document.createElement('button');
            saveBtn.textContent = 'Save';
            saveBtn.className = 'save-btn';
            saveBtn.onclick = () => saveEdit(index, editInput.value);
            
            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = 'Cancel';
            cancelBtn.className = 'cancel-btn';
            cancelBtn.onclick = () => cancelEdit();
            
            buttonContainer.appendChild(saveBtn);
            buttonContainer.appendChild(cancelBtn);
            
            li.appendChild(taskContent);
            li.appendChild(buttonContainer);
            
            // Auto focus
            setTimeout(() => editInput.focus(), 0);
            
            // Enter untuk save
            editInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    saveEdit(index, editInput.value);
                }
            });
        } else {
            // Mode normal
            const taskContent = document.createElement('div');
            taskContent.className = 'task-content';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'task-checkbox';
            checkbox.checked = task.selected || false;
            checkbox.onclick = (e) => {
                e.stopPropagation();
                toggleSelect(index);
            };
            
            const taskText = document.createElement('span');
            taskText.className = 'task-text';
            taskText.textContent = task.text;
            taskText.onclick = () => toggleTask(index);
            
            taskContent.appendChild(checkbox);
            taskContent.appendChild(taskText);
            
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'task-buttons';
            
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.className = 'edit-btn';
            editBtn.onclick = () => startEdit(index);
            
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.className = 'delete-btn';
            deleteBtn.onclick = () => deleteTask(index);
            
            buttonContainer.appendChild(editBtn);
            buttonContainer.appendChild(deleteBtn);
            
            li.appendChild(taskContent);
            li.appendChild(buttonContainer);
        }
        
        tasksList.appendChild(li);
    });
}

// Function untuk add task
function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText !== '') {
        tasks.push({
            text: taskText,
            completed: false,
            selected: false
        });
        
        taskInput.value = '';
        saveTasks();
        renderTasks();
    }
}

// Function untuk toggle completed
function toggleTask(index) {
    if (editingIndex === null) {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    }
}

// Function untuk toggle select
function toggleSelect(index) {
    tasks[index].selected = !tasks[index].selected;
    saveTasks();
    renderTasks();
}

// Function untuk delete task
function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

// Function untuk delete selected tasks
function deleteSelectedTasks() {
    const selectedCount = tasks.filter(task => task.selected).length;
    
    if (selectedCount > 0) {
        if (confirm(`Apakah Anda yakin ingin menghapus ${selectedCount} task yang dipilih?`)) {
            tasks = tasks.filter(task => !task.selected);
            saveTasks();
            renderTasks();
        }
    }
}

// Function untuk start edit
function startEdit(index) {
    editingIndex = index;
    renderTasks();
}

// Function untuk save edit
function saveEdit(index, newText) {
    const trimmedText = newText.trim();
    if (trimmedText !== '') {
        tasks[index].text = trimmedText;
        saveTasks();
    }
    editingIndex = null;
    renderTasks();
}

// Function untuk cancel edit
function cancelEdit() {
    editingIndex = null;
    renderTasks();
}

// Function untuk remove all tasks
function removeAllTasks() {
    if (tasks.length > 0) {
        if (confirm('Apakah Anda yakin ingin menghapus semua task?')) {
            tasks = [];
            editingIndex = null;
            saveTasks();
            renderTasks();
        }
    }
}

// Function untuk save ke localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Event listener untuk button
addTaskButton.addEventListener('click', addTask);
removeAllButton.addEventListener('click', removeAllTasks);
deleteSelectedButton.addEventListener('click', deleteSelectedTasks);

// Event listener untuk Enter key
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Initial render
renderTasks();