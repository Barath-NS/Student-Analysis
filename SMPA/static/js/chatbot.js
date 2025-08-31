// Chatbot Functions Extension for AppState
AppState.prototype.initChatbot = function() {
    const toggle = document.getElementById('chatbotToggle');
    const container = document.getElementById('chatbotContainer');
    const close = document.getElementById('chatbotClose');
    const input = document.getElementById('chatbotInput');
    const send = document.getElementById('chatbotSend');
    const suggestions = document.getElementById('chatSuggestions');

    // Toggle chatbot
    toggle.addEventListener('click', () => {
        container.classList.add('active');
        input.focus();
    });

    // Close chatbot
    close.addEventListener('click', () => {
        container.classList.remove('active');
    });

    // Send message
    const sendMessage = () => {
        const message = input.value.trim();
        if (message) {
            this.addChatMessage(message, 'user');
            input.value = '';
            this.processChatMessage(message);
        }
    };

    send.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Suggestion chips
    suggestions.addEventListener('click', (e) => {
        if (e.target.classList.contains('suggestion-chip')) {
            const message = e.target.textContent;
            this.addChatMessage(message, 'user');
            this.processChatMessage(message);
        }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!container.contains(e.target) && !toggle.contains(e.target)) {
            container.classList.remove('active');
        }
    });
};

AppState.prototype.addChatMessage = function(message, type, isHTML = false) {
    const messagesContainer = document.getElementById('chatbotMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type}`;

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (type === 'bot') {
        messageDiv.innerHTML = `
            <div class="chat-avatar bot">
                <i class="fas fa-robot"></i>
            </div>
            <div>
                <div class="message-content">${isHTML ? message : this.escapeHtml(message)}</div>
                <div class="message-time">${timeString}</div>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div>
                <div class="message-content">${this.escapeHtml(message)}</div>
                <div class="message-time">${timeString}</div>
            </div>
            <div class="chat-avatar user">
                <i class="fas fa-user"></i>
            </div>
        `;
    }

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
};

AppState.prototype.showTypingIndicator = function() {
    const messagesContainer = document.getElementById('chatbotMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot typing-indicator';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        <div class="chat-avatar bot">
            <i class="fas fa-robot"></i>
        </div>
        <div class="typing-dots">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
};

AppState.prototype.hideTypingIndicator = function() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
};

AppState.prototype.processChatMessage = async function(message) {
    this.showTypingIndicator();
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    this.hideTypingIndicator();
    
    const response = this.generateAIResponse(message.toLowerCase());
    this.addChatMessage(response, 'bot', true);
};

AppState.prototype.generateAIResponse = function(message) {
    // Student-specific queries
    if (message.includes('student') && message.match(/\d+/)) {
        const studentId = message.match(/\d+/)[0];
        return this.getStudentPerformanceResponse(studentId);
    }
    
    // Analytics queries
    if (message.includes('analytics') || message.includes('summary') || message.includes('overview')) {
        return this.getAnalyticsSummaryResponse();
    }
    
    // Subject-specific queries
    if (message.includes('subject') || message.includes('physics') || message.includes('math') || 
        message.includes('english') || message.includes('chemistry') || message.includes('computer')) {
        return this.getSubjectAnalysisResponse(message);
    }
    
    // Top performers
    if (message.includes('top') || message.includes('best') || message.includes('highest')) {
        return this.getTopPerformersResponse();
    }
    
    // Struggling students
    if (message.includes('struggling') || message.includes('attention') || message.includes('help') || 
        message.includes('support') || message.includes('bottom') || message.includes('worst')) {
        return this.getStrugglingStudentsResponse();
    }
    
    // Improvement queries
    if (message.includes('improve') || message.includes('progress') || message.includes('better')) {
        return this.getImprovementResponse();
    }
    
    // Recommendations
    if (message.includes('recommend') || message.includes('suggest') || message.includes('advice')) {
        return this.getRecommendationsResponse();
    }
    
    // Platform help
    if (message.includes('help') || message.includes('how') || message.includes('use')) {
        return this.getHelpResponse();
    }
    
    // Greeting responses
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        return `Hello! 👋 I'm here to help you analyze student performance data. I can provide insights about individual students, analytics summaries, subject comparisons, and recommendations. What would you like to know?`;
    }
    
    // Default response
    return this.getDefaultResponse();
};

