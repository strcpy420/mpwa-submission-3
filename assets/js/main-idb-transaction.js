/* INDEXEDDB FAVOURITE CLUB (CREATE, READ, DELETE) */
if (!('indexedDB' in window)){
  console.warn('[IDB] indexedDB is NOT supported.');
} else {
  console.log('[IDB] indexedDB IS supported.');
  // CREATE INDEXEDDB 'premier_league' (INDEXEDDB)
  let dbPromise = idb.open('premier_league', 1, function(upgradeDb) {
    if (!upgradeDb.objectStoreNames.contains('fav_club')) {
      // CREATE OBJECTSTORE 'fav_club'
      let favClub = upgradeDb.createObjectStore('fav_club', { keyPath : 'club_id' });
    }   
  });  

  // ADD ITEM CLUB FEATURE (INDEXEDDB)
  function addItemClub(paramDataClubId, paramDataClubName, paramDataClubLogo) {
    dbPromise.then(function(db) {
      let tx = db.transaction('fav_club', 'readwrite');
      let store = tx.objectStore('fav_club');
      let item = {
        club_id: paramDataClubId,
        club_name: paramDataClubName,
        club_logo: paramDataClubLogo
      };        
      store.add(item);
      let txComplete = tx.complete;
      return txComplete;
    }).then(function() {
      console.log('[IDB] Successfully added your favourite club.');
    }).catch(function(error) {
      console.log('[IDB] Failed to add your favourite club. ', error);
    });
  }

  // DELETE ITEM CLUB FEATURE (INDEXEDDB)
  function deleteItemClub(paramDataClubId) {
    dbPromise.then(function(db) {
      let tx = db.transaction('fav_club', 'readwrite');
      let store = tx.objectStore('fav_club');
      store.delete(paramDataClubId);
      return tx.complete;
    }).then(function() {
      console.log('[IDB] Successfully remove your favourite club.')
    }).catch(function(error) {
      console.log('[IDB] Failed to delete your favourite club. ', error);
    });
  }

  // GET ALL ITEM CLUB FEATURE (INDEXEDDB)
  function getAllItemFavClub() {
    dbPromise.then(function(db) {
      let tx = db.transaction('fav_club', 'readonly');
      let store = tx.objectStore('fav_club');
      return store.getAll();
    }).then(function(data) {
      // console.log(data);
      let contentHTML = '';
      if (Object.keys(data).length < 1) {
        console.log('[IDB] DATA FAVOURITE CLUBS IS EMPTY!');
      } else {
        console.log('[IDB] DATA FAVOURITE CLUBS IS NOT EMPTY!');
        contentHTML += `
          <h5>Your favourite club</h5>
        `;
        data.forEach(function(result) {
          contentHTML += `
            <div class="col s6 m4 l3 xl3 club-favourite-item">
              <a href="#" class="club-favourite-item-anchor" title="`+ result.club_name +`" data-id="`+ result.club_id +`">
                <img class="club-logo" src="`+ result.club_logo +`">
                <span class="club-name" value="`+ result.club_name +`">`+ result.club_name +`</span>
                <span class="remove-favourite-club"><i class="material-icons">close</i></span>
              </a>
            </div> 
          `;
        });
      }
      document.getElementById('data-favourite-club').innerHTML = contentHTML;
      eventClickClubItem('club-favourite-item-anchor'); // EVENT CLICK CLUB ITEM
    })
    .catch(function(error) {
      console.log('[IDB] failed to get all item favourite club. ', error);
    })
  }

  // EVENT CLICK CLUB ITEM
  function eventClickClubItem(paramSelectorClass) {
    document.querySelectorAll('.' + paramSelectorClass).forEach(function(el) {
      el.addEventListener('click',function(e) {
        // console.log(e)
        let dataClubId = parseInt(this.getAttribute('data-id'));
        let dataClubName = this.querySelector('.club-name').getAttribute('value');
        let dataClubLogo = this.querySelector('.club-logo').getAttribute('src');
        if (this.getAttribute('class') == paramSelectorClass) {
          console.log('[IDB] "' + paramSelectorClass + '" Clicked.');
          clubItemClickedDoAddOrDelete(dataClubId, dataClubName, dataClubLogo); // CLUB ITEM CLICKED DO ADD OR DELETE
        } 
        e.preventDefault();
      });
    }); 
  }

  // CLUB ITEM CLICKED DO ADD OR DELETE
  function clubItemClickedDoAddOrDelete(paramDataClubId, paramDataClubName, paramDataClubLogo) {
    dbPromise.then(function(db) {
      let tx = db.transaction('fav_club', 'readonly');
      let store = tx.objectStore('fav_club');
      let storeGetItem = store.get(paramDataClubId);
      return storeGetItem;
    }).then(function(data) {
      console.log('[IDB] Successfully get the favourite club.');
      // console.log(data);
      if (!data) {
        // ADD
        console.log('[IDB] DATA CLUB FAVOURITE IS EMPTY!');
        let confirmAdd = confirm('Do you want to Add ' + paramDataClubName + ' as your favourite club?');
        if (confirmAdd == true) {
          console.log('[IDB] confirm add item is yes.');
          addItemClub(paramDataClubId, paramDataClubName, paramDataClubLogo);
          alert(paramDataClubName + ' successfully added to your favorite club.');
          getAllItemFavClub();
        } else {
          console.log('[IDB] confirm add item is no.');
        }
      } else {
        // REMOVE OR ADD
        console.log('[IDB] DATA FAVOURITE CLUBS IS NOT EMPTY!'); 
        if (data.club_id == paramDataClubId) {
          console.log('[IDB] DATA FAVOURITE CLUB IS SAME!');
          let confirmDelete = confirm('Do you want to Remove ' + paramDataClubName + ' as your favourite club?');
          if (confirmDelete == true) {
            console.log('[IDB] confirm delete item is yes.');
            deleteItemClub(paramDataClubId);
            alert(paramDataClubName + ' successfully removed from your favorite club.');
            getAllItemFavClub();
          } else {
            console.log('[IDB] confirm delete item is no.');
          }
        } else {
          console.log('DATA FAVOURITE CLUB IS NOT SAME!');
          let confirmAdd = confirm('Do you want to Add ' + paramDataClubName + ' as your favourite club?');
          if (confirmAdd == true) {
            console.log('[IDB] confirm add item is yes.');
            addItemClub(paramDataClubId, paramDataClubName, paramDataClubLogo);
            alert(paramDataClubName + ' successfully added to your favorite club.');
            getAllItemFavClub();
          } else {
            console.log('[IDB] confirm add item is no.');
          }
        }
      }
    }).catch(function(error) {
      console.error('[IDB] Error to get the favourite clubs.', error);
    });
  }
}
/* ./INDEXEDDB FAVOURITE CLUB (CREATE, READ, DELETE) */