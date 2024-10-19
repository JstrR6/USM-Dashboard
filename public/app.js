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

// Ensure roleIcons.js is loaded before rendering roles
const script = document.createElement('script');
script.src = '/public/roleIcons.js';  // Ensure this path is correct
script.onload = () => {
  console.log("roleIcons.js loaded successfully");
  // After roleIcons.js is loaded, fetch roles
  fetchRoles();
};
script.onerror = () => {
  console.error("Error loading roleIcons.js");
};
document.head.appendChild(script);

// Fetch roles from the API and display them
function fetchRoles() {
  fetch('/api/roles')
    .then(response => response.json())
    .then(data => {
      console.log("Roles fetched from API:", data.roles);  // Log the raw roles data

      const rolesDiv = document.getElementById('roles-list');
      rolesDiv.innerHTML = ''; // Clear the roles list

      // Role hierarchy array
      const roleHierarchy = [
        "General of the Armed Forces", "General", "Lieutenant General",
        "Major General", "Brigadier General", "Colonel", "Lieutenant Colonel",
        "Major", "Captain", "First Lieutenant", "Second Lieutenant",
        "Sergeant Major of the Armed Forces", "Command Sergeant Major",
        "Sergeant Major", "First Sergeant", "Master Sergeant", "Sergeant First Class",
        "Staff Sergeant", "Sergeant", "Corporal", "Specialist", "Private First Class", "Private"
      ];

      // Filter and sort roles by hierarchy
      const filteredRoles = data.roles
        .filter(role => roleHierarchy.includes(role.name))  // Filter based on role hierarchy
        .sort((a, b) => roleHierarchy.indexOf(a.name) - roleHierarchy.indexOf(b.name));  // Sort by hierarchy order

      console.log("Filtered roles:", filteredRoles);  // Log the filtered roles

      // Display each role with its icon
      filteredRoles.forEach(role => {
        const roleElement = document.createElement('div');
        roleElement.classList.add('role');

        // Check if an icon exists for this role
        const iconSrc = roleIcons[role.name] || '/public/images/icons/private.png';  // Fallback to default icon if not found

        // Display the role name with its icon
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

