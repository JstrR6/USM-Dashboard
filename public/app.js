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
  });
});

// Initially show the overview page
showPage('overview');