AppState.prototype.getStudentPerformanceResponse = function(studentId) {
    if (!this.predictionsGenerated) {
        return `I don't have student data available yet. Please upload exam data and generate predictions first, then I can provide detailed student performance insights! 📊`;
    }
    
    // Generate sample student data
    const subjects = ['Physics', 'Math', 'English', 'Chemistry', 'Computer'];
    const exam1Avg = 65 + Math.random() * 25;
    const improvement = (Math.random() - 0.5) * 20;
    const exam2Avg = Math.max(40, Math.min(95, exam1Avg + improvement));
    
    let response = `📋 <strong>Student ${studentId} Performance Analysis:</strong><br><br>`;
    response += `• <strong>Exam 1 Average:</strong> ${exam1Avg.toFixed(1)}%<br>`;
    response += `• <strong>Predicted Exam 2 Average:</strong> ${exam2Avg.toFixed(1)}%<br>`;
    response += `• <strong>Expected Change:</strong> ${improvement >= 0 ? '+' : ''}${improvement.toFixed(1)}%<br><br>`;
    
    if (improvement > 5) {
        response += `🎉 <strong>Great news!</strong> Student ${studentId} is expected to show significant improvement!`;
    } else if (improvement < -5) {
        response += `⚠️ <strong>Attention needed:</strong> Student ${studentId} may need additional support to maintain performance.`;
    } else {
        response += `📊 <strong>Stable performance:</strong> Student ${studentId} is expected to maintain consistent results.`;
    }
    
    return response;
};

AppState.prototype.getAnalyticsSummaryResponse = function() {
    if (!this.analyticsData) {
        return `Analytics data isn't available yet. Please complete the data upload and prediction process first! 📈`;
    }
    
    const { students } = this.analyticsData;
    const avgImprovement = students.reduce((sum, student) => sum + student.improvement, 0) / students.length;
    const topPerformers = students.filter(s => s.exam2_avg >= 80).length;
    const strugglingStudents = students.filter(s => s.exam2_avg < 60).length;
    
    let response = `📊 <strong>Analytics Summary:</strong><br><br>`;
    response += `• <strong>Total Students:</strong> ${students.length}<br>`;
    response += `• <strong>Average Improvement:</strong> ${avgImprovement >= 0 ? '+' : ''}${avgImprovement.toFixed(1)}%<br>`;
    response += `• <strong>Top Performers (80%+):</strong> ${topPerformers} students<br>`;
    response += `• <strong>Need Attention (60%-):</strong> ${strugglingStudents} students<br><br>`;
    
    if (avgImprovement > 2) {
        response += `🎯 Overall trend is positive with good improvement across the board!`;
    } else if (avgImprovement < -2) {
        response += `📉 There's a concerning decline in performance that needs attention.`;
    } else {
        response += `📊 Performance is stable with minimal change expected.`;
    }
    
    return response;
};

AppState.prototype.getSubjectAnalysisResponse = function(message) {
    const subjects = ['physics', 'math', 'english', 'chemistry', 'computer'];
    const mentionedSubject = subjects.find(subject => message.includes(subject));
    
    if (mentionedSubject) {
        const improvement = (Math.random() - 0.5) * 15;
        let response = `📚 <strong>${mentionedSubject.charAt(0).toUpperCase() + mentionedSubject.slice(1)} Analysis:</strong><br><br>`;
        response += `• <strong>Expected Improvement:</strong> ${improvement >= 0 ? '+' : ''}${improvement.toFixed(1)}%<br><br>`;
        
        if (improvement > 5) {
            response += `🚀 ${mentionedSubject.charAt(0).toUpperCase() + mentionedSubject.slice(1)} shows strong improvement trends!`;
        } else if (improvement < -5) {
            response += `🔍 ${mentionedSubject.charAt(0).toUpperCase() + mentionedSubject.slice(1)} needs focused attention and intervention.`;
        } else {
            response += `📊 ${mentionedSubject.charAt(0).toUpperCase() + mentionedSubject.slice(1)} performance is relatively stable.`;
        }
        
        return response;
    }
    
    return `📚 <strong>Subject Analysis:</strong><br><br>I can provide detailed analysis for Physics, Math, English, Chemistry, and Computer Science. Which specific subject would you like me to analyze? 🤔`;
};

AppState.prototype.getTopPerformersResponse = function() {
    if (!this.analyticsData) {
        return `I need analytics data to identify top performers. Please complete the prediction process first! 🏆`;
    }
    
    const { students } = this.analyticsData;
    const topStudents = students
        .sort((a, b) => b.exam2_avg - a.exam2_avg)
        .slice(0, 5);
    
    let response = `🏆 <strong>Top 5 Performing Students:</strong><br><br>`;
    topStudents.forEach((student, index) => {
        response += `${index + 1}. <strong>Student ${student.id}:</strong> ${student.exam2_avg.toFixed(1)}% (${student.improvement >= 0 ? '+' : ''}${student.improvement.toFixed(1)}%)<br>`;
    });
    
    response += `<br>🎉 These students are excelling and can serve as peer mentors!`;
    return response;
};

