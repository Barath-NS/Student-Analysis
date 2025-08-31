// Utility Functions Extension for AppState

AppState.prototype.showProgress = function(containerId, barId) {
    const container = document.getElementById(containerId);
    const bar = document.getElementById(barId);
    container.classList.remove('hidden');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        bar.style.width = progress + '%';
        
        if (progress >= 100) {
            clearInterval(interval);
        }
    }, 200);
};

AppState.prototype.hideProgress = function(containerId) {
    setTimeout(() => {
        document.getElementById(containerId).classList.add('hidden');
    }, 1000);
};

AppState.prototype.setButtonLoading = function(buttonId, loading) {
    const button = document.getElementById(buttonId);
    if (loading) {
        button.disabled = true;
        button.classList.add('loading');
        const text = button.textContent;
        button.setAttribute('data-original-text', text);
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    } else {
        button.disabled = false;
        button.classList.remove('loading');
        const originalText = button.getAttribute('data-original-text');
        button.innerHTML = originalText;
    }
};

AppState.prototype.showToast = function(message, type = 'info', duration = 5000) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle'
    };

    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6'
    };

    toast.innerHTML = `
        <i class="${icons[type]}" style="color: ${colors[type]};"></i>
        <div style="flex: 1;">
            <div style="font-weight: 600; margin-bottom: 0.25rem;">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
            <div style="font-size: 0.875rem; color: var(--text-secondary);">${message}</div>
        </div>
        <button onclick="this.parentNode.remove()" style="background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 1.125rem; padding: 0.25rem;">
            <i class="fas fa-times"></i>
        </button>
    `;

    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, duration);

    document.getElementById('toastContainer').appendChild(toast);
};

AppState.prototype.debounce = function(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};
