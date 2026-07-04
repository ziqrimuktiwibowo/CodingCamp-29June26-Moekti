const clockDisplay = document.getElementById('clock-display');
const dateDisplay = document.getElementById('date-display');
const greetingTime = document.getElementById('greeting-time');
const userName = document.getElementById('user-name');

function updateClock() {
    const now = new Date();
    
    // Format Jam
    let hours = now.getHours().toString().padStart(2, '0');
    let minutes = now.getMinutes().toString().padStart(2, '0');
    let seconds = now.getSeconds().toString().padStart(2, '0');
    clockDisplay.textContent = `${hours}:${minutes}:${seconds}`;

    // Format Tanggal
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateDisplay.textContent = now.toLocaleDateString('en-US', options);

    // Waktu Greeting
    let hour = now.getHours();
    if (hour < 12) greetingTime.textContent = 'Good Morning';
    else if (hour < 18) greetingTime.textContent = 'Good Afternoon';
    else greetingTime.textContent = 'Good Evening';
}
setInterval(updateClock, 1000);
updateClock();

// Custom Name (Challenge 2)
let savedName = localStorage.getItem('dash_name');
if (savedName) userName.textContent = savedName;

userName.addEventListener('blur', () => {
    localStorage.setItem('dash_name', userName.textContent);
});

// --- 2. FOCUS TIMER ---
let timerInterval;
let timeLeft = 25 * 60; // 25 menit
let isRunning = false;

const timerDisplay = document.getElementById('timer-display');
const btnStart = document.getElementById('btn-start');
const btnStop = document.getElementById('btn-stop');
const btnReset = document.getElementById('btn-reset');

function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

btnStart.addEventListener('click', () => {
    if (!isRunning) {
        isRunning = true;
        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                timerDisplay.textContent = formatTime(timeLeft);
            } else {
                clearInterval(timerInterval);
                isRunning = false;
                alert("Waktu fokus selesai!");
            }
        }, 1000);
    }
});

btnStop.addEventListener('click', () => {
    clearInterval(timerInterval);
    isRunning = false;
});

btnReset.addEventListener('click', () => {
    clearInterval(timerInterval);
    isRunning = false;
    timeLeft = 25 * 60;
    timerDisplay.textContent = formatTime(timeLeft);
});

// --- 3. TO-DO LIST ---
let tasks = JSON.parse(localStorage.getItem('dash_tasks')) || [];
const taskInput = document.getElementById('task-input');
const btnAddTask = document.getElementById('btn-add-task');
const taskList = document.getElementById('task-list');

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        
        const spanText = document.createElement('span');
        spanText.textContent = task.text;
        spanText.className = task.done ? 'task-text done' : 'task-text';
        
        // Mark as done
        spanText.addEventListener('click', () => {
            tasks[index].done = !tasks[index].done;
            saveTasks();
            renderTasks();
        });

        // Edit
        spanText.addEventListener('dblclick', () => {
            let newText = prompt("Edit task:", task.text);
            if (newText !== null && newText.trim() !== '') {
                tasks[index].text = newText.trim();
                saveTasks();
                renderTasks();
            }
        });

        const btnDelete = document.createElement('button');
        btnDelete.textContent = 'X';
        btnDelete.className = 'delete-btn';
        btnDelete.addEventListener('click', () => {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        });

        li.appendChild(spanText);
        li.appendChild(btnDelete);
        taskList.appendChild(li);
    });
}

function saveTasks() {
    localStorage.setItem('dash_tasks', JSON.stringify(tasks));
}

btnAddTask.addEventListener('click', () => {
    const text = taskInput.value.trim();
    if (text !== '') {
        // Prevent Duplicate Tasks (Challenge 4)
        let isDuplicate = tasks.some(t => t.text.toLowerCase() === text.toLowerCase());
        
        if (isDuplicate) {
            alert("Tugas ini sudah ada di daftar!");
        } else {
            tasks.push({ text: text, done: false });
            saveTasks();
            renderTasks();
            taskInput.value = '';
        }
    }
});

renderTasks();

// --- 4. QUICK LINKS ---
let links = JSON.parse(localStorage.getItem('dash_links')) || [];
const linkName = document.getElementById('link-name');
const linkUrl = document.getElementById('link-url');
const btnAddLink = document.getElementById('btn-add-link');
const linksContainer = document.getElementById('quick-links-container');

function renderLinks() {
    linksContainer.innerHTML = '';
    links.forEach(link => {
        const a = document.createElement('a');
        a.href = link.url;
        a.textContent = link.name;
        a.className = 'link-item';
        a.target = '_blank';
        linksContainer.appendChild(a);
    });
}

function saveLinks() {
    localStorage.setItem('dash_links', JSON.stringify(links));
}

btnAddLink.addEventListener('click', () => {
    let name = linkName.value.trim();
    let url = linkUrl.value.trim();
    
    // Simple validation nambah https:// kalau user lupa
    if (name !== '' && url !== '') {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        links.push({ name: name, url: url });
        saveLinks();
        renderLinks();
        linkName.value = '';
        linkUrl.value = '';
    }
});

renderLinks();

// --- 5. LIGHT / DARK MODE (Challenge 1) ---
const themeToggleBtn = document.getElementById('theme-toggle');
let currentTheme = localStorage.getItem('dash_theme') || 'light';

if (currentTheme === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
}

themeToggleBtn.addEventListener('click', () => {
    if (document.body.getAttribute('data-theme') === 'dark') {
        document.body.removeAttribute('data-theme');
        localStorage.setItem('dash_theme', 'light');
    } else {
        document.body.setAttribute('data-theme', 'dark');
        localStorage.setItem('dash_theme', 'dark');
    }
});
