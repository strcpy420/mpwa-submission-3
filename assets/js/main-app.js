/* DOM CONTENT LOADED EVENT */
document.addEventListener('DOMContentLoaded',function() {
  // CONFIGURATION NAV ON LOAD, ON CLICK
  function confNav() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status != 200) { return; }
        document.querySelectorAll('.nav-items').forEach(function(el) {
          el.innerHTML = xhttp.responseText;
          navItemAnchor = document.querySelector('.nav-item.active');
            if (navItemAnchor !== null) {
              navItemAnchor.classList.remove('active');
              document.querySelector('a.nav-item[href*="' + pageTarget + '"]').classList.add('active'); //gets all anchors (a) that contain pageTarget in href
            }
        });
        document.querySelectorAll('.nav-items a').forEach(function(el) {
          el.addEventListener('click',function(e) {
            pageTarget = e.target.getAttribute('href').substr(1);
            navItemAnchor = document.querySelector('.nav-item.active');
            if (navItemAnchor !== null) {
              navItemAnchor.classList.remove('active');
              e.target.classList.add('active');        
            }
            loadPage(pageTarget);
          })
        });
      }
    };
    xhttp.open('GET', '/templates/nav-anchor.html', true);
    xhttp.send();
  }

  // LOAD PAGE ORDER BY PAGE TARGET
  function loadPage(paramPageTarget) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        let pageMain = document.querySelector('#main');
        let pageTitle = document.querySelector('#page-title');
        if (this.status == 200) {
          if (pageTarget == 'matches') {
            getDataMatches();
          } else if (pageTarget == 'standings') {
            getDataStandings();
          } else if (pageTarget == 'clubs') {
            getAllItemFavClub();
            getDataClubs();
          }
          pageMain.innerHTML = xhttp.responseText;
          pageTitle.innerHTML = 'Premier League | ' + paramPageTarget.charAt(0).toUpperCase() + paramPageTarget.substr(1);       
        } else if (this.status == 404) {
          pageMain.innerHTML = `
            <p class="center-align">
              <i class="material-icons pink-text" style="font-size: 10vw;">sentiment_neutral</i>
            </p>
            <p class="pink-text center-align" style="font-size: 3vw;">PAGE NOT FOUND.</p.>
            <p class="center-align" style="font-size: 2vw;"><a href="">Back to Home</a></p.>
          `;
        } else {
          pageMain.innerHTML = `
            <p class="center-align">
              <i class="material-icons pink-text" style="font-size: 10vw;">sentiment_very_dissatisfied</i>
            </p>
            <p class="pink-text center-align" style="font-size: 3vw;">PAGE CANNOT BE ACCESSED.</p>
            <p class="center-align" style="font-size: 2vw;"><a href="">Back to Home</a>
          `;
        }
      }
    };
    xhttp.open('GET', 'pages/' + paramPageTarget + '.html', true);
    xhttp.send();
  }

  let pageTarget = window.location.hash.substr(1); // page target attr HREF
  pageTarget = ( pageTarget == '' ) ? 'matches' : window.location.hash.substr(1); // page target default || attr HREF

  loadPage(pageTarget); // RUN
  confNav(); // RUN

  /* NAVBAR RESPONSIVE */
  let navToggler = document.querySelector('.nav-toggler');
  let navCollapse = document.querySelector('.nav-collapse');
  let navTogglerIcon = document.querySelector('.nav-toggler i');
  navToggler.addEventListener('click',function() {
    navCollapse.classList.toggle('collapse-nav');
    navTogglerIcon.classList.toggle('anim-rotate');
    navTogglerIcon.innerHTML = (navCollapse.classList == 'nav-collapse') ?  'close' : 'menu';
  });
  /* ./NAVBAR RESPONSIVE */
});
/* ./DOM CONTENT LOADED EVENT */