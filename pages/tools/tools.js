// Tools Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize current date for record input
    document.getElementById('record-date').valueAsDate = new Date();
    
    // Load saved data
    loadProgressData();
    updateWeeklyStats();
    updateGoalsProgress();
    
    // Navigation functionality
    const toolNavBtns = document.querySelectorAll('.tool-nav-btn');
    const toolSections = document.querySelectorAll('.tool-section');

    toolNavBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            
            toolNavBtns.forEach(b => b.classList.remove('active'));
            toolSections.forEach(s => s.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(target).classList.add('active');
        });
    });

    // Timer tabs functionality
    const timerTabs = document.querySelectorAll('.timer-tab');
    const timerCards = document.querySelectorAll('.timer-card');

    timerTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const timerType = this.getAttribute('data-timer');
            
            timerTabs.forEach(t => t.classList.remove('active'));
            timerCards.forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(timerType + '-timer').classList.add('active');
        });
    });

    // Progress tabs functionality
    const progressTabs = document.querySelectorAll('.progress-tab');
    const progressCards = document.querySelectorAll('.progress-card');

    progressTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabType = this.getAttribute('data-tab');
            
            progressTabs.forEach(t => t.classList.remove('active'));
            progressCards.forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(tabType + '-input').classList.add('active') ||
            document.getElementById(tabType + '-chart').classList.add('active') ||
            document.getElementById(tabType + 's-setting').classList.add('active');
        });
    });

    // Initialize timers
    initializeIntervalTimer();
    initializeStopwatch();
});

// BMI Calculator Functions
function calculateBMI() {
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);
    
    if (!height || !weight || height <= 0 || weight <= 0) {
        showNotification('身長と体重を正しく入力してください', 'error');
        return;
    }
    
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    const standardWeight = 22 * heightInMeters * heightInMeters;
    
    // Update display
    document.getElementById('bmi-value').textContent = bmi.toFixed(1);
    document.getElementById('standard-weight').textContent = standardWeight.toFixed(1) + 'kg';
    
    // Determine category and advice
    let category, categoryClass, advice;
    
    if (bmi < 18.5) {
        category = '低体重';
        categoryClass = 'underweight';
        advice = '体重が不足しています。バランスの取れた食事と適度な運動で健康的に体重を増やしましょう。医師にご相談することをお勧めします。';
    } else if (bmi < 25) {
        category = '標準体重';
        categoryClass = 'normal';
        advice = '理想的な体重です！この状態を維持するために、バランスの良い食事と定期的な運動を続けましょう。';
    } else if (bmi < 30) {
        category = '過体重';
        categoryClass = 'overweight';
        advice = '体重がやや多めです。食事制限と有酸素運動を組み合わせて、健康的に体重を減らしましょう。';
    } else {
        category = '肥満';
        categoryClass = 'obese';
        advice = '肥満状態です。健康リスクを減らすため、医師の指導の下で食事療法と運動療法を始めることをお勧めします。';
    }
    
    // Update category display
    const categoryElement = document.getElementById('bmi-category');
    categoryElement.textContent = category;
    categoryElement.className = 'bmi-category ' + categoryClass;
    
    // Update advice
    document.getElementById('advice-text').textContent = advice;
    
    // Highlight current range
    document.querySelectorAll('.range-item').forEach(item => {
        item.classList.remove('current');
    });
    document.querySelector('.range-item.' + categoryClass).classList.add('current');
    
    showNotification('BMIを計算しました', 'success');
}

