document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const treeContainer = document.querySelector('.tree');
    const searchInput = document.querySelector('.search-input');
    const noResultsMessage = document.querySelector('.no-results');
    const filterOptions = document.querySelectorAll('.filter-option');
    const toggleSidebarButton = document.querySelector('.toggle-sidebar');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const breadcrumbs = document.querySelector('.breadcrumbs');
    const noteCard = document.querySelector('.note-card');
    const navItems = document.querySelectorAll('.nav-item');
    const viewContainers = document.querySelectorAll('.view-container');

    // Graph view elements
    const graphContainer = document.getElementById('graph-container');
    const resetButton = document.getElementById('reset-graph');
    const toggleLabelsButton = document.getElementById('toggle-labels');
    const graphBreadcrumbs = document.querySelector('.graph-breadcrumbs');
    const nodeTooltip = document.querySelector('.node-tooltip');

    let currentFocusedElement = null;
    let activeFilters = Array.from(filterOptions).map(opt => opt.dataset.category);
    let cy = null; // Cytoscape instance

    // Navigation between views
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetView = this.getAttribute('data-view');

            // Update nav items
            navItems.forEach(navItem => {
                navItem.classList.remove('active');
            });
            this.classList.add('active');

            // Update view containers
            viewContainers.forEach(container => {
                container.classList.remove('active');
            });
            document.getElementById(targetView).classList.add('active');

            // Initialize graph view if selected
            if (targetView === 'graph-view' && !cy) {
                initializeGraphView();
            }
        });
    });

    // Build the tree from data
    function buildTree(data, parent, level = 0, path = []) {
        // Remove loading indicator if present
        const loadingIndicator = parent.querySelector('.loading-indicator');
        if (loadingIndicator) {
            parent.removeChild(loadingIndicator);
        }

        if (!data.children || data.children.length === 0) return;

        data.children.forEach(item => {
            const currentPath = [...path, item.name];
            const li = document.createElement('li');
            li.className = 'tree-item';
            li.setAttribute('role', 'treeitem');
            li.setAttribute('aria-expanded', 'false');
            li.setAttribute('tabindex', '-1');
            li.setAttribute('data-level', level + 1);

            if (item.category) {
                li.setAttribute('data-category', item.category);
            } else if (level === 0) {
                // Assign a default category for top-level items without a category
                li.setAttribute('data-category', 'core');
            } else {
                // Inherit category from parent
                const parentCategory = parent.closest('.tree-item')?.getAttribute('data-category');
                if (parentCategory) {
                    li.setAttribute('data-category', parentCategory);
                }
            }

            const itemContent = document.createElement('div');
            itemContent.className = 'item-content';

            // Create the toggle icon or leaf marker
            if (item.isLeaf) {
                const leafMarker = document.createElement('span');
                leafMarker.className = 'leaf-marker';
                itemContent.appendChild(leafMarker);
            } else {
                const toggleIcon = document.createElement('span');
                toggleIcon.className = 'toggle-icon';
                toggleIcon.textContent = '▶';
                itemContent.appendChild(toggleIcon);
            }

            // Create the item label
            const titleSpan = document.createElement('span');
            titleSpan.className = item.isLeaf ? 'item-title' : 'category-title';
            titleSpan.textContent = item.name;
            itemContent.appendChild(titleSpan);

            li.appendChild(itemContent);

            // Create the children container if not a leaf node
            if (!item.isLeaf && item.children && item.children.length > 0) {
                const childrenContainer = document.createElement('ul');
                childrenContainer.className = 'tree-children';
                childrenContainer.setAttribute('role', 'group');
                li.appendChild(childrenContainer);

                // Set up event listener to toggle expansion
                itemContent.addEventListener('click', (e) => {
                    e.stopPropagation();
                    toggleExpansion(li);
                    updateFocus(li);
                });

                // Recursively build children
                buildTree(item, childrenContainer, level + 1, currentPath);
            } else if (item.isLeaf) {
                // For leaf nodes, set up click to show detailed info
                itemContent.addEventListener('click', (e) => {
                    e.stopPropagation();
                    showItemDetails(item, currentPath);
                    updateSelectedItem(li);
                    updateFocus(li);
                });
            }

            // Set data attributes for search
            li.setAttribute('data-name', item.name.toLowerCase());
            li.setAttribute('data-path', currentPath.join(' > ').toLowerCase());
            if (item.description) {
                li.setAttribute('data-description', item.description.toLowerCase());
            }

            parent.appendChild(li);
        });
    }

    // Toggle the expansion of a tree item
    function toggleExpansion(item) {
        const isExpanded = item.getAttribute('aria-expanded') === 'true';
        const toggleIcon = item.querySelector('.toggle-icon');
        const childrenContainer = item.querySelector('.tree-children');

        if (isExpanded) {
            item.setAttribute('aria-expanded', 'false');
            toggleIcon?.classList.remove('expanded');
            childrenContainer?.classList.remove('expanded');
        } else {
            item.setAttribute('aria-expanded', 'true');
            toggleIcon?.classList.add('expanded');
            childrenContainer?.classList.add('expanded');
        }
    }

    // Update the focus to a specific tree item
    function updateFocus(item) {
        if (currentFocusedElement) {
            currentFocusedElement.setAttribute('tabindex', '-1');
        }
        item.setAttribute('tabindex', '0');
        item.focus();
        currentFocusedElement = item;
    }

    // Update the selected state of tree items
    function updateSelectedItem(item) {
        const allItems = document.querySelectorAll('.tree-item .item-content');
        allItems.forEach(i => i.classList.remove('selected'));
        item.querySelector('.item-content').classList.add('selected');
    }

    // Show item details in the note card
    function showItemDetails(item, path) {
        // Update breadcrumbs
        updateBreadcrumbs(path);

        // Create the note card content
        const noteCardTitle = noteCard.querySelector('.note-card-title');
        const expertiseLevel = noteCard.querySelector('.expertise-level');
        const sections = noteCard.querySelectorAll('.note-card-section');

        // Set title
        noteCardTitle.textContent = item.name;