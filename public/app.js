// Toggle the sidebar menu
document.getElementById("menu-toggle").addEventListener("click", function () {
  document.getElementById("wrapper").classList.toggle("toggled");
});

// Function to switch between pages
function showPage(pageId) {
  // Hide all pages
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => page.style.display = 'none');

  // Show the selected page
  const selectedPage = document.getElementById(pageId);
  selectedPage.style.display = 'block';

  // Fetch roles if we're on the Ranks page
  if (pageId === 'ranks') {
    fetchRoles();
  }
}

// Event listener for sidebar links
document.querySelectorAll('.list-group-item').forEach(link => {
  link.addEventListener('click', function (event) {
    event.preventDefault();

    // Get the target page from the data-page attribute
    const page = this.getAttribute('data-page');

    // Show the corresponding page
    showPage(page);
  });
});

// Initially show the overview page
showPage('overview');

// Ensure roleIcons.js is loaded
const script = document.createElement('script');
script.src = '/public/roleIcons.js'; // Ensure this path is correct
script.onload = () => console.log("roleIcons.js loaded successfully");
script.onerror = () => console.error("Error loading roleIcons.js");
document.head.appendChild(script);


// Fetch roles from the API and display them
function fetchRoles() {
  fetch('/api/roles')
    .then(response => response.json())
    .then(data => {
      console.log("Roles fetched:", data.roles); // Check if roles are fetched
      const rolesDiv = document.getElementById('roles-list');
      rolesDiv.innerHTML = ''; // Clear the roles list

      const roleHierarchy = [
        "General of the Armed Forces",
        "General",
        "Lieutenant General",
        "Major General",
        "Brigadier General",
        "Colonel",
        "Lieutenant Colonel",
        "Major",
        "Captain",
        "First Lieutenant",
        "Second Lieutenant",
        "Sergeant Major of the Armed Forces",
        "Command Sergeant Major",
        "Sergeant Major",
        "First Sergeant",
        "Master Sergeant",
        "Sergeant First Class",
        "Staff Sergeant",
        "Sergeant",
        "Corporal",
        "Specialist",
        "Private First Class",
        "Private"
      ];

      const filteredRoles = data.roles
        .filter(role => roleHierarchy.includes(role.name)) // Filter by hierarchy
        .sort((a, b) => roleHierarchy.indexOf(a.name) - roleHierarchy.indexOf(b.name)); // Sort by hierarchy

      console.log("Filtered roles:", filteredRoles); // Check the filtered roles

      // Loop through the filtered roles and display name + icon
      filteredRoles.forEach(role => {
        const roleElement = document.createElement('div');
        roleElement.classList.add('role');

        // Get the corresponding icon for the role
        const iconSrc = roleIcons[role.name] || '/public/images/icons/Private.png'; // Fallback to default if not found

        // Display role name with the icon
        roleElement.innerHTML = `
          <img src="${iconSrc}" alt="${role.name} icon" style="width:20px; height:20px; margin-right:8px;">
          <strong>${role.name}</strong>
        `;
        rolesDiv.appendChild(roleElement);
      });
    })
    .catch(error => {
      console.error('Error fetching roles:', error);
    });
}

