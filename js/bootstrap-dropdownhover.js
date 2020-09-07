const dropdowns = document.querySelectorAll('.dropdown');
const dropdownToggle = document.querySelectorAll('.dropdown .dropdown-toggle');
const dropdownMenu = document.querySelectorAll('.dropdown .dropdown-menu');

['mouseover', 'click'].forEach(e => {
  dropdowns.forEach(dropdown => {
    dropdown.addEventListener(e, function () {
      for(const child of dropdown.children) {
        child.classList.add("show");
      }
    })
  });
});

dropdowns.forEach(dropdown => {
  dropdown.addEventListener('mouseout', function () {
    for(const child of dropdown.children) {
      child.classList.remove("show");
    }
  });
});