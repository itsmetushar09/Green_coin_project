// Charts and Data Visualization for Green Coins Platform

class ChartsManager {
    constructor() {
        this.charts = {};
        this.colors = {
            primary: '#10B981',
            secondary: '#3B82F6',
            accent: '#8B5CF6',
            warning: '#F59E0B',
            danger: '#EF4444',
            success: '#10B981'
        };
        
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeCharts());
        } else {
            this.initializeCharts();
        }
    }

    initializeCharts() {
        this.createImpactChart();
        this.createNetworkChart();
        this.createLeaderboardChart();
        this.createChallengeProgress();
        this.createRealTimeMetrics();
        
        // Update charts periodically
        this.startChartUpdates();
    }

    createImpactChart() {
        const ctx = document.getElementById('impact-chart');
        if (!ctx) return;

        const config = {
            type: 'doughnut',
            data: {
                labels: ['CO₂ Saved', 'Devices Recycled', 'Energy Conserved', 'Water Saved'],
                datasets: [{
                    label: 'Environmental Impact',
                    data: [35, 25, 20, 20],
                    backgroundColor: [
                        this.colors.primary,
                        this.colors.secondary,
                        this.colors.accent,
                        this.colors.warning
                    ],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                size: 12,
                                family: 'Inter'
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const label = context.label || '';
                                const value = context.parsed;
                                return `${label}: ${value}%`;
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    duration: 1000
                }
            }
        };

        this.charts.impact = new Chart(ctx, config);
    }

    createNetworkChart() {
        const ctx = document.getElementById('network-chart');
        if (!ctx) return;

        const hours = [];
        const activeKiosks = [];
        const devicesRecycled = [];
        
        // Generate data for last 24 hours
        for (let i = 0; i < 24; i++) {
            hours.push(String(i).padStart(2, '0') + ':00');
            activeKiosks.push(Math.floor(Math.random() * 8) + 7); // 7-15 kiosks
            devicesRecycled.push(Math.floor(Math.random() * 50) + 10); // 10-60 devices
        }

        const config = {
            type: 'line',
            data: {
                labels: hours,
                datasets: [
                    {
                        label: 'Active Kiosks',
                        data: activeKiosks,
                        borderColor: this.colors.primary,
                        backgroundColor: this.colors.primary + '20',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 3,
                        pointHoverRadius: 6
                    },
                    {
                        label: 'Devices Recycled',
                        data: devicesRecycled,
                        borderColor: this.colors.secondary,
                        backgroundColor: this.colors.secondary + '20',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 3,
                        pointHoverRadius: 6,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            font: {
                                family: 'Inter'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleFont: {
                            family: 'Inter'
                        },
                        bodyFont: {
                            family: 'Inter'
                        }
                    }
                },
                scales: {
                    x: {
                        display: true,
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                family: 'Inter'
                            }
                        }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Active Kiosks'
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        ticks: {
                            font: {
                                family: 'Inter'
                            }
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Devices Recycled'
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
                        ticks: {
                            font: {
                                family: 'Inter'
                            }
                        }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeInOutQuart'
                }
            }
        };

        this.charts.network = new Chart(ctx, config);
    }

    createLeaderboardChart() {
        // Create a horizontal bar chart for leaderboard if canvas exists
        const ctx = document.getElementById('leaderboard-chart');
        if (!ctx) return;

        const config = {
            type: 'bar',
            data: {
                labels: ['Alex Chen', 'Sarah Kim', 'Mike Rodriguez', 'Emma Wilson', 'David Lee'],
                datasets: [{
                    label: 'Green Coins',
                    data: [2840, 2650, 2180, 1120, 980],
                    backgroundColor: [
                        this.colors.warning,   // Gold
                        '#C0C0C0',            // Silver
                        '#CD7F32',            // Bronze
                        this.colors.secondary,
                        this.colors.accent
                    ],
                    borderRadius: 8,
                    borderSkipped: false,
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `${context.parsed.x} Green Coins`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                family: 'Inter'
                            }
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                family: 'Inter'
                            }
                        }
                    }
                },
                animation: {
                    duration: 1200,
                    easing: 'easeOutBounce'
                }
            }
        };

        this.charts.leaderboard = new Chart(ctx, config);
    }

    createChallengeProgress() {
        // Create progress charts for challenges if canvas exists
        const ctx = document.getElementById('challenge-progress-chart');
        if (!ctx) return;

        const config = {
            type: 'radar',
            data: {
                labels: ['Devices', 'CO₂ Saved', 'Coins Earned', 'Days Active', 'Social Impact'],
                datasets: [{
                    label: 'Your Progress',
                    data: [65, 80, 70, 85, 60],
                    backgroundColor: this.colors.primary + '40',
                    borderColor: this.colors.primary,
                    borderWidth: 2,
                    pointBackgroundColor: this.colors.primary,
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: this.colors.primary
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                elements: {
                    line: {
                        borderWidth: 3
                    }
                },
                scales: {
                    r: {
                        angleLines: {
                            display: true
                        },
                        suggestedMin: 0,
                        suggestedMax: 100,
                        ticks: {
                            font: {
                                family: 'Inter'
                            }
                        },
                        pointLabels: {
                            font: {
                                family: 'Inter'
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                },
                animation: {
                    duration: 1500,
                    easing: 'easeOutElastic'
                }
            }
        };

        this.charts.challenge = new Chart(ctx, config);
    }

    createRealTimeMetrics() {
        // Create real-time metrics chart
        const ctx = document.getElementById('realtime-metrics-chart');
        if (!ctx) return;

        const config = {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Coins per Minute',
                        data: [],
                        borderColor: this.colors.primary,
                        backgroundColor: this.colors.primary + '20',
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Devices per Minute',
                        data: [],
                        borderColor: this.colors.secondary,
                        backgroundColor: this.colors.secondary + '20',
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'minute'
                        },
                        display: true,
                        ticks: {
                            maxTicksLimit: 10,
                            font: {
                                family: 'Inter'
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            font: {
                                family: 'Inter'
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            font: {
                                family: 'Inter'
                            }
                        }
                    }
                },
                animation: {
                    duration: 500
                }
            }
        };

        this.charts.realtime = new Chart(ctx, config);
        
        // Start real-time updates
        this.startRealtimeUpdates();
    }

    startRealtimeUpdates() {
        if (!this.charts.realtime) return;

        setInterval(() => {
            const now = new Date();
            const coinsPerMinute = Math.floor(Math.random() * 100) + 50;
            const devicesPerMinute = Math.floor(Math.random() * 10) + 2;

            // Add new data
            this.charts.realtime.data.labels.push(now);
            this.charts.realtime.data.datasets[0].data.push(coinsPerMinute);
            this.charts.realtime.data.datasets[1].data.push(devicesPerMinute);

            // Keep only last 20 data points
            if (this.charts.realtime.data.labels.length > 20) {
                this.charts.realtime.data.labels.shift();
                this.charts.realtime.data.datasets[0].data.shift();
                this.charts.realtime.data.datasets[1].data.shift();
            }

            this.charts.realtime.update('none');
        }, 5000); // Update every 5 seconds
    }

    startChartUpdates() {
        // Update charts periodically with new data
        setInterval(() => {
            this.updateImpactChart();
            this.updateNetworkChart();
        }, 30000); // Update every 30 seconds
    }

    updateImpactChart() {
        if (!this.charts.impact) return;

        // Generate new data with slight variations
        const currentData = this.charts.impact.data.datasets[0].data;
        const newData = currentData.map(value => {
            const variation = (Math.random() - 0.5) * 5; // ±2.5% variation
            return Math.max(5, Math.min(50, value + variation));
        });

        this.charts.impact.data.datasets[0].data = newData;
        this.charts.impact.update();
    }

    updateNetworkChart() {
        if (!this.charts.network) return;

        // Add new data point and remove oldest
        const newActiveKiosks = Math.floor(Math.random() * 8) + 7;
        const newDevicesRecycled = Math.floor(Math.random() * 50) + 10;
        const now = new Date();
        const timeLabel = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');

        this.charts.network.data.labels.push(timeLabel);
        this.charts.network.data.datasets[0].data.push(newActiveKiosks);
        this.charts.network.data.datasets[1].data.push(newDevicesRecycled);

        // Keep only last 24 data points
        if (this.charts.network.data.labels.length > 24) {
            this.charts.network.data.labels.shift();
            this.charts.network.data.datasets[0].data.shift();
            this.charts.network.data.datasets[1].data.shift();
        }

        this.charts.network.update();
    }

    // Utility method to create animated counters
    createAnimatedCounter(element, endValue, duration = 2000, suffix = '') {
        if (!element) return;

        const startValue = 0;
        const increment = endValue / (duration / 16); // 60 FPS
        let currentValue = startValue;

        const timer = setInterval(() => {
            currentValue += increment;
            
            if (currentValue >= endValue) {
                currentValue = endValue;
                clearInterval(timer);
            }
            
            element.textContent = Math.floor(currentValue).toLocaleString() + suffix;
        }, 16);
    }

    // Method to animate progress bars
    animateProgressBar(element, percentage, duration = 1000) {
        if (!element) return;

        let currentWidth = 0;
        const increment = percentage / (duration / 16);

        const timer = setInterval(() => {
            currentWidth += increment;
            
            if (currentWidth >= percentage) {
                currentWidth = percentage;
                clearInterval(timer);
            }
            
            element.style.width = currentWidth + '%';
        }, 16);
    }

    // Method to create sparkline charts
    createSparkline(canvas, data, color = '#10B981') {
        if (!canvas) return;

        const config = {
            type: 'line',
            data: {
                labels: data.map((_, i) => i),
                datasets: [{
                    data: data,
                    borderColor: color,
                    backgroundColor: color + '20',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { display: false },
                    y: { display: false }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                },
                elements: {
                    point: { radius: 0 }
                }
            }
        };

        return new Chart(canvas, config);
    }

    // Destroy all charts
    destroy() {
        Object.values(this.charts).forEach(chart => {
            if (chart) chart.destroy();
        });
        this.charts = {};
    }
}

// Initialize charts when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const chartsManager = new ChartsManager();
    
    // Make charts manager globally accessible
    window.chartsManager = chartsManager;
    
    // Create animated counters for stats
    const statsElements = [
        { element: document.getElementById('active-users'), value: 10247, suffix: '+' },
        { element: document.getElementById('co2-impact'), value: 2.5, suffix: ' Tons' },
        { element: document.getElementById('total-co2'), value: 1248, suffix: '' }
    ];
    
    // Animate counters when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stat = statsElements.find(s => s.element === entry.target);
                if (stat) {
                    chartsManager.createAnimatedCounter(stat.element, stat.value, 2000, stat.suffix);
                    observer.unobserve(entry.target);
                }
            }
        });
    }, { threshold: 0.5 });
    
    statsElements.forEach(stat => {
        if (stat.element) observer.observe(stat.element);
    });
});