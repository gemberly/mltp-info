//-----------------------------------------------------------------------------//
// IF WE ARE ON THE GROUP PAGE, CREATE A CHECK BOX TO TURN ON STATS COLLECTION //
//-----------------------------------------------------------------------------//

if( document.URL.search(/groups\/[a-zA-Z]{8}/) > 0 ) {
	
	//------------------//
	//  SET UP DIALOGS  //
	//------------------//
	
	// spectator dialog div
	var specInputDiv = $('<div id=specInput style="cursor: default; background-color: #E4E4E4;">')[0];
	document.body.appendChild(specInputDiv);
	specInputDiv.hidden = true;
	
	// spectator title and buttons

    var specTitle1 = $('<h2 id=specTitle1 style="margin-bottom: 10px;">It looks like you\'re spectating!</h2>')[0];
	var specTitle2 = $('<txt id=specTitle2>Which team is yours?</txt>')[0];

    var specRedButton = $('<input id=specRedButton type=button value="Red Team" style="margin-top: 20px; margin-right: 10px; margin-bottom: 10px;">')[0];
	specRedButton.onclick = function() {
        $('#spectatorLabel').text('Spectating - Red Team');
        $('#spectatorLabel').css('color', 'red');
		GM_setValue("specTeam", 'r');
		$.unblockUI();
	};
    
    var specBlueButton = $('<input id=specBlueButton type=button value="Blue Team">')[0];
	specBlueButton.onclick = function() {
        $('#spectatorLabel').text('Spectating - Blue Team');
        $('#spectatorLabel').css('color', 'blue');
		GM_setValue("specTeam", 'b');
		$.unblockUI();
	};
	
	// build up spectator div
	var y = $('#specInput');
	y.append(specTitle1);
	y.append('<p>', specTitle2);
	y.append('<p>', specRedButton, specBlueButton);
	    	
	// set up main dialog div
    var statsInputDiv = $('<div id=statsInput style="cursor: default; background-color=#E4E4E4;">')[0];
	document.body.appendChild(statsInputDiv);
	statsInputDiv.hidden = true;
	
	// set up titles and stuff
    var sID_t1 = $('<h2 id=sID_t1>Input Game and Half Info</h2>')[0];    	

	var gamehalfForm = $('<form id=gamehalfForm>');
    var g1h1Radio = $('<input type=radio id=g1h1 name=gamehalf game=1 half=1></input><label for="g1h1"><i> Game 1 Half 1</i></label><p>');
    var g1h2Radio = $('<input type=radio id=g1h2 name=gamehalf game=1 half=2></input><label for="g1h2"><i> Game 1 Half 2</i></label><p>');
    var g2h1Radio = $('<input type=radio id=g2h1 name=gamehalf game=2 half=1></input><label for="g2h1"><i> Game 2 Half 1</i></label><p>');
    var g2h2Radio = $('<input type=radio id=g2h2 name=gamehalf game=2 half=2></input><label for="g2h2"><i> Game 2 Half 2</i></label><p>');
    g1h1Radio[0].checked = true;
    gamehalfForm.append(g1h1Radio, g1h2Radio, g2h1Radio, g2h2Radio);
	
    var sID_t2 = $('<h2 id=sID_t2 style="font-size: 14px; margin-top: 60px">If you are returning from a TIME OUT, input score information here.</h2>');
    var sID_t3 = $('<h2 id=sID_t3 style="font-size: 15px; color:red">Otherwise, leave this area alone!</h2>');
    var sID_st4 = $('<txt id=sID_st4>Your Team: </txt>')[0];
    var sID_yourTeam = $('<input id=sID_yourTeam value=0 style="margin-top: 20px; margin-right: 20px; width: 20px">')[0];
    var sID_st5 = $('<txt id=sID_st5>Other Team: </txt>')[0];
    var sID_otherTeam = $('<input id=sID_otherTeam value=0 style="width: 20px;">')[0];
	
    var sID_ok = $('<input id=ok type=button value=OK>')[0];
	sID_ok.onclick = function() {
        var game, half;
        var radios = $('#gamehalfForm').children('input');
        for(var i = 0; i < radios.length; i++) {
            if(radios[i].checked) {
                game = radios[i].getAttribute('game');
                half = radios[i].getAttribute('half');
            }
        }
        if(!game || !half) return;

		var a = isNaN(Number($('#sID_yourTeam')[0].value));
		var b = isNaN(Number($('#sID_otherTeam')[0].value));
		if( a | b) {
			$('#sID_yourTeam')[0].value = 0;
			$('#sID_otherTeam')[0].value = 0;
			return;
		}
        GM_setValue('gamehalfInfo', {
            game: Number(game),
            half: Number(half),
            increment: false,
            lastUpdate: Date.now()
        });
        GM_setValue('thisTeamTimeoutScore', Number($('#sID_yourTeam')[0].value));
        GM_setValue('otherTeamTimeoutScore', Number($('#sID_otherTeam')[0].value));
                
        // if label was wiggling, stop it 
        if($('#sendStatsLabel')[0].className == 'wiggling') {
            $('#sendStatsLabel').ClassyWiggle('stop');
        }

        // change checkbox label to show what game and half are currently selected
        $('#sendStatsLabel').text('Game ' + game + ' Half ' + half);
        $('#sendStatsLabel').css('color', '#00FF00');
        $('#sendStatsLabel').css('cursor', 'pointer');
		
		$.unblockUI();
		setTimeout(function() { 
            GM_setValue("post_tagpro_stats_status","true");
        }, 500);
	};
		
	var sID_cancel = $('<input id=cancel type=button value=Cancel style="margin-top: 30px; margin-right: 15px; margin-bottom: 15px">')[0];
	sID_cancel.onclick = function() {
		clearDialog();
        GM_setValue("post_tagpro_stats_status","false");
		$.unblockUI();
	};
	
	clearDialog = function() {
        $('#sendStatsLabel').text('Send Stats to Server');
        $('#sendStatsLabel').css('color', 'white');
        $('#sendStatsLabel').css('cursor', 'default');
		$('#sID_yourTeam')[0].value = 0;
		$('#sID_otherTeam')[0].value = 0;
		$('#sendStatsCheckbox')[0].checked = false;
	};
	
	// add titles and stuff to main dialog div
	var t = $('#statsInput');
	t.append(sID_t1);
	t.append(gamehalfForm);
	t.append(sID_t2);
    t.append(sID_t3);
	t.append(sID_st4, sID_yourTeam);
	t.append(sID_st5, sID_otherTeam);
	t.append('<p>', sID_cancel, sID_ok);
	
	//------------------------//
	//  END OF DIALOGS SETUP  //
	//------------------------//

    // This function handles settings each time the group page is visited
    setSettings = function() {
        // make sure cookie for initial scores (scores set in group page) is 
        // set to 0-0
        // this really shouldn't be necessary, but just in case
        GM_setValue('initialScore', {r:"0",b:"0"});

        // set variable to indicate this player is spectating is false
        var spectating =  false;

        // get game/half info
        var gamehalfInfo = GM_getValue('gamehalfInfo');

        // if the flag to save stats is true and it has been less than two 
        // hours since the last update, then check if we need to increment 
        // to the next game/half. then, save the settings.
        if(GM_getValue('post_tagpro_stats_status') === "true" && (Date.now() - gamehalfInfo.lastUpdate < 2*60*60*1000)) {
            var newGame = gamehalfInfo.game;
            var newHalf = gamehalfInfo.half;
            if(gamehalfInfo.increment === true) {
                switch('' + gamehalfInfo.game + gamehalfInfo.half) {
                    case '11':
                        newGame = 1;
                        newHalf = 2;
                        break;
                    case '12':
                        newGame = 2;
                        newHalf = 1;
                        break;
                    case '21':
                        newGame = 2;
                        newHalf = 2;
                        break;
                    case '22':
                    default:
                        newGame = 1;
                        newHalf = 1;
                        GM_setValue('post_tagpro_stats_status', 'false');
                        clearDialog();
                        return;
                }
            }
            $('#g' + newGame + 'h' + newHalf)[0].checked = true;
            $('#ok').click();
            $('#sendStatsCheckbox')[0].checked = true;
        }
    };
    
    
    // make checkbox
    $('#leaveButton').after('<input id=sendStatsCheckbox type=checkbox>');
    $('#sendStatsCheckbox')[0].style.marginLeft='20px';
    
    // make checkbox label (actually a button so it will wiggle)
    $('#sendStatsCheckbox').after('<button id=sendStatsLabel style="background-color: transparent; border: none; color: white; cursor: default; font-size: 16px; outline: none">Send Stats to Server');
    $('#sendStatsLabel')[0].onclick = function() {
        if(this.innerText === "Send Stats to Server") {
            var cmd = $('#sendStatsLabel')[0].className == 'wiggling' ? 'stop' : 'start';
            $('#sendStatsLabel').ClassyWiggle(cmd);
        } else {
            promptFunction();
        }
    };

    // make spectation label - which team is the spectator's
    $('#sendStatsLabel').after('<txt id=spectatorLabel style="cursor:pointer; font-size:16px; font-weight:bold">');
    $('#spectatorLabel')[0].onclick = function() {
        var dialogWidth2 = 400;
        var dialogLeft2 = $(window).width() / 2 - dialogWidth2 / 2;
        $.blockUI({ message: $('#specInput'), css: { width: dialogWidth2+'px', left: dialogLeft2+'px' } });
    };
    
    
    // If it is Sunday night (5:00 PM or later), make the checkbox label wiggle in the group page as a reminder
    if( new Date().getDay() == 0 & new Date().getHours() >= 17 ) {
        $('#sendStatsLabel').ClassyWiggle();
    }
    
    // If the box is checked, make a prompt to get game and half info, then 
    //   run timeout prompt function
    promptFunction = function() {
        if( $('#sendStatsCheckbox')[0].checked ) { // if we just checked the box
			var dialogWidth = 600;
	    	var dialogLeft = $(window).width() / 2 - dialogWidth / 2;
			$.blockUI({ message: $('#statsInput'), 
                        css: { 
                                width: dialogWidth+'px', 
                                left: dialogLeft+'px' 
                             } 
                      });
		} else {
			GM_setValue("post_tagpro_stats_status","false");
			clearDialog();
		}
    };
    

    
    // This function handles the speccing problem. It first checks if the send stats cookie is true. If not,
    //  it sets the spectating cookie to be false and returns. If it is, it checks if the player is in the spectator box.
    //  If so, a dialog is created to ask which team is she/he the captain of (red or blue). Since this will run in a
    //  setInterval, if the captain moves out of spec and then back into spec, it should ask again for their team.
    specCheckFunction = function() {
        if( GM_getValue("post_tagpro_stats_status") === "false") {
            spectating = false;
            clearInterval(swapInterval);
            $('#spectatorLabel').text('');
            return;
        }
        
        if( $(document.getElementsByClassName('you')).closest('div')[0].id === "spectators" ) {
            if(spectating){
                return;
            }
                
            spectating = true;
            var dialogWidth2 = 400;
	    	var dialogLeft2 = $(window).width() / 2 - dialogWidth2 / 2;
			$.blockUI({ message: $('#specInput'), css: { width: dialogWidth2+'px', left: dialogLeft2+'px' } });
            swapInterval = setInterval(checkSwapped, 100);
            
        } else {
            spectating = false;
            clearInterval(swapInterval);
            $('#spectatorLabel').text('');
        }
    };

    arraysEqual = function(arr1, arr2) {
        if(arr1.length !== arr2.length)
            return false;
        for(var i = arr1.length; i--;) {
            if(arr1[i] !== arr2[i])
                return false;
        }
        return true;
    };

    checkSwapped = function() {
        newTeams = {r:[], b:[]};
        $('#redTeam li').each(function(i,e) { newTeams.r.push(e.firstChild.textContent);});
        $('#blueTeam li').each(function(i,e) { newTeams.b.push(e.firstChild.textContent);});
        if(arraysEqual(newTeams.r.sort(), teams.b.sort()) && arraysEqual(newTeams.b.sort(), teams.r.sort()) && newTeams.r.length) {
            swapTeams();
        }
        teams = newTeams;
    };

    swapTeams = function() {
        if(GM_getValue("specTeam") === 'r') {
            $('#spectatorLabel').text('Spectating - Blue Team');
            $('#spectatorLabel').css('color', 'blue');
            GM_setValue("specTeam", 'b');
        } else {
            $('#spectatorLabel').text('Spectating - Red Team');
            $('#spectatorLabel').css('color', 'red');
            GM_setValue("specTeam", 'r');
        }
    };

    teams = {r:[], b:[]};
    spectating = false;
    swapInterval = 0;
    $('#sendStatsCheckbox')[0].onchange = promptFunction;
    setInterval(specCheckFunction, 500);
    setSettings();
    
    // Before leaving the page, save what the scores were set to in group so that we can correct for it in-game
    window.addEventListener('beforeunload', function() { 
        var rScore = document.getElementsByName('redTeamScore')[0].value;
        var bScore = document.getElementsByName('blueTeamScore')[0].value;
        GM_setValue('initialScore', {r:rScore,b:bScore});
        if( $('#blueTeam li').length + $('#redTeam li').length < MINPLAYERS ) {
            GM_setValue('post_tagpro_stats_status', 'false');
        }
    });
    
} 