// Calorie Calculator Functions
function calculateCalories() {
    const height = parseFloat(document.getElementById('cal-height').value);
    const weight = parseFloat(document.getElementById('cal-weight').value);
    const age = parseFloat(document.getElementById('cal-age').value);
    const gender = document.getElementById('cal-gender').value;
    const activityLevel = parseFloat(document.getElementById('activity-level').value);
    const goal = document.getElementById('goal').value;
    
    if (!height || !weight || !age) {
        showNotification('すべての項目を入力してください', 'error');
        return;
    }
    
    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    
    // Calculate TDEE
    const tdee = bmr * activityLevel;
    
    // Calculate target calories based on goal
    let targetCalories;
    switch (goal) {
        case 'maintain':
            targetCalories = tdee;
            break;
        case 'lose-0.5':
            targetCalories = tdee - 250; // 0.5kg/month = ~250kcal/day deficit
            break;
        case 'lose-1':
            targetCalories = tdee - 500; // 1kg/month = ~500kcal/day deficit
            break;
        case 'lose-2':
            targetCalories = tdee - 1000; // 2kg/month = ~1000kcal/day deficit
            break;
        case 'gain-0.5':
            targetCalories = tdee + 250; // 0.5kg/month = ~250kcal/day surplus
            break;
        case 'gain-1':
            targetCalories = tdee + 500; // 1kg/month = ~500kcal/day surplus
            break;
    }
    
    // Calculate macros (protein: 25%, carbs: 45%, fats: 30%)
    const protein = Math.round((targetCalories * 0.25) / 4); // 4 cal/g
    const carbs = Math.round((targetCalories * 0.45) / 4); // 4 cal/g
    const fats = Math.round((targetCalories * 0.30) / 9); // 9 cal/g
    
    // Update display
    document.getElementById('bmr-value').textContent = Math.round(bmr);
    document.getElementById('tdee-value').textContent = Math.round(tdee);
    document.getElementById('target-calories').textContent = Math.round(targetCalories);
    document.getElementById('protein-value').textContent = protein + 'g';
    document.getElementById('carbs-value').textContent = carbs + 'g';
    document.getElementById('fats-value').textContent = fats + 'g';
    
    showNotification('カロリーを計算しました', 'success');
}

// Timer Variables
let intervalTimer = {
    interval: null,
    phase: 'work', // 'work', 'rest', 'finished'
    timeLeft: 0,
    currentRound: 1,
    totalRounds: 0,
    workTime: 0,
    restTime: 0,
    isRunning: false
};

let stopwatch = {
    interval: null,
    startTime: 0,
    lapTime: 0,
    elapsedTime: 0,
    laps: [],
    isRunning: false
};

// Interval Timer Functions
function initializeIntervalTimer() {
    const startBtn = document.getElementById('start-interval');
    const pauseBtn = document.getElementById('pause-interval');
    const resetBtn = document.getElementById('reset-interval');
    
    startBtn.addEventListener('click', startIntervalTimer);
    pauseBtn.addEventListener('click', pauseIntervalTimer);
    resetBtn.addEventListener('click', resetIntervalTimer);
}

function setPreset(type) {
    switch (type) {
        case 'tabata':
            document.getElementById('work-minutes').value = 0;
            document.getElementById('work-seconds').value = 20;
            document.getElementById('rest-minutes').value = 0;
            document.getElementById('rest-seconds').value = 10;
            document.getElementById('rounds').value = 8;
            break;
        case 'emom':
            document.getElementById('work-minutes').value = 1;
            document.getElementById('work-seconds').value = 0;
            document.getElementById('rest-minutes').value = 0;
            document.getElementById('rest-seconds').value = 0;
            document.getElementById('rounds').value = 10;
            break;
        case 'hiit':
            document.getElementById('work-minutes').value = 0;
            document.getElementById('work-seconds').value = 45;
            document.getElementById('rest-minutes').value = 0;
            document.getElementById('rest-seconds').value = 15;
            document.getElementById('rounds').value = 10;
            break;
    }
    showNotification(`${type.toUpperCase()}プリセットを設定しました`, 'success');
}

function startIntervalTimer() {
    if (!intervalTimer.isRunning) {
        // Get settings
        const workMinutes = parseInt(document.getElementById('work-minutes').value) || 0;
        const workSeconds = parseInt(document.getElementById('work-seconds').value) || 0;
        const restMinutes = parseInt(document.getElementById('rest-minutes').value) || 0;
        const restSecondsVal = parseInt(document.getElementById('rest-seconds').value) || 0;
        const rounds = parseInt(document.getElementById('rounds').value) || 1;
        
        intervalTimer.workTime = workMinutes * 60 + workSeconds;
        intervalTimer.restTime = restMinutes * 60 + restSecondsVal;
        intervalTimer.totalRounds = rounds;
        
        if (intervalTimer.timeLeft === 0) {
            // Start new session
            intervalTimer.phase = 'work';
            intervalTimer.timeLeft = intervalTimer.workTime;
            intervalTimer.currentRound = 1;
        }
        
        intervalTimer.isRunning = true;
        intervalTimer.interval = setInterval(updateIntervalTimer, 1000);
        
        // Update buttons
        document.getElementById('start-interval').disabled = true;
        document.getElementById('pause-interval').disabled = false;
        
        updateTimerDisplay();
        showNotification('インターバルタイマーを開始しました', 'success');
    }
}

function pauseIntervalTimer() {
    intervalTimer.isRunning = false;
    clearInterval(intervalTimer.interval);
    
    // Update buttons
    document.getElementById('start-interval').disabled = false;
    document.getElementById('pause-interval').disabled = true;
}

