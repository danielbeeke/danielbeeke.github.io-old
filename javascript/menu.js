let hamburger = document.querySelector('.hamburger');

hamburger.addEventListener('click', () => {
  document.body.classList.toggle('has-active-menu');
});

document.addEventListener('keydown', (event) => {
  if (event.keyCode == 27 && document.body.classList.contains('has-active-menu')) {
    document.body.classList.remove('has-active-menu')
  }
})