AppState.prototype.getStrugglingStudentsResponse = function() {
    if (!this.analyticsData) {
        return `I need analytics data to identify struggling students. Please complete the prediction process first! 📊`;
    }
    
    const { students } = this.analyticsData;
    const strugglingStudents = students
        .filter(s => s.exam2_avg < 60 || s.improvement < -5)
        .sort((a, b) => a.exam2_avg - b.exam2_avg)
        .slice(0, 5);
    
    if (strugglingStudents.length === 0) {
        return `🎉 Great news! No students appear to be struggling significantly. Everyone is performing well! 🌟`;
    }
    
    let response = `🔔 <strong>Students Needing Attention:</strong><br><br>`;
    strugglingStudents.forEach((student, index) => {
        response += `• <strong>Student ${student.id}:</strong> ${student.exam2_avg.toFixed(1)}% (${student.improvement >= 0 ? '+' : ''}${student.improvement.toFixed(1)}%)<br>`;
    });
    
    response += `<br>💡 <strong>Recommendations:</strong> Consider personalized tutoring, additional practice materials, or one-on-one support sessions.`;
    return response;
};

AppState.prototype.getImprovementResponse = function() {
    if (!this.analyticsData) {
        return `Upload your data first, and I'll provide detailed improvement insights! 📈`;
    }
    
    const { students, subjects } = this.analyticsData;
    const avgImprovement = students.reduce((sum, student) => sum + student.improvement, 0) / students.length;
    const improvingStudents = students.filter(s => s.improvement > 2).length;
    
    let response = `📈 <strong>Improvement Insights:</strong><br><br>`;
    response += `• <strong>Overall Improvement:</strong> ${avgImprovement >= 0 ? '+' : ''}${avgImprovement.toFixed(1)}%<br>`;
    response += `• <strong>Students Improving:</strong> ${improvingStudents} out of ${students.length}<br><br>`;
    
    // Find best improving subject
    const subjectImprovements = subjects.map(subject => {
        const improvements = students.map(student => 
            student[`exam2_${subject}`] - student[`exam1_${subject}`]
        );
        return {
            subject,
            avg: improvements.reduce((sum, imp) => sum + imp, 0) / improvements.length
        };
    });
    
    const bestSubject = subjectImprovements.sort((a, b) => b.avg - a.avg)[0];
    response += `🚀 <strong>Best Improving Subject:</strong> ${bestSubject.subject.charAt(0).toUpperCase() + bestSubject.subject.slice(1)} (+${bestSubject.avg.toFixed(1)}%)`;
    
    return response;
};

AppState.prototype.getRecommendationsResponse = function() {
    const recommendations = [
        `💡 <strong>Data-Driven Recommendations:</strong><br><br>• Focus on personalized learning paths for struggling students<br>• Implement peer tutoring with top performers<br>• Create subject-specific intervention programs<br>• Use predictive insights for early intervention<br>• Regular progress monitoring and feedback sessions`,
        `🎯 <strong>Strategic Recommendations:</strong><br><br>• Identify at-risk students early using AI predictions<br>• Develop targeted study groups for challenging subjects<br>• Implement adaptive learning technologies<br>• Create mentorship programs<br>• Use analytics to optimize teaching methods`,
        `📊 <strong>Performance Enhancement Tips:</strong><br><br>• Regular assessment and feedback cycles<br>• Subject-specific skill development programs<br>• Use of interactive learning tools<br>• Parent-teacher collaboration for struggling students<br>• Celebrate improvements to boost motivation`
    ];
    
    return recommendations[Math.floor(Math.random() * recommendations.length)];
};

AppState.prototype.getHelpResponse = function() {
    return `🤖 <strong>How I Can Help:</strong><br><br>` +
           `• <strong>Student Queries:</strong> "How is Student 123 performing?"<br>` +
           `• <strong>Analytics:</strong> "Show me the analytics summary"<br>` +
           `• <strong>Subject Analysis:</strong> "How is math performing?"<br>` +
           `• <strong>Top Performers:</strong> "Who are the top students?"<br>` +
           `• <strong>Struggling Students:</strong> "Which students need help?"<br>` +
           `• <strong>Recommendations:</strong> "What do you recommend?"<br><br>` +
           `Just ask me anything about your student performance data! 📚`;
};

AppState.prototype.getDefaultResponse = function() {
    const responses = [
        `I'm here to help with student performance analysis! Try asking about specific students, analytics summaries, or recommendations. 🤔`,
        `Hmm, I'm not sure about that. You can ask me about student performance, analytics data, top performers, or struggling students! 📊`,
        `Let me help you with student analytics! Ask me about performance trends, specific students, or recommendations for improvement. 💡`,
        `I specialize in student performance insights! Try queries like "Show analytics summary" or "How is Student 123 doing?" 🎯`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
};

AppState.prototype.escapeHtml = function(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
};
