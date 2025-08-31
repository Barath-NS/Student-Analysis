// Application State Management
class AppState {
    constructor() {
        this.exam1Data = null;
        this.exam2Data = null;
        this.modelsStatus = false;
        this.predictionsGenerated = false;
        this.currentStudent = null;
        this.theme = localStorage.getItem('theme') || 'light';
        this.analyticsData = null;
        this.init();
    }

    init() {
        this.setTheme(this.theme);
        this.bindEvents();
        this.initCharts();
        this.initChatbot();
    }

    setTheme(theme) {
        this.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        const themeIcon = document.querySelector('#themeToggle i');
        themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    toggleTheme() {
        this.setTheme(this.theme === 'light' ? 'dark' : 'light');
    }


    bindEvents() {
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchPage(e.target.dataset.page);
            });
        });

        // File uploads with drag and drop
        this.setupFileUpload('exam1Upload', 'exam1File', this.handleExam1Upload.bind(this));
        this.setupFileUpload('exam2Upload', 'exam2File', this.handleExam2Upload.bind(this));

        // Buttons
        document.getElementById('uploadExam1Btn').addEventListener('click', this.uploadExam1.bind(this));
        document.getElementById('trainModelsBtn').addEventListener('click', this.trainModels.bind(this));
        document.getElementById('predictExam2Btn').addEventListener('click', this.predictExam2.bind(this));

        // Student search
        const studentSearch = document.getElementById('studentSearch');
        studentSearch.addEventListener('input', this.debounce(this.handleSearch.bind(this), 300));
        studentSearch.addEventListener('focus', () => {
            if (studentSearch.value.trim()) {
                this.handleSearch();
            }
        });

        // Click outside to close search results
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.student-search-container')) {
                document.getElementById('searchResults').classList.add('hidden');
            }
        });
    }

    setupFileUpload(dropZoneId, fileInputId, handler) {
        const dropZone = document.getElementById(dropZoneId);
        const fileInput = document.getElementById(fileInputId);

        // File input change
        fileInput.addEventListener('change', handler);

        // Drag and drop
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileInput.files = files;
                handler({ target: { files } });
            }
        });
    }

    switchPage(pageId) {
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-page="${pageId}"]`).classList.add('active');

        // Switch pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(`${pageId}Page`).classList.add('active');
    }

    handleExam1Upload(event) {
        const file = event.target.files[0];
        if (file) {
            this.updateFileUploadUI('exam1Upload', file.name);
            document.getElementById('uploadExam1Btn').disabled = false;
        }
    }

    handleExam2Upload(event) {
        const file = event.target.files[0];
        if (file) {
            this.updateFileUploadUI('exam2Upload', file.name);
            document.getElementById('predictExam2Btn').disabled = !this.modelsStatus;
        }
    }

    updateFileUploadUI(uploadId, fileName) {
        const uploadElement = document.getElementById(uploadId);
        const textElement = uploadElement.querySelector('.file-upload-text');
        const hintElement = uploadElement.querySelector('.file-upload-hint');
        
        textElement.textContent = fileName;
        hintElement.textContent = 'File selected successfully';
        uploadElement.classList.add('file-selected');
    }

    async uploadExam1() {
        const fileInput = document.getElementById('exam1File');
        const file = fileInput.files[0];
        
        if (!file) {
            this.showToast('Please select a file first', 'error');
            return;
        }

        try {
            this.setButtonLoading('uploadExam1Btn', true);
            this.showProgress('exam1Progress', 'exam1ProgressBar');

            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/upload_exam1/', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                this.exam1Data = true;
                document.getElementById('exam1Count').textContent = result.records || 0;
                document.getElementById('trainModelsBtn').disabled = false;
                this.showToast(result.message, 'success');
            } else {
                throw new Error(result.detail || 'Upload failed');
            }
        } catch (error) {
            this.showToast(error.message, 'error');
        } finally {
            this.setButtonLoading('uploadExam1Btn', false);
            this.hideProgress('exam1Progress');
        }
    }

    async trainModels() {
        try {
            this.setButtonLoading('trainModelsBtn', true);
            this.showProgress('trainingProgress', 'trainingProgressBar');

            const response = await fetch('/train_models/', {
                method: 'POST'
            });

            const result = await response.json();

            if (response.ok) {
                this.modelsStatus = true;
                document.getElementById('modelsCount').textContent = '5/5';
                this.showToast(result.message, 'success');
                
                // Enable prediction if exam2 file is selected
                const exam2File = document.getElementById('exam2File').files[0];
                if (exam2File) {
                    document.getElementById('predictExam2Btn').disabled = false;
                }
            } else {
                throw new Error(result.detail || 'Training failed');
            }
        } catch (error) {
            this.showToast(error.message, 'error');
        } finally {
            this.setButtonLoading('trainModelsBtn', false);
            this.hideProgress('trainingProgress');
        }
    }

    async predictExam2() {
        const fileInput = document.getElementById('exam2File');
        const file = fileInput.files[0];
        
        if (!file) {
            this.showToast('Please select a file first', 'error');
            return;
        }

        try {
            this.setButtonLoading('predictExam2Btn', true);
            this.showProgress('predictionProgress', 'predictionProgressBar');

            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/predict_exam2/', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                this.predictionsGenerated = true;
                document.getElementById('predictionsCount').textContent = result.records || 0;
                this.showToast(result.message, 'success');
                
                // Enable analytics
                this.enableAnalytics();
            } else {
                throw new Error(result.detail || 'Prediction failed');
            }
        } catch (error) {
            this.showToast(error.message, 'error');
        } finally {
            this.setButtonLoading('predictExam2Btn', false);
            this.hideProgress('predictionProgress');
        }
    }

    async handleSearch() {
        const query = document.getElementById('studentSearch').value.trim();
        const resultsContainer = document.getElementById('searchResults');

        if (query.length === 0) {
            resultsContainer.classList.add('hidden');
            return;
        }

        if (!this.predictionsGenerated) {
            this.showToast('Please generate predictions first', 'info');
            return;
        }

        // For demo purposes, generate some sample student IDs
        const sampleStudents = [];
        for (let i = 1; i <= 100; i++) {
            if (i.toString().includes(query)) {
                sampleStudents.push(i);
            }
        }

        resultsContainer.innerHTML = '';
        
        if (sampleStudents.length === 0) {
            resultsContainer.innerHTML = '<div class="search-result-item">No students found</div>';
        } else {
            sampleStudents.slice(0, 10).forEach(studentId => {
                const item = document.createElement('div');
                item.className = 'search-result-item';
                item.textContent = `Student ${studentId}`;
                item.addEventListener('click', () => {
                    this.selectStudent(studentId);
                    resultsContainer.classList.add('hidden');
                });
                resultsContainer.appendChild(item);
            });
        }

        resultsContainer.classList.remove('hidden');
    }

    async selectStudent(studentId) {
        try {
            document.getElementById('studentSearch').value = `Student ${studentId}`;
            
            const response = await fetch(`/student_marks_data/${studentId}`);
            const data = await response.json();

            if (response.ok) {
                this.displayStudentData(studentId, data);
            } else {
                throw new Error(data.detail || 'Failed to fetch student data');
            }
        } catch (error) {
            this.showToast(error.message, 'error');
        }
    }

    displayStudentData(studentId, data) {
        this.currentStudent = { id: studentId, data };
        
        // Update title
        document.getElementById('studentTitle').textContent = `Student ${studentId} Performance`;
        
        // Update chart
        this.updatePerformanceChart(data);
        
        // Update table
        this.updateMarksTable(data);
        
        // Generate insights
        this.generateInsights(data);
        
        // Show student details
        document.getElementById('studentDetails').classList.remove('hidden');
    }

    generateInsights(data) {
        const insights = [];
        const subjects = Object.keys(data.exam1);
        
        let totalImprovement = 0;
        let improvingSubjects = 0;

        subjects.forEach(subject => {
            const difference = data.exam2[subject] - data.exam1[subject];
            totalImprovement += difference;
            
            if (difference > 5) {
                improvingSubjects++;
                insights.push(`📈 <strong>Strong improvement predicted in ${subject}</strong> (+${difference.toFixed(1)}%)`);
            } else if (difference < -5) {
                insights.push(`📉 <strong>Attention needed in ${subject}</strong> (${difference.toFixed(1)}%)`);
            }
        });

        const avgImprovement = totalImprovement / subjects.length;
        
        if (avgImprovement > 2) {
            insights.unshift(`🎉 <strong>Overall positive trend!</strong> Average improvement: +${avgImprovement.toFixed(1)}%`);
        } else if (avgImprovement < -2) {
            insights.unshift(`⚠️ <strong>Needs attention.</strong> Average decline: ${avgImprovement.toFixed(1)}%`);
        } else {
            insights.unshift(`📊 <strong>Stable performance expected.</strong> Average change: ${avgImprovement.toFixed(1)}%`);
        }

        const insightsContainer = document.getElementById('performanceInsights');
        insightsContainer.innerHTML = `
            <div style="line-height: 1.8;">
                ${insights.map(insight => `<p style="margin-bottom: 0.75rem;">${insight}</p>`).join('')}
            </div>
        `;
    }

    initCharts() {
        Chart.defaults.font.family = 'Inter';
        Chart.defaults.color = '#64748b';
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.app = new AppState();
});
