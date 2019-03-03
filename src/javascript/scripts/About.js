let aboutToggle = document.querySelector('.about-me-button');

let closeAbout = () => {
  document.body.classList.remove('has-open-about');
  aboutToggle.innerHTML = 'about';
  aboutToggle.dataset.mouseClass = 'info';
  history.pushState(null, '', '#');
};

let openAbout = () =>  {
  document.body.classList.add('has-open-about');
  aboutToggle.innerHTML = 'close';
  aboutToggle.dataset.mouseClass = 'close';
  history.pushState(null, '', '#about');
};

document.addEventListener('keyup', (event) => {
  if (event.key === 'Escape' && document.body.classList.contains('has-open-about')) {
    closeAbout();
  }
});

aboutToggle.addEventListener('click', () => {
  if (document.body.classList.contains('has-open-about'))  {
    closeAbout();
  }
  else {
    openAbout();
  }
});

if (location.hash === '#about') {
  openAbout();
}

let closeAboutButton = document.querySelector('.close-about');

closeAboutButton.addEventListener('click', () => {
  closeAbout();
});