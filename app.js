// ========== GLOBAL STATE & CONSTANTS ==========
let currentBag = [];
let recentScans = [];
let savedBags = {};
let bagCounter = 1;

// DOM Elements
const scannerInput = document.getElementById('scanner-input');
const manualAddBtn = document.getElementById('manual-add');
const saveBagBtn = document.getElementById('save-bag');
const clearCurrentBtn = document.getElementById('clear-current');
const currentBagList = document.getElementById('current-bag-list');
const recentScansList = document.getElementById('recent-scans-list');
const currentCountEl = document.getElementById('current-count');
const bagCounterEl = document.getElementById('bag-counter');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const searchResults = document.getElementById('search-results');
const savedBagsList = document.getElementById('saved-bags-list');
const bagDetailContent = document.getElementById('bag-detail-content');
const totalBagsEl = document.getElementById('total-bags');
const clearStorageBtn = document.getElementById('clear-storage');
const toast = document.getElementById('toast');
const currentYearEl = document.getElementById('current-year');

// ========== INITIALIZATION ==========
function init() {
    // Set current year in footer
    currentYearEl.textContent = new Date().getFullYear();
    
    // Load data from localStorage
    loadData();
    
    // Setup event listeners
    setupEventListeners();
    
    // Update UI
    updateUI();
    
    // Keep scanner input focused
    scannerInput.focus();
    
    // Show welcome notification
    showToast('System ready. Start scanning shipments.', 'success');
}

// ========== DATA MANAGEMENT ==========
function loadData() {
    // Load saved bags from localStorage
    const savedBagsData = localStorage.getItem('reasonec_saved_bags');
    if (savedBagsData) {
        savedBags = JSON.parse(savedBagsData);
    }
    
    // Load bag counter
    const counter = localStorage.getItem('reasonec_bag_counter');
    if (counter) {
        bagCounter = parseInt(counter, 10);
    }
    
    // Load recent scans
    const recentScansData = localStorage.getItem('reasonec_recent_scans');
    if (recentScansData) {
        recentScans = JSON.parse(recentScansData);
    }
}

function saveData() {
    // Save saved bags
    localStorage.setItem('reasonec_saved_bags', JSON.stringify(savedBags));
    
    // Save bag counter
    localStorage.setItem('reasonec_bag_counter', bagCounter.toString());
    
    // Save recent scans
    localStorage.setItem('reasonec_recent_scans', JSON.stringify(recentScans));
}

// ========== SCANNER FUNCTIONALITY ==========
function addToCurrentBag(shipmentNumber) {
    // Validate input
    if (!shipmentNumber || shipmentNumber.trim() === '') {
        showToast('Please enter a valid shipment number', 'error');
        return;
    }
    
    // Clean the shipment number
    shipmentNumber = shipmentNumber.trim().toUpperCase();
    
    // Check if already in current bag
    if (currentBag.includes(shipmentNumber)) {
        showToast(`Shipment ${shipmentNumber} is already in current bag`, 'error');
        return;
    }
    
    // Add to current bag
    currentBag.push(shipmentNumber);
    
    // Add to recent scans (limit to 10)
    recentScans.unshift(shipmentNumber);
    if (recentScans.length > 10) {
        recentScans = recentScans.slice(0, 10);
    }
    
    // Update UI
    updateUI();
    
    // Clear input and refocus
    scannerInput.value = '';
    scannerInput.focus();
    
    // Show success notification
    showToast(`Added ${shipmentNumber} to current bag`, 'success');
}

function saveCurrentBag() {
    if (currentBag.length === 0) {
        showToast('Current bag is empty. Add shipments before saving.', 'error');
        return;
    }
    
    // Generate bag ID
    const bagId = `BAG#${bagCounter.toString().padStart(3, '0')}`;
    
    // Save bag
    savedBags[bagId] = {
        id: bagId,
        shipments: [...currentBag],
        createdAt: new Date().toISOString()
    };
    
    // Increment bag counter
    bagCounter++;
    
    // Clear current bag
    currentBag = [];
    
    // Save data to localStorage
    saveData();
    
    // Update UI
    updateUI();
    
    // Show success notification
    showToast(`Bag ${bagId} saved with ${savedBags[bagId].shipments.length} shipments`, 'success');
    
    // Show bag details
    showBagDetails(bagId);
}