function resetIntervalTimer() {
    intervalTimer.isRunning = false;
    clearInterval(intervalTimer.interval);
    intervalTimer.timeLeft = 0;
    intervalTimer.phase = 'work';
    intervalTimer.currentRound = 1;
    
    // Update buttons
    document.getElementById('start-interval').disabled = false;
    document.getElementById('pause-interval').disabled = true;
    
    // Update display
    document.getElementById('timer-phase').textContent = '準備';
    document.getElementById('timer-time').textContent = '00:00';
    document.getElementById('timer-round').textContent = 'Round 1 / ' + (intervalTimer.totalRounds || 5);
    document.getElementById('progress-bar').style.width = '0%';
}

function updateIntervalTimer() {
    intervalTimer.timeLeft--;
    
    if (intervalTimer.timeLeft <= 0) {
        // Phase completed
        if (intervalTimer.phase === 'work') {
            if (intervalTimer.currentRound < intervalTimer.totalRounds) {
                // Switch to rest
                intervalTimer.phase = 'rest';
                intervalTimer.timeLeft = intervalTimer.restTime;
            } else {
                // Workout finished
                intervalTimer.phase = 'finished';
                intervalTimer.isRunning = false;
                clearInterval(intervalTimer.interval);
                showNotification('ワークアウト完了！お疲れさまでした！', 'success');
                
                // Update buttons
                document.getElementById('start-interval').disabled = false;
                document.getElementById('pause-interval').disabled = true;
            }
        } else if (intervalTimer.phase === 'rest') {
            // Switch to next round
            intervalTimer.currentRound++;
            intervalTimer.phase = 'work';
            intervalTimer.timeLeft = intervalTimer.workTime;
        }
    }
    
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const minutes = Math.floor(intervalTimer.timeLeft / 60);
    const seconds = intervalTimer.timeLeft % 60;
    
    document.getElementById('timer-time').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Update phase
    let phaseText = '';
    if (intervalTimer.phase === 'work') {
        phaseText = 'ワーク';
    } else if (intervalTimer.phase === 'rest') {
        phaseText = '休憩';
    } else if (intervalTimer.phase === 'finished') {
        phaseText = '完了';
    }
    document.getElementById('timer-phase').textContent = phaseText;
    
    // Update round
    document.getElementById('timer-round').textContent = 
        `Round ${intervalTimer.currentRound} / ${intervalTimer.totalRounds}`;
    
    // Update progress bar
    const totalTime = intervalTimer.phase === 'work' ? intervalTimer.workTime : intervalTimer.restTime;
    const progress = totalTime > 0 ? ((totalTime - intervalTimer.timeLeft) / totalTime) * 100 : 0;
    document.getElementById('progress-bar').style.width = progress + '%';
}

// Stopwatch Functions
function initializeStopwatch() {
    const startBtn = document.getElementById('start-stopwatch');
    const lapBtn = document.getElementById('lap-stopwatch');
    const pauseBtn = document.getElementById('pause-stopwatch');
    const resetBtn = document.getElementById('reset-stopwatch');
    
    startBtn.addEventListener('click', startStopwatch);
    lapBtn.addEventListener('click', addLap);
    pauseBtn.addEventListener('click', pauseStopwatch);
    resetBtn.addEventListener('click', resetStopwatch);
}

function startStopwatch() {
    if (!stopwatch.isRunning) {
        stopwatch.startTime = Date.now() - stopwatch.elapsedTime;
        stopwatch.lapTime = Date.now() - stopwatch.elapsedTime;
        stopwatch.isRunning = true;
        
        stopwatch.interval = setInterval(updateStopwatch, 10); // Update every 10ms for precision
        
        // Update buttons
        document.getElementById('start-stopwatch').disabled = true;
        document.getElementById('lap-stopwatch').disabled = false;
        document.getElementById('pause-stopwatch').disabled = false;
    }
}

function addLap() {
    const currentTime = Date.now();
    const totalTime = currentTime - stopwatch.startTime;
    const lapTime = currentTime - stopwatch.lapTime;
    
    stopwatch.laps.push({
        number: stopwatch.laps.length + 1,
        lapTime: lapTime,
        totalTime: totalTime
    });
    
    stopwatch.lapTime = currentTime;
    updateLapDisplay();
}

function pauseStopwatch() {
    stopwatch.isRunning = false;
    clearInterval(stopwatch.interval);
    
    // Update buttons
    document.getElementById('start-stopwatch').disabled = false;
    document.getElementById('lap-stopwatch').disabled = true;
    document.getElementById('pause-stopwatch').disabled = true;
}

