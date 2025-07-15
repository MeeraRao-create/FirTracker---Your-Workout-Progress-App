// Global variables
let currentView = 'log';
let currentDate = new Date();
let workouts = [];
let charts = {};

// Exercise database
const exercises = {
    cardio: [
        'Running', 'Cycling', 'Swimming', 'Walking', 'Rowing', 'Elliptical',
        'Treadmill', 'Stair Climbing', 'Jump Rope', 'Dancing', 'Hiking',
        'Spinning', 'Aerobics', 'Kickboxing', 'Zumba'
    ],
    strength: [
        'Bench Press', 'Squats', 'Deadlifts', 'Pull-ups', 'Push-ups', 'Rows',
        'Overhead Press', 'Bicep Curls', 'Tricep Dips', 'Lunges', 'Leg Press',
        'Chest Flyes', 'Shoulder Raises', 'Planks', 'Crunches', 'Burpees',
        'Dumbbell Press', 'Barbell Curls', 'Lat Pulldowns', 'Calf Raises'
    ],
    yoga: [
        'Vinyasa Flow', 'Hatha Yoga', 'Ashtanga', 'Yin Yoga', 'Hot Yoga',
        'Restorative Yoga', 'Power Yoga', 'Bikram Yoga', 'Kundalini',
        'Meditation', 'Sun Salutations', 'Warrior Poses', 'Downward Dog',
        'Child\'s Pose', 'Tree Pose', 'Mountain Pose', 'Corpse Pose'
    ]
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadWorkouts();
    initializeEventListeners();
    updateCurrentDateInput();
    showView('log');
    updateRecentWorkouts();
});

// Load workouts from localStorage
function loadWorkouts() {
    const savedWorkouts = localStorage.getItem('fittracker_workouts');
    if (savedWorkouts) {
        workouts = JSON.parse(savedWorkouts);
    }
}

// Save workouts to localStorage
function saveWorkouts() {
    localStorage.setItem('fittracker_workouts', JSON.stringify(workouts));
}

// Initialize event listeners
function initializeEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const view = this.dataset.view;
            showView(view);
        });
    });

    // Workout form
    document.getElementById('workout-type').addEventListener('change', handleWorkoutTypeChange);
    document.getElementById('exercise-search').addEventListener('input', handleExerciseSearch);
    document.getElementById('exercise-search').addEventListener('focus', handleExerciseSearch);
    document.getElementById('log-workout-btn').addEventListener('click', handleLogWorkout);

    // Calendar navigation
    document.getElementById('prev-month').addEventListener('click', () => navigateMonth(-1));
    document.getElementById('next-month').addEventListener('click', () => navigateMonth(1));

    // Progress controls
    document.getElementById('progress-timeframe').addEventListener('change', updateProgressCharts);

    // Modal
    document.getElementById('close-modal').addEventListener('click', closeModal);
    document.getElementById('workout-modal').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });

    // Close suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.form-group')) {
            document.getElementById('exercise-suggestions').classList.remove('show');
        }
    });
}

// Show specific view
function showView(view) {
    // Update navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-view="${view}"]`).classList.add('active');

    // Show view
    document.querySelectorAll('.view').forEach(v => {
        v.classList.remove('active');
    });
    document.getElementById(`${view}-view`).classList.add('active');

    currentView = view;

    // Initialize view-specific content
    if (view === 'calendar') {
        renderCalendar();
    } else if (view === 'progress') {
        updateProgressCharts();
        updateStats();
    }
}

// Update current date input
function updateCurrentDateInput() {
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    document.getElementById('workout-date').value = dateString;
}

