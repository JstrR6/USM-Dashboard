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
}

// Event listener for sidebar links
document.querySelectorAll('.list-group-item').forEach(link => {
  link.addEventListener('click', function (event) {
    event.preventDefault();

    // Get the target page from the data-page attribute
    const page = this.getAttribute('data-page');

    // Show the corresponding page
    showPage(page);

    // If we're navigating to the Ranks page, fetch the roles
    if (page === 'ranks') {
      fetchRoles();
    }
  });
});

// Initially show the overview page
showPage('overview');

// Fetch roles from the API and display them
function fetchRoles() {
  fetch('/api/roles')
    .then(response => response.json())
    .then(data => {
      const rolesDiv = document.getElementById('roles-list');
      rolesDiv.innerHTML = ''; // Clear the roles list

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
    });
}