function resetStopwatch() {
    stopwatch.isRunning = false;
    clearInterval(stopwatch.interval);
    stopwatch.elapsedTime = 0;
    stopwatch.laps = [];
    
    // Update buttons
    document.getElementById('start-stopwatch').disabled = false;
    document.getElementById('lap-stopwatch').disabled = true;
    document.getElementById('pause-stopwatch').disabled = true;
    
    // Update display
    document.getElementById('stopwatch-time').textContent = '00:00:00';
    document.getElementById('current-lap').textContent = 'ラップ: 00:00:00';
    updateLapDisplay();
}

function updateStopwatch() {
    stopwatch.elapsedTime = Date.now() - stopwatch.startTime;
    const currentLapTime = Date.now() - stopwatch.lapTime;
    
    document.getElementById('stopwatch-time').textContent = formatTime(stopwatch.elapsedTime);
    document.getElementById('current-lap').textContent = 'ラップ: ' + formatTime(currentLapTime);
}

function updateLapDisplay() {
    const lapList = document.getElementById('lap-list');
    lapList.innerHTML = '';
    
    stopwatch.laps.forEach((lap, index) => {
        const lapItem = document.createElement('div');
        lapItem.className = 'lap-item';
        lapItem.innerHTML = `
            <span class="lap-number">ラップ ${lap.number}</span>
            <span class="lap-time-value">${formatTime(lap.lapTime)}</span>
        `;
        lapList.appendChild(lapItem);
    });
}

function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${centiseconds.toString().padStart(2, '0')}`;
}

// Progress Tracking Functions
function saveRecord() {
    const date = document.getElementById('record-date').value;
    const weight = parseFloat(document.getElementById('record-weight').value);
    const bodyFat = parseFloat(document.getElementById('record-body-fat').value);
    const muscleMass = parseFloat(document.getElementById('record-muscle-mass').value);
    const workoutDuration = parseInt(document.getElementById('workout-duration').value);
    const caloriesBurned = parseInt(document.getElementById('calories-burned').value);
    const notes = document.getElementById('notes').value;
    
    if (!date) {
        showNotification('日付を入力してください', 'error');
        return;
    }
    
    const record = {
        date: date,
        weight: weight || null,
        bodyFat: bodyFat || null,
        muscleMass: muscleMass || null,
        workoutDuration: workoutDuration || null,
        caloriesBurned: caloriesBurned || null,
        notes: notes || ''
    };
    
    // Get existing records
    const records = JSON.parse(localStorage.getItem('fitnessRecords')) || [];
    
    // Check if record for this date already exists
    const existingIndex = records.findIndex(r => r.date === date);
    if (existingIndex !== -1) {
        records[existingIndex] = record;
        showNotification('記録を更新しました', 'success');
    } else {
        records.push(record);
        showNotification('記録を保存しました', 'success');
    }
    
    // Sort by date (newest first)
    records.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Save to localStorage
    localStorage.setItem('fitnessRecords', JSON.stringify(records));
    
    // Clear form
    document.getElementById('record-weight').value = '';
    document.getElementById('record-body-fat').value = '';
    document.getElementById('record-muscle-mass').value = '';
    document.getElementById('workout-duration').value = '';
    document.getElementById('calories-burned').value = '';
    document.getElementById('notes').value = '';
    
    // Update displays
    updateWeeklyStats();
    loadProgressData();
    updateGoalsProgress();
}

function loadProgressData() {
    const records = JSON.parse(localStorage.getItem('fitnessRecords')) || [];
    const tbody = document.getElementById('history-tbody');
    tbody.innerHTML = '';
    
    records.forEach((record, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(record.date).toLocaleDateString('ja-JP')}</td>
            <td>${record.weight ? record.weight + 'kg' : '-'}</td>
            <td>${record.bodyFat ? record.bodyFat + '%' : '-'}</td>
            <td>${record.muscleMass ? record.muscleMass + 'kg' : '-'}</td>
            <td>${record.workoutDuration ? record.workoutDuration + '分' : '-'}</td>
            <td><button class="delete-btn" onclick="deleteRecord(${index})">削除</button></td>
        `;
        tbody.appendChild(row);
    });
    
    updateChart();
}

