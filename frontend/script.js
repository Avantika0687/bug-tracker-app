const API_URL = "http://127.0.0.1:8000";

const username = document.getElementById("username");
const password = document.getElementById("password");
const loginButton = document.getElementById("loginButton");
const loginMessage = document.getElementById("loginMessage");

const loginContainer = document.getElementById("loginContainer");
const dashboardContainer = document.getElementById("dashboardContainer");
const welcomeMessage = document.getElementById("welcomeMessage");
const logoutButton = document.getElementById("logoutButton");
const dashboardActions = document.getElementById("dashboardActions");
const dashboardSummary = document.getElementById("dashboardSummary");

const createBugContainer = document.getElementById("createBugContainer");
const backToDashboardButton = document.getElementById("backToDashboardButton");

const bugTitle = document.getElementById("bugTitle");
const bugDescription = document.getElementById("bugDescription");
const bugSeverity = document.getElementById("bugSeverity");
const bugPriority = document.getElementById("bugPriority");
const assignedTo = document.getElementById("assignedTo");
const saveBugButton = document.getElementById("saveBugButton");

const bugListContainer = document.getElementById("bugListContainer");
const bugList = document.getElementById("bugList");
const backFromBugListButton = document.getElementById("backFromBugListButton");

let bugs = [];
let editingIndex = null;

let loggedInRole = null;
let loggedInDeveloperName = null;
let currentBugListFilter = null;

function convertApiBugToFrontendBug(apiBug) {
    return {
        id: apiBug.id,
        title: apiBug.title,
        description: apiBug.description,
        severity: apiBug.severity,
        priority: apiBug.priority,
        assignedTo: apiBug.assigned_to,
        createdBy: apiBug.created_by,
        createdDate: "From API",
        status: apiBug.status
    };
}

async function loadBugsFromApi() {
    const response = await fetch(`${API_URL}/bugs`);
    const apiBugs = await response.json();

    bugs = apiBugs.map(function (bug) {
        return convertApiBugToFrontendBug(bug);
    });
}

loginButton.addEventListener("click", async function () {
    const enteredUsername = username.value;
    const enteredPassword = password.value;

    if (enteredUsername === "tester" && enteredPassword === "tester123") {
        loggedInRole = "Tester";
        loggedInDeveloperName = null;
        currentBugListFilter = null;

        await loadBugsFromApi();

        loginContainer.style.display = "none";
        dashboardContainer.style.display = "block";
        welcomeMessage.textContent = "Welcome, Tester";

        dashboardActions.innerHTML = `
            <button id="createBugButton">Create Bug</button>
            <button id="viewBugsButton">View Bugs</button>
        `;

        updateDashboardSummary();

    } else if (enteredUsername === "developer1" && enteredPassword === "developer123") {
        await showDeveloperDashboard("Developer 1");

    } else if (enteredUsername === "developer2" && enteredPassword === "developer123") {
        await showDeveloperDashboard("Developer 2");

    } else if (enteredUsername === "developer3" && enteredPassword === "developer123") {
        await showDeveloperDashboard("Developer 3");

    } else if (enteredUsername === "manager" && enteredPassword === "manager123") {
        loggedInRole = "Manager";
        loggedInDeveloperName = null;
        currentBugListFilter = null;

        await loadBugsFromApi();

        loginContainer.style.display = "none";
        dashboardContainer.style.display = "block";
        welcomeMessage.textContent = "Welcome, Manager";

        dashboardActions.innerHTML = `
            <button id="viewBugsButton">View All Bugs</button>
            <button>Reports</button>
        `;

        updateDashboardSummary();

    } else {
        loginMessage.textContent = "Invalid username or password";
    }
});

async function showDeveloperDashboard(developerName) {
    loggedInRole = "Developer";
    loggedInDeveloperName = developerName;
    currentBugListFilter = developerName;

    await loadBugsFromApi();

    loginContainer.style.display = "none";
    dashboardContainer.style.display = "block";
    welcomeMessage.textContent = "Welcome, " + developerName;

    dashboardActions.innerHTML = `
        <button id="myAssignedBugsButton">My Assigned Bugs</button>
    `;

    updateDashboardSummary();
}