function clearCurrentBag() {
    if (currentBag.length === 0) {
        showToast('Current bag is already empty', 'error');
        return;
    }
    
    if (confirm(`Clear current bag with ${currentBag.length} shipments?`)) {
        currentBag = [];
        updateUI();
        showToast('Current bag cleared', 'success');
    }
}

// ========== SEARCH FUNCTIONALITY ==========
function performSearch() {
    const query = searchInput.value.trim();
    
    if (!query) {
        showToast('Please enter a search term', 'error');
        return;
    }
    
    searchInput.value = '';
    
    // Check if searching for a bag ID
    if (query.startsWith('BAG#')) {
        const bagId = query.toUpperCase();
        if (savedBags[bagId]) {
            showBagSearchResult(bagId);
            showBagDetails(bagId);
            return;
        } else {
            showToast(`Bag ${bagId} not found`, 'error');
            return;
        }
    }
    
    // Search for shipment in bags
    let foundInBags = [];
    const shipmentQuery = query.toUpperCase();
    
    for (const [bagId, bag] of Object.entries(savedBags)) {
        if (bag.shipments.includes(shipmentQuery)) {
            foundInBags.push(bagId);
        }
    }
    
    if (foundInBags.length > 0) {
        showShipmentSearchResult(shipmentQuery, foundInBags);
        // Show first bag details
        showBagDetails(foundInBags[0]);
    } else {
        showNoResults(query);
    }
}

function showShipmentSearchResult(shipment, bagIds) {
    const resultHTML = `
        <div class="search-result-item">
            <div class="result-title">
                <i class="fas fa-check-circle" style="color: var(--success);"></i>
                Shipment Found: <span class="shipment-id">${shipment}</span>
            </div>
            <p>Found in ${bagIds.length} bag(s):</p>
            <div>
                ${bagIds.map(bagId => `
                    <div class="bag-item" data-bag-id="${bagId}" style="margin: 10px 0; padding: 10px; background: var(--dark-card); border-radius: 8px; cursor: pointer;">
                        <strong>${bagId}</strong> - ${savedBags[bagId].shipments.length} shipments
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    searchResults.innerHTML = resultHTML;
    
    // Add click listeners to bag items
    document.querySelectorAll('.bag-item').forEach(item => {
        item.addEventListener('click', function() {
            const bagId = this.getAttribute('data-bag-id');
            showBagDetails(bagId);
        });
    });
}

function showBagSearchResult(bagId) {
    const bag = savedBags[bagId];
    const resultHTML = `
        <div class="search-result-item">
            <div class="result-title">
                <i class="fas fa-archive" style="color: var(--secondary);"></i>
                Bag Found: <span class="bag-id">${bagId}</span>
            </div>
            <p>Contains ${bag.shipments.length} shipment(s)</p>
            <div class="result-shipments">
                ${bag.shipments.map(shipment => `
                    <span class="result-shipment">${shipment}</span>
                `).join('')}
            </div>
        </div>
    `;
    
    searchResults.innerHTML = resultHTML;
}

function showNoResults(query) {
    searchResults.innerHTML = `
        <div class="search-result-item">
            <div class="result-title">
                <i class="fas fa-times-circle" style="color: var(--danger);"></i>
                No Results Found
            </div>
            <p>No bag or shipment found for: <strong>${query}</strong></p>
        </div>
    `;
    
    bagDetailContent.innerHTML = `
        <div class="empty-detail">
            <i class="fas fa-search"></i>
            <p>No results found for "${query}"</p>
        </div>
    `;
}

// ========== BAG DETAILS DISPLAY ==========
function showBagDetails(bagId) {
    if (!savedBags[bagId]) {
        bagDetailContent.innerHTML = `
            <div class="empty-detail">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Bag ${bagId} not found</p>
            </div>
        `;
        return;
    }
    
    const bag = savedBags[bagId];
    const date = new Date(bag.createdAt).toLocaleString();
    
    const detailHTML = `
        <div class="bag-detail-header">
            <div>
                <h3><span class="bag-id">${bagId}</span></h3>
                <p style="color: var(--text-secondary); font-size: 0.9rem;">Created: ${date}</p>
            </div>
            <div class="count-badge">${bag.shipments.length} shipments</div>
        </div>
        
        <div class="detail-shipments">
            ${bag.shipments.map(shipment => `
                <div class="detail-shipment">
                    <i class="fas fa-box"></i>
                    <span class="shipment-id">${shipment}</span>
                </div>
            `).join('')}
        </div>
    `;
    
    bagDetailContent.innerHTML = detailHTML;
}