function deleteRecord(index) {
    const records = JSON.parse(localStorage.getItem('fitnessRecords')) || [];
    records.splice(index, 1);
    localStorage.setItem('fitnessRecords', JSON.stringify(records));
    loadProgressData();
    updateWeeklyStats();
    updateGoalsProgress();
    showNotification('記録を削除しました', 'success');
}

function updateWeeklyStats() {
    const records = JSON.parse(localStorage.getItem('fitnessRecords')) || [];
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weeklyRecords = records.filter(record => new Date(record.date) >= oneWeekAgo);
    
    const workoutCount = weeklyRecords.filter(r => r.workoutDuration > 0).length;
    const totalDuration = weeklyRecords.reduce((sum, r) => sum + (r.workoutDuration || 0), 0);
    const totalCalories = weeklyRecords.reduce((sum, r) => sum + (r.caloriesBurned || 0), 0);
    
    // Weight change
    const sortedRecords = records.sort((a, b) => new Date(a.date) - new Date(b.date));
    const firstWeight = sortedRecords.find(r => r.weight)?.weight;
    const lastWeight = sortedRecords.reverse().find(r => r.weight)?.weight;
    const weightChange = (firstWeight && lastWeight) ? (lastWeight - firstWeight).toFixed(1) : '--';
    
    document.getElementById('week-workouts').textContent = workoutCount;
    document.getElementById('week-duration').textContent = totalDuration;
    document.getElementById('week-calories').textContent = totalCalories;
    document.getElementById('weight-change').textContent = weightChange !== '--' ? (weightChange >= 0 ? '+' : '') + weightChange : '--';
}

function updateChart() {
    const canvas = document.getElementById('progress-chart');
    const ctx = canvas.getContext('2d');
    
    // Simple chart implementation (placeholder)
    // In a real implementation, you would use Chart.js
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#666';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('進捗チャート（Chart.jsで実装予定）', canvas.width / 2, canvas.height / 2);
}

function saveGoals() {
    const goals = {
        targetWeight: parseFloat(document.getElementById('target-weight').value) || null,
        targetWeightDate: document.getElementById('target-weight-date').value || null,
        targetBodyFat: parseFloat(document.getElementById('target-body-fat').value) || null,
        targetBodyFatDate: document.getElementById('target-body-fat-date').value || null,
        targetMuscleMass: parseFloat(document.getElementById('target-muscle-mass').value) || null,
        targetMuscleMassDate: document.getElementById('target-muscle-mass-date').value || null,
        weeklyWorkouts: parseInt(document.getElementById('weekly-workouts').value) || null
    };
    
    localStorage.setItem('fitnessGoals', JSON.stringify(goals));
    updateGoalsProgress();
    showNotification('目標を保存しました', 'success');
}

function updateGoalsProgress() {
    const goals = JSON.parse(localStorage.getItem('fitnessGoals')) || {};
    const records = JSON.parse(localStorage.getItem('fitnessRecords')) || [];
    
    // Get latest values
    const latestRecord = records[0];
    if (!latestRecord) return;
    
    // Weight progress
    if (goals.targetWeight && latestRecord.weight) {
        const progress = Math.min((latestRecord.weight / goals.targetWeight) * 100, 100);
        document.getElementById('weight-progress').textContent = progress.toFixed(1) + '%';
        document.getElementById('weight-progress-fill').style.width = progress + '%';
    }
    
    // Body fat progress
    if (goals.targetBodyFat && latestRecord.bodyFat) {
        const progress = Math.min((goals.targetBodyFat / latestRecord.bodyFat) * 100, 100);
        document.getElementById('bodyfat-progress').textContent = progress.toFixed(1) + '%';
        document.getElementById('bodyfat-progress-fill').style.width = progress + '%';
    }
    
    // Muscle mass progress
    if (goals.targetMuscleMass && latestRecord.muscleMass) {
        const progress = Math.min((latestRecord.muscleMass / goals.targetMuscleMass) * 100, 100);
        document.getElementById('muscle-progress').textContent = progress.toFixed(1) + '%';
        document.getElementById('muscle-progress-fill').style.width = progress + '%';
    }
    
    // Weekly workout progress
    if (goals.weeklyWorkouts) {
        const thisWeekWorkouts = parseInt(document.getElementById('week-workouts').textContent) || 0;
        const progress = Math.min((thisWeekWorkouts / goals.weeklyWorkouts) * 100, 100);
        document.getElementById('workout-progress').textContent = progress.toFixed(1) + '%';
        document.getElementById('workout-progress-fill').style.width = progress + '%';
    }
}

// Notification system (reuse from workout page)
function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        font-weight: 500;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

// Add notification animations
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(notificationStyles);