logoutButton.addEventListener("click", function () {
    dashboardContainer.style.display = "none";
    createBugContainer.style.display = "none";
    bugListContainer.style.display = "none";
    loginContainer.style.display = "block";

    username.value = "";
    password.value = "";
    loginMessage.textContent = "";

    loggedInRole = null;
    loggedInDeveloperName = null;
    editingIndex = null;
    currentBugListFilter = null;
});

document.addEventListener("click", async function (event) {
    if (event.target.id === "createBugButton") {
        editingIndex = null;
        currentBugListFilter = null;

        bugTitle.value = "";
        bugDescription.value = "";
        bugSeverity.value = "Low";
        bugPriority.value = "Low";
        assignedTo.value = "Developer 1";
        saveBugButton.textContent = "Create Bug";

        dashboardContainer.style.display = "none";
        bugListContainer.style.display = "none";
        createBugContainer.style.display = "block";
    }

    if (event.target.id === "viewBugsButton") {
        currentBugListFilter = null;

        await loadBugsFromApi();

        dashboardContainer.style.display = "none";
        createBugContainer.style.display = "none";
        bugListContainer.style.display = "block";

        showBugs();
    }

    if (event.target.id === "myAssignedBugsButton") {
        currentBugListFilter = loggedInDeveloperName;

        await loadBugsFromApi();

        dashboardContainer.style.display = "none";
        createBugContainer.style.display = "none";
        bugListContainer.style.display = "block";

        showBugs(currentBugListFilter);
    }
});

backToDashboardButton.addEventListener("click", async function () {
    createBugContainer.style.display = "none";
    bugListContainer.style.display = "none";
    dashboardContainer.style.display = "block";

    editingIndex = null;
    saveBugButton.textContent = "Create Bug";

    await loadBugsFromApi();
    updateDashboardSummary();
});

backFromBugListButton.addEventListener("click", async function () {
    bugListContainer.style.display = "none";
    createBugContainer.style.display = "none";
    dashboardContainer.style.display = "block";

    await loadBugsFromApi();
    updateDashboardSummary();
});

