var createSongRow = function (songNumber, songName, songLength) {
	var template = 
		'<tr class="album-view-song-item">'
	+	'	<td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
	+	'	<td class="song-item-title">' + songName + '</td>'
	+	'	<td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
	+	'</tr>'
	;
	
	var $row = $(template);
	
	var clickHandler = function() {
		var $songNumber = parseInt($(this).attr('data-song-number'));
			
		if (currentlyPlayingSongNumber === null) {
			$('.volume .seek-bar .thumb').css({left: currentVolume + "%"});
			$('.volume .seek-bar .fill').css({width: currentVolume + "%"});
			$(this).html(pauseButtonTemplate);
			setSong($songNumber);
			currentSoundFile.play();
			updateSeekBarWhileSongPlays();
		} else if (currentlyPlayingSongNumber === $songNumber) {
			if (currentSoundFile.isPaused()) {
				$(this).html(pauseButtonTemplate);
				currentSoundFile.play();
				updateSeekBarWhileSongPlays();
			} else {
				$(this).html(playButtonTemplate);
				currentSoundFile.pause();
			}
		} else if (currentlyPlayingSongNumber !== $songNumber) {
			currentSoundFile.stop();
			var $currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
			
			$currentlyPlayingCell.html($currentlyPlayingCell.attr('data-song-number'));
			$(this).html(pauseButtonTemplate);
			setSong($songNumber);
			currentSoundFile.play();
			updateSeekBarWhileSongPlays();
		}
		
		updatePlayerBarSong();
	};
	
	var onHover = function(event) {
		var $songNumberCell = $(this).find('.song-item-number'), 
			$songNumber = parseInt($songNumberCell.attr('data-song-number'));
		
		if ($songNumber !== currentlyPlayingSongNumber) {
			$songNumberCell.html(playButtonTemplate);
		}
	};
	
	var offHover = function(event) {
		var $songNumberCell = $(this).find('.song-item-number'),  
			$songNumber = parseInt($songNumberCell.attr('data-song-number'));
		
		if ($songNumber !== currentlyPlayingSongNumber) {
			$songNumberCell.html($songNumber);
		}
	};

	$row.find('.song-item-number').click(clickHandler);
	$row.hover(onHover, offHover);
	return $row;
};

var setCurrentAlbum = function (album) {
	currentAlbum = album;
	var $albumTitle = $('.album-view-title');
	var $albumArtist = $('.album-view-artist');
	var $albumReleaseInfo = $('.album-view-release-info');
	var $albumImage = $('.album-cover-art');
	var $albumSongList = $('.album-view-song-list');
	
	$albumTitle.text(album.title);
	$albumArtist.text(album.artist);
	$albumReleaseInfo.text(album.year + ' ' + album.label);
	$albumImage.attr('src', album.albumArtUrl);
	
	$albumSongList.empty();
	
	for (var i = 0; i < album.songs.length; i++) {
		var $newRow = createSongRow(i+1, album.songs[i].title, album.songs[i].duration);
		$albumSongList.append($newRow);
	}
};

var setSong = function(songNumber) {
	if (currentSoundFile) {
		currentSoundFile.stop();
	}

	currentlyPlayingSongNumber = parseInt(songNumber);
	currentSongFromAlbum = currentAlbum.songs[songNumber-1];

	currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
		formats: [ 'mp3' ],
		preload: true
	});

	setVolume(currentVolume);
};

var setVolume = function(volume) {
	if (currentSoundFile) {
		currentSoundFile.setVolume(volume);
	}
};

var getSongNumberCell = function(number) {
	return $('.song-item-number[data-song-number="' + number + '"]');
};

var trackIndex = function(album, song) {
	return album.songs.indexOf(song);
};

