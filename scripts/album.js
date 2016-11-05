var createSongRow = function (songNumber, songName, songLength) {
	var template = 
		'<tr class="album-view-song-item">'
	+	'	<td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
	+	'	<td class="song-item-title">' + songName + '</td>'
	+	'	<td class="song-item-duration">' + songLength + '</td>'
	+	'</tr>'
	;
	
	var $row = $(template);
	
	var clickHandler = function() {
		var $songNumber = parseInt($(this).attr('data-song-number'));
			
		if (currentlyPlayingSongNumber === null) {
			$(this).html(pauseButtonTemplate);
			setSong($songNumber);
			currentSoundFile.play();
		} else if (currentlyPlayingSongNumber === $songNumber) {
			if (currentSoundFile.isPaused()) {
				$(this).html(pauseButtonTemplate);
				currentSoundFile.play();
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
	updatePlayerBarSong();
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
	$previousButton.click(previousSong);
	$nextButton.click(nextSong);
});