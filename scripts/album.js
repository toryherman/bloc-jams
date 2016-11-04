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
			currentlyPlayingSongNumber = $songNumber;
			currentSongFromAlbum = currentAlbum.songs[$songNumber - 1];
		} else if (currentlyPlayingSongNumber === $songNumber) {
			$(this).html(playButtonTemplate);
			currentlyPlayingSongNumber = null;
			currentSongFromAlbum = null;
		} else if (currentlyPlayingSongNumber !== $songNumber) {
			var $currentlyPlayingCell = $(document).find('[data-song-number="' + currentlyPlayingSongNumber + '"]');
			
			$currentlyPlayingCell.html($currentlyPlayingCell.attr('data-song-number'));
			$(this).html(pauseButtonTemplate);
			currentlyPlayingSongNumber = $songNumber;
			currentSongFromAlbum = currentAlbum.songs[$songNumber - 1];
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

var trackIndex = function(album, song) {
	return album.songs.indexOf(song);
};

var updatePlayerBarSong = function() {
	if (currentSongFromAlbum !== null) {
		$('.song-name').text(currentSongFromAlbum.title);
		$('.artist-name').text(currentAlbum.artist);
		$('.artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
		$('.main-controls .play-pause').html(playerBarPauseButton);
	} else {
		$('.main-controls .play-pause').html(playerBarPlayButton);
	}
};

var nextSong = function() {
	var i = trackIndex(currentAlbum, currentSongFromAlbum);
	var $lastSong = $(document).find('[data-song-number="' + (i+1) + '"]');
	
	$lastSong.html($lastSong.attr('data-song-number'));
	
	if (i < currentAlbum.songs.length - 1) {
		i++;
	} else {
		i = 0;
	}
	
	var $newSong = $(document).find('[data-song-number="' + (i+1) + '"]');
	$newSong.html(pauseButtonTemplate);
	
	currentlyPlayingSongNumber = i+1;
	currentSongFromAlbum = currentAlbum.songs[i];
	updatePlayerBarSong();
};

var previousSong = function() {
	var i = trackIndex(currentAlbum, currentSongFromAlbum);
	var $lastSong = $(document).find('[data-song-number="' + (i+1) + '"]');
	
	$lastSong.html($lastSong.attr('data-song-number'));
	
	if (i > 0) {
		i--;
	} else {
		i = currentAlbum.songs.length - 1;
	}
	
	var $newSong = $(document).find('[data-song-number="' + (i+1) + '"]');
	$newSong.html(pauseButtonTemplate);
	
	currentlyPlayingSongNumber = i+1;
	currentSongFromAlbum = currentAlbum.songs[i];
	updatePlayerBarSong();
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function () {
	setCurrentAlbum(albumPicasso);
	$previousButton.click(previousSong);
	$nextButton.click(nextSong);
});