// Analytics Functions Extension for AppState
AppState.prototype.enableAnalytics = function() {
    // Show analytics available state
    document.getElementById('analyticsNotAvailable').classList.add('hidden');
    document.getElementById('analyticsAvailable').classList.remove('hidden');
    
    // Load analytics data
    this.loadAnalyticsData();
};

AppState.prototype.loadAnalyticsData = async function() {
    try {
        // In a real app, you'd fetch this from your backend
        // For demo purposes, we'll generate sample data
        const analyticsData = this.generateSampleAnalyticsData();
        
        // Update stats
        this.updateAnalyticsStats(analyticsData);
        
        // Create charts
        this.createAnalyticsCharts(analyticsData);
        
        // Generate insights
        this.generateAnalyticsInsights(analyticsData);
        
    } catch (error) {
        console.error('Error loading analytics:', error);
        this.showToast('Failed to load analytics data', 'error');
    }
};

AppState.prototype.generateSampleAnalyticsData = function() {
    const subjects = ['physics', 'maths', 'english', 'chemistry', 'computer'];
    const totalStudents = parseInt(document.getElementById('predictionsCount').textContent) || 1000;
    
    // Generate student performance data
    const students = [];
    for (let i = 1; i <= totalStudents; i++) {
        const student = { id: i };
        let exam1Total = 0;
        let exam2Total = 0;
        
        subjects.forEach(subject => {
            const exam1Mark = Math.random() * 100;
            const improvement = (Math.random() - 0.5) * 30; // -15 to +15
            const exam2Mark = Math.max(0, Math.min(100, exam1Mark + improvement));
            
            student[`exam1_${subject}`] = exam1Mark;
            student[`exam2_${subject}`] = exam2Mark;
            
            exam1Total += exam1Mark;
            exam2Total += exam2Mark;
        });
        
        student.exam1_avg = exam1Total / subjects.length;
        student.exam2_avg = exam2Total / subjects.length;
        student.improvement = student.exam2_avg - student.exam1_avg;
        
        students.push(student);
    }
    
    return {
        students,
        subjects,
        totalStudents
    };
};

AppState.prototype.updateAnalyticsStats = function(data) {
    const { students } = data;
    
    // Total students
    document.getElementById('totalStudentsAnalytics').textContent = data.totalStudents;
    
    // Average improvement
    const avgImprovement = students.reduce((sum, student) => sum + student.improvement, 0) / students.length;
    document.getElementById('avgImprovement').textContent = `${avgImprovement >= 0 ? '+' : ''}${avgImprovement.toFixed(1)}%`;
    
    // Top performers (above 80% average)
    const topPerformers = students.filter(student => student.exam2_avg >= 80).length;
    document.getElementById('topPerformers').textContent = topPerformers;
    
    // Needs attention (below 60% average or negative improvement)
    const needsAttention = students.filter(student => student.exam2_avg < 60 || student.improvement < -5).length;
    document.getElementById('needsAttention').textContent = needsAttention;
};

AppState.prototype.createAnalyticsCharts = function(data) {
    this.createPerformanceDistributionChart(data);
    this.createSubjectComparisonChart(data);
    this.createImprovementTrendsChart(data);
    this.createGradeDistributionChart(data);
    this.updatePerformanceRankingsTable(data);
};

AppState.prototype.updatePerformanceRankingsTable = function(data) {
    const { students } = data;
    const tbody = document.querySelector('#performanceRankingsTable tbody');
    
    // Sort students by exam2 average (descending)
    const sortedStudents = [...students].sort((a, b) => b.exam2_avg - a.exam2_avg);
    
    // Show top 10 performers
    const topStudents = sortedStudents.slice(0, 10);
    
    tbody.innerHTML = '';
    
    topStudents.forEach((student, index) => {
        const row = document.createElement('tr');
        const improvement = student.improvement;
        
        row.innerHTML = `
            <td style="font-weight: 600;">${index + 1}</td>
            <td>Student ${student.id}</td>
            <td>${student.exam2_avg.toFixed(1)}%</td>
            <td style="color: ${improvement >= 0 ? '#10b981' : '#ef4444'};">
                ${improvement >= 0 ? '+' : ''}${improvement.toFixed(1)}%
            </td>
        `;
        tbody.appendChild(row);
    });
};

AppState.prototype.generateAnalyticsInsights = function(data) {
    const { students, subjects } = data;
    const insights = [];
    
    // Store analytics data for chatbot
    this.analyticsData = data;
    
    // Overall performance insight
    const avgImprovement = students.reduce((sum, student) => sum + student.improvement, 0) / students.length;
    if (avgImprovement > 2) {
        insights.push(`🎯 <strong>Positive Trend:</strong> Students are showing an average improvement of ${avgImprovement.toFixed(1)}% across all subjects.`);
    } else if (avgImprovement < -2) {
        insights.push(`⚠️ <strong>Attention Needed:</strong> There's an average decline of ${Math.abs(avgImprovement).toFixed(1)}% in performance.`);
    } else {
        insights.push(`📊 <strong>Stable Performance:</strong> Overall performance is relatively stable with minimal change.`);
    }
    
    // Subject-specific insights
    subjects.forEach(subject => {
        const subjectImprovements = students.map(student => 
            student[`exam2_${subject}`] - student[`exam1_${subject}`]
        );
        const avgSubjectImprovement = subjectImprovements.reduce((sum, imp) => sum + imp, 0) / subjectImprovements.length;
        
        if (avgSubjectImprovement > 5) {
            insights.push(`📈 <strong>${subject.charAt(0).toUpperCase() + subject.slice(1)}:</strong> Strong improvement expected (+${avgSubjectImprovement.toFixed(1)}%).`);
        } else if (avgSubjectImprovement < -5) {
            insights.push(`📉 <strong>${subject.charAt(0).toUpperCase() + subject.slice(1)}:</strong> Needs attention (${avgSubjectImprovement.toFixed(1)}%).`);
        }
    });
    
    // Performance distribution insights
    const topPerformers = students.filter(s => s.exam2_avg >= 80).length;
    const strugglingStudents = students.filter(s => s.exam2_avg < 60).length;
    
    insights.push(`🏆 <strong>Top Performers:</strong> ${topPerformers} students (${(topPerformers / students.length * 100).toFixed(1)}%) are expected to score above 80%.`);
    
    if (strugglingStudents > 0) {
        insights.push(`🔔 <strong>Intervention Needed:</strong> ${strugglingStudents} students (${(strugglingStudents / students.length * 100).toFixed(1)}%) may need additional support.`);
    }
    
    // Recommendations
    insights.push(`💡 <strong>Recommendation:</strong> Focus on personalized learning plans for struggling students and maintain current strategies for top performers.`);
    
    const insightsContainer = document.getElementById('analyticsInsights');
    insightsContainer.innerHTML = `
        <div style="line-height: 1.8;">
            ${insights.map(insight => `<p style="margin-bottom: 1rem;">${insight}</p>`).join('')}
        </div>
    `;
};