// Handle workout type change
function handleWorkoutTypeChange(e) {
    const workoutType = e.target.value;
    const metricsContainer = document.getElementById('metrics-container');
    
    metricsContainer.innerHTML = '';

    if (workoutType === 'cardio') {
        metricsContainer.innerHTML = `
            <div class="metric-input">
                <label>Distance (km)</label>
                <input type="number" id="distance" step="0.1" placeholder="0.0">
            </div>
            <div class="metric-input">
                <label>Average Pace (min/km)</label>
                <input type="number" id="pace" step="0.1" placeholder="0.0">
            </div>
            <div class="metric-input">
                <label>Calories Burned</label>
                <input type="number" id="calories" placeholder="0">
            </div>
        `;
    } else if (workoutType === 'strength') {
        metricsContainer.innerHTML = `
            <div class="metric-input">
                <label>Weight (kg)</label>
                <input type="number" id="weight" step="0.5" placeholder="0.0">
            </div>
            <div class="metric-input">
                <label>Sets</label>
                <input type="number" id="sets" placeholder="0">
            </div>
            <div class="metric-input">
                <label>Reps</label>
                <input type="number" id="reps" placeholder="0">
            </div>
        `;
    } else if (workoutType === 'yoga') {
        metricsContainer.innerHTML = `
            <div class="metric-input">
                <label>Difficulty Level</label>
                <select id="difficulty">
                    <option value="">Select difficulty</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                </select>
            </div>
            <div class="metric-input">
                <label>Focus Area</label>
                <input type="text" id="focus-area" placeholder="e.g., Flexibility, Strength">
            </div>
        `;
    }
}

// Handle exercise search
function handleExerciseSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const workoutType = document.getElementById('workout-type').value;
    const suggestionsContainer = document.getElementById('exercise-suggestions');

    if (!workoutType || searchTerm.length < 1) {
        suggestionsContainer.classList.remove('show');
        return;
    }

    const filteredExercises = exercises[workoutType].filter(exercise =>
        exercise.toLowerCase().includes(searchTerm)
    );

    if (filteredExercises.length === 0) {
        suggestionsContainer.classList.remove('show');
        return;
    }

    suggestionsContainer.innerHTML = filteredExercises.map(exercise => `
        <div class="suggestion-item" onclick="selectExercise('${exercise}')">${exercise}</div>
    `).join('');

    suggestionsContainer.classList.add('show');
}

// Select exercise from suggestions
function selectExercise(exercise) {
    document.getElementById('exercise-search').value = exercise;
    document.getElementById('exercise-suggestions').classList.remove('show');
}

// Handle log workout
function handleLogWorkout() {
    const workoutData = {
        id: Date.now(),
        date: document.getElementById('workout-date').value,
        type: document.getElementById('workout-type').value,
        exercise: document.getElementById('exercise-search').value,
        duration: parseInt(document.getElementById('duration').value),
        notes: document.getElementById('notes').value,
        metrics: {}
    };

    // Validate required fields
    if (!workoutData.date || !workoutData.type || !workoutData.exercise || !workoutData.duration) {
        showToast('Please fill in all required fields', 'error');
        return;
    }

    // Get metrics based on workout type
    if (workoutData.type === 'cardio') {
        workoutData.metrics.distance = parseFloat(document.getElementById('distance')?.value) || 0;
        workoutData.metrics.pace = parseFloat(document.getElementById('pace')?.value) || 0;
        workoutData.metrics.calories = parseInt(document.getElementById('calories')?.value) || 0;
    } else if (workoutData.type === 'strength') {
        workoutData.metrics.weight = parseFloat(document.getElementById('weight')?.value) || 0;
        workoutData.metrics.sets = parseInt(document.getElementById('sets')?.value) || 0;
        workoutData.metrics.reps = parseInt(document.getElementById('reps')?.value) || 0;
    } else if (workoutData.type === 'yoga') {
        workoutData.metrics.difficulty = document.getElementById('difficulty')?.value || '';
        workoutData.metrics.focusArea = document.getElementById('focus-area')?.value || '';
    }

    // Add workout to array
    workouts.push(workoutData);
    
    // Save to localStorage
    saveWorkouts();
    
    // Show success message
    showToast('Workout logged successfully!');
    
    // Reset form
    resetWorkoutForm();
    
    // Update recent workouts
    updateRecentWorkouts();
}

// Reset workout form
function resetWorkoutForm() {
    document.getElementById('workout-type').value = '';
    document.getElementById('exercise-search').value = '';
    document.getElementById('duration').value = '';
    document.getElementById('notes').value = '';
    document.getElementById('metrics-container').innerHTML = '';
}

