// NCI Shipments Record System - Main Application

document.addEventListener('DOMContentLoaded', function() {
    // ==================== APPLICATION STATE ====================
    let currentUser = null;
    let users = [];
    let bags = [];
    let currentBag = null;
    let activities = [];
    let systemSettings = {
        theme: 'light',
        cnValidation: true,
        autoBackup: true,
        activityLogging: true
    };

    // ==================== DEFAULT DATA ====================
    const defaultUsers = [
        {
            username: '17453.sajjad',
            password: '709709',
            name: 'Sajjad Ali',
            designation: 'Branch Assistant',
            role: 'admin',
            lastLogin: null
        },
        {
            username: '15831.naeem',
            password: '1213',
            name: 'Naeem Ahmed',
            designation: 'Debriefing Assistant',
            role: 'admin',
            lastLogin: null
        },
        {
            username: '10933.zulfiqar',
            password: '10933',
            name: 'Zulfiqar Ali',
            designation: 'Branch Manager',
            role: 'user',
            lastLogin: null
        }
    ];

    const defaultBags = [
        {
            id: 'BAG#001',
            cnCount: 5,
            created: '2023-10-15T09:30:00',
            updated: '2023-10-15T14:45:00',
            cns: [
                { cn: '12345-67-890123456', timestamp: '2023-10-15T09:32:15', status: 'Scanned' },
                { cn: '98765432101234', timestamp: '2023-10-15T09:45:22', status: 'Scanned' },
                { cn: '54321-98-765432109', timestamp: '2023-10-15T10:15:03', status: 'Scanned' },
                { cn: '12345678901234', timestamp: '2023-10-15T11:20:45', status: 'Scanned' },
                { cn: '67890-12-345678901', timestamp: '2023-10-15T14:42:18', status: 'Scanned' }
            ]
        },
        {
            id: 'BAG#002',
            cnCount: 3,
            created: '2023-10-16T10:15:00',
            updated: '2023-10-16T11:30:00',
            cns: [
                { cn: '34567-89-012345678', timestamp: '2023-10-16T10:18:32', status: 'Scanned' },
                { cn: '23456789012345', timestamp: '2023-10-16T10:45:11', status: 'Scanned' },
                { cn: '78901-23-456789012', timestamp: '2023-10-16T11:28:47', status: 'Scanned' }
            ]
        }
    ];

    // ==================== DOM ELEMENTS ====================
    // Login elements
    const loginScreen = document.getElementById('loginScreen');
    const dashboard = document.getElementById('dashboard');
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    
    // Dashboard elements
    const logoutBtn = document.getElementById('logoutBtn');
    const currentUsernameEl = document.getElementById('currentUsername');
    const currentDesignationEl = document.getElementById('currentDesignation');
    const currentRoleEl = document.getElementById('currentRole');
    
    // Sidebar navigation
    const sidebarItems = document.querySelectorAll('.sidebar-nav li');
    const contentSections = document.querySelectorAll('.content-section');
    
    // Dashboard section
    const totalBagsEl = document.getElementById('totalBags');
    const totalCNsEl = document.getElementById('totalCNs');
    const totalUsersEl = document.getElementById('totalUsers');
    const todayActivityEl = document.getElementById('todayActivity');
    const recentBagsTable = document.querySelector('#recentBagsTable tbody');
    const refreshBtn = document.getElementById('refreshBtn');
    const permissionSummaryEl = document.getElementById('permissionSummary');
    
    // Scan section
    const scanSection = document.getElementById('scanSection');
    const scanSectionContent = document.getElementById('scanSectionContent');
    const cnInput = document.getElementById('cnInput');
    const currentBagNumberEl = document.getElementById('currentBagNumber');
    const currentBagCountEl = document.getElementById('currentBagCount');
    const saveBagBtn = document.getElementById('saveBagBtn');
    const newBagBtn = document.getElementById('newBagBtn');
    const currentCNTable = document.querySelector('#currentCNTable tbody');
    
    // Bags section
    const bagsSection = document.querySelector('[data-section="bags"]');
    const allBagsTable = document.querySelector('#allBagsTable tbody');
    const deleteAllBagsBtn = document.getElementById('deleteAllBagsBtn');
    const exportBagsBtn = document.getElementById('exportBagsBtn');
    const filterBagsInput = document.getElementById('filterBags');
    const bagDetailsCard = document.getElementById('bagDetailsCard');
    const detailBagNumberEl = document.getElementById('detailBagNumber');
    const detailTotalCNsEl = document.getElementById('detailTotalCNs');
    const detailCreatedEl = document.getElementById('detailCreated');
    const detailUpdatedEl = document.getElementById('detailUpdated');
    const bagDetailTable = document.querySelector('#bagDetailTable tbody');
    const exportBagBtn = document.getElementById('exportBagBtn');
    const deleteBagBtn = document.getElementById('deleteBagBtn');
    const closeDetailsBtn = document.getElementById('closeDetailsBtn');
    
    // Users section
    const usersSection = document.getElementById('usersSection');
    const usersSectionContent = document.getElementById('usersSectionContent');
    const addUserBtn = document.getElementById('addUserBtn');
    const usersTable = document.querySelector('#usersTable tbody');
    const filterUsersInput = document.getElementById('filterUsers');
    const userModal = document.getElementById('userModal');
    const modalTitle = document.getElementById('modalTitle');
    const userForm = document.getElementById('userForm');
    const modalUsername = document.getElementById('modalUsername');
    const modalName = document.getElementById('modalName');
    const modalDesignation = document.getElementById('modalDesignation');
    const modalRole = document.getElementById('modalRole');
    const modalPassword = document.getElementById('modalPassword');
    const modalConfirmPassword = document.getElementById('modalConfirmPassword');
    const saveUserBtn = document.getElementById('saveUserBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelModalBtn = document.getElementById('cancelModalBtn');
    
    // Reports section
    const reportsSection = document.querySelector('[data-section="reports"]');
    const generateReportBtn = document.getElementById('generateReportBtn');
    const totalBagsChartEl = document.getElementById('totalBagsChart');
    const avgCNsPerBagEl = document.getElementById('avgCNsPerBag');
    const latestBagEl = document.getElementById('latestBag');
    const exportButtons = document.querySelectorAll('.export-btn');
    
    // Settings section
    const settingsSection = document.getElementById('settingsSection');
    const settingsSectionContent = document.getElementById('settingsSectionContent');
    const changePasswordForm = document.getElementById('changePasswordForm');
    const themeOptions = document.querySelectorAll('.theme-option');
    const systemSettingsCard = document.getElementById('systemSettingsCard');
    const saveSystemSettingsBtn = document.getElementById('saveSystemSettingsBtn');
    
    // Search
    const searchInput = document.getElementById('searchInput');
    const searchModal = document.getElementById('searchModal');
    const closeSearchModalBtn = document.getElementById('closeSearchModalBtn');
    const searchResultsContent = document.getElementById('searchResultsContent');
    
    // Activity list
    const activityList = document.getElementById('activityList');
    
    // ==================== UTILITY FUNCTIONS ====================
    
    // Format date to readable string
    function formatDate(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    // Format time ago
    function timeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        
        if (seconds < 60) return 'just now';
        
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
        
        return formatDate(dateString);
    }
    
    // Show toast notification
    function showToast(type, title, message) {
        const toastContainer = document.getElementById('toastContainer');
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'error') icon = 'exclamation-circle';
        if (type === 'warning') icon = 'exclamation-triangle';
        
        toast.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <i class="fas fa-times close-toast" style="cursor: pointer;"></i>
        `;
        
        toastContainer.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (toast.parentNode) toastContainer.removeChild(toast);
                }, 300);
            }
        }, 5000);
        
        // Close button
        toast.querySelector('.close-toast').addEventListener('click', () => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) toastContainer.removeChild(toast);
            }, 300);
        });
    }
    
    // Validate CN format
    function validateCN(cn) {
        // Remove any hyphens for validation
        const cleanCN = cn.replace(/-/g, '');
        
        // Check if it's all numeric
        if (!/^\d+$/.test(cleanCN)) {
            return { valid: false, message: 'CN must contain only numbers' };
        }
        
        // Check for 14-digit format
        if (cleanCN.length === 14) {
            return { valid: true, formatted: cleanCN };
        }
        
        // Check for 5-2-9 format
        if (cn.includes('-')) {
            const parts = cn.split('-');
            if (parts.length === 3 && parts[0].length === 5 && parts[1].length === 2 && parts[2].length === 9) {
                return { valid: true, formatted: cn };
            }
        }
        
        return { valid: false, message: 'Invalid CN format. Use 00000-00-000000000 or 14 digits' };
    }
    
    // Generate next bag ID
    function generateNextBagId() {
        if (bags.length === 0) return 'BAG#001';
        
        const lastBag = bags[bags.length - 1];
        const lastNumber = parseInt(lastBag.id.replace('BAG#', ''));
        const nextNumber = (lastNumber + 1).toString().padStart(3, '0');
        return `BAG#${nextNumber}`;
    }
    
    // Add activity log
    function addActivity(action, details) {
        const activity = {
            id: Date.now(),
            user: currentUser.username,
            action,
            details,
            timestamp: new Date().toISOString()
        };
        
        activities.unshift(activity);
        
        // Keep only last 50 activities
        if (activities.length > 50) {
            activities = activities.slice(0, 50);
        }
        
        // Save to localStorage
        saveToLocalStorage();
        
        // Update activity list
        updateActivityList();
        
        // Update today's activity count
        updateDashboardStats();
    }
    
    // Update activity list in sidebar
    function updateActivityList() {
        activityList.innerHTML = '';
        
        // Show only last 5 activities
        const recentActivities = activities.slice(0, 5);
        
        recentActivities.forEach(activity => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas fa-circle" style="font-size: 6px;"></i> ${activity.action} - ${timeAgo(activity.timestamp)}`;
            activityList.appendChild(li);
        });
    }
    
    // Save data to localStorage
    function saveToLocalStorage() {
        const data = {
            users,
            bags,
            activities,
            systemSettings
        };
        
        localStorage.setItem('nciShipmentsData', JSON.stringify(data));
    }
    
    // Load data from localStorage
    function loadFromLocalStorage() {
        const savedData = localStorage.getItem('nciShipmentsData');
        
        if (savedData) {
            const data = JSON.parse(savedData);
            users = data.users || defaultUsers;
            bags = data.bags || defaultBags;
            activities = data.activities || [];
            systemSettings = data.systemSettings || {
                theme: 'light',
                cnValidation: true,
                autoBackup: true,
                activityLogging: true
            };
        } else {
            // Initialize with default data
            users = [...defaultUsers];
            bags = [...defaultBags];
            activities = [];
            
            // Add initial activities
            addActivity('System initialized', 'NCI Shipments Record System started');
            addActivity('Default data loaded', 'System loaded with default bags and users');
        }
        
        // Apply saved theme
        applyTheme(systemSettings.theme);
        
        // Update UI with loaded data
        updateDashboardStats();
        updateRecentBagsTable();
        updateAllBagsTable();
        updateUsersTable();
        updateActivityList();
    }
    
    // Apply theme
    function applyTheme(theme) {
        systemSettings.theme = theme;
        
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
        
        // Update theme buttons
        themeOptions.forEach(btn => {
            if (btn.dataset.theme === theme) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        saveToLocalStorage();
    }
    
    // ==================== DASHBOARD FUNCTIONS ====================
    
    // Update dashboard statistics
    function updateDashboardStats() {
        // Total bags
        totalBagsEl.textContent = bags.length;
        
        // Total CNs
        const totalCNs = bags.reduce((sum, bag) => sum + bag.cnCount, 0);
        totalCNsEl.textContent = totalCNs;
        
        // Total users
        totalUsersEl.textContent = users.length;
        
        // Today's activity
        const today = new Date().toDateString();
        const todayActivities = activities.filter(activity => {
            const activityDate = new Date(activity.timestamp).toDateString();
            return activityDate === today;
        });
        todayActivityEl.textContent = todayActivities.length;
        
        // Permission summary
        if (currentUser) {
            permissionSummaryEl.textContent = currentUser.role === 'admin' ? 'Full Access' : 'View Only';
        }
        
        // Update chart stats
        totalBagsChartEl.textContent = bags.length;
        avgCNsPerBagEl.textContent = bags.length > 0 ? (totalCNs / bags.length).toFixed(1) : '0';
        latestBagEl.textContent = bags.length > 0 ? bags[bags.length - 1].id : '-';
        
        // Update chart if it exists
        updateChart();
    }
    
    // Update recent bags table
    function updateRecentBagsTable() {
        recentBagsTable.innerHTML = '';
        
        // Show only recent 5 bags
        const recentBags = bags.slice(-5).reverse();
        
        recentBags.forEach(bag => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${bag.id}</td>
                <td>${bag.cnCount}</td>
                <td>${timeAgo(bag.updated)}</td>
                <td>
                    <button class="btn-icon view-bag-btn" data-bag-id="${bag.id}" title="View Bag">
                        <i class="fas fa-eye"></i>
                    </button>
                    ${currentUser && currentUser.role === 'admin' ? `
                        <button class="btn-icon delete-bag-btn" data-bag-id="${bag.id}" title="Delete Bag">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </td>
            `;
            
            recentBagsTable.appendChild(row);
        });
        
        // Add event listeners to buttons
        document.querySelectorAll('.view-bag-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const bagId = this.dataset.bagId;
                showBagDetails(bagId);
                // Switch to bags section
                switchSection('bags');
            });
        });
        
        document.querySelectorAll('.delete-bag-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const bagId = this.dataset.bagId;
                deleteBag(bagId);
            });
        });
    }
    
    // Update all bags table
    function updateAllBagsTable() {
        allBagsTable.innerHTML = '';
        
        bags.forEach(bag => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${bag.id}</td>
                <td>${bag.cnCount}</td>
                <td>${formatDate(bag.created)}</td>
                <td>${formatDate(bag.updated)}</td>
                <td>
                    <button class="btn-icon view-bag-details-btn" data-bag-id="${bag.id}" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    ${currentUser && currentUser.role === 'admin' ? `
                        <button class="btn-icon delete-single-bag-btn" data-bag-id="${bag.id}" title="Delete Bag">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </td>
            `;
            
            allBagsTable.appendChild(row);
        });
        
        // Add event listeners
        document.querySelectorAll('.view-bag-details-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const bagId = this.dataset.bagId;
                showBagDetails(bagId);
            });
        });
        
        document.querySelectorAll('.delete-single-bag-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const bagId = this.dataset.bagId;
                deleteBag(bagId);
            });
        });
    }
    
    // ==================== BAG MANAGEMENT FUNCTIONS ====================
    
    // Initialize new bag for scanning
    function initializeNewBag() {
        const bagId = generateNextBagId();
        
        currentBag = {
            id: bagId,
            cnCount: 0,
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            cns: []
        };
        
        currentBagNumberEl.textContent = bagId;
        currentBagCountEl.textContent = '0';
        
        // Clear CN table
        currentCNTable.innerHTML = '<tr><td colspan="5" class="text-center">No CNs scanned yet</td></tr>';
        
        showToast('info', 'New Bag Created', `Ready to scan CNs for ${bagId}`);
    }
    
    // Add CN to current bag
    function addCNToCurrentBag(cn) {
        if (!currentBag) {
            showToast('error', 'No Active Bag', 'Please create a new bag first');
            return;
        }
        
        // Validate CN
        if (systemSettings.cnValidation) {
            const validation = validateCN(cn);
            if (!validation.valid) {
                showToast('error', 'Invalid CN', validation.message);
                cnInput.classList.add('error');
                setTimeout(() => cnInput.classList.remove('error'), 1000);
                return;
            }
            cn = validation.formatted;
        }
        
        // Check for duplicate in current bag
        const isDuplicate = currentBag.cns.some(item => item.cn === cn);
        if (isDuplicate) {
            showToast('warning', 'Duplicate CN', 'This CN is already in the current bag');
            cnInput.classList.add('error');
            setTimeout(() => cnInput.classList.remove('error'), 1000);
            return;
        }
        
        // Add CN to current bag
        const timestamp = new Date().toISOString();
        currentBag.cns.push({
            cn,
            timestamp,
            status: 'Scanned'
        });
        
        currentBag.cnCount = currentBag.cns.length;
        currentBag.updated = timestamp;
        
        // Update UI
        currentBagCountEl.textContent = currentBag.cnCount;
        updateCurrentCNTable();
        
        // Clear input and focus
        cnInput.value = '';
        cnInput.focus();
        
        // Add activity
        addActivity('CN Scanned', `Added CN ${cn} to ${currentBag.id}`);
        
        showToast('success', 'CN Added', `CN ${cn} added to ${currentBag.id}`);
    }
    
    // Update current CN table
    function updateCurrentCNTable() {
        currentCNTable.innerHTML = '';
        
        if (currentBag.cns.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="5" class="text-center">No CNs scanned yet</td>';
            currentCNTable.appendChild(row);
            return;
        }
        
        currentBag.cns.forEach((cn, index) => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${cn.cn}</td>
                <td>${formatDate(cn.timestamp)}</td>
                <td><span class="status-indicator active"></span> ${cn.status}</td>
                <td>
                    <button class="btn-icon remove-cn-btn" data-cn-index="${index}" title="Remove CN">
                        <i class="fas fa-times"></i>
                    </button>
                </td>
            `;
            
            currentCNTable.appendChild(row);
        });
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-cn-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.cnIndex);
                removeCNFromCurrentBag(index);
            });
        });
    }
    
    // Remove CN from current bag
    function removeCNFromCurrentBag(index) {
        if (!currentBag || index < 0 || index >= currentBag.cns.length) return;
        
        const removedCN = currentBag.cns[index].cn;
        currentBag.cns.splice(index, 1);
        currentBag.cnCount = currentBag.cns.length;
        currentBag.updated = new Date().toISOString();
        
        // Update UI
        currentBagCountEl.textContent = currentBag.cnCount;
        updateCurrentCNTable();
        
        addActivity('CN Removed', `Removed CN ${removedCN} from ${currentBag.id}`);
        showToast('info', 'CN Removed', `CN ${removedCN} removed from current bag`);
    }
    
    // Save current bag
    function saveCurrentBag() {
        if (!currentBag || currentBag.cns.length === 0) {
            showToast('warning', 'Empty Bag', 'Cannot save an empty bag');
            return;
        }
        
        // Check if bag already exists (for editing)
        const existingIndex = bags.findIndex(bag => bag.id === currentBag.id);
        
        if (existingIndex >= 0) {
            // Update existing bag
            bags[existingIndex] = { ...currentBag };
            showToast('success', 'Bag Updated', `${currentBag.id} has been updated`);
        } else {
            // Add new bag
            bags.push({ ...currentBag });
            showToast('success', 'Bag Saved', `${currentBag.id} has been saved with ${currentBag.cnCount} CNs`);
        }
        
        // Update UI
        updateDashboardStats();
        updateRecentBagsTable();
        updateAllBagsTable();
        
        // Add activity
        addActivity('Bag Saved', `${currentBag.id} with ${currentBag.cnCount} CNs`);
        
        // Save to localStorage
        saveToLocalStorage();
        
        // Initialize new bag
        initializeNewBag();
    }
    
    // Show bag details
    function showBagDetails(bagId) {
        const bag = bags.find(b => b.id === bagId);
        if (!bag) {
            showToast('error', 'Bag Not Found', `Bag ${bagId} not found`);
            return;
        }
        
        // Update details
        detailBagNumberEl.textContent = bag.id;
        detailTotalCNsEl.textContent = bag.cnCount;
        detailCreatedEl.textContent = formatDate(bag.created);
        detailUpdatedEl.textContent = formatDate(bag.updated);
        
        // Update CN table
        bagDetailTable.innerHTML = '';
        
        bag.cns.forEach((cn, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${cn.cn}</td>
                <td>${formatDate(cn.timestamp)}</td>
                <td><span class="status-indicator active"></span> ${cn.status}</td>
            `;
            bagDetailTable.appendChild(row);
        });
        
        // Show bag details card
        bagDetailsCard.style.display = 'block';
        
        // Scroll to details card
        bagDetailsCard.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Delete bag
    function deleteBag(bagId) {
        if (!confirm(`Are you sure you want to delete ${bagId}? This action cannot be undone.`)) {
            return;
        }
        
        const bagIndex = bags.findIndex(bag => bag.id === bagId);
        if (bagIndex === -1) {
            showToast('error', 'Bag Not Found', `Bag ${bagId} not found`);
            return;
        }
        
        const deletedBag = bags.splice(bagIndex, 1)[0];
        
        // Update UI
        updateDashboardStats();
        updateRecentBagsTable();
        updateAllBagsTable();
        
        // Hide details if showing this bag
        if (bagDetailsCard.style.display === 'block' && detailBagNumberEl.textContent === bagId) {
            bagDetailsCard.style.display = 'none';
        }
        
        // Add activity
        addActivity('Bag Deleted', `${bagId} with ${deletedBag.cnCount} CNs`);
        
        // Save to localStorage
        saveToLocalStorage();
        
        showToast('success', 'Bag Deleted', `${bagId} has been deleted`);
    }
    
    // Delete all bags
    function deleteAllBags() {
        if (!confirm('Are you sure you want to delete ALL bags? This action cannot be undone.')) {
            return;
        }
        
        const bagCount = bags.length;
        bags = [];
        
        // Update UI
        updateDashboardStats();
        updateRecentBagsTable();
        updateAllBagsTable();
        
        // Hide details card
        bagDetailsCard.style.display = 'none';
        
        // Add activity
        addActivity('All Bags Deleted', `${bagCount} bags removed from system`);
        
        // Save to localStorage
        saveToLocalStorage();
        
        showToast('success', 'All Bags Deleted', `${bagCount} bags have been deleted`);
    }
    
    // ==================== USER MANAGEMENT FUNCTIONS ====================
    
    // Update users table
    function updateUsersTable() {
        usersTable.innerHTML = '';
        
        users.forEach(user => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${user.username}</td>
                <td>${user.name}</td>
                <td>${user.designation}</td>
                <td><span class="role-badge" data-role="${user.role}">${user.role}</span></td>
                <td>${user.lastLogin ? timeAgo(user.lastLogin) : 'Never'}</td>
                <td>
                    ${currentUser && currentUser.role === 'admin' ? `
                        <button class="btn-icon edit-user-btn" data-username="${user.username}" title="Edit User">
                            <i class="fas fa-edit"></i>
                        </button>
                        ${user.username !== currentUser.username ? `
                            <button class="btn-icon delete-user-btn" data-username="${user.username}" title="Delete User">
                                <i class="fas fa-trash"></i>
                            </button>
                        ` : ''}
                    ` : ''}
                </td>
            `;
            
            usersTable.appendChild(row);
        });
        
        // Add event listeners
        if (currentUser && currentUser.role === 'admin') {
            document.querySelectorAll('.edit-user-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const username = this.dataset.username;
                    openUserModal(username);
                });
            });
            
            document.querySelectorAll('.delete-user-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const username = this.dataset.username;
                    deleteUser(username);
                });
            });
        }
    }
    
    // Open user modal for add/edit
    function openUserModal(username = null) {
        if (username) {
            // Edit mode
            const user = users.find(u => u.username === username);
            if (!user) return;
            
            modalTitle.textContent = 'Edit User';
            modalUsername.value = user.username;
            modalUsername.readOnly = true;
            modalName.value = user.name;
            modalDesignation.value = user.designation;
            modalRole.value = user.role;
            modalPassword.value = '';
            modalConfirmPassword.value = '';
            modalPassword.required = false;
            modalConfirmPassword.required = false;
            
            saveUserBtn.textContent = 'Update User';
            saveUserBtn.dataset.mode = 'edit';
        } else {
            // Add mode
            modalTitle.textContent = 'Add New User';
            modalUsername.value = '';
            modalUsername.readOnly = false;
            modalName.value = '';
            modalDesignation.value = '';
            modalRole.value = 'user';
            modalPassword.value = '';
            modalConfirmPassword.value = '';
            modalPassword.required = true;
            modalConfirmPassword.required = true;
            
            saveUserBtn.textContent = 'Add User';
            saveUserBtn.dataset.mode = 'add';
        }
        
        userModal.style.display = 'flex';
    }
    
    // Close user modal
    function closeUserModal() {
        userModal.style.display = 'none';
        userForm.reset();
    }
    
    // Save user (add or edit)
    function saveUser(mode) {
        const username = modalUsername.value.trim();
        const name = modalName.value.trim();
        const designation = modalDesignation.value;
        const role = modalRole.value;
        const password = modalPassword.value;
        const confirmPassword = modalConfirmPassword.value;
        
        // Validation
        if (!username || !name || !designation) {
            showToast('error', 'Validation Error', 'Please fill in all required fields');
            return;
        }
        
        if (mode === 'add' && (!password || password.length < 4)) {
            showToast('error', 'Validation Error', 'Password must be at least 4 characters');
            return;
        }
        
        if (mode === 'add' && password !== confirmPassword) {
            showToast('error', 'Validation Error', 'Passwords do not match');
            return;
        }
        
        if (mode === 'add') {
            // Check if username already exists
            const existingUser = users.find(u => u.username === username);
            if (existingUser) {
                showToast('error', 'User Exists', 'Username already exists');
                return;
            }
            
            // Add new user
            users.push({
                username,
                password,
                name,
                designation,
                role,
                lastLogin: null
            });
            
            addActivity('User Added', `New user: ${name} (${username})`);
            showToast('success', 'User Added', `${name} has been added to the system`);
        } else {
            // Edit existing user
            const userIndex = users.findIndex(u => u.username === username);
            if (userIndex === -1) return;
            
            users[userIndex].name = name;
            users[userIndex].designation = designation;
            users[userIndex].role = role;
            
            // Update password if provided
            if (password && password.length >= 4 && password === confirmPassword) {
                users[userIndex].password = password;
            }
            
            addActivity('User Updated', `User details updated: ${name} (${username})`);
            showToast('success', 'User Updated', `${name}'s details have been updated`);
        }
        
        // Update UI and close modal
        updateUsersTable();
        updateDashboardStats();
        closeUserModal();
        saveToLocalStorage();
    }
    
    // Delete user
    function deleteUser(username) {
        if (username === currentUser.username) {
            showToast('error', 'Cannot Delete', 'You cannot delete your own account');
            return;
        }
        
        if (!confirm(`Are you sure you want to delete user ${username}? This action cannot be undone.`)) {
            return;
        }
        
        const userIndex = users.findIndex(u => u.username === username);
        if (userIndex === -1) return;
        
        const deletedUser = users.splice(userIndex, 1)[0];
        
        // Update UI
        updateUsersTable();
        updateDashboardStats();
        
        // Add activity
        addActivity('User Deleted', `User removed: ${deletedUser.name} (${username})`);
        
        // Save to localStorage
        saveToLocalStorage();
        
        showToast('success', 'User Deleted', `${deletedUser.name} has been removed from the system`);
    }
    
    // ==================== SEARCH FUNCTIONALITY ====================
    
    // Search for CN or BAG
    function search(query) {
        if (!query.trim()) {
            showToast('warning', 'Empty Search', 'Please enter a CN or BAG# to search');
            return;
        }
        
        let results = [];
        
        // Check if it's a BAG# search
        if (query.toUpperCase().startsWith('BAG#')) {
            const bagId = query.toUpperCase();
            const bag = bags.find(b => b.id === bagId);
            
            if (bag) {
                results.push({
                    type: 'bag',
                    id: bag.id,
                    cnCount: bag.cnCount,
                    created: bag.created,
                    message: `Found bag: ${bag.id} with ${bag.cnCount} CNs`
                });
            } else {
                results.push({
                    type: 'notfound',
                    message: `No bag found with ID: ${bagId}`
                });
            }
        } else {
            // CN search
            const searchCN = query.replace(/-/g, '');
            let found = false;
            
            for (const bag of bags) {
                const foundCN = bag.cns.find(cn => cn.cn.replace(/-/g, '') === searchCN);
                if (foundCN) {
                    results.push({
                        type: 'cn',
                        bagId: bag.id,
                        cn: foundCN.cn,
                        timestamp: foundCN.timestamp,
                        message: `CN ${foundCN.cn} found in ${bag.id}`
                    });
                    found = true;
                }
            }
            
            if (!found) {
                results.push({
                    type: 'notfound',
                    message: `No record found for CN: ${query}`
                });
            }
        }
        
        // Display results
        displaySearchResults(results, query);
    }
    
    // Display search results in modal
    function displaySearchResults(results, query) {
        searchResultsContent.innerHTML = '';
        
        if (results.length === 0) {
            searchResultsContent.innerHTML = '<p class="text-center">No results found</p>';
        } else {
            results.forEach(result => {
                const resultEl = document.createElement('div');
                resultEl.className = 'search-result';
                
                if (result.type === 'notfound') {
                    resultEl.innerHTML = `
                        <div class="search-result-header error">
                            <i class="fas fa-search"></i>
                            <h4>No Record Found</h4>
                        </div>
                        <div class="search-result-body">
                            <p>${result.message}</p>
                        </div>
                    `;
                } else if (result.type === 'bag') {
                    resultEl.innerHTML = `
                        <div class="search-result-header success">
                            <i class="fas fa-suitcase"></i>
                            <h4>Bag Found</h4>
                        </div>
                        <div class="search-result-body">
                            <p>${result.message}</p>
                            <div class="result-details">
                                <p><strong>Bag ID:</strong> ${result.id}</p>
                                <p><strong>CN Count:</strong> ${result.cnCount}</p>
                                <p><strong>Created:</strong> ${formatDate(result.created)}</p>
                            </div>
                            <button class="btn-primary view-search-bag-btn" data-bag-id="${result.id}">
                                <i class="fas fa-eye"></i> View Bag Details
                            </button>
                        </div>
                    `;
                } else if (result.type === 'cn') {
                    resultEl.innerHTML = `
                        <div class="search-result-header success">
                            <i class="fas fa-barcode"></i>
                            <h4>CN Found</h4>
                        </div>
                        <div class="search-result-body">
                            <p>${result.message}</p>
                            <div class="result-details">
                                <p><strong>Consignment Number:</strong> ${result.cn}</p>
                                <p><strong>Bag ID:</strong> ${result.bagId}</p>
                                <p><strong>Scanned:</strong> ${formatDate(result.timestamp)}</p>
                            </div>
                            <button class="btn-primary view-search-bag-btn" data-bag-id="${result.bagId}">
                                <i class="fas fa-eye"></i> View Bag Details
                            </button>
                        </div>
                    `;
                }
                
                searchResultsContent.appendChild(resultEl);
            });
        }
        
        // Add event listeners to view bag buttons
        document.querySelectorAll('.view-search-bag-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const bagId = this.dataset.bagId;
                searchModal.style.display = 'none';
                showBagDetails(bagId);
                switchSection('bags');
            });
        });
        
        // Show modal
        searchModal.style.display = 'flex';
    }
    
    // ==================== CHART FUNCTIONS ====================
    
    let bagsChart = null;
    
    // Update chart
    function updateChart() {
        const ctx = document.getElementById('bagsChart');
        if (!ctx) return;
        
        // Destroy existing chart
        if (bagsChart) {
            bagsChart.destroy();
        }
        
        // Prepare data
        const bagLabels = bags.map(bag => bag.id);
        const cnData = bags.map(bag => bag.cnCount);
        
        // Create chart
        bagsChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: bagLabels,
                datasets: [{
                    data: cnData,
                    backgroundColor: [
                        '#3949ab', '#4caf50', '#ff9800', '#f44336', '#9c27b0',
                        '#2196f3', '#ffeb3b', '#795548', '#607d8b', '#00bcd4'
                    ],
                    borderWidth: 2,
                    borderColor: document.body.classList.contains('dark-theme') ? '#1a1a2e' : '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: document.body.classList.contains('dark-theme') ? '#e6e6e6' : '#333',
                            font: {
                                size: 11
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.raw} CNs`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // ==================== EXPORT FUNCTIONS ====================
    
    // Export to Excel
    function exportToExcel(data, filename) {
        try {
            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
            XLSX.writeFile(wb, `${filename}.xlsx`);
            return true;
        } catch (error) {
            console.error('Export error:', error);
            showToast('error', 'Export Failed', 'Could not generate Excel file');
            return false;
        }
    }
    
    // Export all bags
    function exportAllBags() {
        const exportData = [];
        
        bags.forEach(bag => {
            exportData.push({
                'Bag ID': bag.id,
                'CN Count': bag.cnCount,
                'Created Date': formatDate(bag.created),
                'Last Updated': formatDate(bag.updated)
            });
        });
        
        if (exportData.length === 0) {
            showToast('warning', 'No Data', 'There are no bags to export');
            return;
        }
        
        const success = exportToExcel(exportData, `NCI_Bags_Export_${new Date().toISOString().split('T')[0]}`);
        if (success) {
            addActivity('Data Exported', 'All bags exported to Excel');
            showToast('success', 'Export Complete', 'All bags have been exported to Excel');
        }
    }
    
    // Export bag details
    function exportBagDetails(bagId) {
        const bag = bags.find(b => b.id === bagId);
        if (!bag) {
            showToast('error', 'Bag Not Found', `Bag ${bagId} not found`);
            return;
        }
        
        const exportData = bag.cns.map((cn, index) => ({
            '#': index + 1,
            'Consignment Number': cn.cn,
            'Timestamp': formatDate(cn.timestamp),
            'Status': cn.status
        }));
        
        const success = exportToExcel(exportData, `NCI_${bagId}_Export_${new Date().toISOString().split('T')[0]}`);
        if (success) {
            addActivity('Bag Exported', `${bagId} exported to Excel`);
            showToast('success', 'Export Complete', `${bagId} has been exported to Excel`);
        }
    }
    
    // Export all CNs
    function exportAllCNs() {
        const exportData = [];
        
        bags.forEach(bag => {
            bag.cns.forEach(cn => {
                exportData.push({
                    'Bag ID': bag.id,
                    'Consignment Number': cn.cn,
                    'Timestamp': formatDate(cn.timestamp),
                    'Status': cn.status
                });
            });
        });
        
        if (exportData.length === 0) {
            showToast('warning', 'No Data', 'There are no CNs to export');
            return;
        }
        
        const success = exportToExcel(exportData, `NCI_All_CNs_Export_${new Date().toISOString().split('T')[0]}`);
        if (success) {
            addActivity('CNs Exported', 'All CNs exported to Excel');
            showToast('success', 'Export Complete', 'All CNs have been exported to Excel');
        }
    }
    
    // ==================== SECTION SWITCHING ====================
    
    // Switch between sections
    function switchSection(sectionId) {
        // Update sidebar active item
        sidebarItems.forEach(item => {
            if (item.dataset.section === sectionId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        // Show corresponding content section
        contentSections.forEach(section => {
            if (section.id === `${sectionId}Section` || section.id === `${sectionId}SectionContent`) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
        
        // Hide bag details when switching away from bags section
        if (sectionId !== 'bags' && bagDetailsCard.style.display === 'block') {
            bagDetailsCard.style.display = 'none';
        }
        
        // Special handling for admin-only sections
        if ((sectionId === 'scan' || sectionId === 'users' || sectionId === 'settings') && 
            currentUser.role !== 'admin') {
            showToast('warning', 'Access Denied', 'This section is for administrators only');
            switchSection('dashboard');
            return;
        }
        
        // Focus on CN input when switching to scan section
        if (sectionId === 'scan') {
            setTimeout(() => {
                cnInput.focus();
            }, 300);
        }
    }
    
    // ==================== EVENT LISTENERS ====================
    
    // Login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        
        // Find user
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            // Update user last login
            user.lastLogin = new Date().toISOString();
            saveToLocalStorage();
            
            // Set current user
            currentUser = { ...user };
            
            // Update UI
            currentUsernameEl.textContent = user.name;
            currentDesignationEl.textContent = user.designation;
            currentRoleEl.textContent = user.role;
            currentRoleEl.dataset.role = user.role;
            
            // Show/hide admin-only elements
            const adminOnlyElements = [scanSection, usersSection, settingsSection, 
                                      deleteAllBagsBtn, addUserBtn, deleteBagBtn, systemSettingsCard];
            
            adminOnlyElements.forEach(el => {
                if (el) {
                    el.style.display = user.role === 'admin' ? 'flex' : 'none';
                }
            });
            
            // Update permission summary
            permissionSummaryEl.textContent = user.role === 'admin' ? 'Full Access' : 'View Only';
            
            // Switch to dashboard
            loginScreen.style.display = 'none';
            dashboard.style.display = 'flex';
            
            // Initialize new bag for scanning
            initializeNewBag();
            
            // Add activity
            addActivity('User Login', `${user.name} logged into the system`);
            
            showToast('success', 'Login Successful', `Welcome ${user.name}!`);
        } else {
            showToast('error', 'Login Failed', 'Invalid username or password');
            passwordInput.value = '';
            passwordInput.focus();
        }
    });
    
    // Logout
    logoutBtn.addEventListener('click', function() {
        if (currentUser) {
            addActivity('User Logout', `${currentUser.name} logged out`);
            currentUser = null;
        }
        
        dashboard.style.display = 'none';
        loginScreen.style.display = 'flex';
        
        // Clear login form
        loginForm.reset();
        usernameInput.focus();
    });
    
    // Sidebar navigation
    sidebarItems.forEach(item => {
        item.addEventListener('click', function() {
            const sectionId = this.dataset.section;
            switchSection(sectionId);
        });
    });
    
    // Refresh dashboard
    refreshBtn.addEventListener('click', function() {
        updateDashboardStats();
        updateRecentBagsTable();
        showToast('info', 'Dashboard Refreshed', 'Data has been refreshed');
    });
    
    // CN scanning - Enter key
    cnInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const cn = cnInput.value.trim();
            if (cn) {
                addCNToCurrentBag(cn);
            }
        }
    });
    
    // Save bag button
    saveBagBtn.addEventListener('click', saveCurrentBag);
    
    // New bag button
    newBagBtn.addEventListener('click', function() {
        if (currentBag && currentBag.cns.length > 0) {
            if (!confirm('Current bag has unsaved CNs. Create new bag anyway?')) {
                return;
            }
        }
        initializeNewBag();
    });
    
    // Delete all bags button
    deleteAllBagsBtn.addEventListener('click', deleteAllBags);
    
    // Export all bags button
    exportBagsBtn.addEventListener('click', exportAllBags);
    
    // Filter bags
    filterBagsInput.addEventListener('input', function() {
        const filter = this.value.toLowerCase();
        const rows = allBagsTable.querySelectorAll('tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(filter) ? '' : 'none';
        });
    });
    
    // Export specific bag
    exportBagBtn.addEventListener('click', function() {
        const bagId = detailBagNumberEl.textContent;
        exportBagDetails(bagId);
    });
    
    // Delete specific bag
    deleteBagBtn.addEventListener('click', function() {
        const bagId = detailBagNumberEl.textContent;
        deleteBag(bagId);
    });
    
    // Close bag details
    closeDetailsBtn.addEventListener('click', function() {
        bagDetailsCard.style.display = 'none';
    });
    
    // Add user button
    addUserBtn.addEventListener('click', function() {
        openUserModal();
    });
    
    // User modal
    closeModalBtn.addEventListener('click', closeUserModal);
    cancelModalBtn.addEventListener('click', closeUserModal);
    
    userForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const mode = saveUserBtn.dataset.mode;
        saveUser(mode);
    });
    
    // Filter users
    filterUsersInput.addEventListener('input', function() {
        const filter = this.value.toLowerCase();
        const rows = usersTable.querySelectorAll('tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(filter) ? '' : 'none';
        });
    });
    
    // Search functionality
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query) {
                search(query);
                searchInput.value = '';
            }
        }
    });
    
    // Close search modal
    closeSearchModalBtn.addEventListener('click', function() {
        searchModal.style.display = 'none';
    });
    
    // Export buttons
    exportButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.dataset.type;
            
            if (type === 'all-bags') {
                exportAllBags();
            } else if (type === 'all-cns') {
                exportAllCNs();
            } else if (type === 'user-activity') {
                showToast('info', 'Coming Soon', 'User activity export will be available in next update');
            }
        });
    });
    
    // Generate report button
    generateReportBtn.addEventListener('click', function() {
        exportAllBags();
    });
    
    // Change password form
    changePasswordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmNewPassword = document.getElementById('confirmNewPassword').value;
        
        if (currentPassword !== currentUser.password) {
            showToast('error', 'Password Error', 'Current password is incorrect');
            return;
        }
        
        if (newPassword.length < 4) {
            showToast('error', 'Password Error', 'New password must be at least 4 characters');
            return;
        }
        
        if (newPassword !== confirmNewPassword) {
            showToast('error', 'Password Error', 'New passwords do not match');
            return;
        }
        
        // Update password
        const userIndex = users.findIndex(u => u.username === currentUser.username);
        if (userIndex !== -1) {
            users[userIndex].password = newPassword;
            currentUser.password = newPassword;
            
            saveToLocalStorage();
            
            showToast('success', 'Password Changed', 'Your password has been updated successfully');
            changePasswordForm.reset();
            
            addActivity('Password Changed', 'User changed their password');
        }
    });
    
    // Theme selection
    themeOptions.forEach(btn => {
        btn.addEventListener('click', function() {
            const theme = this.dataset.theme;
            applyTheme(theme);
            showToast('success', 'Theme Changed', `Switched to ${theme} theme`);
            
            // Update chart with new theme
            if (bagsChart) {
                bagsChart.destroy();
                updateChart();
            }
        });
    });
    
    // Save system settings
    saveSystemSettingsBtn.addEventListener('click', function() {
        systemSettings.cnValidation = document.getElementById('cnValidationToggle').checked;
        systemSettings.autoBackup = document.getElementById('autoBackupToggle').checked;
        systemSettings.activityLogging = document.getElementById('activityLoggingToggle').checked;
        
        saveToLocalStorage();
        showToast('success', 'Settings Saved', 'System settings have been updated');
        
        addActivity('Settings Updated', 'System configuration changed');
    });
    
    // ==================== INITIALIZATION ====================
    
    // Load data and initialize app
    loadFromLocalStorage();
    
    // Set focus on username input
    usernameInput.focus();
    
    // Initialize with dashboard section
    switchSection('dashboard');
    
    // Show welcome message
    console.log('NCI Shipments Record System initialized');
    console.log('Default admin: 17453.sajjad / 709709');
    console.log('Default user: 15831.naeem / 1213');
});