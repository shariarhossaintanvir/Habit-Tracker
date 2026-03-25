/**
 * Dual Habit Tracker - Vanilla JS Logic
 */

// State management
let currentMode = 'good'; // 'good' or 'bad'
let habits = {
    good: [],
    bad: []
};
let selectedIcon = '📚';
let selectedType = 'simple';
let selectedDate = new Date().toISOString().split('T')[0];
let currentTheme = localStorage.getItem('dualHabitTheme') || 'default';
let profileSeed = localStorage.getItem('dualHabitProfileSeed') || 'diana';
let colorScheme = localStorage.getItem('dualHabitColorScheme') || 'light';

const icons = ['📚', '🏋️', '💻', '💰', '🧘', '🥦', '💧', '🛌', '🧹', '🎨', '🎸', '🚶', '🍎', '🚭', '📵', '🏃', '🏊', '🚴', '🥗', '💊', '🧠', '✍️', '🌱', '🧹', '🚿', '🍵', '📅', '🎯', '🔥', '✨'];

const quotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
    { text: "The best way to predict the future is to invent it.", author: "Alan Kay" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
    { text: "Hardships often prepare ordinary people for an extraordinary destiny.", author: "C.S. Lewis" },
    { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
    { text: "What you get by achieving your goals is not as important as what you become by achieving your goals.", author: "Zig Ziglar" },
    { text: "If you can dream it, you can do it.", author: "Walt Disney" },
    { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
    { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
    { text: "Don't be pushed around by the fears in your mind. Be led by the dreams in your heart.", author: "Roy T. Bennett" }
];

const challenges = [
    "Avoid phone for 6 hours",
    "No junk food today",
    "No social media for 4 hours",
    "Drink 3L of water",
    "No complaining today",
    "Walk 10,000 steps",
    "No caffeine after 2 PM"
];

// DOM Elements
const body = document.body;
const splashScreen = document.getElementById('splashScreen');
const getStartedBtn = document.getElementById('getStartedBtn');
const app = document.getElementById('app');
const habitList = document.getElementById('habitList');
const fab = document.getElementById('fab');
const modal = document.getElementById('modal');
const habitInput = document.getElementById('habitInput');
const habitDesc = document.getElementById('habitDesc');
const habitInterval = document.getElementById('habitInterval');
const iconGrid = document.getElementById('iconGrid');
const customIconInput = document.getElementById('customIconInput');
const addBtn = document.getElementById('addBtn');
const cancelBtn = document.getElementById('cancelBtn');
const emptyState = document.getElementById('emptyState');
const modeToggle = document.getElementById('modeToggle');
const detailView = document.getElementById('detailView');
const detailTitle = document.getElementById('detailTitle');
const detailIcon = document.getElementById('detailIcon');
const timerText = document.getElementById('timerText');
const closeDetailBtn = document.getElementById('closeDetailBtn');
const finishBtn = document.getElementById('finishBtn');
const deleteHabitBtn = document.getElementById('deleteHabitBtn');
const dayPickerContainer = document.getElementById('dayPickerContainer');
const dayBtns = document.querySelectorAll('.day-btn');
const settingsModal = document.getElementById('settingsModal');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const themeOptions = document.querySelectorAll('.theme-option');
const resetDataBtn = document.getElementById('resetDataBtn');
const profilePic = document.querySelector('.profile-pic');
const userNameInput = document.getElementById('userNameInput');
const changePicBtn = document.getElementById('changePicBtn');
const settingsProfileImg = document.getElementById('settingsProfileImg');
const mainProfileImg = profilePic.querySelector('img');
const userNameDisplay = document.getElementById('userName');
const darkModeToggle = document.getElementById('darkModeToggle');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const dailyChallenge = document.getElementById('dailyChallenge');
const challengeTitle = document.getElementById('challengeTitle');
const completeChallengeBtn = document.getElementById('completeChallengeBtn');
const confirmModal = document.getElementById('confirmModal');
const confirmYesBtn = document.getElementById('confirmYesBtn');
const confirmNoBtn = document.getElementById('confirmNoBtn');
const timeInputModal = document.getElementById('timeInputModal');
const minutesInput = document.getElementById('minutesInput');
const saveTimeBtn = document.getElementById('saveTimeBtn');
const closeTimeModalBtn = document.getElementById('closeTimeModalBtn');
const timeInputTitle = document.getElementById('timeInputTitle');
const timeInputDate = document.getElementById('timeInputDate');
const typeOptions = document.querySelectorAll('.type-option');

let timerInterval;
let seconds = 0;
let activeHabitIndex = null;
let activeDateStr = null;

// Initialize App
function init() {
    loadData();
    applyTheme(currentTheme);
    applyColorScheme(colorScheme);
    
    const savedName = localStorage.getItem('dualHabitUserName') || 'Diana';
    userNameDisplay.textContent = savedName;
    userNameInput.value = savedName;
    
    updateProfileUI();
    
    renderHabits();
    renderIconGrid();
    setupEventListeners();
    updateDates();
    updateStats();
    updateDailyQuote();
    updateDailyChallenge();
}

function updateDailyChallenge() {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const challengeIndex = dayOfYear % challenges.length;
    challengeTitle.textContent = challenges[challengeIndex];
    
    const challengeKey = `challenge_${today.toISOString().split('T')[0]}`;
    if (localStorage.getItem(challengeKey)) {
        completeChallengeBtn.textContent = "DEFEATED ⚔️";
        completeChallengeBtn.disabled = true;
        completeChallengeBtn.style.opacity = '0.5';
    } else {
        completeChallengeBtn.textContent = "I DID IT! ⚔️";
        completeChallengeBtn.disabled = false;
        completeChallengeBtn.style.opacity = '1';
    }
}

function updateDailyQuote() {
    const today = new Date();
    // Use day of year to select a quote that changes daily
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const quoteIndex = dayOfYear % quotes.length;
    const quote = quotes[quoteIndex];
    
    const quoteText = document.getElementById('quoteText');
    const quoteAuthor = document.getElementById('quoteAuthor');
    
    if (quoteText && quoteAuthor) {
        quoteText.textContent = `"${quote.text}"`;
        quoteAuthor.textContent = `- ${quote.author}`;
    }
}

function updateDates() {
    const dateSelector = document.querySelector('.date-selector');
    dateSelector.innerHTML = '';
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    for (let i = -2; i < 5; i++) {
        const date = new Date();
        date.setDate(today.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        const pill = document.createElement('div');
        pill.className = `date-pill ${selectedDate === dateStr ? 'active' : ''} ${dateStr > todayStr ? 'future' : ''}`;
        pill.innerHTML = `<span>${date.getDate()}</span><small>${days[date.getDay()]}</small>`;
        pill.onclick = () => {
            if (dateStr > todayStr) {
                showToast("You can't track future habits yet! Stay focused on today. 🚀");
                return;
            }
            selectedDate = dateStr;
            document.querySelectorAll('.date-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            renderHabits();
        };
        dateSelector.appendChild(pill);
    }
}

function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function applyTheme(theme) {
    currentTheme = theme;
    body.setAttribute('data-theme', theme);
    localStorage.setItem('dualHabitTheme', theme);
    
    // Update active state in UI
    document.querySelectorAll('.theme-option').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.theme === theme);
    });
}

function applyColorScheme(scheme) {
    colorScheme = scheme;
    body.setAttribute('data-color-scheme', scheme);
    localStorage.setItem('dualHabitColorScheme', scheme);
    darkModeToggle.checked = scheme === 'dark';
}

function updateStats() {
    const currentHabits = habits[currentMode];
    if (currentHabits.length === 0) {
        dailyChallenge.style.display = 'none';
        return;
    }

    if (currentMode === 'bad') {
        dailyChallenge.style.display = 'flex';
    } else {
        dailyChallenge.style.display = 'none';
    }
}

function updateProfileUI() {
    const url = `https://picsum.photos/seed/${profileSeed}/100/100`;
    mainProfileImg.src = url;
    settingsProfileImg.src = url;
}

// Load data from LocalStorage
function loadData() {
    const savedHabits = localStorage.getItem('dualHabits');
    if (savedHabits) {
        habits = JSON.parse(savedHabits);
        // Migration: ensure history exists
        ['good', 'bad'].forEach(mode => {
            habits[mode].forEach(habit => {
                if (!habit.history) {
                    habit.history = {};
                    const oldStatus = mode === 'good' ? habit.completed : habit.avoided;
                    if (oldStatus) {
                        const today = new Date().toISOString().split('T')[0];
                        habit.history[today] = true;
                    }
                    delete habit.completed;
                    delete habit.avoided;
                }
            });
        });
    }
}

// Save data to LocalStorage
function saveData() {
    localStorage.setItem('dualHabits', JSON.stringify(habits));
}

// Render Icon Grid
function renderIconGrid() {
    iconGrid.innerHTML = '';
    icons.forEach(icon => {
        const item = document.createElement('div');
        item.className = `icon-item ${selectedIcon === icon ? 'selected' : ''}`;
        item.textContent = icon;
        item.onclick = () => {
            selectedIcon = icon;
            renderIconGrid();
        };
        iconGrid.appendChild(item);
    });
    
    // Add custom icon button
    const customItem = document.createElement('div');
    customItem.className = `icon-item ${selectedIcon.startsWith('data:image') ? 'selected' : ''}`;
    customItem.innerHTML = selectedIcon.startsWith('data:image') 
        ? `<img src="${selectedIcon}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`
        : '➕';
    customItem.title = "Upload Custom Icon";
    customItem.onclick = () => customIconInput.click();
    iconGrid.appendChild(customItem);
}

// Render Habits based on current mode
function renderHabits() {
    habitList.innerHTML = '';
    const currentHabits = habits[currentMode];

    if (currentHabits.length === 0) {
        emptyState.classList.add('active');
        return;
    } else {
        emptyState.classList.remove('active');
    }

    currentHabits.forEach((habit, index) => {
        // Filter by specific days if applicable
        if (habit.interval === 'specific' && habit.days) {
            const [y, m, d] = selectedDate.split('-').map(Number);
            const dayOfWeek = new Date(y, m - 1, d).getDay();
            if (!habit.days.includes(dayOfWeek)) {
                return;
            }
        }

        const card = document.createElement('div');
        const isSpecial = habit.type === 'special';
        const isDone = isSpecial ? (habit.logs && habit.logs[selectedDate] > 0) : (habit.history && habit.history[selectedDate]);
        const streak = calculateStreak(habit);
        
        card.className = `habit-card ${isDone ? 'completed animate-bounce' : ''} ${isSpecial ? 'special-habit' : ''}`;
        card.dataset.index = index;
        
        const title = currentMode === 'bad' ? `Enemy: ${habit.name}` : habit.name;
        
        let cardHTML = `
            <div class="habit-icon">
                ${habit.icon.startsWith('data:image') 
                    ? `<img src="${habit.icon}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">` 
                    : (habit.icon || '📚')}
            </div>
            <div class="habit-content">
                <div class="habit-title">${title}</div>
                <div class="habit-subtitle">
                    ${habit.interval === 'specific' ? 'Specific Days' : (habit.interval || 'Daily')} • ${habit.description || 'Habit'}
                </div>
                ${habit.interval === 'specific' && habit.days ? `
                    <div class="habit-days-list">
                        ${['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => `
                            <div class="habit-day-dot ${habit.days.includes(i) ? 'active' : ''}">${d}</div>
                        `).join('')}
                    </div>
                ` : ''}
                <div class="streak-badge">🔥 ${streak} day streak</div>
            </div>
        `;

        if (isSpecial) {
            cardHTML += `<div class="heatmap-container" id="heatmap-${index}"></div>`;
        }

        card.innerHTML = cardHTML;
        habitList.appendChild(card);

        if (isSpecial) {
            renderHeatmap(habit, index);
        }
    });
}

function renderHeatmap(habit, index) {
    const container = document.getElementById(`heatmap-${index}`);
    if (!container) return;

    const today = new Date();
    const totalTimeThisWeek = calculateWeeklyTime(habit);

    container.innerHTML = `
        <div class="heatmap-header">
            <span>Activity Heatmap</span>
            <span class="total-time-badge">${totalTimeThisWeek}m this week</span>
        </div>
        <div class="heatmap-grid"></div>
    `;

    const grid = container.querySelector('.heatmap-grid');
    
    // Render 14 days (2 weeks)
    for (let i = 13; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const minutes = (habit.logs && habit.logs[dateStr]) || 0;
        
        const square = document.createElement('div');
        square.className = `heatmap-square ${getLevel(minutes)} ${dateStr === selectedDate ? 'today' : ''}`;
        
        square.innerHTML = `
            <div class="heatmap-tooltip">
                ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: ${minutes}m
            </div>
        `;

        grid.appendChild(square);
    }
}

function getLevel(minutes) {
    if (minutes === 0) return 'level-0';
    if (minutes < 20) return 'level-1';
    if (minutes < 45) return 'level-2';
    if (minutes < 60) return 'level-3';
    return 'level-4';
}

function calculateWeeklyTime(habit) {
    if (!habit.logs) return 0;
    let total = 0;
    const today = new Date();
    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        total += habit.logs[dateStr] || 0;
    }
    return total;
}

function openTimeInput(index, dateStr) {
    activeHabitIndex = index;
    activeDateStr = dateStr;
    const habit = habits[currentMode][index];
    
    timeInputTitle.textContent = `Log time for ${habit.name}`;
    timeInputDate.textContent = new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    minutesInput.value = (habit.logs && habit.logs[dateStr]) || '';
    
    timeInputModal.classList.add('active');
    setTimeout(() => minutesInput.focus(), 100);
}

saveTimeBtn.onclick = () => {
    const minutes = parseInt(minutesInput.value) || 0;
    const habit = habits[currentMode][activeHabitIndex];
    
    if (!habit.logs) habit.logs = {};
    habit.logs[activeDateStr] = minutes;
    
    saveData();
    renderHabits();
    updateStats();
    timeInputModal.classList.remove('active');
    showToast(`Logged ${minutes} minutes!`);
};

closeTimeModalBtn.onclick = () => {
    timeInputModal.classList.remove('active');
};

function calculateStreak(habit) {
    const isSpecial = habit.type === 'special';
    const history = isSpecial ? habit.logs : habit.history;
    if (!history) return 0;
    
    let streak = 0;
    const today = new Date();
    let checkDate = new Date(today);
    
    // If not done today, start checking from yesterday
    const todayStr = today.toISOString().split('T')[0];
    const isDoneToday = isSpecial ? (history[todayStr] > 0) : history[todayStr];
    
    if (!isDoneToday) {
        checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
        const dateStr = checkDate.toISOString().split('T')[0];
        const isDoneOnDate = isSpecial ? (history[dateStr] > 0) : history[dateStr];
        
        if (isDoneOnDate) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            break;
        }
    }
    return streak;
}

// Toggle Mode
function toggleMode() {
    currentMode = currentMode === 'good' ? 'bad' : 'good';
    body.className = currentMode === 'good' ? 'mode-good' : 'mode-bad';
    renderHabits();
    updateStats();
}

function openDetail(index) {
    activeHabitIndex = index;
    const habit = habits[currentMode][index];
    detailTitle.textContent = habit.name;
    detailIcon.innerHTML = habit.icon.startsWith('data:image') 
        ? `<img src="${habit.icon}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">` 
        : habit.icon;
    detailView.classList.add('active');
    
    // Update finish button text based on status
    const isDone = habit.history && habit.history[selectedDate];
    finishBtn.textContent = isDone ? 'Unmark' : (currentMode === 'good' ? 'Finish' : 'Avoided');
    
    // Update detail view background color based on mode
    detailView.style.backgroundColor = currentMode === 'good' ? 'var(--card-green)' : 'var(--card-pink)';
    
    startTimer();
}

function startTimer() {
    seconds = 0;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        seconds++;
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        timerText.textContent = `${m.toString().padStart(2, '0')} min ${s.toString().padStart(2, '0')} s`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

// Toggle Habit Completion
function toggleHabit(index) {
    const habit = habits[currentMode][index];
    
    if (habit.type === 'special') {
        openTimeInput(index, selectedDate);
        return;
    }

    if (!habit.history) habit.history = {};
    
    const isNowDone = !habit.history[selectedDate];
    
    if (habit.history[selectedDate]) {
        delete habit.history[selectedDate];
        if (currentMode === 'bad') {
            showToast("It got you this time 😈");
            const card = document.querySelector(`.habit-card[data-index="${index}"]`);
            if (card) {
                card.classList.add('rage-shake');
                setTimeout(() => card.classList.remove('rage-shake'), 500);
            }
        }
    } else {
        habit.history[selectedDate] = true;
        if (currentMode === 'bad') {
            showToast("You defeated it 😤🔥");
            const card = document.querySelector(`.habit-card[data-index="${index}"]`);
            if (card) {
                card.classList.add('fire-effect');
                setTimeout(() => card.classList.remove('fire-effect'), 1000);
            }
        } else {
            showToast("Habit completed! 🌟");
        }
    }
    
    saveData();
    renderHabits();
    updateStats();
}

// Delete Habit
function deleteHabit(index) {
    if (confirm('Are you sure you want to delete this habit?')) {
        habits[currentMode].splice(index, 1);
        saveData();
        renderHabits();
        updateStats();
    }
}

// Event Listeners
function setupEventListeners() {
    getStartedBtn.addEventListener('click', () => {
        splashScreen.style.opacity = '0';
        splashScreen.style.visibility = 'hidden';
        app.style.display = 'block';
    });

    const splashLinks = document.querySelectorAll('.splash-link, .splash-footer a');
    splashLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            alert('This feature is coming soon!');
        });
    });

    modeToggle.addEventListener('change', () => {
        currentMode = modeToggle.checked ? 'bad' : 'good';
        
        // Cinematic transition
        const overlay = document.createElement('div');
        overlay.className = 'mode-switch-overlay active';
        document.body.appendChild(overlay);
        
        if (currentMode === 'bad') {
            document.body.classList.add('rage-shake');
            setTimeout(() => document.body.classList.remove('rage-shake'), 500);
        }

        setTimeout(() => {
            body.className = `mode-${currentMode}`;
            renderHabits();
            updateStats();
            overlay.remove();
        }, 300);
    });

    darkModeToggle.addEventListener('change', () => {
        applyColorScheme(darkModeToggle.checked ? 'dark' : 'light');
    });

    customIconInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                selectedIcon = event.target.result;
                renderIconGrid();
            };
            reader.readAsDataURL(file);
        }
    });

    const userName = document.getElementById('userName');
    userName.addEventListener('click', () => {
        const newName = prompt('Enter your name:', userName.textContent);
        if (newName) {
            userName.textContent = newName;
            localStorage.setItem('dualHabitUserName', newName);
        }
    });

    fab.addEventListener('click', () => {
        modal.classList.add('active');
        habitInput.focus();
        // Reset type selection
        selectedType = 'simple';
        typeOptions.forEach(opt => opt.classList.toggle('active', opt.dataset.type === 'simple'));
    });

    // Type selection
    typeOptions.forEach(option => {
        option.addEventListener('click', () => {
            typeOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            selectedType = option.dataset.type;
        });
    });

    habitInterval.addEventListener('change', () => {
        if (habitInterval.value === 'specific') {
            dayPickerContainer.style.display = 'block';
        } else {
            dayPickerContainer.style.display = 'none';
        }
    });

    dayBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
        });
    });

    const emptyAddBtn = document.getElementById('emptyAddBtn');
    emptyAddBtn.addEventListener('click', () => {
        modal.classList.add('active');
        habitInput.focus();
    });

    cancelBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        resetForm();
    });

    addBtn.addEventListener('click', addHabit);

    closeDetailBtn.addEventListener('click', () => {
        detailView.classList.remove('active');
        stopTimer();
    });

    finishBtn.addEventListener('click', () => {
        if (activeHabitIndex !== null) {
            toggleHabit(activeHabitIndex);
        }
        detailView.classList.remove('active');
        stopTimer();
    });

    deleteHabitBtn.addEventListener('click', () => {
        if (activeHabitIndex !== null) {
            deleteHabit(activeHabitIndex);
        }
        detailView.classList.remove('active');
        stopTimer();
    });

    profilePic.style.cursor = 'pointer';
    profilePic.addEventListener('click', () => {
        settingsModal.classList.add('active');
    });

    closeSettingsBtn.addEventListener('click', () => {
        settingsModal.classList.remove('active');
    });

    themeOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            applyTheme(opt.dataset.theme);
        });
    });

    resetDataBtn.addEventListener('click', () => {
        confirmModal.classList.add('active');
    });

    confirmNoBtn.addEventListener('click', () => {
        confirmModal.classList.remove('active');
    });

    confirmYesBtn.addEventListener('click', () => {
        localStorage.clear();
        location.reload();
    });

    completeChallengeBtn.addEventListener('click', () => {
        const today = new Date().toISOString().split('T')[0];
        const challengeKey = `challenge_${today}`;
        localStorage.setItem(challengeKey, 'true');
        showToast("Challenge Defeated! Power Level Increased! ⚔️");
        updateDailyChallenge();
        
        // Visual feedback
        document.body.classList.add('fire-effect');
        setTimeout(() => document.body.classList.remove('fire-effect'), 1000);
    });

    userNameInput.addEventListener('input', (e) => {
        const newName = e.target.value || 'User';
        userNameDisplay.textContent = newName;
        localStorage.setItem('dualHabitUserName', newName);
    });

    changePicBtn.addEventListener('click', () => {
        const seeds = ['alex', 'jordan', 'casey', 'morgan', 'taylor', 'riley', 'quinn', 'diana', 'felix', 'leo', 'mia', 'zoe'];
        let newSeed;
        do {
            newSeed = seeds[Math.floor(Math.random() * seeds.length)];
        } while (newSeed === profileSeed);
        
        profileSeed = newSeed;
        localStorage.setItem('dualHabitProfileSeed', profileSeed);
        updateProfileUI();
    });

    // Habit List interaction
    habitList.addEventListener('click', (e) => {
        const card = e.target.closest('.habit-card');
        if (!card) return;

        const index = parseInt(card.dataset.index);
        
        // Open detail view on click
        openDetail(index);
    });

    // Scroll listener to hide streak and motivation
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            body.classList.add('scrolled');
        } else {
            body.classList.remove('scrolled');
        }
    });
}

function resetForm() {
    habitInput.value = '';
    habitDesc.value = '';
    habitInterval.selectedIndex = 0;
    habitInterval.value = 'daily';
    dayPickerContainer.style.display = 'none';
    dayBtns.forEach(btn => btn.classList.remove('active'));
    selectedIcon = '📚';
    selectedType = 'simple';
    typeOptions.forEach(opt => opt.classList.toggle('active', opt.dataset.type === 'simple'));
    renderIconGrid();
}

// Add Habit
function addHabit() {
    const name = habitInput.value.trim();
    if (!name) return;

    if (currentMode === 'bad') {
        showToast("This habit is dangerous ⚠️");
    }

    const selectedDays = [];
    if (habitInterval.value === 'specific') {
        dayBtns.forEach(btn => {
            if (btn.classList.contains('active')) {
                selectedDays.push(parseInt(btn.dataset.day));
            }
        });
        if (selectedDays.length === 0) {
            alert('Please select at least one day.');
            return;
        }
    }

    const newHabit = {
        name: name,
        description: habitDesc.value.trim(),
        interval: habitInterval.value,
        days: selectedDays,
        icon: selectedIcon,
        type: selectedType,
        history: {},
        logs: {}
    };

    habits[currentMode].push(newHabit);
    saveData();
    renderHabits();
    updateStats();
    
    modal.classList.remove('active');
    resetForm();
}

// Start the app
init();