// Update recent workouts display
function updateRecentWorkouts() {
    const recentWorkoutsContainer = document.getElementById('recent-workouts-list');
    
    if (workouts.length === 0) {
        recentWorkoutsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-dumbbell"></i>
                <h3>No workouts yet</h3>
                <p>Log your first workout to get started!</p>
            </div>
        `;
        return;
    }

    // Sort workouts by date (newest first) and take last 5
    const recentWorkouts = workouts
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

    recentWorkoutsContainer.innerHTML = recentWorkouts.map(workout => `
        <div class="workout-item ${workout.type}" onclick="showWorkoutDetails(${workout.id})">
            <div class="workout-header">
                <span class="workout-type">${workout.type}</span>
                <span class="workout-date">${formatDate(workout.date)}</span>
            </div>
            <div class="workout-exercise">${workout.exercise}</div>
            <div class="workout-details">
                <span><i class="fas fa-clock"></i> ${workout.duration} min</span>
                ${getWorkoutMetricsSummary(workout)}
            </div>
        </div>
    `).join('');
}

// Get workout metrics summary
function getWorkoutMetricsSummary(workout) {
    const metrics = workout.metrics;
    let summary = '';

    if (workout.type === 'cardio') {
        if (metrics.distance) summary += `<span><i class="fas fa-route"></i> ${metrics.distance} km</span>`;
        if (metrics.calories) summary += `<span><i class="fas fa-fire"></i> ${metrics.calories} cal</span>`;
    } else if (workout.type === 'strength') {
        if (metrics.weight) summary += `<span><i class="fas fa-weight-hanging"></i> ${metrics.weight} kg</span>`;
        if (metrics.sets && metrics.reps) summary += `<span><i class="fas fa-repeat"></i> ${metrics.sets} × ${metrics.reps}</span>`;
    } else if (workout.type === 'yoga') {
        if (metrics.difficulty) summary += `<span><i class="fas fa-star"></i> ${metrics.difficulty}</span>`;
    }

    return summary;
}

// Show workout details modal
function showWorkoutDetails(workoutId) {
    const workout = workouts.find(w => w.id === workoutId);
    if (!workout) return;

    const modal = document.getElementById('workout-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    modalTitle.textContent = `${workout.exercise} - ${formatDate(workout.date)}`;
    
    modalBody.innerHTML = `
        <div class="workout-detail">
            <h4>Workout Details</h4>
            <p><strong>Type:</strong> ${workout.type}</p>
            <p><strong>Duration:</strong> ${workout.duration} minutes</p>
            <p><strong>Date:</strong> ${formatDate(workout.date)}</p>
            ${workout.notes ? `<p><strong>Notes:</strong> ${workout.notes}</p>` : ''}
            
            <h4>Metrics</h4>
            ${getDetailedMetrics(workout)}
            
            <div style="margin-top: 2rem;">
                <button class="btn btn-danger" onclick="deleteWorkout(${workout.id})">
                    <i class="fas fa-trash"></i> Delete Workout
                </button>
            </div>
        </div>
    `;

    modal.style.display = 'block';
}

// Get detailed metrics for modal
function getDetailedMetrics(workout) {
    const metrics = workout.metrics;
    let html = '';

    if (workout.type === 'cardio') {
        html = `
            <p><strong>Distance:</strong> ${metrics.distance || 0} km</p>
            <p><strong>Average Pace:</strong> ${metrics.pace || 0} min/km</p>
            <p><strong>Calories Burned:</strong> ${metrics.calories || 0}</p>
        `;
    } else if (workout.type === 'strength') {
        html = `
            <p><strong>Weight:</strong> ${metrics.weight || 0} kg</p>
            <p><strong>Sets:</strong> ${metrics.sets || 0}</p>
            <p><strong>Reps:</strong> ${metrics.reps || 0}</p>
        `;
    } else if (workout.type === 'yoga') {
        html = `
            <p><strong>Difficulty:</strong> ${metrics.difficulty || 'Not specified'}</p>
            <p><strong>Focus Area:</strong> ${metrics.focusArea || 'Not specified'}</p>
        `;
    }

    return html;
}

// Delete workout
function deleteWorkout(workoutId) {
    if (confirm('Are you sure you want to delete this workout?')) {
        workouts = workouts.filter(w => w.id !== workoutId);
        saveWorkouts();
        closeModal();
        updateRecentWorkouts();
        showToast('Workout deleted successfully!');
    }
}

// Close modal
function closeModal() {
    document.getElementById('workout-modal').style.display = 'none';
}

// Calendar functions
function renderCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    const monthDisplay = document.getElementById('current-month');
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Set month display
    monthDisplay.textContent = currentDate.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    });
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // Clear calendar
    calendarGrid.innerHTML = '';
    
    // Add day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = day;
        dayHeader.style.fontWeight = 'bold';
        dayHeader.style.background = '#f8f9fa';
        dayHeader.style.color = '#666';
        calendarGrid.appendChild(dayHeader);
    });
    
    // Add empty cells for previous month
    for (let i = 0; i < startingDayOfWeek; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day other-month';
        calendarGrid.appendChild(emptyDay);
    }
    
    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        
        const currentDayDate = new Date(year, month, day);
        const today = new Date();
        
        // Check if it's today
        if (currentDayDate.toDateString() === today.toDateString()) {
            dayElement.classList.add('today');
        }
        
        // Get workouts for this day
        const dayWorkouts = getWorkoutsForDate(currentDayDate);
        
        if (dayWorkouts.length > 0) {
            dayElement.classList.add('has-workout');
            
            const indicators = document.createElement('div');
            indicators.className = 'workout-indicators';
            
            // Show indicators for different workout types
            const workoutTypes = [...new Set(dayWorkouts.map(w => w.type))];
            workoutTypes.forEach(type => {
                const indicator = document.createElement('div');
                indicator.className = `workout-indicator ${type}`;
                indicators.appendChild(indicator);
            });
            
            dayElement.appendChild(dayNumber);
            dayElement.appendChild(indicators);
            
            // Add click handler to show workouts
            dayElement.addEventListener('click', () => showDayWorkouts(currentDayDate, dayWorkouts));
        } else {
            dayElement.appendChild(dayNumber);
        }
        
        calendarGrid.appendChild(dayElement);
    }
}

// Navigate month
function navigateMonth(direction) {
    currentDate.setMonth(currentDate.getMonth() + direction);
    renderCalendar();
}

// Get workouts for specific date
function getWorkoutsForDate(date) {
    const dateString = date.toISOString().split('T')[0];
    return workouts.filter(workout => workout.date === dateString);
}

// Show day workouts
function showDayWorkouts(date, dayWorkouts) {
    const modal = document.getElementById('workout-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    modalTitle.textContent = `Workouts - ${formatDate(date.toISOString().split('T')[0])}`;
    
    modalBody.innerHTML = `
        <div class="day-workouts">
            ${dayWorkouts.map(workout => `
                <div class="workout-item ${workout.type}" style="margin-bottom: 1rem;">
                    <div class="workout-header">
                        <span class="workout-type">${workout.type}</span>
                    </div>
                    <div class="workout-exercise">${workout.exercise}</div>
                    <div class="workout-details">
                        <span><i class="fas fa-clock"></i> ${workout.duration} min</span>
                        ${getWorkoutMetricsSummary(workout)}
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    modal.style.display = 'block';
}

// Progress charts and stats
function updateProgressCharts() {
    const timeframe = parseInt(document.getElementById('progress-timeframe').value);
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - (timeframe * 24 * 60 * 60 * 1000));
    
    const filteredWorkouts = workouts.filter(workout => {
        const workoutDate = new Date(workout.date);
        return workoutDate >= startDate && workoutDate <= endDate;
    });
    
    updateFrequencyChart(filteredWorkouts, timeframe);
    updateDurationChart(filteredWorkouts);
    updateTypesChart(filteredWorkouts);
    updateMetricsChart(filteredWorkouts);
}

// Update frequency chart
function updateFrequencyChart(workouts, timeframe) {
    const ctx = document.getElementById('frequency-chart').getContext('2d');
    
    // Create date labels
    const labels = [];
    const data = [];
    const endDate = new Date();
    
    for (let i = timeframe - 1; i >= 0; i--) {
      const date = new Date(endDate.getTime() - (i * 24 * 60 * 60 * 1000));
        const dateString = date.toISOString().split('T')[0];
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        
        const dayWorkouts = workouts.filter(w => w.date === dateString);
        data.push(dayWorkouts.length);
    }
    
    if (charts.frequency) {
        charts.frequency.destroy();
    }
    
    charts.frequency = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Workouts',
                data: data,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// Update duration chart
function updateDurationChart(workouts) {
    const ctx = document.getElementById('duration-chart').getContext('2d');
    
    // Group workouts by week
    const weeklyData = {};
    workouts.forEach(workout => {
        const date = new Date(workout.date);
        const weekStart = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay());
        const weekKey = weekStart.toISOString().split('T')[0];
        
        if (!weeklyData[weekKey]) {
            weeklyData[weekKey] = 0;
        }
        weeklyData[weekKey] += workout.duration;
    });
    
    const labels = Object.keys(weeklyData).sort().map(date => {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    
    const data = Object.keys(weeklyData).sort().map(key => weeklyData[key]);
    
    if (charts.duration) {
        charts.duration.destroy();
    }
    
    charts.duration = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Duration (minutes)',
                data: data,
                backgroundColor: '#28a745',
                borderColor: '#28a745',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Update types chart
function updateTypesChart(workouts) {
    const ctx = document.getElementById('types-chart').getContext('2d');
    
    const typeCounts = {};
    workouts.forEach(workout => {
        typeCounts[workout.type] = (typeCounts[workout.type] || 0) + 1;
    });
    
    const labels = Object.keys(typeCounts);
    const data = Object.values(typeCounts);
    const colors = ['#28a745', '#dc3545', '#6f42c1'];
    
    if (charts.types) {
        charts.types.destroy();
    }
    
    charts.types = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels.map(label => label.charAt(0).toUpperCase() + label.slice(1)),
            datasets: [{
                data: data,
                backgroundColor: colors.slice(0, labels.length),
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Update metrics chart
function updateMetricsChart(workouts) {
    const ctx = document.getElementById('metrics-chart').getContext('2d');
    
    // Get strength training workouts with weight data
    const strengthWorkouts = workouts.filter(w => w.type === 'strength' && w.metrics.weight > 0);
    
    if (strengthWorkouts.length === 0) {
        if (charts.metrics) {
            charts.metrics.destroy();
        }
        ctx.canvas.parentNode.innerHTML = '<div class="empty-state"><p>No strength training data available</p></div>';
        return;
    }
    
    // Group by exercise and get average weight
    const exerciseData = {};
    strengthWorkouts.forEach(workout => {
        const exercise = workout.exercise;
        if (!exerciseData[exercise]) {
            exerciseData[exercise] = { total: 0, count: 0 };
        }
        exerciseData[exercise].total += workout.metrics.weight;
        exerciseData[exercise].count += 1;
    });
    
    const labels = Object.keys(exerciseData).slice(0, 5); // Top 5 exercises
    const data = labels.map(exercise => 
        Math.round(exerciseData[exercise].total / exerciseData[exercise].count)
    );
    
    if (charts.metrics) {
        charts.metrics.destroy();
    }
    
    charts.metrics = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Average Weight (kg)',
                data: data,
                backgroundColor: '#dc3545',
                borderColor: '#dc3545',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Update stats
function updateStats() {
    const totalWorkouts = workouts.length;
    const totalDuration = workouts.reduce((sum, workout) => sum + workout.duration, 0);
    const currentStreak = calculateCurrentStreak();
    
    document.getElementById('total-workouts').textContent = totalWorkouts;
    document.getElementById('total-duration').textContent = Math.round(totalDuration / 60);
    document.getElementById('current-streak').textContent = currentStreak;
}

// Calculate current streak
function calculateCurrentStreak() {
    if (workouts.length === 0) return 0;
    
    const sortedWorkouts = workouts.sort((a, b) => new Date(b.date) - new Date(a.date));
    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);
    
    for (let i = 0; i < 365; i++) { // Check up to 365 days
        const dateString = currentDate.toISOString().split('T')[0];
        const hasWorkout = sortedWorkouts.some(workout => workout.date === dateString);
        
        if (hasWorkout) {
            streak++;
        } else if (streak > 0) {
            break;
        }
        
        currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak;
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    document.getElementById('toast-container').appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Service worker registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registered: ', registration);
            })
            .catch(registrationError => {
                console.log('ServiceWorker registration failed: ', registrationError);
            });
    });
    }
      