saveBugButton.addEventListener("click", async function () {
    const title = bugTitle.value;
    const description = bugDescription.value;
    const severity = bugSeverity.value;
    const priority = bugPriority.value;
    const assignedDeveloper = assignedTo.value;

    if (title === "" || description === "") {
        alert("Please enter bug title and description");
        return;
    }

    if (editingIndex !== null) {
        const bugId = bugs[editingIndex].id;

        const response = await fetch(`${API_URL}/bugs/${bugId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                description: description,
                severity: severity,
                priority: priority,
                assigned_to: assignedDeveloper
            })
        });

        const updatedApiBug = await response.json();
        bugs[editingIndex] = convertApiBugToFrontendBug(updatedApiBug);

        alert("Bug updated successfully");

        editingIndex = null;
        saveBugButton.textContent = "Create Bug";

        bugTitle.value = "";
        bugDescription.value = "";
        bugSeverity.value = "Low";
        bugPriority.value = "Low";
        assignedTo.value = "Developer 1";

        createBugContainer.style.display = "none";
        bugListContainer.style.display = "block";

        await loadBugsFromApi();
        showBugs(currentBugListFilter);

        return;
    }

    const response = await fetch(`${API_URL}/bugs`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: title,
            description: description,
            severity: severity,
            priority: priority,
            assigned_to: assignedDeveloper
        })
    });

    const createdApiBug = await response.json();
    const newBug = convertApiBugToFrontendBug(createdApiBug);

    bugs.push(newBug);

    alert("Bug created successfully");

    bugTitle.value = "";
    bugDescription.value = "";
    bugSeverity.value = "Low";
    bugPriority.value = "Low";
    assignedTo.value = "Developer 1";

    updateDashboardSummary();
});

function showBugs(assignedDeveloperFilter = null) {
    bugList.innerHTML = "";

    let hasBugToShow = false;

    for (let i = 0; i < bugs.length; i++) {
        if (assignedDeveloperFilter !== null && bugs[i].assignedTo !== assignedDeveloperFilter) {
            continue;
        }

        hasBugToShow = true;

        bugList.innerHTML += `
            <div class="bug-card">
                <h3>BUG-${bugs[i].id}: ${bugs[i].title}</h3>
                <p><strong>Created By:</strong> ${bugs[i].createdBy}</p>
                <p><strong>Created Date:</strong> ${bugs[i].createdDate}</p>
                <p><strong>Description:</strong> ${bugs[i].description}</p>
                <p><strong>Severity:</strong> ${bugs[i].severity}</p>
                <p><strong>Priority:</strong> ${bugs[i].priority}</p>
                <p><strong>Assigned To:</strong> ${bugs[i].assignedTo}</p>
                <p><strong>Status:</strong> ${bugs[i].status}</p>

                <select onchange="changeBugStatus(${i}, this.value)">
                    <option value="Open" ${bugs[i].status === "Open" ? "selected" : ""}>Open</option>
                    <option value="In Progress" ${bugs[i].status === "In Progress" ? "selected" : ""}>In Progress</option>
                    <option value="Fixed" ${bugs[i].status === "Fixed" ? "selected" : ""}>Fixed</option>
                    <option value="Closed" ${bugs[i].status === "Closed" ? "selected" : ""}>Closed</option>
                </select>

                ${getBugActionButtons(i)}
            </div>
        `;
    }

    if (hasBugToShow === false) {
        bugList.innerHTML = "<p>No bugs found.</p>";
    }
}

function getBugActionButtons(index) {
    if (loggedInRole === "Developer") {
        return "";
    }

    return `
        <button onclick="editBug(${index})">Edit</button>
        <button onclick="deleteBug(${index})">Delete</button>
    `;
}

function editBug(index) {
    editingIndex = index;

    bugTitle.value = bugs[index].title;
    bugDescription.value = bugs[index].description;
    bugSeverity.value = bugs[index].severity;
    bugPriority.value = bugs[index].priority;
    assignedTo.value = bugs[index].assignedTo;

    saveBugButton.textContent = "Update Bug";

    bugListContainer.style.display = "none";
    dashboardContainer.style.display = "none";
    createBugContainer.style.display = "block";
}

async function deleteBug(index) {
    const confirmDelete = confirm("Are you sure you want to delete this bug?");

    if (confirmDelete === false) {
        return;
    }

    const bugId = bugs[index].id;

    await fetch(`${API_URL}/bugs/${bugId}`, {
        method: "DELETE"
    });

    await loadBugsFromApi();

    showBugs(currentBugListFilter);
    updateDashboardSummary();
}

async function changeBugStatus(index, newStatus) {
    const bugId = bugs[index].id;

    const response = await fetch(`${API_URL}/bugs/${bugId}/status`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            status: newStatus
        })
    });

    const updatedApiBug = await response.json();
    bugs[index] = convertApiBugToFrontendBug(updatedApiBug);

    await loadBugsFromApi();

    showBugs(currentBugListFilter);
    updateDashboardSummary();
}

function updateDashboardSummary() {
    let summaryBugs = bugs;

    if (loggedInRole === "Developer" && loggedInDeveloperName !== null) {
        summaryBugs = bugs.filter(function (bug) {
            return bug.assignedTo === loggedInDeveloperName;
        });
    }

    const totalBugs = summaryBugs.length;
    const openBugs = summaryBugs.filter(bug => bug.status === "Open").length;
    const inProgressBugs = summaryBugs.filter(bug => bug.status === "In Progress").length;
    const fixedBugs = summaryBugs.filter(bug => bug.status === "Fixed").length;
    const closedBugs = summaryBugs.filter(bug => bug.status === "Closed").length;

    dashboardSummary.innerHTML = `
        <p><strong>Total Bugs:</strong> ${totalBugs}</p>
        <p><strong>Open:</strong> ${openBugs}</p>
        <p><strong>In Progress:</strong> ${inProgressBugs}</p>
        <p><strong>Fixed:</strong> ${fixedBugs}</p>
        <p><strong>Closed:</strong> ${closedBugs}</p>
    `;
}