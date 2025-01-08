document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskList = document.getElementById("taskList");
    const filterBtns = document.querySelectorAll(".filter-btn");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let currentFilter = "all";

    function renderTasks() {
        taskList.innerHTML = "";
        const filteredTasks = tasks.filter(task => {
            if (currentFilter === "completed") return task.completed;
            if (currentFilter === "incomplete") return !task.completed;
            return true;
        });

        filteredTasks.forEach((task, index) => {
            const li = document.createElement("li");
            li.className = `task-item ${task.completed ? "completed" : ""}`;
            li.innerHTML = `
                <span>${task.text}</span>
                <div class="task-actions">
                    <button class="edit-btn" data-index="${index}">Edit</button>
                    <button class="delete-btn" data-index="${index}">Delete</button>
                    <button class="toggle-btn" data-index="${index}">
                        ${task.completed ? "Undo" : "Complete"}
                    </button>
                </div>
            `;
            taskList.appendChild(li);
        });
    }

    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    addTaskBtn.addEventListener("click", () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            tasks.push({ text: taskText, completed: false });
            saveTasks();
            renderTasks();
            taskInput.value = "";
        }
    });

    taskList.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        if (e.target.classList.contains("edit-btn")) {
            const newText = prompt("Edit your task:", tasks[index].text);
            if (newText !== null) {
                tasks[index].text = newText.trim() || tasks[index].text;
                saveTasks();
                renderTasks();
            }
        } else if (e.target.classList.contains("delete-btn")) {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        } else if (e.target.classList.contains("toggle-btn")) {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            renderTasks();
        }
    });

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentFilter = btn.dataset.filter;
            renderTasks();
        });
    });

    renderTasks();
});
