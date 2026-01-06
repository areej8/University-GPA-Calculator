# 🎓 University GPA Calculator

A modern, responsive web application for calculating Semester GPA (SGPA) and Cumulative GPA (CGPA) with a customizable grading scale.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://areej8.github.io/University-GPA-Calculator/)

## ✨ Features

- 📊 **SGPA Calculator** - Calculate your semester GPA instantly
- 📈 **CGPA Calculator** - Track your cumulative GPA across all semesters
- ⚙️ **Customizable Grade Scale** - Adjust grade points to match your university's system
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile
- 💾 **Real-time Calculations** - Instant updates as you enter data

## 🚀 Live Demo

Visit: [University GPA Calculator](https://areej8.github.io/University-GPA-Calculator/)

## 📖 How to Use

### Calculating SGPA (Semester GPA)

1. **Enter Course Details**
   - Add your course name (optional)
   - Enter credit hours (default is 3)
   - Select the grade you received

2. **Add More Courses**
   - Click "Add Course" button to add additional courses
   - Remove courses using the ✕ button

3. **View Results**
   - Your SGPA is calculated automatically
   - See total credits and grade points

### Calculating CGPA (Cumulative GPA)

1. **Enter Previous Performance**
   - Total credit hours from previous semesters
   - Your previous CGPA (not grade points)

2. **Add Current Semester Courses**
   - Follow the SGPA steps above

3. **View Combined Results**
   - Your CGPA combines previous and current performance
   - See total credits and grade points across all semesters

**Example:** If you completed 45 credit hours with a 3.5 CGPA previously, enter:
- Previous Credits: `45`
- Previous CGPA: `3.5`

The calculator automatically computes: 45 × 3.5 = 157.5 grade points

### Customizing Grade Scale

The default grade scale follows a standard 4.0 system:
- A = 4.0
- A- = 3.67
- B+ = 3.33
- And so on...

**To customize:**
1. Find the "Grade Scale" panel on the left (desktop) or bottom (mobile)
2. Click on any grade point value
3. Enter your university's grade point
4. All calculations update automatically

## 🛠️ Technical Details

### Technologies Used
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with gradients, flexbox, and grid
- **Vanilla JavaScript** - No frameworks, pure ES6+
- **Responsive Design** - Mobile-first approach

### Browser Support
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### File Structure
```
University-GPA-Calculator/
├── index.html          # Main HTML structure
├── style.css          # Styling and responsive design
├── script.js          # Application logic
└── README.md          # Documentation
```

### Key Features Implementation

**Real-time Validation**
- Credit hours: 0.5 - 20 range
- Grade points: 0 - 4.0 range
- Previous CGPA: 0 - 4.0 range
- Previous credits: 0 - 500 range

**Calculation Formula**

SGPA:
```javascript
SGPA = (Σ(Credits × Grade Points)) / (Total Credits)
```

CGPA:
```javascript
CGPA = (Previous Credits × Previous CGPA + Current Credits × SGPA) / (Total Credits)
```

## 📧 Contact

**Areej** - [@areej8](https://github.com/areej8)

Project Link: [https://github.com/areej8/University-GPA-Calculator](https://github.com/areej8/University-GPA-Calculator)

---

<div align="center">

**Made with ❤️ for students tracking their academic journey**

[⭐ Star this repo](https://github.com/areej8/University-GPA-Calculator) if you found it helpful!

</div>
