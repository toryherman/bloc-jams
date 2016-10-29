var albumPicasso = {
	title: 'The Colors',
	artist: 'Pablo Picasso',
	label: 'Cubism',
	year: '1881',
	albumArtUrl: 'assets/images/album_covers/01.png',
	songs: [
		{ title: 'Blue', duration: '4:26' },
		{ title: 'Green', duration: '3:14' },
		{ title: 'Red', duration: '5:01' },
		{ title: 'Pink', duration: '3:21' },
		{ title: 'Magenta', duration: '2:15' }
	]
};

var albumMarconi = {
	title: 'The Telephone',
	artist: 'Guglielmo Marconi',
	label: 'EM',
	year: '1909',
	albumArtUrl: 'assets/images/album_covers/20.png',
	songs: [
		{ title: 'Hello, Operator?', duration: '1:01' },
		{ title: 'Ring, ring, ring', duration: '5:01' },
		{ title: 'Fits in your pocket', duration: '3:21' },
		{ title: 'Can you hear me now?', duration: '3:14' },
		{ title: 'Wrong phone number', duration: '2:15' }
	]
};

var albumAllman = {
	title: 'Eat a Peach',
	artist: 'The Allman Brothers Band',
	label: 'Capricorn',
	year: '1972',
	albumArtUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c3/Eat_a_Peach_%28James_Flournoy_Holmes_album_-_cover_art%29.jpg',
	songs: [
		{ title: "Ain't Wastin' Time No More", duration: '3:40' },
		{ title: 'Les Brers in A Minor', duration: '9:03' },
		{ title: 'Melissa', duration: '3:54' },
		{ title: 'Mountain Jam', duration: '19:37' },
		{ title: 'One Way Out', duration: '4:58' },
		{ title: 'Trouble No More', duration: '3:43' },
		{ title: 'Stand Back', duration: '3:24' },
		{ title: 'Blue Sky', duration: '5:09' },
		{ title: 'Little Martha', duration: '2:07' }
	]
};

var createSongRow = function (songNumber, songName, songLength) {
	var template = 
		'<tr class="album-view-song-item">'
	+	'	<td class="song-item-number">' + songNumber + '</td>'
	+	'	<td class="song-item-title">' + songName + '</td>'
	+	'	<td class="song-item-duration">' + songLength + '</td>'
	+	'</tr>'
	;
	
	return template;
};

var setCurrentAlbum = function (album) {
	var albumTitle = document.getElementsByClassName('album-view-title')[0];
	var albumArtist = document.getElementsByClassName('album-view-artist')[0];
	var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
	var albumImage = document.getElementsByClassName('album-cover-art')[0];
	var albumSongList = document.getElementsByClassName('album-view-song-list')[0];
	
	albumTitle.firstChild.nodeValue = album.title;
	albumArtist.firstChild.nodeValue = album.artist;
	albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
	albumImage.setAttribute('src', album.albumArtUrl);
	
	albumSongList.innerHTML = '';
	
	for (var i = 0; i < album.songs.length; i++) {
		albumSongList.innerHTML += createSongRow(i+1, album.songs[i].title, album.songs[i].duration);
	}
};

//variable to change album on click
var albumArt = document.getElementsByClassName('album-cover-art')[0];
var albumsArray = [albumPicasso, albumMarconi, albumAllman];
var counter = 0;

window.onload = function () {
	setCurrentAlbum(albumPicasso);
};

albumArt.addEventListener('click', function (event) {
	if (counter < 2) {
		counter++;
	} else if (counter == 2) {
		counter = 0;
	}
	setCurrentAlbum(albumsArray[counter]);
});