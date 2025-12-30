// ===============================
// Grade points configuration
// ===============================
let gradePoints = {
    'A': 4.0,
    'A-': 3.7,
    'B+': 3.3,
    'B': 3.0,
    'B-': 2.7,
    'C+': 2.3,
    'C': 2.0,
    'C-': 1.7,
    'D+': 1.3,
    'D': 1.0,
    'F': 0.0
};

// ===============================
// Courses array (default course)
// ===============================
let courses = [
    { id: 1, name: '', credits: '3', grade: '' }
];

let courseIdCounter = 2;

// ===============================
// Initialize application
// ===============================
function init() {
    renderGradeScale();
    renderCourses();
    calculateAll();

    // Attach CGPA input listeners safely
    const prevCreditsInput = document.getElementById('prevCredits');
    const prevCGPAInput = document.getElementById('prevCGPA');

    if (prevCreditsInput) {
        prevCreditsInput.addEventListener('input', function () {
            validateInput(this);
            calculateAll();
        });
    }

    if (prevCGPAInput) {
        prevCGPAInput.addEventListener('input', function () {
            validateInput(this);
            calculateAll();
        });
    }
}

// ===============================
// Input validation
// ===============================
function validateInput(input) {
    const min = parseFloat(input.getAttribute('min')) || 0;
    const max = parseFloat(input.getAttribute('max')) || Infinity;
    let value = parseFloat(input.value);

    if (isNaN(value)) return;

    if (value < min) value = min;
    if (value > max) value = max;

    input.value = value;
}

// ===============================
// Render grade scale
// ===============================
function renderGradeScale() {
    const container = document.getElementById('gradeScaleContainer');
    if (!container) return;

    container.innerHTML = '';

    Object.entries(gradePoints).forEach(([grade, points]) => {
        const gradeItem = document.createElement('div');
        gradeItem.className = 'grade-item';
        gradeItem.innerHTML = `
            <div class="grade-badge">${grade}</div>
            <input type="number" step="0.1" min="0" max="4" value="${points}"
                   oninput="validateInput(this); updateGradePoint('${grade}', this.value)">
        `;
        container.appendChild(gradeItem);
    });
}

// ===============================
// Update grade point
// ===============================
function updateGradePoint(grade, value) {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 4) {
        gradePoints[grade] = numValue;
        calculateAll();
    }
}

// ===============================
// Render courses table
// ===============================
function renderCourses() {
    const tbody = document.getElementById('coursesTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    courses.forEach(course => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td data-label="Course Name">
                <input type="text" value="${escapeHtml(course.name)}"
                       placeholder="e.g., Data Structures"
                       onchange="updateCourse(${course.id}, 'name', this.value)">
            </td>
            <td data-label="Credits">
                <input type="number" value="${course.credits}"
                       min="0.5" max="20" step="0.5"
                       oninput="validateInput(this); updateCourse(${course.id}, 'credits', this.value)">
            </td>
            <td data-label="Grade">
                <select onchange="updateCourse(${course.id}, 'grade', this.value)">
                    <option value="">Select</option>
                    ${Object.keys(gradePoints).map(g =>
                        `<option value="${g}" ${course.grade === g ? 'selected' : ''}>${g}</option>`
                    ).join('')}
                </select>
            </td>
            <td>
                <button class="btn-delete"
                        onclick="removeCourse(${course.id})"
                        ${courses.length === 1 ? 'disabled' : ''}>
                    ✕
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// ===============================
// Escape HTML (XSS safe)
// ===============================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===============================
// Add / Remove / Update course
// ===============================
function addCourse() {
    courses.push({
        id: courseIdCounter++,
        name: '',
        credits: '3',
        grade: ''
    });
    renderCourses();
    calculateAll();
}

function removeCourse(id) {
    if (courses.length > 1) {
        courses = courses.filter(c => c.id !== id);
        renderCourses();
        calculateAll();
    }
}

function updateCourse(id, field, value) {
    const course = courses.find(c => c.id === id);
    if (!course) return;

    course[field] = value;
    calculateAll();
}

// ===============================
// SGPA Calculation
// ===============================
function calculateSGPA() {
    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach(course => {
        const credits = parseFloat(course.credits);
        if (!isNaN(credits) && course.grade) {
            totalCredits += credits;
            totalPoints += credits * gradePoints[course.grade];
        }
    });

    return {
        sgpa: totalCredits ? (totalPoints / totalCredits).toFixed(2) : '0.00',
        credits: totalCredits,
        points: totalPoints
    };
}

// ===============================
// CGPA Calculation
// ===============================
function calculateCGPA(currentCredits, currentPoints) {
    const prevCredits = parseFloat(document.getElementById('prevCredits')?.value) || 0;
    const prevCGPA = parseFloat(document.getElementById('prevCGPA')?.value) || 0;

    const prevPoints = prevCredits * prevCGPA;
    const totalCredits = prevCredits + currentCredits;
    const totalPoints = prevPoints + currentPoints;

    return totalCredits
        ? (totalPoints / totalCredits).toFixed(2)
        : '0.00';
}

// ===============================
// Update UI
// ===============================
function calculateAll() {
    const { sgpa, credits, points } = calculateSGPA();
    const cgpa = calculateCGPA(credits, points);

    document.getElementById('sgpaValue').textContent = sgpa;
    document.getElementById('currentCredits').textContent = credits.toFixed(1);
    document.getElementById('currentGradePoints').textContent = points.toFixed(2);
    document.getElementById('cgpaValue').textContent = cgpa;
}

// ===============================
// Prevent Enter key submit
// ===============================
document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
        e.preventDefault();
        e.target.blur();
    }
});

// ===============================
// Single DOMContentLoaded (FIXED)
// ===============================
window.addEventListener('DOMContentLoaded', init);
