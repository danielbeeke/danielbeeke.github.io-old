let teaserExpanders = document.querySelectorAll('teaser-expander[data-html]');

if (teaserExpanders) {
  Array.from(teaserExpanders).forEach(teaserExpander => {
    teaserExpander.addEventListener('expand', () => {
      if (teaserExpander.dataset.html) {
        fetch(teaserExpander.dataset.html)
          .then(response => response.text())
          .then(response => {
            teaserExpander.innerHTML = response;
            teaserExpander.removeAttribute('data-html');
            let closeButton = teaserExpander.querySelector('.close-teaser-expander');

            if (closeButton) {
              closeButton.addEventListener('click', () => {
                teaserExpander.expanded = false;
              });
            }
          })
      }
    });
  })
}