//------------------------//
// END OF GROUP PAGE CODE //
//------------------------//


// If we are on the main Tagpro site, set 'save stats' cookie to false. 
//   This is to prevent a bug in which a captain leaves a game for which she or he
//   is saving stats WITHOUT going back to the groups page (by closing the tab or whatever).
//   if that captain were to then play a pub, the userscript would try to send stats to the server 
//   because it hasn't been told not to.
if( document.URL.search(".com/$") > 0 || document.URL.search(".fr/$") > 0 ) {
    GM_setValue("post_tagpro_stats_status","false");
    GM_setValue('initialScore', {r:"0",b:"0"});
}



//-----------------------------------------------------------------//
// NOW STARTS THE MAIN CODE FOR SAVING STATS AND SENDING TO SERVER //
//-----------------------------------------------------------------//

if(document.URL.search(/:[0-9]{4}/) >= 0) {
    window.catstatsMLTP = function(catstatsMLTP) {
       
        catstatsMLTP.downloaded = false;
        catstatsMLTP.players = {};
        catstatsMLTP.score = {redTeam: 0, blueTeam: 0};
        catstatsMLTP.columns = ['name', 'plusminus', 'minutes', 'score', 'tags', 'pops',
                            'grabs', 'drops', 'hold', 'captures', 'prevent', 'returns',
                            'support', 'team', 'team captures', 'opponent captures',
                            'arrival', 'departure', 'bombtime', 'tagprotime', 'griptime',
                            'speedtime', 'powerups'];
        catstatsMLTP.gamehalfInfo = GM_getValue('gamehalfInfo');
        
        
        // TODO: Use tagpro.ready
        catstatsMLTP.init = function init() {
            if (window.tagpro && tagpro.socket && window.jQuery)
                return this.setup();
            setTimeout(this.init, 0);
        };
        
        
        
        
        
        var linkId = "postTagproStats";
        
        var tsvSavePrompt = "Send stats";
        
        catstatsMLTP.setup = function setup() {
            var _this = this;
            
            $(document).ready(function() {
                var currentStatusString = GM_getValue("post_tagpro_stats_status");
                var currentStatus;
                
                if (currentStatusString == null) {
                    currentStatus = false;
                } else {
                    currentStatus = (currentStatusString === "true");
                }
                
                catstatsMLTP.wantsStats = currentStatus;
                console.log('current status: ' + currentStatus);
                
            });
            
            // Listen for player updates
            tagpro.socket.on('p', function(data) { _this.onPlayerUpdate.call(_this, data); });
            // Listen for score updates
            tagpro.socket.on('score', function(data) { 
                _this.onScoreUpdate.call(_this, data);                    
                setTimeout(function() {
                    catstatsMLTP.updateExport();
                }, 50);
            });
            // Listen for player quits
            tagpro.socket.on('playerLeft', function(data) { _this.onPlayerLeftUpdate.call(_this, data); });
            // Listen for time and game state changes
            tagpro.socket.on('time', function(data) { _this.onTimeUpdate.call(_this, data); });
            // Listen for map
            tagpro.socket.on('map', function(data) { _this.onMapUpdate.call(_this, data); });
            
            // Listen for end game and attempt download
            tagpro.socket.on('end', function() { _this.onEnd.call(_this); });
            // Before leaving the page attempt download
            window.addEventListener('beforeunload', function() { _this.onEnd.call(_this); });
            
        };
        
        catstatsMLTP.onMapUpdate = function onMapUpdate(data) {
            this.mapName = data.info.name;
        };
        
        /**
	 * Update local player stats
	 * @param {Object} data The 'p' update data
	 */
        catstatsMLTP.onPlayerUpdate = function onPlayerUpdate(data) {
            // Sometimes data is in .u
            data = data.u || data;
            
            var _this = this;
            
            // Loop over all the player updates
            // and update each player in
            // the local player record
            data.forEach(function(playerUpdate) {
                var player = _this.players[playerUpdate.id];
                
                if (!player) { // this player id is not in the local player database
                	
                	// check if a player with the same name is already in the database
                	// if so, delete the old one but save the old one's arrival time
                	// then, create new player and assign that player the old player's arrival time
                	// this will work well for refreshes, but will inflate 'minutes' if a player leaves the game
                	// and then comes back later
                	var refreshed = false;
                	Object.keys(_this.players).forEach(function(key){
                		if( playerUpdate.name === _this.players[key].name ) {
                			console.log(playerUpdate.name + ' refreshed!');
                			refreshed = true;
                			
                			player = _this.createPlayer(playerUpdate.id);
                			player.arrival    = _this.players[key].arrival;
                			player.bombtime   = _this.players[key].bombtime;
                			player.tagprotime = _this.players[key].tagprotime;
                			player.griptime   = _this.players[key].griptime;
                			player.speedtime  = _this.players[key].speedtime;
                			player.diftotal   = _this.players[key].diftotal;
                			delete(_this.players[key]);
                    		_this.updatePlayer(player, tagpro.players[playerUpdate.id]);
                		}
                	});
                		
                    if(!refreshed) {		
                    	player = _this.createPlayer(playerUpdate.id);
                    	_this.updatePlayer(player, tagpro.players[playerUpdate.id]);
                    }
                } else { //player id is already in local player database
                    _this.updatePlayer(player, playerUpdate);
                }
                
            });
        };
        
        
        /**
	* Update the team score
	* @param {Object} data - The 'score' update data
	*/
        catstatsMLTP.onScoreUpdate = function onScoreUpdate(data) {
            this.score.redTeam = data.r - Number(GM_getValue('initialScore').r);
            this.score.blueTeam = data.b - Number(GM_getValue('initialScore').b);
        };
        
        
        /**
	 * Handle players who leave early
	 * @param {Number} playerId - The id of the player leaving
	 */
        catstatsMLTP.onPlayerLeftUpdate = function onPlayerLeftUpdate(playerId) {
            // Player leaves mid-game
            if(tagpro.state == 1) {
                this.updatePlayerAfterDeparture(this.players[playerId], Date.now(), false, true);
            }
            
            // Player leaves before the game
            if(tagpro.state == 3) {
                delete this.players[playerId];
            }
            
            // Ignore all other player's leaving
        };
        
        
        /**
	 * Track the amount of time a player is in the game
	 * @param {Object} data - The time object
	 */
        catstatsMLTP.onTimeUpdate = function onTimeUpdate(data) {
            if(tagpro.state == 2) return; //Probably unneeded
            if(tagpro.state !== 3) {
                catstatsMLTP.gamehalfInfo.increment = true;
                GM_setValue('gamehalfInfo', catstatsMLTP.gamehalfInfo);
            }
            var playerIds = Object.keys(this.players);
            var _this = this;
            playerIds.forEach(function(id) {
                _this.players[id]['arrival'] = data.time;
            });
        };
        
        
        /**
	 * Called when the game has ended or
	 * the client is leaving the page
	 */
        catstatsMLTP.onEnd = function onEnd() {
            if(tagpro.state === 3) return;
            if(this.wantsStats && !this.downloaded) {
                this.exportStats(false);
                this.exportStats(true);
            }
        };
        
        /**
	 * Prepare the local player record for export
	 */
        catstatsMLTP.prepareStats = function prepareStats(final) {
            var now = Date.now();
            var _this = this;
            var stats = Object.keys(this.players).map(function(id) {
                var player = _this.players[id];
                _this.updatePlayerAfterDeparture(player, now, final, false);
                
                // calculate plusminus for players who have not departed
                //  and update current score for that player
                if(! player['departed']) {
                    if(player['current score']) {
                        var mult = player.team === 1 ? 1 : -1;
                        var rScore = tagpro.score.r - player['current score'].r;
                        var bScore = tagpro.score.b - player['current score'].b;
                        player['diftotal'] += mult * (rScore - bScore);
                    } 
                    player['current score'] = tagpro.score;
                }
                
                // Record every column for the spreadsheet
                var columns = {};
                columns['name']        = player['name'] || '';
                columns['plusminus']   = player['diftotal'] || 0;
                columns['minutes']     = player['minutes'] || 0;
                columns['score']       = player['score'] || 0;
                columns['tags']        = player['s-tags'] || 0;
                columns['pops']        = player['s-pops'] || 0;
                columns['grabs']       = player['s-grabs'] || 0;
                columns['drops']       = player['s-drops'] || 0;
                columns['hold']        = player['s-hold'] || 0;
                columns['captures']    = player['s-captures'] || 0;
                columns['prevent']     = player['s-prevent'] || 0;
                columns['returns']     = player['s-returns'] || 0;
                columns['support']     = player['s-support'] || 0;
                columns['powerups']    = player['s-powerups'] || 0;
                columns['team']        = player.team || 0;
                columns['team captures']     = player.team == 1 ? tagpro.score.r - Number(GM_getValue('initialScore').r): tagpro.score.b - Number(GM_getValue('initialScore').b);
                columns['opponent captures'] =  player.team == 1 ? tagpro.score.b - Number(GM_getValue('initialScore').b) : tagpro.score.r - Number(GM_getValue('initialScore').r);
                columns['arrival']     = player['arrival'] || 0;
                columns['departure']   = player['departure'] || 0;
                columns['bombtime']    = player['bombtime'] || 0;
                columns['tagprotime']  = player['tagprotime'] || 0;
                columns['griptime']    = player['griptime'] || 0;
                columns['speedtime']   = player['speedtime'] || 0;
                
                return columns;
            });
            
            
            var mapName = catstatsMLTP.mapName || "Unknown";
            var serverName = tagpro.serverHost;
            
            // add current score by team 
            var redScore = tagpro.score.r;
            var blueScore = tagpro.score.b;
            
            
            if(tagpro.spectator === 'watching') {
                var thisTeam = GM_getValue('specTeam') === 'r' ? 1 : 2;
            } else {
                var thisTeam = tagpro.players[tagpro.playerId].team;
            }
            
            if(thisTeam == 1) {
                var thisTeamScore = redScore + Number(GM_getValue('thisTeamTimeoutScore')) - Number(GM_getValue('initialScore').r);
                var otherTeamScore = blueScore + Number(GM_getValue('otherTeamTimeoutScore')) - Number(GM_getValue('initialScore').b);
            } else {
                var thisTeamScore = blueScore + Number(GM_getValue('thisTeamTimeoutScore')) - Number(GM_getValue('initialScore').b);
                var otherTeamScore = redScore + Number(GM_getValue('otherTeamTimeoutScore')) - Number(GM_getValue('initialScore').r);
            }   
            
            // add map, server, game, half, key, and score objects to stats array
            var statsObj = {
                map: mapName,
                server: serverName,
                game: catstatsMLTP.gamehalfInfo.game,
                half: catstatsMLTP.gamehalfInfo.half,
                userkey: KEY,
                score: {thisTeamScore: thisTeamScore, otherTeamScore: otherTeamScore},
                state: tagpro.state,
                stats: stats
            };
            
            return statsObj;
        };
        
        
        /**
	 * Called when a cap occurs. It exports data as an update, not as a final stats export
	 */
        catstatsMLTP.updateExport = function updateExport() {
            if ( this.wantsStats ) {
                this.exportStats(false);
            }
        };
        
        /**
	 * Create a local player record
	 * @param {Number} id - the id of the player
	 */
        catstatsMLTP.createPlayer = function createPlayer(id) {
            var player = this.players[id] = {};
            player['arrival']     = tagpro.gameEndsAt - Date.now();
            player['bombtime']    = 0;
            player['tagprotime']  = 0;
            player['griptime']    = 0;
            player['speedtime']   = 0;
            player['bombtr']      = false;
            player['tagprotr']    = false;
            player['griptr']      = false;
            player['speedtr']     = false;
            player['diftotal']    = 0;
            player['departed']    = false;
            return player;
        };
        
        
        /**
	 * Update the local player record with new data
	 * @param {Object} player - reference to local player record
	 * @param {Object} playerUpdate - new player data
	 */
        catstatsMLTP.updatePlayer = function updatePlayer(player, playerUpdate) {
            var attrs = Object.keys(playerUpdate);
            var _this = this;
            attrs.forEach(function(attr) {
                var data = playerUpdate[attr];
                
                // if this is a powerup - update time tracking
                if(attr === 'bomb' || attr === 'tagpro' || attr === 'speed' || attr === 'grip') {
                    _this.updatePlayerTimer(player, attr, data);
                }
                
                // update the local player record with new data
                if(typeof data !== 'object') {
                    player[attr] = data;
                }
            });
        };
        
        
        /**
	 * Update timers on the local player record
	 * @param {Object} player - reference to local player record
	 * @param {Object} timerName - name of the timer to update
	 * @param {Object} timerValue - value of the timer to update
	 */
        catstatsMLTP.updatePlayerTimer = function updatePlayerTimer(player, timerName, timerValue) {
            // the player has the powerup and
            // we aren't tracking the time yet
            if(timerValue === true && !player[timerName+'tr']) {
                player[timerName+'tr'] = true;
                player[timerName+'start'] = Date.now();
                return;
            }
            
            // player lost the powerup, save the time
            if(timerValue === false && player[timerName+'tr'] === true) {
                player[timerName+'tr'] = false;
                player[timerName+'time'] += Date.now() - player[timerName+'start'];
                return;
            }
        }
        
        /**
	 * When a player leaves or the game is over perform some cleanup
	 * @param {Object} player - reference to local player record
	 * @param {Number} [now] - unix timestamp representing current time
	 */
        catstatsMLTP.updatePlayerAfterDeparture = function updatePlayerAfterDeparture (player, now, final, playerLeft) {
            var now = now || Date.now();
            
            // ignore players who have already departed
            if(player['departed']) {
                return;
            }
            
            // if player left game early, set departed flag
            if(playerLeft) {
                player['departed'] = true;
            }
            
            // update minutes in non-final updates
            if(!final && !player['departed']) {
                var seconds  = (player['arrival'] - (tagpro.gameEndsAt - now)) / 1e3;
                player['minutes'] = Math.round(seconds/60);
                return;
            }
            
            
            player['departure'] = tagpro.gameEndsAt - now;
            
            // Record the minutes played
            var seconds  = (player['arrival'] - player['departure']) / 1e3;
            player['minutes'] = Math.round(seconds/60);
            
            var _this = this;
            // Update all timers
            ['bomb', 'tagpro', 'grip', 'speed'].forEach(function(timerName) {
                _this.updatePlayerTimer(player, timerName, false);
            });
        }
        
        /**
	 * Create the document and trigger a download
	 */
        catstatsMLTP.exportStats = function exportStats(final) {
            var data = this.prepareStats(final);
            if(sendStats){
                $.ajax({url: final ? FINALURL : UPDATEURL, method: 'POST', data: data })
                    .done(function (res) {
                        console.log(res);
                    }).fail(function (err) {
                        console.log(err);
                    });
            }
            if(final) {
                this.downloaded = true;
            }
        }
        
        $(function() {
            window.tagpro.ready(function() {
                catstatsMLTP.init();
            });
        });
        
        return catstatsMLTP;
    };
    window.catstatsMLTP({});
    console.log("y");
}