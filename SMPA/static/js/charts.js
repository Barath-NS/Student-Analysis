// Chart Functions Extension for AppState

// Student Performance Chart
AppState.prototype.updatePerformanceChart = function(data) {
    const ctx = document.getElementById('performanceChart').getContext('2d');
    
    const subjects = Object.keys(data.exam1);
    const exam1Marks = subjects.map(subject => data.exam1[subject]);
    const exam2Marks = subjects.map(subject => data.exam2[subject]);

    if (this.performanceChart) {
        this.performanceChart.destroy();
    }

    this.performanceChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: subjects.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
            datasets: [
                {
                    label: 'Exam 1 (Actual)',
                    data: exam1Marks,
                    backgroundColor: '#6366f1',
                    borderColor: '#4f46e5',
                    borderWidth: 1,
                    borderRadius: 4,
                },
                {
                    label: 'Exam 2 (Predicted)',
                    data: exam2Marks,
                    backgroundColor: '#06b6d4',
                    borderColor: '#0891b2',
                    borderWidth: 1,
                    borderRadius: 4,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutCubic'
            }
        }
    });
};

// Update marks table
AppState.prototype.updateMarksTable = function(data) {
    const tbody = document.querySelector('#marksTable tbody');
    tbody.innerHTML = '';

    Object.keys(data.exam1).forEach(subject => {
        const exam1Mark = data.exam1[subject];
        const exam2Mark = data.exam2[subject];
        const difference = exam2Mark - exam1Mark;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="font-weight: 600; text-transform: capitalize;">${subject}</td>
            <td>${exam1Mark.toFixed(1)}%</td>
            <td>${exam2Mark.toFixed(1)}%</td>
            <td style="color: ${difference >= 0 ? '#10b981' : '#ef4444'};">
                ${difference >= 0 ? '+' : ''}${difference.toFixed(1)}%
            </td>
        `;
        tbody.appendChild(row);
    });
};

// Analytics Charts
AppState.prototype.createPerformanceDistributionChart = function(data) {
    const ctx = document.getElementById('performanceDistributionChart').getContext('2d');
    const { students } = data;
    
    // Create performance ranges
    const ranges = {
        'Excellent (90-100%)': students.filter(s => s.exam2_avg >= 90).length,
        'Good (80-89%)': students.filter(s => s.exam2_avg >= 80 && s.exam2_avg < 90).length,
        'Satisfactory (70-79%)': students.filter(s => s.exam2_avg >= 70 && s.exam2_avg < 80).length,
        'Needs Improvement (60-69%)': students.filter(s => s.exam2_avg >= 60 && s.exam2_avg < 70).length,
        'Poor (<60%)': students.filter(s => s.exam2_avg < 60).length
    };
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(ranges),
            datasets: [{
                label: 'Number of Students',
                data: Object.values(ranges),
                backgroundColor: ['#10b981', '#06b6d4', '#f59e0b', '#f97316', '#ef4444'],
                borderColor: ['#059669', '#0891b2', '#d97706', '#ea580c', '#dc2626'],
                borderWidth: 1,
                borderRadius: 4
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
};

AppState.prototype.createSubjectComparisonChart = function(data) {
    const ctx = document.getElementById('subjectComparisonChart').getContext('2d');
    const { students, subjects } = data;
    
    const exam1Avgs = subjects.map(subject => {
        return students.reduce((sum, student) => sum + student[`exam1_${subject}`], 0) / students.length;
    });
    
    const exam2Avgs = subjects.map(subject => {
        return students.reduce((sum, student) => sum + student[`exam2_${subject}`], 0) / students.length;
    });
    
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: subjects.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
            datasets: [
                {
                    label: 'Exam 1 Average',
                    data: exam1Avgs,
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.2)',
                    borderWidth: 2,
                    pointBackgroundColor: '#6366f1'
                },
                {
                    label: 'Exam 2 Average (Predicted)',
                    data: exam2Avgs,
                    borderColor: '#06b6d4',
                    backgroundColor: 'rgba(6, 182, 212, 0.2)',
                    borderWidth: 2,
                    pointBackgroundColor: '#06b6d4'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20
                    }
                }
            }
        }
    });
};

AppState.prototype.createImprovementTrendsChart = function(data) {
    const ctx = document.getElementById('improvementTrendsChart').getContext('2d');
    const { students, subjects } = data;
    
    const improvements = subjects.map(subject => {
        const improvements = students.map(student => 
            student[`exam2_${subject}`] - student[`exam1_${subject}`]
        );
        return improvements.reduce((sum, imp) => sum + imp, 0) / improvements.length;
    });
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: subjects.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
            datasets: [{
                label: 'Average Improvement (%)',
                data: improvements,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#10b981',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            }
        }
    });
};

AppState.prototype.createGradeDistributionChart = function(data) {
    const ctx = document.getElementById('gradeDistributionChart').getContext('2d');
    const { students } = data;
    
    const grades = {
        'A (90-100%)': students.filter(s => s.exam2_avg >= 90).length,
        'B (80-89%)': students.filter(s => s.exam2_avg >= 80 && s.exam2_avg < 90).length,
        'C (70-79%)': students.filter(s => s.exam2_avg >= 70 && s.exam2_avg < 80).length,
        'D (60-69%)': students.filter(s => s.exam2_avg >= 60 && s.exam2_avg < 70).length,
        'F (<60%)': students.filter(s => s.exam2_avg < 60).length
    };
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(grades),
            datasets: [{
                data: Object.values(grades),
                backgroundColor: ['#10b981', '#06b6d4', '#f59e0b', '#f97316', '#ef4444'],
                borderColor: '#ffffff',
                borderWidth: 2
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
};
