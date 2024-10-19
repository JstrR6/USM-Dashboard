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

// Fetch roles from the API and display them
function fetchRoles() {
  console.log("Fetching roles from the server...");

  fetch('/api/roles')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      const rolesDiv = document.getElementById('roles-list');
      rolesDiv.innerHTML = ''; // Clear the roles list

      if (data.roles.length === 0) {
        rolesDiv.innerHTML = '<p>No roles found.</p>';
        return;
      }

      console.log("Roles fetched successfully:", data.roles);

      // Loop through the roles and create HTML elements for each role
      data.roles.forEach(role => {
        const roleElement = document.createElement('div');
        roleElement.classList.add('role');
        roleElement.innerHTML = `
          <strong>${role.name}</strong> (Position: ${role.position}) - Color: #${role.color.toString(16)}
        `;
        rolesDiv.appendChild(roleElement);
      });
    })
    .catch(error => {
      console.error('Error fetching roles:', error);
      const rolesDiv = document.getElementById('roles-list');
      rolesDiv.innerHTML = '<p>Error fetching roles. Please try again later.</p>';
    });
}
