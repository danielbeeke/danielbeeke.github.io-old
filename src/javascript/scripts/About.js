let aboutToggle = document.querySelector('.about-me-button');

let closeAbout = () => {
  document.body.classList.remove('has-open-about');
  history.pushState(null, '', '#');
};

let openAbout = () =>  {
  document.body.classList.add('has-open-about');
  history.pushState(null, '', '#about');
};

document.addEventListener('keyup', (event) => {
  if (event.key === 'Escape' && document.body.classList.contains('has-open-about')) {
    closeAbout();
  }
});

aboutToggle.addEventListener('click', () => {
  document.body.classList.contains('has-open-about') ? closeAbout() : openAbout();
});

window.addEventListener('hashchange', () => {
  if (location.hash === '#about') {
    openAbout();
  }

  if (location.hash === '') {
    closeAbout();
  }
});

let closeAboutButton = document.querySelector('.close-about');

closeAboutButton.addEventListener('click', () => {
  closeAbout();
});

if (location.hash === '#about') {
  openAbout();
}
