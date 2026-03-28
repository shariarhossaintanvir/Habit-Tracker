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
const withdrawChallengeBtn = document.getElementById('withdrawChallengeBtn');
const longTermHeatmap = document.getElementById('longTermHeatmap');
const heatmapMonths = document.getElementById('heatmapMonths');
const weeklyAggregate = document.getElementById('weeklyAggregate');
const monthlyAggregate = document.getElementById('monthlyAggregate');
const yearlyAggregate = document.getElementById('yearlyAggregate');
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

// New DOM Elements
const userLevel = document.getElementById('userLevel');
const xpBar = document.getElementById('xpBar');
const quoteText = document.getElementById('quoteText');
const quoteAuthor = document.getElementById('quoteAuthor');
const profileModal = document.getElementById('profileModal');
const closeProfileBtn = document.getElementById('closeProfileBtn');
const totalCompletions = document.getElementById('totalCompletions');
const bestStreak = document.getElementById('bestStreak');
const challengesWon = document.getElementById('challengesWon');
const profileRank = document.getElementById('profileRank');
const profileName = document.getElementById('profileName');

const quotes = [
    { text: "The secret of your future is hidden in your daily routine.", author: "Mike Murdock" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { text: "Everything you’ve ever wanted is on the other side of fear.", author: "George Addair" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "Hardships often prepare ordinary people for an extraordinary destiny.", author: "C.S. Lewis" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "Your limitation—it’s only your imagination.", author: "Unknown" },
    { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
    { text: "Great things never come from comfort zones.", author: "Unknown" },
    { text: "Dream it. Wish it. Do it.", author: "Unknown" }
];

let timerInterval;
let seconds = 0;
let activeHabitIndex = null;
let activeDateStr = null;

// Initialize App
function init() {
    loadData();
    applyTheme(currentTheme);
    applyColorScheme(colorScheme);
    updateUserLevel();
    updateQuote();
    
    const savedName = localStorage.getItem('dualHabitUserName') || 'Diana';
    userNameDisplay.textContent = savedName;
    userNameInput.value = savedName;
    
    updateProfileUI();
    
    renderHabits();
    renderIconGrid();
    setupEventListeners();
    updateDates();
    updateStats();
    updateDailyChallenge();
}

function updateDailyChallenge() {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const challengeIndex = dayOfYear % challenges.length;
    challengeTitle.textContent = challenges[challengeIndex];
    
    const todayStr = today.toISOString().split('T')[0];
    const challengeKey = `challenge_${todayStr}`;
    const withdrawKey = `withdraw_${todayStr}`;
    
    if (localStorage.getItem(challengeKey)) {
        completeChallengeBtn.textContent = "DEFEATED ⚔️ (RESET?)";
        completeChallengeBtn.disabled = false;
        completeChallengeBtn.style.opacity = '0.8';
        withdrawChallengeBtn.style.display = 'none';
    } else if (localStorage.getItem(withdrawKey)) {
        completeChallengeBtn.textContent = "WITHDRAWN 🏳️ (RESET?)";
        completeChallengeBtn.disabled = false;
        completeChallengeBtn.style.opacity = '0.8';
        withdrawChallengeBtn.style.display = 'none';
    } else {
        completeChallengeBtn.textContent = "I DID IT! ⚔️";
        completeChallengeBtn.disabled = false;
        completeChallengeBtn.style.opacity = '1';
        withdrawChallengeBtn.style.display = 'block';
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
                <div class="habit-footer">
                    <div class="streak-badge">🔥 ${streak} day streak</div>
                    ${isSpecial ? `<div class="time-badge">⏱️ ${habit.logs?.[selectedDate] || 0}m</div>` : ''}
                </div>
            </div>
        `;

        const showHeatmap = isSpecial || currentMode === 'good';
        
        if (showHeatmap) {
            cardHTML += `<div class="heatmap-container" id="heatmap-${index}"></div>`;
        }
        
        cardHTML += `<button class="delete-habit-btn-small" data-action="delete">×</button>`;

        card.innerHTML = cardHTML;
        habitList.appendChild(card);

        if (showHeatmap) {
            renderHeatmap(habit, index);
        }
    });
}

function renderHeatmap(habit, index) {
    const container = document.getElementById(`heatmap-${index}`);
    if (!container) return;

    const isSpecial = habit.type === 'special';
    const today = new Date();
    
    let statsHTML = '';
    if (isSpecial) {
        const totalTimeThisWeek = calculateWeeklyTime(habit);
        statsHTML = `<span class="total-time-badge">${totalTimeThisWeek}m THIS WEEK</span>`;
    } else {
        const completedThisWeek = calculateWeeklyCompletion(habit);
        statsHTML = `<span class="total-time-badge">${completedThisWeek}/7 DAYS</span>`;
    }

    container.innerHTML = `
        <div class="heatmap-header">
            <span>ACTIVITY HEATMAP</span>
            ${statsHTML}
        </div>
        <div class="heatmap-grid"></div>
    `;

    const grid = container.querySelector('.heatmap-grid');
    
    // Render 14 days (2 weeks)
    for (let i = 13; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        let level = 'level-0';
        let tooltipText = '';
        
        if (isSpecial) {
            const minutes = (habit.logs && habit.logs[dateStr]) || 0;
            level = getLevel(minutes);
            tooltipText = `${minutes}m`;
        } else {
            const done = (habit.history && habit.history[dateStr]);
            level = done ? 'level-4' : 'level-0';
            tooltipText = done ? 'Completed' : 'Not completed';
        }
        
        const square = document.createElement('div');
        square.className = `heatmap-square ${level} ${dateStr === selectedDate ? 'today' : ''}`;
        
        square.innerHTML = `
            <div class="heatmap-tooltip">
                ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: ${tooltipText}
            </div>
        `;

        grid.appendChild(square);
    }
}

function calculateWeeklyCompletion(habit) {
    if (!habit.history) return 0;
    let total = 0;
    const today = new Date();
    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        if (habit.history[dateStr]) total++;
    }
    return total;
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
    
    renderLongTermHeatmap(habit);
    startTimer();
}

function renderLongTermHeatmap(habit) {
    if (!longTermHeatmap) return;
    longTermHeatmap.innerHTML = '';
    if (heatmapMonths) heatmapMonths.innerHTML = '';
    
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const isSpecial = habit.type === 'special';
    
    const startDate = new Date();
    startDate.setDate(today.getDate() - 364); // 1 year ago
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);

    const totalDays = 371; // 53 weeks * 7 days
    
    let lastMonth = -1;
    
    let weeklySum = 0;
    let monthlySum = 0;
    let yearlySum = 0;

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const startOfWeekStr = startOfWeek.toISOString().split('T')[0];

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfMonthStr = startOfMonth.toISOString().split('T')[0];

    for (let i = 0; i < totalDays; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        
        // Add month label if it's a new month and it's Sunday (start of column)
        if (date.getDay() === 0 && date.getMonth() !== lastMonth) {
            if (heatmapMonths) {
                const monthSpan = document.createElement('span');
                monthSpan.textContent = date.toLocaleDateString('en-US', { month: 'short' });
                // Each column is a week, so the column index is i/7 + 1
                monthSpan.style.gridColumnStart = Math.floor(i / 7) + 1;
                heatmapMonths.appendChild(monthSpan);
            }
            lastMonth = date.getMonth();
        }
        
        let level = 'level-0';
        let tooltipText = '';
        let value = 0;
        
        if (isSpecial) {
            value = (habit.logs && habit.logs[dateStr]) || 0;
            level = getLevel(value);
            tooltipText = `${value}m`;
        } else {
            const done = (habit.history && habit.history[dateStr]);
            value = done ? 1 : 0;
            level = done ? 'level-4' : 'level-0';
            tooltipText = done ? 'Completed' : 'Not completed';
        }
        
        // Aggregates
        if (dateStr >= startOfWeekStr && dateStr <= todayStr) {
            weeklySum += value;
        }
        if (dateStr >= startOfMonthStr && dateStr <= todayStr) {
            monthlySum += value;
        }
        if (dateStr <= todayStr) {
            yearlySum += value;
        }

        const square = document.createElement('div');
        square.className = `long-term-square ${level} ${dateStr === todayStr ? 'today' : ''}`;
        
        const tooltip = document.createElement('div');
        tooltip.className = 'heatmap-tooltip';
        tooltip.textContent = `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}: ${tooltipText}`;
        square.appendChild(tooltip);
        
        longTermHeatmap.appendChild(square);
    }

    // Update aggregate displays
    if (weeklyAggregate) {
        weeklyAggregate.textContent = isSpecial ? `${weeklySum}m` : `${weeklySum}d`;
    }
    if (monthlyAggregate) {
        monthlyAggregate.textContent = isSpecial ? `${monthlySum}m` : `${monthlySum}d`;
    }
    if (yearlyAggregate) {
        yearlyAggregate.textContent = isSpecial ? `${yearlySum}m` : `${yearlySum}d`;
    }
    
    // Scroll to the end (today)
    const scrollContainer = longTermHeatmap.parentElement;
    if (scrollContainer) {
        scrollContainer.scrollLeft = scrollContainer.scrollWidth;
    }
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
    updateUserLevel();
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

    profilePic.addEventListener('click', () => {
        updateProfileStats();
        profileModal.classList.add('active');
    });

    closeProfileBtn.addEventListener('click', () => {
        profileModal.classList.remove('active');
    });

    window.addEventListener('click', (e) => {
        if (e.target === profileModal) {
            profileModal.classList.remove('active');
        }
    });

    confirmYesBtn.addEventListener('click', () => {
        localStorage.clear();
        location.reload();
    });

    completeChallengeBtn.addEventListener('click', () => {
        const todayStr = new Date().toISOString().split('T')[0];
        const cKey = `challenge_${todayStr}`;
        const wKey = `withdraw_${todayStr}`;

        if (localStorage.getItem(cKey) || localStorage.getItem(wKey)) {
            // Reset logic
            localStorage.removeItem(cKey);
            localStorage.removeItem(wKey);
            showToast("Challenge Reset! Try again. ⚔️");
            updateDailyChallenge();
            return;
        }

        localStorage.setItem(cKey, 'true');
        
        // Increment challenges won
        const wonCount = parseInt(localStorage.getItem('challengesWonCount') || '0');
        localStorage.setItem('challengesWonCount', wonCount + 1);
        
        showToast("Challenge Defeated! Power Level Increased! ⚔️");
        updateDailyChallenge();
        updateUserLevel();
        
        // Visual feedback
        document.body.classList.add('fire-effect');
        setTimeout(() => document.body.classList.remove('fire-effect'), 1000);
    });

    withdrawChallengeBtn.addEventListener('click', () => {
        const today = new Date().toISOString().split('T')[0];
        const withdrawKey = `withdraw_${today}`;
        localStorage.setItem(withdrawKey, 'true');
        showToast("Challenge Withdrawn. Stay strong next time! 🏳️");
        updateDailyChallenge();
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
        const deleteBtn = e.target.closest('[data-action="delete"]');
        const card = e.target.closest('.habit-card');
        if (!card) return;

        const index = parseInt(card.dataset.index);
        
        if (deleteBtn) {
            e.stopPropagation();
            deleteHabit(index);
        } else {
            // Toggle habit on click instead of opening details
            toggleHabit(index);
        }
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

function updateUserLevel() {
    let totalPoints = 0;
    
    // Points from good habits
    habits.good.forEach(habit => {
        const history = habit.history || {};
        totalPoints += Object.keys(history).length * 10;
    });
    
    // Points from bad habits (avoiding them)
    habits.bad.forEach(habit => {
        const history = habit.history || {};
        totalPoints += Object.keys(history).length * 15;
    });
    
    // Points from challenges
    const challengesWonCount = parseInt(localStorage.getItem('challengesWonCount') || '0');
    totalPoints += challengesWonCount * 50;
    
    const level = Math.floor(totalPoints / 100) + 1;
    const xp = totalPoints % 100;
    
    if (userLevel) userLevel.textContent = `Lv. ${level}`;
    if (xpBar) xpBar.style.width = `${xp}%`;
    
    localStorage.setItem('userLevel', level);
    localStorage.setItem('userXP', xp);
}

function updateQuote() {
    if (!quoteText || !quoteAuthor) return;
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    quoteText.textContent = `"${randomQuote.text}"`;
    quoteAuthor.textContent = `— ${randomQuote.author}`;
}

function updateProfileStats() {
    let totalComp = 0;
    let maxStreak = 0;
    
    [...habits.good, ...habits.bad].forEach(habit => {
        const history = habit.history || {};
        const dates = Object.keys(history).sort();
        totalComp += dates.length;
        
        // Simple streak calculation
        let currentStreak = 0;
        let tempMax = 0;
        
        if (dates.length > 0) {
            tempMax = 1;
            currentStreak = 1;
            for (let i = 1; i < dates.length; i++) {
                const d1 = new Date(dates[i-1]);
                const d2 = new Date(dates[i]);
                const diff = (d2 - d1) / (1000 * 60 * 60 * 24);
                if (diff === 1) {
                    currentStreak++;
                } else {
                    currentStreak = 1;
                }
                tempMax = Math.max(tempMax, currentStreak);
            }
        }
        maxStreak = Math.max(maxStreak, tempMax);
    });
    
    if (totalCompletions) totalCompletions.textContent = totalComp;
    if (bestStreak) bestStreak.textContent = maxStreak;
    if (challengesWon) challengesWon.textContent = localStorage.getItem('challengesWonCount') || '0';
    
    const level = parseInt(localStorage.getItem('userLevel') || '1');
    if (profileRank) {
        if (level < 5) profileRank.textContent = 'Novice Tracker';
        else if (level < 15) profileRank.textContent = 'Habit Warrior';
        else if (level < 30) profileRank.textContent = 'Elite Master';
        else profileRank.textContent = 'Legendary Soul';
    }
    
    if (profileName) profileName.textContent = localStorage.getItem('dualHabitUserName') || 'Diana';
}

// Start the app
init();
