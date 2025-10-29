let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function addTask()
 {
  const name = document.getElementById("taskName").value.trim();
  const category = document.getElementById("category").value.trim();
  const deadline = document.getElementById("deadline").value;
  const status = document.getElementById("status").value;

  if (!name || !category || !deadline) {
    alert("Please fill in all fields.");
    return;
  }

  const task = { name, category, deadline, status };
  tasks.push(task);
  saveTasks();
  displayTasks();
  clearInputs();
}

function clearInputs() 
{
  document.getElementById("taskName").value = "";
  document.getElementById("category").value = "";
  document.getElementById("deadline").value = "";
  document.getElementById("status").value = "In Progress";
}

function saveTasks()
 {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function displayTasks(filtered = tasks)
 {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  const today = new Date().toISOString().split("T")[0];

  filtered.forEach((task, index) =>
     {
    // Auto-update status if overdue
    if (task.status !== "Completed" && task.deadline < today) {
      task.status = "Overdue";
    }

    const li = document.createElement("li");

    const info = document.createElement("div");
    info.className = "task-info";
    info.innerHTML = `<strong>${task.name}</strong> | ${task.category} | Deadline: ${task.deadline} | Status: ${task.status}`;

    const statusSelect = document.createElement("select");
    statusSelect.className = "status-select";
    ["In Progress", "Completed", "Overdue"].forEach(option => {
      const opt = document.createElement("option");
      opt.value = option;
      opt.textContent = option;
      if (task.status === option) opt.selected = true;
      statusSelect.appendChild(opt);
    });

    statusSelect.onchange = () => 
    {
      task.status = statusSelect.value;
      saveTasks();
      displayTasks();
    };

    li.appendChild(info);
    li.appendChild(statusSelect);
    list.appendChild(li);
  });

  saveTasks();
}

function filterTasks() 
{
  const statusFilter = document.getElementById("filterStatus").value;
  const categoryFilter = document.getElementById("filterCategory").value.toLowerCase();

  const filtered = tasks.filter(task =>
 {
    const statusMatch = statusFilter === "All" || task.status === statusFilter;
    const categoryMatch = !categoryFilter || task.category.toLowerCase().includes(categoryFilter);
    return statusMatch && categoryMatch;
  });

  displayTasks(filtered);
}

// Initial display
displayTasks();