var updatePlayerBarSong = function() {
	if (currentSongFromAlbum !== null) {
		if (currentSoundFile.isPaused()) {
			$('.main-controls .play-pause').html(playerBarPlayButton);
		} else {
			$('.song-name').text(currentSongFromAlbum.title);
			$('.artist-name').text(currentAlbum.artist);
			$('.artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
			$('.main-controls .play-pause').html(playerBarPauseButton);
		}
	} else {
		$('.main-controls .play-pause').html(playerBarPlayButton);
	}
};

var nextSong = function() {
	var i = trackIndex(currentAlbum, currentSongFromAlbum);
	var $lastSong = getSongNumberCell(i+1);
	
	$lastSong.html($lastSong.attr('data-song-number'));
	
	if (i < currentAlbum.songs.length - 1) {
		i++;
	} else {
		i = 0;
	}
	
	var $newSong = getSongNumberCell(i+1);
	$newSong.html(pauseButtonTemplate);
	
	setSong(i+1);
	currentSoundFile.play();
	updateSeekBarWhileSongPlays();
	updatePlayerBarSong();
};

var previousSong = function() {
	var i = trackIndex(currentAlbum, currentSongFromAlbum);
	var $lastSong = getSongNumberCell(i+1);
	
	$lastSong.html($lastSong.attr('data-song-number'));
	
	if (i > 0) {
		i--;
	} else {
		i = currentAlbum.songs.length - 1;
	}
	
	var $newSong = getSongNumberCell(i+1);
	$newSong.html(pauseButtonTemplate);
	
	setSong(i+1);
	currentSoundFile.play();
	updateSeekBarWhileSongPlays();
	updatePlayerBarSong();
};

var updateSeekPercentage = function ($seekBar, seekBarFillRatio) {
	var offsetXPercent = seekBarFillRatio*100;
	
	offsetXPercent = Math.max(0, offsetXPercent);
	offsetXPercent = Math.min(100, offsetXPercent);
	
	var percentageString = offsetXPercent + '%';
	$seekBar.find('.fill').width(percentageString);
	$seekBar.find('.thumb').css({left: percentageString});
};

var setupSeekBars = function() {
	var $seekBars = $('.player-bar .seek-bar');
	
	$seekBars.click(function(event) {
		var offsetX = event.pageX - $(this).offset().left;
		var barWidth = $(this).width();
		
		var seekBarFillRatio = offsetX / barWidth;
		
		updateSeekPercentage($(this), seekBarFillRatio);
		
		if ($(this).parent().hasClass('seek-control')) {
			seek(seekBarFillRatio * currentSongFromAlbum.duration);
		} else {
			setVolume(seekBarFillRatio * 100);
		}
	});
	
	$seekBars.find('.thumb').mousedown(function(event) {
		var $seekBar = $(this).parent();
		
		$(document).bind('mousemove.thumb', function(event) {
			var offsetX = event.pageX - $seekBar.offset().left;
			var barWidth = $seekBar.width();
			var seekBarFillRatio = offsetX / barWidth;
			
			updateSeekPercentage($seekBar, seekBarFillRatio);
			
			if ($seekBar.hasClass('seek-control')) {
				seek(seekBarFillRatio * 		currentSongFromAlbum.duration);
			} else {
				setVolume(seekBarFillRatio * 100);
			}
		});
		
		$(document).bind('mouseup.thumb', function() {
			$(document).unbind('mousemove.thumb');
			$(document).unbind('mouseup.thumb');
		});
	});
};

var updateSeekBarWhileSongPlays = function() {
	if (currentSoundFile) {
		currentSoundFile.bind('timeupdate', function(event) {
			var seekBarFillRatio = this.getTime() / this.getDuration();
			var $seekBar = $('.seek-control .seek-bar');
			var $totalTime = filterTimeCode(currentSongFromAlbum.duration);
			var $currentTime = filterTimeCode(currentSongFromAlbum.duration * seekBarFillRatio);
			
			updateSeekPercentage($seekBar, seekBarFillRatio);
			setCurrentTimeInPlayerBar($currentTime);
			setTotalTimeInPlayerBar($totalTime);
		});
	}
};

var seek = function(time) {
	if (currentSoundFile) {
		currentSoundFile.setTime(time);
	}
};

var setCurrentTimeInPlayerBar = function(currentTime) {
	$('.current-time').html(currentTime);
};

var setTotalTimeInPlayerBar = function(totalTime) {
	$('.total-time').html(totalTime);
};

var filterTimeCode = function(timeInSeconds) {
	timeInSeconds = parseFloat(timeInSeconds);
	var minutes = Math.floor(timeInSeconds / 60);
	var seconds = Math.floor(timeInSeconds % 60);
	
	if (seconds < 10) {
		return minutes + ":0" + seconds;
	} else {
		return minutes + ":" + seconds;
	}
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function () {
	setCurrentAlbum(albumPicasso);
	setupSeekBars();
	$previousButton.click(previousSong);
	$nextButton.click(nextSong);
});