// ========== UI UPDATES ==========
function updateUI() {
    // Update current bag count
    currentCountEl.textContent = currentBag.length;
    bagCounterEl.textContent = `(${currentBag.length} shipments)`;
    
    // Update total bags count
    const totalBags = Object.keys(savedBags).length;
    totalBagsEl.textContent = totalBags;
    
    // Update current bag list
    if (currentBag.length > 0) {
        currentBagList.innerHTML = currentBag.map(shipment => `
            <li class="shipment-item">
                <span class="shipment-id">${shipment}</span>
                <i class="fas fa-box"></i>
            </li>
        `).join('');
    } else {
        currentBagList.innerHTML = '<li class="empty-message">No shipments in current bag</li>';
    }
    
    // Update recent scans list
    if (recentScans.length > 0) {
        recentScansList.innerHTML = recentScans.map(shipment => `
            <li class="shipment-item">
                <span class="shipment-id">${shipment}</span>
                <i class="fas fa-history"></i>
            </li>
        `).join('');
    } else {
        recentScansList.innerHTML = '<li class="empty-message">No recent scans</li>';
    }
    
    // Update saved bags list
    const savedBagsArray = Object.values(savedBags);
    if (savedBagsArray.length > 0) {
        // Sort by bag ID
        savedBagsArray.sort((a, b) => a.id.localeCompare(b.id));
        
        savedBagsList.innerHTML = savedBagsArray.map(bag => `
            <li class="bag-item" data-bag-id="${bag.id}">
                <div>
                    <span class="bag-id">${bag.id}</span>
                    <div style="font-size: 0.8rem; color: var(--text-secondary);">
                        ${new Date(bag.createdAt).toLocaleDateString()}
                    </div>
                </div>
                <span class="count-badge">${bag.shipments.length}</span>
            </li>
        `).join('');
        
        // Add click listeners to bag items
        document.querySelectorAll('.bag-item').forEach(item => {
            item.addEventListener('click', function() {
                const bagId = this.getAttribute('data-bag-id');
                showBagDetails(bagId);
                showBagSearchResult(bagId);
            });
        });
    } else {
        savedBagsList.innerHTML = '<li class="empty-message">No saved bags yet</li>';
    }
}

// ========== NOTIFICATION SYSTEM ==========
function showToast(message, type = 'info') {
    toast.textContent = message;
    toast.className = 'toast';
    toast.classList.add(type);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Hide toast after 4 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// ========== EVENT LISTENERS SETUP ==========
function setupEventListeners() {
    // Scanner input - Enter key
    scannerInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addToCurrentBag(this.value);
        }
    });
    
    // Manual add button
    manualAddBtn.addEventListener('click', function() {
        addToCurrentBag(scannerInput.value);
    });
    
    // Save bag button
    saveBagBtn.addEventListener('click', saveCurrentBag);
    
    // Clear current bag button
    clearCurrentBtn.addEventListener('click', clearCurrentBag);
    
    // Search - Enter key
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Search button
    searchBtn.addEventListener('click', performSearch);
    
    // Clear all data button
    clearStorageBtn.addEventListener('click', function() {
        if (confirm('This will delete ALL saved data (bags, recent scans, counter). Continue?')) {
            localStorage.clear();
            currentBag = [];
            recentScans = [];
            savedBags = {};
            bagCounter = 1;
            updateUI();
            showToast('All data cleared', 'success');
        }
    });
    
    // Keep scanner focused when clicking elsewhere
    document.addEventListener('click', function(e) {
        // If not clicking on search input or its related elements
        if (e.target !== searchInput && e.target !== searchBtn) {
            scannerInput.focus();
        }
    });
}

// ========== INITIALIZE APP ==========
// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);