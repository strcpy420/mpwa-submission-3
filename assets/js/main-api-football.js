const BASE_URL_API_FOOTBALL = 'https://api.football-data.org/v2/';

/* UTILS */
// CONVERT UTC DATE TO GMTWIB
function dateMatchToGMTWIB(paramUtcDate) {
  paramUtcDate = new Date(paramUtcDate);
  paramUtcDate = paramUtcDate.toString();

  // console.log(paramUtcDate);
  return paramUtcDate;
}

// CONVERT UTC DATE TO DATE
function getMatchDate(paramUtcDate) {
  paramUtcDate = dateMatchToGMTWIB(paramUtcDate).toString();
  paramUtcDate = paramUtcDate.split(' ');
  paramUtcDate = paramUtcDate[2] + ' ' + paramUtcDate[1] + ' ' + paramUtcDate[3];

  // console.log(paramUtcDate);
  return paramUtcDate;
}

// CONVERT UTC DATE TO DATE TIME
function getMatchTime(paramUtcDate) {
  paramUtcDate = dateMatchToGMTWIB(paramUtcDate).toString();
  paramUtcDate = paramUtcDate.split(' ')[4];
  paramUtcDate = paramUtcDate.split(':');
  paramUtcDate = paramUtcDate[0] + ':' + paramUtcDate[1];
  paramUtcDate = paramUtcDate.toString();

  // console.log(paramUtcDate);
  return paramUtcDate;
}

// CONVERT UTC DATE TO YEARS
function getDateYearsSeason(paramDate) {
  paramDate = paramDate.split('-')[0];

  // console.log(paramDate);
  return paramDate;
}

