// Grade points configuration
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

// Courses array with default credit value of 3
let courses = [
    { id: 1, name: '', credits: '3', grade: '' }
];

let courseIdCounter = 2;

// Initialize the application
function init() {
    renderGradeScale();
    renderCourses();
    calculateAll();
}

// Validate input to prevent negative and impossible values
function validateInput(input) {
    const min = parseFloat(input.getAttribute('min')) || 0;
    const max = parseFloat(input.getAttribute('max')) || Infinity;
    let value = parseFloat(input.value);
    
    // Remove any negative sign
    if (value < 0) {
        value = 0;
        input.value = value;
    }
    
    // Check against minimum
    if (value < min) {
        value = min;
        input.value = value;
    }
    
    // Check against maximum
    if (value > max) {
        value = max;
        input.value = value;
    }
}

// Render grade scale sidebar
function renderGradeScale() {
    const container = document.getElementById('gradeScaleContainer');
    container.innerHTML = '';
    
    Object.entries(gradePoints).forEach(([grade, points]) => {
        const gradeItem = document.createElement('div');
        gradeItem.className = 'grade-item';
        gradeItem.innerHTML = `
            <div class="grade-badge">${grade}</div>
            <input type="number" step="0.1" min="0" max="4" value="${points}" 
                   onchange="updateGradePoint('${grade}', this.value)"
                   oninput="validateInput(this)">
        `;
        container.appendChild(gradeItem);
    });
}

// Update grade point value
function updateGradePoint(grade, value) {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 4) {
        gradePoints[grade] = numValue;
        calculateAll();
    }
}

// Render courses table with mobile-friendly data labels
function renderCourses() {
    const tbody = document.getElementById('coursesTableBody');
    tbody.innerHTML = '';
    
    courses.forEach(course => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td data-label="Course Name">
                <input type="text" value="${escapeHtml(course.name)}" 
                       placeholder="e.g., Data Structures"
                       onchange="updateCourse(${course.id}, 'name', this.value)"
                       maxlength="100">
            </td>
            <td data-label="Credits">
                <input type="number" value="${course.credits}" 
                       placeholder="3"
                       min="0.5"
                       max="20"
                       step="0.5"
                       oninput="validateInput(this); updateCourse(${course.id}, 'credits', this.value)">
            </td>
            <td data-label="Grade">
                <select onchange="updateCourse(${course.id}, 'grade', this.value)">
                    <option value="">Select</option>
                    ${Object.keys(gradePoints).map(grade => 
                        `<option value="${grade}" ${course.grade === grade ? 'selected' : ''}>${grade}</option>`
                    ).join('')}
                </select>
            </td>
            <td data-label="">
                <button class="btn-delete" onclick="removeCourse(${course.id})" 
                        ${courses.length === 1 ? 'disabled' : ''}
                        aria-label="Remove course">
                    <svg class="icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Escape HTML to prevent XSS attacks
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add a new course with default credit value of 3
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

// Remove a course (must keep at least one)
function removeCourse(id) {
    if (courses.length > 1) {
        courses = courses.filter(c => c.id !== id);
        renderCourses();
        calculateAll();
    }
}

// Update course data
function updateCourse(id, field, value) {
    const course = courses.find(c => c.id === id);
    if (course) {
        if (field === 'credits') {
            // Validate credits
            const numValue = parseFloat(value);
            if (!isNaN(numValue) && numValue >= 0.5 && numValue <= 20) {
                course[field] = value;
            } else if (value === '') {
                course[field] = '';
            }
        } else {
            course[field] = value;
        }
        calculateAll();
    }
}

// Calculate SGPA (Semester GPA)
function calculateSGPA() {
    let totalPoints = 0;
    let totalCredits = 0;
    
    courses.forEach(course => {
        const credits = parseFloat(course.credits);
        if (!isNaN(credits) && credits > 0 && course.grade && gradePoints[course.grade] !== undefined) {
            const points = gradePoints[course.grade];
            totalPoints += credits * points;
            totalCredits += credits;
        }
    });
    
    return {
        sgpa: totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00',
        currentCredits: totalCredits,
        currentGradePoints: totalPoints
    };
}

// Calculate CGPA (Cumulative GPA)
// Takes previous credits + previous CGPA, calculates grade points automatically
function calculateCGPA(currentCredits, currentGradePoints) {
    const prevCreditsInput = document.getElementById('prevCredits');
    const prevCGPAInput = document.getElementById('prevCGPA');
    
    const prevCredits = parseFloat(prevCreditsInput.value) || 0;
    const prevCGPA = parseFloat(prevCGPAInput.value) || 0;
    
    // Validate previous CGPA (must be between 0 and 4)
    if (prevCGPA > 4) {
        prevCGPAInput.value = '4.00';
        return calculateCGPA(currentCredits, currentGradePoints);
    }
    
    if (prevCGPA < 0) {
        prevCGPAInput.value = '0.00';
        return calculateCGPA(currentCredits, currentGradePoints);
    }
    
    // Validate previous credits (must be non-negative)
    if (prevCredits < 0) {
        prevCreditsInput.value = '0';
        return calculateCGPA(currentCredits, currentGradePoints);
    }
    
    // Calculate previous grade points from credits and CGPA
    // Formula: Previous Grade Points = Previous Credits × Previous CGPA
    const prevGradePoints = prevCredits * prevCGPA;
    
    // Calculate totals
    const totalCredits = prevCredits + currentCredits;
    const totalGradePoints = prevGradePoints + currentGradePoints;
    
    return {
        cgpa: totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : '0.00',
        totalCredits: totalCredits,
        totalGradePoints: totalGradePoints
    };
}

// Calculate and update all values on the page
function calculateAll() {
    // Calculate SGPA
    const { sgpa, currentCredits, currentGradePoints } = calculateSGPA();
    
    // Calculate CGPA
    const { cgpa, totalCredits, totalGradePoints } = calculateCGPA(currentCredits, currentGradePoints);
    
    // Update SGPA display
    document.getElementById('sgpaValue').textContent = sgpa;
    document.getElementById('currentCredits').textContent = currentCredits.toFixed(1);
    document.getElementById('currentGradePoints').textContent = currentGradePoints.toFixed(2);
    
    // Update CGPA display
    document.getElementById('cgpaValue').textContent = cgpa;
    document.getElementById('totalCredits').textContent = totalCredits.toFixed(1);
    document.getElementById('totalGradePoints').textContent = totalGradePoints.toFixed(2);
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', init);

// Prevent form submission on enter key in input fields
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && event.target.tagName === 'INPUT') {
        event.preventDefault();
        event.target.blur();
    }
});

// Add event listeners for CGPA inputs to recalculate on change
document.addEventListener('DOMContentLoaded', function() {
    const prevCreditsInput = document.getElementById('prevCredits');
    const prevCGPAInput = document.getElementById('prevCGPA');
    
    if (prevCreditsInput) {
        prevCreditsInput.addEventListener('input', function() {
            validateInput(this);
            calculateAll();
        });
    }
    
    if (prevCGPAInput) {
        prevCGPAInput.addEventListener('input', function() {
            validateInput(this);
            calculateAll();
        });
    }
});