// REPLACE SOURCE IMAGE HTTP TO HTTPS
function srcImageHttpToHttps(paramSrc) {
  paramSrc = paramSrc.split('//');
  paramSrcProtocol = paramSrc[0] + '//';
  paramSrcProtocol = paramSrcProtocol.replace(/^http:\/\//i, 'https://');
  paramSrc = paramSrcProtocol + paramSrc[1];

  // console.log(paramSrc);
  return paramSrc;
}

// STATUS RESPONSE FETCH
function status(paramResponse) {
  if (paramResponse.status !== 200) {
    console.log('Error : '  + paramResponse.status);
    return Promise.reject(new Error(paramResponse.statusText));
  } else {
    return Promise.resolve(paramResponse);
  }
}

// CONVERT RESPONSE FETCH TO OBJECT ARRAY
function json(paramResponse) {
  return paramResponse.json();
}
  
// ERROR RESPONSE FETCH
function error(paramErr) {
  console.log('Error : ' + paramErr);
}
/* ./UTILS */ 

/* FETCH API FOOTBALL-DATA */
// GET DATA MATCHES PREMIER LEAGUE
function getDataMatches() {
  // CACHES
  if ('caches' in window) {
    caches.match(BASE_URL_API_FOOTBALL + 'competitions/2021/matches?season=2019&status=LIVE,IN_PLAY,FINISHED,SCHEDULED,PAUSED').then(function(response) {
      if (response) {
        response.json().then(function(data) {
          // console.log(data);
          getMatches(data, 'CACHES');
        })
        .catch(function(error) {
          console.log('[CACHES] failed to get data matches. ', error);
        });        
      }
    });
  }

  // FETCH
  document.getElementById('loader').style.display = 'block';
  fetch(BASE_URL_API_FOOTBALL + 'competitions/2021/matches?season=2019&status=LIVE,IN_PLAY,FINISHED,SCHEDULED,PAUSED', {
    headers: {
      'X-Auth-Token': 'eae4ca7c411840adba8ce68880f5a5f5'
    }
  })
  .then(status)
  .then(json)
  .then(function(data) {
    // console.log(data);
    getMatches(data, 'FETCH');
  })
  .catch(error);
}

// PROCEDURE GET MATCHES
function getMatches(paramData, paramType) {
  let contentHTML = '',
        headerMatches = '',
        valStatusMatch,
        valStatusMatchFull,
        ValSeasonMatchday,
        valMatchDate,
        valHomeClubName,
        valHomeClubScore,
        valMatchTime,
        valAwayClubScore,
        valAwayClubName;
  if (Object.keys(paramData.matches).length < 1) {
    console.log(`[${paramType}] DATA MATCHES IS EMPTY!`);
  } else {
    // console.log(data);
    console.log(`[${paramType}] DATA MATCHES IS NOT EMPTY!`);
    headerMatches += `<h5>Matches</h5>`;
    paramData.matches.forEach(function(result) {
      let resultScore = result.score,
        resultScoreHThomeTeam = resultScore.halfTime.homeTeam,
        resultScoreHTawayTeam = resultScore.halfTime.awayTeam,
        resultScoreFThomeTeam = resultScore.fullTime.homeTeam,
        resultScoreFTawayTeam = resultScore.fullTime.awayTeam,
        resultScoreAEThomeTeam = resultScore.extraTime.homeTeam,
        resultScoreAETawayTeam = resultScore.extraTime.awayTeam,
        resultScorePKhomeTeam = resultScore.penalties.homeTeam,
        resultScorePKawayTeam = resultScore.penalties.awayTeam;

      // console.log(result);
      if (((resultScoreHThomeTeam != null) && (resultScoreHTawayTeam != null)) && ((resultScoreFThomeTeam == null) && (resultScoreFTawayTeam == null))) {
        valStatusMatch = 'HT';
        valStatusMatchFull = 'HALF TIME';
        valHomeClubScore = resultScoreHThomeTeam;
        valAwayClubScore = resultScoreHTawayTeam;
      } else if (((resultScoreHThomeTeam != null) && (resultScoreHTawayTeam != null)) && ((resultScoreFThomeTeam != null) && (resultScoreFTawayTeam != null))) {
        valStatusMatch = 'FT';
        valStatusMatchFull = 'FULL TIME';
        valHomeClubScore = resultScoreFThomeTeam;
        valAwayClubScore = resultScoreFTawayTeam;
      } else if (((resultScoreAEThomeTeam != null) && (resultScoreAETawayTeam != null)) && ((resultScoreFThomeTeam != null) && (resultScoreFTawayTeam != null)) && ((resultScoreHThomeTeam != null) && (resultScoreHTawayTeam != null))) {
        valStatusMatch = 'AET';
        valStatusMatchFull = 'AFTER EXTRA TIME';
        valHomeClubScore = resultScoreAEThomeTeam;
        valAwayClubScore = resultScoreAETawayTeam;
      } else if (((resultScorePKhomeTeam != null) && (resultScorePKawayTeam != null)) && ((resultScoreAEThomeTeam != null) && (resultScoreAETawayTeam != null)) && ((resultScoreFThomeTeam != null) && (resultScoreFTawayTeam != null)) && ((resultScoreHThomeTeam != null) && (resultScoreHTawayTeam != null))) {
        valStatusMatch = 'PK';
        valStatusMatch = 'PENALYTY KICKS';
        valHomeClubScore = resultScorePKhomeTeam;
        valAwayClubScore = resultScorePKawayTeam;
      } else {
        valStatusMatch = '-';
        valStatusMatchFull = '-';
        valHomeClubScore = '-';
        valAwayClubScore = '-';
      }
      ValSeasonMatchday = result.matchday;
      valMatchDate = getMatchDate(result.utcDate);
      valHomeClubName = result.homeTeam.name;
      valAwayClubName = result.awayTeam.name;
      valMatchTime = getMatchTime(result.utcDate);
      contentHTML += `
        <tr>
          <td>
            <div class="circle-status-match" title="Match Day ${ ValSeasonMatchday }">
              ${ ValSeasonMatchday }
            </div>              
          </td>
          <td class="tdm-date-matches">${ valMatchDate }</td>
          <td class="tdm-name-home-club">${ valHomeClubName }</td>
          <td class="tdm-score-home-club">${ valHomeClubScore }</td>
          <td>${ valMatchTime }</td>
          <td class="tdm-score-away-club">${ valAwayClubScore }</td>
          <td class="tdm-name-away-club">${ valAwayClubName }</td>
          <td>
            <div class="circle-status-match" title="${ valStatusMatchFull }">
              ${ valStatusMatch }
            </div>  
          </td>
        </tr>
      `;
    });
    contentHTML += `
      </tbody>
    `;
  }
  // console.log(contentHTML);
  document.getElementById('header-matches').innerHTML = headerMatches;
  document.getElementById('table-data-matches').innerHTML = contentHTML;
  document.getElementById('loader').style.display = 'none';
}

// GET DATA STANDINGS PREMIER LEAGUE
function getDataStandings() {
  // CACHES
  if ('caches' in window) {
    caches.match(BASE_URL_API_FOOTBALL + 'competitions/2021/standings?standingType=TOTAL').then(function(response) {
      if (response) {
        response.json().then(function(data) {
          // console.log(data);
          getStandings(data, 'CACHES');
        })
        .catch(function(error) {
          console.log('[CACHES] failed to get data standings. ', error);
        });
      }
    });
  }

  // FETCH
  document.getElementById('loader').style.display = 'block';
  fetch(BASE_URL_API_FOOTBALL + 'competitions/2021/standings?standingType=TOTAL', {
    headers: {
      'X-Auth-Token': 'eae4ca7c411840adba8ce68880f5a5f5'
    }
  })
  .then(status)
  .then(json)
  .then(function(data) {
    // console.log(data);
    getStandings(data, 'FETCH');
  })
  .catch(error);
}

// PROCEDURE GET STANDINGS
function getStandings(paramData, paramType) {
  let contentHTML = '';
    let headerStandings = '';
    if (Object.keys(paramData.standings).length < 1) {
      console.log(`[${paramType}] DATA STANDINGS IS EMPTY!`);
    } else {
      paramData.standings.forEach(function(result) {
        // console.log(result);
        console.log(`[${paramType}] DATA STANDINGS IS NOT EMPTY!`);
        headerStandings += `<h5>SEASON ${ getDateYearsSeason(paramData.season.startDate) + '-' + getDateYearsSeason(paramData.season.endDate)  }</h5>`;
        contentHTML += `
          <thead>
            <tr>
              <th class="tds-club-header" colspan="3">Club</th>
              <th class="tds-mp u-d" title="Match Played">MP</th>
              <th class="tds-w u-d" title="Won">W</th>
              <th class="tds-d u-d" title="Draw">D</th>
              <th class="tds-l u-d" title="Lost">L</th>
              <th class="tds-gf u-d" title="Goals For">GF</th>
              <th class="tds-gh u-d" title="Goals Against">GA</th>
              <th class="tds-gd u-d" title="Goal Difference">GD</th>
              <th class="tds-pts u-d" title="Point">Pts</th>
            </tr>
          </thead>
          <tbody id="tds-content">
        `;
        result.table.forEach(function(resultTable) {
          // console.log(resultTable);
          contentHTML += `
            <tr>
              <td class="tds-position">${ resultTable.position }</td>
              <td class="tds-logo">
                <img src="${ srcImageHttpToHttps(resultTable.team.crestUrl) }">
              </td>
              <td class="tds-club">${ resultTable.team.name }</td>
              <td class="tds-mp">${ resultTable.playedGames }</td>
              <td class="tds-w">${ resultTable.won }</td>
              <td class="tds-d">${ resultTable.draw }</td>
              <td class="tds-l">${ resultTable.lost }</td>
              <td class="tds-gf">${ resultTable.goalsFor }</td>
              <td class="tds-ga">${ resultTable.goalsAgainst }</td>
              <td class="tds-gd">${ resultTable.goalDifference }</td>
              <td class="tds-pts">${ resultTable.points }</td>
            </tr>
          `;
        });
        contentHTML += `
          </tbody>
        `;
      });
    }
    // console.log(contentHTML);
    document.getElementById('header-standings').innerHTML = headerStandings;
    document.getElementById('table-data-standings').innerHTML = contentHTML;
    document.getElementById('loader').style.display = 'none';
}

// GET DATA CLUBS PREMIER LEAGUE
function getDataClubs() {
  // CACHES
  if ('caches' in window) {
    caches.match(BASE_URL_API_FOOTBALL + 'competitions/2021/teams').then(function(response) {
      if (response) {
        response.json().then(function(data) {
          // console.log(data);
          getClubs(data, 'CACHES');
        })
        .catch(function(error) {
          console.log('[CACHES] failed to get data clubs. ', error);
        });
      }
    });
  }

  // FETCH
  document.getElementById('loader').style.display = 'block';
  fetch(BASE_URL_API_FOOTBALL + 'competitions/2021/teams', {
    headers: {
      'X-Auth-Token': 'eae4ca7c411840adba8ce68880f5a5f5'
    }
  })
  .then(status)
  .then(json)
  .then(function(data) {
    // console.log(data);
    getClubs(data, 'FETCH');
  })
  .catch(error);
}

// PROCEDURE GET CLUBS
function getClubs(paramData, paramType) {
  let contentHTML = '';
    if (Object.keys(paramData.teams).length < 1) {
      console.log(`[${paramType}] DATA CLUBS IS EMPTY!`);
    } else {
      console.log(`[${paramType}] DATA CLUBS IS NOT EMPTY!`);
      contentHTML += `
        <h5>Pick your favourite club</h5>
      `;
      paramData.teams.forEach(function(result) {
        // console.log(result);
        contentHTML += `
          <div class="col s6 m4 l3 xl3 club-item">
            <a href="#" class="club-item-anchor" title="${ result.name }" data-id="${ result.id }">
              <img class="club-logo" src="${ srcImageHttpToHttps(result.crestUrl) }">
              <span class="club-name" value="${ result.name }">${ result.name }</span>
            </a>
          </div>   
        `;
      });
    }
    // console.log(contentHTML);
    document.getElementById('data-club').innerHTML = contentHTML;
    document.getElementById('loader').style.display = 'none';
    eventClickClubItem('club-item-anchor');
}
/* ./FETCH API FOOTBALL-DATA */