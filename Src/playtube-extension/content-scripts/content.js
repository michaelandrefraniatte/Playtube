chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

document.getElementsByTagName('html')[0].innerHTML = '<head></head><body></body>';

var script = document.createElement('script'); 
script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js'; 
document.head.appendChild(script);

var stringinject = `
    <link rel="shortcut icon" href="${request.favicon}" type="image/png" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <style>

body {
    background: #222222;
    color: #FFFFFF;
    font-family: sans-serif;
    text-decoration: none;
    font-size: 14px;
}

a, a:hover, a:focus, a:active {
    color: #FFFFFF;
    font-family: sans-serif;
    text-decoration: none;
}

.slideshow-container {
    justify-content: center;
    display: flex;
    height: 100%;
    width: 100%
    position: fixed;
    left: 0;
    top: 0;
}

#navbar {
    background: rgba(0, 0, 0, 0.9);
    position: absolute;
    height: 50px;
    top: -50px;
    left: 0;
    width: 100%;
    height: 50px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: top 0.3s;
    color: #FFFFFF;
    font-family: sans-serif;
    text-decoration: none;
}

.menushow-container div, .menushow-container a, label {
    align-items: center;
    line-height: 50px;
    text-align: center;
    display: inline;
}

.navMenu {
    margin-right: 30px;
    margin-left: 30px;
}

#list {
    background: rgba(0, 0, 0, 0.9);
    position: fixed;
    overflow-y: auto;
    overflow-x: hidden;
    display: none;
    top: 50px;
    left: 0;
    width: 100%;
    margin: 0;
    padding: 0;
    text-align: center;
    justify-content: stretch;
    align-items: stretch;
    justify-items: stretch;
}

#list a {
    display: inline-flex;
    margin: 20px;
    color: #FFFFFF;
    font-family: sans-serif;
    text-decoration: none;
}

#overlay {
    background: rgba(0, 0, 0, 0.9);
    position: fixed;
    overflow-y: auto;
    overflow-x: hidden;
    display: inline-block;
    text-align: center;
    justify-content: stretch;
    width: 100%;
    height: 240px;
    max-height: 240px;
    transition: top 0.3s;
    top: 100%;
    left: 0;
    color: #FFFFFF;
    font-family: sans-serif;
    text-decoration: none;
}

#overlay iframe {
    pointer-events: none;
}

iframe {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

#overlay figure {
    height: 210px;
    width: 240px;
    margin: 15px;
    display: inline-block;
}

.overlaytitle {
    height: 60px;
    width: 240px;
    color: #FFFFFF;
}

.overlayimage {
    height: 150px;
    width: 240px;
}

img {
    border: 0;
}

.goto, .gotochannel, .collaspse, .folderminus, .folderplus, .foldersave, .folderopen, .fileminus, .fileplus, .addapikey, .random, .loop, .allrandom, .voicerecognition, .speech {
    cursor: pointer;
    text-align: center;
    color: white;
    overflow: hidden;
}

.centered {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
}

.centered:hover {
    background-color: black;
}

.prev, .next {
    cursor: pointer;
    position: fixed;
    top: 50%;
    width: auto;
    padding: 16px;
    margin-top: -22px;
    color: white;
    font-weight: bold;
    font-size: 18px;
    transition: 0.6s ease;
    user-select: none;
    text-decoration: none;
}

.prev {
    left: 0;
}

.next {
    right: 0;
}

.prev:hover, .next:hover {
    background-color: rgba(0,0,0,0.8);
}

.thumbnailed {
    outline: 4px solid white;
    outline-offset: -4px;
}

.icon-upload > input {
    display: none;
}

.icon-download > input {
    display: none;
}

.hide {
    display: none;
}

.show {
    display: flex;
}

.spinner {
    position: fixed;
    top: calc(50% - 50px);
    left: calc(50% - 50px);
    text-align: center;
    font-size: 100px;
}

/* width */
::-webkit-scrollbar {
    width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
    background: #000;
}

/* Handle */
::-webkit-scrollbar-thumb {
    background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
    background: #eee;
}

#canvas {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100px;
}

.ad-showing, .ad-container, .ytp-ad-overlay-open, .video-ads, .ytp-ad-overlay-image, .ytp-ad-overlay-container {
    display: none !important;
}

    </style>`;

document.getElementsByTagName('head')[0].innerHTML = stringinject;

stringinject = `

    <!-- Visualizer container -->
    <canvas id=\'canvas\'></canvas>

    <!-- Slideshow container -->
    <div class="slideshow-container" id="slideshow"></div>

    <!-- Menushow container -->
    <div class="menushow-container" id="navbar"></div>

    <!-- List container -->
    <div id="list"></div>

    <!-- Overlay container -->
    <div id="overlay"></div>

    <!-- Loading spinner overlay container -->
    <div class="fa fa-spinner fa-spin spinner hide"></div>

    <script>

var cutfilmon = false;
var menuIndex = 1;
var slideIndex = 1;
var arrayMenuIndex = [];
var arraySlideIndex = [];
var arrayIndex = -1;
var obj = {};
var videoPlayer = {};
var sizescreenx = window.innerWidth;
var sizescreeny = window.innerHeight;
var videos = {};
var done = false;
var wd = 2;
var wu = 2;
var checkfolder = "";
var collapse = false;
var thumbnails = {};
var titles = {};
var playlists = {};
var isplaylist = {};
var rand = false;
var looping = false;
var allrand = true;
var speeching = false;
var voicer = false;
var goingtovideo = false;
var goingtochannel = false;
var clickonmenu = false;
var starting = true;
var playerid = [];
var playertitle = [];
var audioCtx;
var source;
var stream;
var ctx;
var analyser;
var bufferLength;
var dataArray;
var WIDTH;
var HEIGHT;
var barWidth;
var barHeight;
var x;
var canvas;
var titletemp = "";
var playlisttemp = "";
var videoidtemp = "";
var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
var recognition = new SpeechRecognition();
var threadvoicer;

function changeTitle() {
    document.title = "Playtube";
}

$.ajax({
    url: 'https://www.youtube.com/iframe_api',
    dataType: 'script'
}).done(function() {
    loadPlayer();
});

function loadPlayer() {
    var getitem = localStorage.getItem("playlists");
    if (getitem == "" | getitem == null | getitem == "undefined") {
        localStorage.setItem("playlists", "[]");
    }
    window.onYouTubePlayerAPIReady = function() {
        processFill();
        setVisualizer();
    };
}

function reLoadPlayer() {
    $("#overlay").empty();
    $("#slideshow").empty();
    cutfilmon = false;
    menuIndex = 1;
    slideIndex = 1;
    obj = {};
    videoPlayer = {};
    sizescreenx = window.innerWidth;
    sizescreeny = window.innerHeight;
    videos = {};
    done = false;
    wd = 2;
    wu = 2;
    checkfolder = "";
    thumbnails = {};
    titles = {};
    playlists = {};
    isplaylist = {};
    rand = false;
    looping = false;
    allrand = true;
    speeching = false;
    voicer = false;
    clearInterval(threadvoicer);
    try {
        recognition.stop();
    }
    catch {}
    goingtovideo = false;
    goingtochannel = false;
    clickonmenu = false;
    starting = true;
    playerid = [];
    playertitle = [];
    videoidtemp = "";
    processFill();
}

function processFill() {
    changeTitle();
    getAllFilesFromFolders();
}

function setVideoSource(id) {
    var folder = $("#navbar .folder:visible").text();
    var videoid = id.replace(folder + "-", "");
    createPlayer(id, sizescreenx / 1.7, sizescreeny / 1.4, videoid, folder, titles[videoid]);
    var str = id.replace(folder + "-", "https://www.youtube.com/watch?v=");
    var a = document.getElementById("download");
    a.href = str;
}

function setVideoPlayOverlay() {
    $("img").removeClass("thumbnailed");
    var id = $(".video:visible").attr("id");
    var el = document.getElementById(id + "-Overlay");
    if (el != null & el != "")
        el.classList.add("thumbnailed");
    var elements = document.getElementsByClassName("overlaytitle");
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.cssText = "color:#FFFFFF;";
    }
    var e = document.getElementById(id + "-OverlayTitle");
    if (e != null & e != "")
        e.style.cssText = "color:#FFFFFF;font-style:italic;font-weight:700;";
}

function plusSlides(n) {
    if (n == -1 | (n == 1 & arrayIndex < arraySlideIndex.length - 1)) {
        showSlides(n);
    }
    else if (checkVideoInOverlay()) {
        if (looping) {
            showSlides(slideIndex);
        }
        else {
            showSlides(slideIndex += n);
        }
    }
    else {
        clickMenu();
    }
}

function showSlides(n) {
    var classname = $(".video:visible").attr("class"); 
    var folder =  classname.replace("video ", "");
    var id = $(".video:visible").attr("id"); 
    var previousvideoid = id.replace(folder + "-", "");
    try {
        videoPlayer[previousvideoid].stopVideo();
    }
    catch {}
    try {
        videoPlayer[previousvideoid].destroy();
    }
    catch {}
    try {
        videoPlayer[previousvideoid].pauseVideo();
    }
    catch {}
    var folder = $("#navbar .folder:visible").text();
    var files = obj[folder];
    if (!goingtovideo & !goingtochannel) {
        if (n == -1) {
            arrayIndex -= 1;
            if (arrayIndex <= 0) {
                arrayIndex = 0;
            }
            menuIndex = arrayMenuIndex[arrayIndex];
            slideIndex = arraySlideIndex[arrayIndex];
            showMenu(menuIndex);
            createOverlay();
            createSlide();
        }
        else if (n == 1 & arrayIndex < arraySlideIndex.length - 1) {
            arrayIndex += 1;
            menuIndex = arrayMenuIndex[arrayIndex];
            slideIndex = arraySlideIndex[arrayIndex];
            showMenu(menuIndex);
            createOverlay();
            createSlide();
        }
        else if (!looping) {
            if ((allrand & !clickonmenu) | starting) {
                var folders = (Object.keys(obj).map(key => key));
                var rndnext = folders.length;
                var rnd = Math.floor(Math.random() * rndnext) + 1;
                menuIndex = rnd;
                showMenu(menuIndex);
                createOverlay();
                var folder = $("#navbar .folder:visible").text();
                var files = obj[folder];
                var rndnext = files.length;
                var rnd = Math.floor(Math.random() * rndnext) + 1;
                slideIndex = rnd;
                createSlide();
            }
            else if (rand | (allrand & clickonmenu)) {
                var rndnext = files.length;
                var rnd = Math.floor(Math.random() * rndnext) + 1;
                slideIndex = rnd;
            }
            else {
                if (n > files.length) {
                    slideIndex = 1;
                }    
                if (n < 1) {
                    slideIndex = files.length;
                }
            }
            arrayMenuIndex.push(menuIndex);
            arraySlideIndex.push(slideIndex);
            arrayIndex = arrayMenuIndex.length;
        }
    }
    else {
        arrayMenuIndex.push(menuIndex);
        arraySlideIndex.push(slideIndex);
        arrayIndex = arrayMenuIndex.length;
    }
    goingtochannel = false;
    goingtovideo = false;
    clickonmenu = false;
    starting = false;
    setPlayer(slideIndex - 1);
    setVideoSource(playerid[slideIndex - 1]);
    setVideoPlayOverlay();
}

function plusMenu(n) {
    showMenu(menuIndex += n);
    scrollToThumbnail(videoidtemp);
}

function showMenu(n) {
    var menu = document.getElementsByClassName("myMenu");
    if (n > menu.length) {
        menuIndex = 1;
    }
    if (n < 1) {
        menuIndex = menu.length;
    }
    for (var i = 0; i < menu.length; i++) {
        menu[i].style.display = "none";
    }
    menu[menuIndex-1].style.display = "block";
    createOverlay();
    setVideoPlayOverlay();
}

function getAllFilesFromFolders() {
    try {
        $(".spinner").removeClass("hide");
        $(".spinner").addClass("show");
        playlists = JSON.parse(localStorage.getItem("playlists") || "[]");
        playlists = transformObj(playlists);
        var grouped = transformArr(playlists);
        grouped.forEach(function(val, index) {
            var name = val.playlist;
            var files = val.videoids;
            var array = [];
            var n = 0;
            for (let file of files) {
                if (file.videoid != "" & file.videotitle != "") {
                    var videoid = file.videoid;
    	            array.push(videoid);
                    titles[videoid] = file.videotitle;
                    thumbnails[videoid] = "https://img.youtube.com/vi/" + videoid + "/mqdefault.jpg";
                }
             };
             obj[name] = array;
        });
    }
    catch {
        localStorage.setItem("playlists", "[]");
    }
    $(".spinner").removeClass("show");
    $(".spinner").addClass("hide");
    createMenu();
    clickMenu();
}

function createPlayer(classid, x, y, videoid, playlist, title) {
    if (speeching) {
        var msg = new SpeechSynthesisUtterance();
        msg.text = playlist + ", " + title;
        window.speechSynthesis.speak(msg);
    }
    window.YT.ready(function() {
        videoPlayer[videoid] = new YT.Player(classid, {
            width: "70%",
            height: "70%",
            videoId: videoid,
            playerVars: {
              autoplay: 1,
              controls: 1,
              rel: 1,
              showinfo: 1,
              loop: 0,
              modestbranding: 1
            },
            events: {  
                "onReady": onPlayerReady,
                "onStateChange": onPlayerStateChange, 
                "onError": onPlayerError
            }
        });
        titletemp = title;
        playlisttemp = playlist;
        videoidtemp = videoid;
        scrollToThumbnail(videoid);
        enlightPlaylist(playlist);
    });
}

function scrollToThumbnail(videoid) {
    var folder = $("#navbar .folder:visible").text();
    var file = videoid;
    var id = folder + "-" + file + "-Overlay";
    var element = document.getElementById(id).parentNode;
    if (element != null & element != "")
        setTimeout(() => { element.scrollIntoView({ block: "center" }); }, 1000);
}

function enlightPlaylist(playlist) {
    var elements = document.getElementById("list").getElementsByTagName("a");
    for (var i = 0; i < elements.length; i++) {
        if (elements[i].innerHTML == playlist)
            elements[i].style.cssText = "color:#FFFFFF;font-style:italic;font-weight:700;";
        else
            elements[i].style.cssText = "color:#FFFFFF;";
    }
}

function onPlayerReady(event) {  
    event.target.setPlaybackQuality("small"); 
    if (checkVideoInOverlay()) {
        if (event.target.getDuration() <= 0) {
            slideIndex += 1;
            showSlides(slideIndex);
        }
        if (event.data != YT.PlayerState.PLAYING) {
            var classname = $(".video:visible").attr("class"); 
            var folder =  classname.replace("video ", "");
            var id = $(".video:visible").attr("id"); 
            var str = id.replace(folder + "-", "");
            videoPlayer[str].playVideo();
         }
    }
    else {
        clickMenu();
    }
} 

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
        event.target.destroy();
    };
    if (checkVideoInOverlay()) {
        if (event.data == YT.PlayerState.ENDED) {
            if (allrand) {
                var folders = (Object.keys(obj).map(key => key));
                var rndnext = folders.length;
                var rnd = Math.floor(Math.random() * rndnext) + 1;
                menuIndex = rnd;
                showMenu(menuIndex);
                createOverlay();
                var folder = $("#navbar .folder:visible").text();
                var files = obj[folder];
                var rndnext = files.length;
                var rnd = Math.floor(Math.random() * rndnext) + 1;
                slideIndex = rnd;
                arrayMenuIndex.push(menuIndex);
                arraySlideIndex.push(slideIndex);
                arrayIndex = arrayMenuIndex.length;
                createSlide();
                setPlayer(slideIndex - 1);
                setVideoSource(playerid[slideIndex - 1]);
                setVideoPlayOverlay();
            }
            else if (rand) {  
                var folder = $("#navbar .folder:visible").text();
                var files = obj[folder];
                var rndnext = files.length;
                var rnd = Math.floor(Math.random() * rndnext) + 1;
                slideIndex = rnd;
                arrayMenuIndex.push(menuIndex);
                arraySlideIndex.push(slideIndex);
                arrayIndex = arrayMenuIndex.length;
                setPlayer(slideIndex - 1);
                setVideoSource(playerid[slideIndex - 1]);
                setVideoPlayOverlay();
            }
            else if (!looping) {
                slideIndex += 1;
                showSlides(slideIndex);
            }
            else {
                showSlides(slideIndex);
            }
        }
        if (event.data != YT.PlayerState.PAUSED) {
            var classname = $(".video:visible").attr("class"); 
            var folder =  classname.replace("video ", "");
            var id = $(".video:visible").attr("id"); 
            var str = id.replace(folder + "-", "");
            videoPlayer[str].playVideo();
        }
    }
    else {
        clickMenu();
    }
}

function onPlayerError(event) {
    arrayMenuIndex = arrayMenuIndex.slice(0, -1);
    arraySlideIndex = arraySlideIndex.slice(0, -1);
    arrayIndex -= 1;
    if (arrayIndex < arraySlideIndex.length - 1) {
        plusSlides(1);
    }
    else {
        if (checkVideoInOverlay()) {
            slideIndex += 1;
            showSlides(slideIndex);
            var classname = $(".video:visible").attr("class"); 
            var folder =  classname.replace("video ", "");
            var id = $(".video:visible").attr("id"); 
            var str = id.replace(folder + "-", "");
            videoPlayer[str].playVideo();
        }
        else {
            clickMenu();
        }
    }
}

function createMenu() {
    var keyNames = Object.keys(obj).sort((a, b) => b.localeCompare(a, "es", { sensitivity: "base" })).reverse();
    let htmlString = "";
    htmlString = "<div class=\'bg-light collaspse\' style=\'display:float;position:fixed;float:left;left:10px;\' onclick=\'listCollaspse();\' title=\'see playlists\'><i class=\'fa fa-bars\'></i></div><div class=\'bg-light folderminus\' style=\'display:float;position:fixed;float:left;left:40px;\' onclick=\'listminus();\' title=\'remove a playlist\'><i class=\'fa fa-minus\'></i></div><div class=\'bg-light folderplus\' style=\'display:float;position:fixed;float:left;left:70px;\' onclick=\'listplus();\' title=\'add a playlist\'><i class=\'fa fa-plus\'></i></div><div class=\'icon-download\' style=\'display:float;position:fixed;float:left;left:100px;\'><label for=\'filename\'><div class=\'bg-light foldersave\'><i class=\'fa fa-save\' title=\'save playlists\'></i></div></label><input type=\'button\' onClick=\'handleFilename()\' value=\'Save\' class=\'button\' id=\'filename\'></div><div class=\'icon-upload\' style=\'display:float;position:fixed;float:left;left:130px;\'><label for=\'txtFileInput\'><div class=\'bg-light folderopen\'><i class=\'fa fa-folder-open\' title=\'open playlists\'></i></div></label><input type=\'file\' id=\'txtFileInput\' onchange=\'handleFiles(this.files)\' accept=\'.txt\'></div><div class=\'bg-light voicerecognition\' style=\'display:float;position:fixed;float:left;left:163px;color:gray;\' onclick=\'voicerecognition();\' title=\'set voice recognition\'><i class=\'fa fa-microphone\'></i></div><div class=\'bg-light allrandom\' style=\'display:float;position:fixed;float:left;left:190px;color:white;\' onclick=\'allrandom();\' title=\'set all random playing\'><i class=\'fa fa-random\'></i></div><div class=\'navMenu\'><a href='#' onclick=\'plusMenu(-1)\' style=\'text-decoration:none;\' title=\'see previous playlist\'><</a></div>";
    for (let keyName of keyNames) {
        htmlString += "<div class=\'myMenu\'><a href='#' onclick=\'clickMenu()\' class=\'folder\' style=\'text-decoration:none;\' title=\'open playlist\'>"+ keyName +"</a></div>";
    }
    htmlString += "<div class=\'navMenu\'><a href='#' onclick=\'plusMenu(1)\' style=\'text-decoration:none;\' title=\'see next playlist\'>></a></div><div class=\'bg-light random\' style=\'display:float;position:fixed;float:right;right:190px;color:gray;\' onclick=\'random();\' title=\'set random playing\'><i class=\'fa fa-random\'></i></div><div class=\'bg-light loop\' style=\'display:float;position:fixed;float:right;right:160px;color:gray;\' onclick=\'loop();\' title=\'set loop playing\'><i class=\'fa fa-repeat\'></i></div><div class=\'bg-light speech\' style=\'display:float;position:fixed;float:right;right:130px;color:gray;\' onclick=\'speech();\' title=\'set text to speech\'><i class=\'fa fa-comments-o\'></i></div><div class=\'bg-light addapikey\' style=\'display:float;position:fixed;float:right;right:100px;\' onclick=\'addapikey();\' title=\'add API key\'><i class=\'fa fa-unlock\'></i></div><div class=\'bg-light fileminus\' style=\'display:float;position:fixed;float:right;right:70px;\' onclick=\'videominus();\' title=\'remove a video\'><i class=\'fa fa-minus\'></i></div><div class=\'bg-light fileplus\' style=\'display:float;position:fixed;float:right;right:40px;\' onclick=\'videoplus();\' title=\'add video(s)\'><i class=\'fa fa-plus\'></i></div><a href=\'\' target=\'_blank\' class=\'bg-light\' style=\'display:float;position:fixed;float:right;right:10px;\' id=\'download\' title=\'go to youtube video\'><i class=\'fa fa-youtube-play\'></i></a>"; 
    $(".menushow-container").html(htmlString);
    var folders = (Object.keys(obj).map(key => key)).sort((a, b) => b.localeCompare(a, "es", { sensitivity: "base" })).reverse();
    var index = 0;
    htmlString = "";
    for (let folder of folders) {
    	    htmlString += "<a onclick=\'goToChannel(this)\' data-folder=\'" + index + "\' class=\'gotochannel\'>" + folder + "</a>";
            index++;
    }
    $("#list").html(htmlString);
    showMenu(1);
}
 
function clickMenu() {
    clickonmenu = true;
    createSlide();
    slideIndex = 1;
    showSlides(1);
 }

function createSlide() {
    var folder = $("#navbar .folder:visible").text();
    var files = obj[folder];
    files = files.filter(function (value, index, array) { 
        return array.indexOf(value) === index;
    });
    playerid = [];
    playertitle = [];
    for (let file of files) {
        playerid.push(folder + "-" + file);
        playertitle.push(titles[file]);
    }
    $(".slideshow-container").html("");
    let htmlString = "";
    htmlString = "<div style=\'top:10%;align-items:center;position:fixed;\'>" + folder + "</div><div class=\'mySlides\' align=\'center\'><div class=\'item\'><div id=\'\' class=\'video " + folder + "\'></div><div class=\'centered title " + folder + "\' style=\'top:90%;align-items:center;position:fixed;\'></div></div></div>";
    htmlString += "<div><a class=\'prev\' onclick=\'plusSlides(-1)\' style=\'text-decoration:none;color:white;\'>&#10094;</a><a class=\'next\' onclick=\'plusSlides(1)\' style=\'text-decoration:none;color:white;\'>&#10095;</a></div>";
    $(".slideshow-container").html(htmlString);
}

function createOverlay() {
    var folder = $("#navbar .folder:visible").text();
    var folderindex = (Object.keys(obj).map(key => key)).indexOf(folder);
    var fileindex = 0;
    if (folder != checkfolder) {
        checkfolder = folder;
        var files = obj[folder];
        files = files.filter(function (value, index, array) { 
            return array.indexOf(value) === index;
        });
        let htmlString = "";
        for (let file of files) {
    	    htmlString += "<figure onclick=\'goToVideo(this)\' data-folderindex=\'" + folderindex + "\' data-fileindex=\'" + fileindex + "\' class=\'goto\'><img onload=\'checkSize(this)\' class=\'align-middle overlayimage\' src=\'" + thumbnails[file] + "\' alt=\'\' id=\'" + folder + "-" + file + "-Overlay\'><figcaption class=\'text-center align-middle overlaytitle\' id=\'" + folder + "-" + file + "-OverlayTitle\'>" + titles[file] + "</figcaption></figure>";
            fileindex++;
        }
        $("#overlay").html(htmlString);
        if ($("#overlay").get(0).scrollTop != 0) {
            document.getElementById("overlay").scrollTop = "0px";
        }
    }
}

async function checkSize(img) {
    var imgblob = await fetchBlob(img.src);
    if (parseInt(parseInt(imgblob.size)) == 1097) {
        img.parentElement.remove();
    }
}

async function getSize(videoid) {
    var imgblob = await fetchBlob("https://img.youtube.com/vi/" + videoid + "/mqdefault.jpg");
    if (parseInt(parseInt(imgblob.size)) == 1097 | parseInt(parseInt(imgblob.size)) == 8853) {
        return true;
    }
    else {
        return false;
    }
}

async function fetchBlob(url) {
    const response = await fetch(url);
    return response.blob();
}

function checkVideoInOverlay() {
    var txt = $(".video:visible").attr("class"); 
    var folder = txt.replace("video ", "");
    return folder == $("#navbar .folder:visible").text();
}

function goToVideo(el) {
    goingtovideo = true;
    clickMenu();
    goingtovideo = true;
    var fileindex = Number(el.dataset.fileindex);
    slideIndex += fileindex;
    showSlides(slideIndex);
}

function goToChannel(el) {
    goingtochannel = true;
    var folderindex = Number(el.dataset.folder);
    menuIndex = folderindex + 1;
    showMenu(menuIndex);
    scrollToThumbnail(videoidtemp);
}

document.onmousemove = function(event) {
	mouseOnTop(event.pageY);
};

function mouseOnTop(y) {
    if (wd == 1) {
        document.getElementById("navbar").style.top = "0px";
        document.getElementById("overlay").style.top = (sizescreeny - 240) + "px";
    }
    if (wu == 1 & !collapse) {
        document.getElementById("navbar").style.top = "-50px";
        document.getElementById("overlay").style.top = "100%";
    }
    if (y < 50 | y > sizescreeny - 240)
    {
	    if (wd <= 1) {
		    wd = wd + 1;
	    }
	    wu = 0;
    }
    else
    {
	    if (wu <= 1) {
		    wu = wu + 1;
	    }
	    wd = 0;
    }
}

function listCollaspse() {
    if (!collapse) {
        collapse = true;
        document.getElementById("list").style.height = (sizescreeny - 240 - 50) + "px";
        document.getElementById("list").style.display = "block";
    }
    else {
        collapse = false;
        document.getElementById("list").style.display = "none";
    }
}

function listminus() {
    var item = prompt("Please enter a playlist name to delete:", "");
    if (!(item == null || item == "")) {
        playlists = JSON.parse(localStorage.getItem("playlists") || "[]");
        playlists = transformObj(playlists);
        var newplaylists = [];
        playlists.forEach(function(val, index) {
            if (val.playlist != item) {
                newplaylists.push({videoid: val.videoid, videotitle: val.videotitle, playlist: val.playlist});
            }
        });
        var tempgrouper = newplaylists;
        var grouped = transformArr(tempgrouper);
        grouped = transformInpand(grouped);
        localStorage.setItem("playlists", JSON.stringify(grouped));
        reLoadPlayer();
    }
}

function listplus() {
    var item = prompt("Please enter a playlist name to add:", "");
    if (!(item == null || item == "")) {
        playlists = JSON.parse(localStorage.getItem("playlists")) || [];
        playlists = transformObj(playlists);
        playlists.push({videoid: "", videotitle: "", playlist: item});
        var tempgrouper = playlists;
        var grouped = transformArr(tempgrouper);
        grouped = transformInpand(grouped);
        localStorage.setItem("playlists", JSON.stringify(grouped));
        reLoadPlayer();
    }
}

function videominus() {
    var folder = $("#navbar .folder:visible").text();
    if (folder != "") {
        var item = prompt("Please enter a video id to delete from " + folder + " playlist:", "");
        if (!(item == null || item == "")) {
            var itemarray = item.split(" ");
            for (var i = 0; i < itemarray.length; i++)
            {
                item = itemarray[i];
                playlists = JSON.parse(localStorage.getItem("playlists") || "[]");
                playlists = transformObj(playlists);
                var newplaylists = [];
                playlists.forEach(function(val, index) {
                    if ((val.videoid != item & val.playlist == folder) | val.playlist != folder) {
                        newplaylists.push({videoid: val.videoid, videotitle: val.videotitle, playlist: val.playlist});
                    }
                });
                var tempgrouper = newplaylists;
                var grouped = transformArr(tempgrouper);
                grouped = transformInpand(grouped);
                localStorage.setItem("playlists", JSON.stringify(grouped));
            }
            reLoadPlayer();
        }
    }
}

function videoplus() {
    var folder = $("#navbar .folder:visible").text();
    if (folder != "") {
        var item = prompt("Please enter a video or playlist or channel id to add in " + folder + " playlist:", "");
        if (!(item == null || item == "")) {
            $(".spinner").removeClass("hide");
            $(".spinner").addClass("show");
            var isnotchannelplaylistid = false;
            var isnotplaylistid = false;
            (async () => { 
                var itemarray = item.split(" ");
                for (var i = 0; i < itemarray.length; i++)
                {
                    item = itemarray[i];
                    var str = item[0] + item[1];
                    if (str == "UC") {                 
                        try {
                            var channelplaylistid = "UU" + item.slice(2); 
                            var apikey = localStorage.getItem("apikey") || "";
                            var array = [];
                            var objdetails = [];
                            var nextpagetoken = "";
                            var nomorevideo = false;
                            var param = "playlistId=" + channelplaylistid;
                            var responsef = await fetch("https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&videoEmbeddable=true&maxResults=50&" + param + "&key=" + apikey);
                            var files = await responsef.json();
                            for (let file of files.items) {
                                var videoid = file.snippet.resourceId.videoId;
                                var isprivate = await getSize(videoid);
                                if (!isprivate) {
                                    var title = (file.snippet.title).replaceAll(/[&]/g, "and").replaceAll(/[|]/g, "-").replaceAll(/[\]/g, "").replaceAll(/["]/g, "").replaceAll(/[@]/g, "").replaceAll(/[#]/g, "");
                                    array.push(videoid);
                                    objdetails[videoid] = title;
                                }
                            }
                            try {
                                nextpagetoken = files.nextPageToken;
                                if (nextpagetoken == "undefined" | nextpagetoken == "" | nextpagetoken == null) {
                                    nomorevideo = true;
                                }
                                else {
                                    nomorevideo = false;
                                }
                            }
                            catch {
                                nomorevideo = true;
                            }
                            while (!nomorevideo) {
                                var responsenf = await fetch("https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&videoEmbeddable=true&maxResults=50&pageToken=" + nextpagetoken + "&" + param + "&key=" + apikey);
                                var nfiles = await responsenf.json();
                                for (let file of nfiles.items) {
                                    var videoid = file.snippet.resourceId.videoId;
                                    var isprivate = await getSize(videoid);
                                    if (!isprivate) {
                                        var title = (file.snippet.title).replaceAll(/[&]/g, "and").replaceAll(/[|]/g, "-").replaceAll(/[\]/g, "").replaceAll(/["]/g, "").replaceAll(/[@]/g, "").replaceAll(/[#]/g, "");
                                        array.push(videoid);
                                        objdetails[videoid] = title;
                                    }
                                }
                                try {
                                    nextpagetoken = nfiles.nextPageToken;
                                    if (nextpagetoken == "undefined" | nextpagetoken == "" | nextpagetoken == null) {
                                        break;
                                    }
                                }
                                catch {
                                    break;
                                }
                            }
                            playlists = JSON.parse(localStorage.getItem("playlists") || "[]");
                            playlists = transformObj(playlists);
                            var newplaylists = [];
                            playlists.forEach(function(val, index) {
                                var inarray = array.includes(val.videoid);
                                if ((val.playlist == folder & !inarray) | val.playlist != folder) {
                                    if (val.videotitle != "Private video" & val.videotitle != "Deleted video")
                                        newplaylists.push({videoid: val.videoid, videotitle: val.videotitle, playlist: val.playlist});
                                }
                            });
                            for (let id of array) {
                                if (objdetails[id] != "Private video" & objdetails[id] != "Deleted video")
                                    newplaylists.push({videoid: id, videotitle: objdetails[id], playlist: folder});
                            }
                            var tempgrouper = newplaylists;
                            var grouped = transformArr(tempgrouper);
                            grouped = transformInpand(grouped);
                            localStorage.setItem("playlists", JSON.stringify(grouped));
                        }
                        catch {
                            isnotchannelplaylistid = true;
                        }
                    }
                    if (str != "UC" | isnotchannelplaylistid) {                  
                        try {
                            var channelplaylistid = item; 
                            var apikey = localStorage.getItem("apikey") || "";
                            var array = [];
                            var objdetails = [];
                            var nextpagetoken = "";
                            var nomorevideo = false;
                            var param = "playlistId=" + channelplaylistid;
                            var responsef = await fetch("https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&" + param + "&key=" + apikey);
                            var files = await responsef.json();
                            for (let file of files.items) {
                                var videoid = file.snippet.resourceId.videoId;
                                var isprivate = await getSize(videoid);
                                if (!isprivate) {
                                    var title = (file.snippet.title).replaceAll(/[&]/g, "and").replaceAll(/[|]/g, "-").replaceAll(/[\]/g, "").replaceAll(/["]/g, "").replaceAll(/[@]/g, "").replaceAll(/[#]/g, "");
                                    array.push(videoid);
                                    objdetails[videoid] = title;
                                }
                            }
                            try {
                                nextpagetoken = files.nextPageToken;
                                if (nextpagetoken == "undefined" | nextpagetoken == "" | nextpagetoken == null) {
                                    nomorevideo = true;
                                }
                                else {
                                    nomorevideo = false;
                                }
                            }
                            catch {
                                nomorevideo = true;
                            }
                            while (!nomorevideo) {
                                var responsenf = await fetch("https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&pageToken=" + nextpagetoken + "&" + param + "&key=" + apikey);
                                var nfiles = await responsenf.json();
                                for (let file of nfiles.items) {
                                    var videoid = file.snippet.resourceId.videoId;
                                    var isprivate = await getSize(videoid);
                                    if (!isprivate) {
                                        var title = (file.snippet.title).replaceAll(/[&]/g, "and").replaceAll(/[|]/g, "-").replaceAll(/[\]/g, "").replaceAll(/["]/g, "").replaceAll(/[@]/g, "").replaceAll(/[#]/g, "");
                                        array.push(videoid);
                                        objdetails[videoid] = title;
                                    }
                                }
                                try {
                                    nextpagetoken = nfiles.nextPageToken;
                                    if (nextpagetoken == "undefined" | nextpagetoken == "" | nextpagetoken == null) {
                                        break;
                                    }
                                }
                                catch {
                                    break;
                                }
                            }
                            playlists = JSON.parse(localStorage.getItem("playlists") || "[]");
                            playlists = transformObj(playlists);
                            var newplaylists = [];
                            playlists.forEach(function(val, index) {
                                var inarray = array.includes(val.videoid);
                                if ((val.playlist == folder & !inarray) | val.playlist != folder) {
                                    if (val.videotitle != "Private video" & val.videotitle != "Deleted video")
                                        newplaylists.push({videoid: val.videoid, videotitle: val.videotitle, playlist: val.playlist});
                                }
                            });
                            for (let id of array) {
                                if (objdetails[id] != "Private video" & objdetails[id] != "Deleted video")
                                    newplaylists.push({videoid: id, videotitle: objdetails[id], playlist: folder});
                            }
                            var tempgrouper = newplaylists;
                            var grouped = transformArr(tempgrouper);
                            grouped = transformInpand(grouped);
                            localStorage.setItem("playlists", JSON.stringify(grouped));
                        }
                        catch {
                            isnotplaylistid = true;
                        }
                        if (isnotplaylistid) {
                            var videoid = item;
                            var isprivate = await getSize(videoid);
                            if (!isprivate) {
                            	var videotitle = "";
                            	var videothumbnail = "";
                            	$.ajax({
                                type: "GET",
                                async: false,
                                cache: false,
                                url: "https://noembed.com/embed?url=https://www.youtube.com/watch?v=" + videoid,
                                dataType: "json",
                                success: function(data) {
                                    if (data.error != "404 Not Found") {
                                        videotitle = (data.title).replaceAll(/[&]/g, "and").replaceAll(/[|]/g, "-").replaceAll(/[\]/g, "").replaceAll(/["]/g, "").replaceAll(/[@]/g, "").replaceAll(/[#]/g, "");
                                    }
                                }
                            	});
                            	playlists = JSON.parse(localStorage.getItem("playlists")) || [];
                            	playlists = transformObj(playlists);
                            	if (videotitle != "Private video" & videotitle != "Deleted video")
                            	    playlists.push({videoid: item, videotitle: videotitle, playlist: folder});
                            	var tempgrouper = playlists;
                            	var grouped = transformArr(tempgrouper);
                            	grouped = transformInpand(grouped);
                            	localStorage.setItem("playlists", JSON.stringify(grouped));
				    }
                        }
                    }
                }
                reLoadPlayer();
            })();
        }
    }
}

function transformInpand(orig) {
    var grouped = [];
    orig.forEach(function(val, index) {
        var name = val.playlist;
        var files = val.videoids;
        var tempgrouped = [];
        for (let file of files) {
            var videoid = file.videoid;
            var videotitle = file.videotitle;
            tempgrouped.push(videoid);
            tempgrouped.push(videotitle);
         };
        grouped.push({videos : tempgrouped, playlist: name});
    });
    return grouped;
}

function transformObj(orig) {
    playlists = [];
    orig.forEach(function(val, index) {
        var name = val.playlist;
        var files = val.videos;
        var n = 0;
        var videoid;
        var videotitle;
        for (let file of files) {
            n++;
            if (n == 1) {
                videoid = file;
            }
            if (n >= 2) {
                videotitle = file;
                playlists.push({videoid: videoid, videotitle: videotitle, playlist: name});
                n = 0;
            }
         };
    });
    return playlists;
}

function transformArr(orig) {
    var newArr = [], playlists = {}, i, j, cur;
    for (i = 0, j = orig.length; i < j; i++) {
        cur = orig[i];
        if (!(cur.playlist in playlists)) {
            playlists[cur.playlist] = {playlist: cur.playlist, videoids: []};
            newArr.push(playlists[cur.playlist]);
        }
        playlists[cur.playlist].videoids.push({videoid: cur.videoid, videotitle: cur.videotitle});
    }
    return newArr;
}

function handleFilename() {
	exportTableToTXT("playtube.txt");
}

function exportTableToTXT(filename) {
    var txt = localStorage.getItem("playlists");
    downloadTXT(txt, filename);
}

function downloadTXT(txt, filename) {
    var txtFile;
    var downloadLink;
	if (window.Blob == undefined || window.URL == undefined || window.URL.createObjectURL == undefined) {
		return;
	}
    txtFile = new Blob([txt], {type:"text/txt"});
    downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(txtFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
}

function handleFiles(files) {
    $(".spinner").removeClass("hide");
    $(".spinner").addClass("show");
	getAsText(files[0]); 
}

function getAsText(fileToRead) {
	var reader = new FileReader();
	reader.onload = loadHandler;
	reader.onerror = errorHandler;   
	reader.readAsText(fileToRead);
}

function loadHandler(event) {
	var txt = event.target.result;
	processData(txt);     
}

function errorHandler(evt) {
	if(evt.target.error.name == "NotReadableError") {
	}
}

function processData(txt) {
    localStorage.setItem("playlists", txt);
    reLoadPlayer();
}

function addapikey() {
    var key = localStorage.getItem("apikey");
    var item = prompt("Please enter a youtube API key for add videos from a playlist or channel id:", key);
    if (!(item == null || item == "")) {
        localStorage.setItem("apikey", item);
    }
}

function random() {
    var element = document.getElementsByClassName("random");
    var el = document.getElementsByClassName("loop");
    var elem = document.getElementsByClassName("allrandom");
    if (!rand) {
        rand = true;
        looping = false;
        allrand = false;
        for (var i = 0; i < element.length; i++) {
            element[i].style.color = "white";
        }
        for (var i = 0; i < el.length; i++) {
            el[i].style.color = "gray";
        }
        for (var i = 0; i < elem.length; i++) {
            elem[i].style.color = "gray";
        }
    }
    else {
        rand = false;
        for (var i = 0; i < element.length; i++) {
            element[i].style.color = "gray";
        }
    }
}

function loop() {
    var element = document.getElementsByClassName("loop");
    var el = document.getElementsByClassName("random");
    var elem = document.getElementsByClassName("allrandom");
    if (!looping) {
        looping = true;
        rand = false;
        allrand = false;
        for (var i = 0; i < element.length; i++) {
            element[i].style.color = "white";
        }
        for (var i = 0; i < el.length; i++) {
            el[i].style.color = "gray";
        }
        for (var i = 0; i < elem.length; i++) {
            elem[i].style.color = "gray";
        }
    }
    else {
        looping = false;
        for (var i = 0; i < element.length; i++) {
            element[i].style.color = "gray";
        }
    }
}

function allrandom() {
    var element = document.getElementsByClassName("allrandom");
    var el = document.getElementsByClassName("loop");
    var elem = document.getElementsByClassName("random");
    if (!allrand) {
        allrand = true;
        rand = false;
        looping = false;
        for (var i = 0; i < element.length; i++) {
            element[i].style.color = "white";
        }
        for (var i = 0; i < el.length; i++) {
            el[i].style.color = "gray";
        }
        for (var i = 0; i < elem.length; i++) {
            elem[i].style.color = "gray";
        }
    }
    else {
        allrand = false;
        for (var i = 0; i < element.length; i++) {
            element[i].style.color = "gray";
        }
    }
}

function voicerecognition() {
    var element = document.getElementsByClassName("voicerecognition");
    if (!voicer) {
        voicer = true;
        for (var i = 0; i < element.length; i++) {
            element[i].style.color = "white";
        }
        threadvoicer = setInterval(() => { startVoicer(); }, 1000);
    }
    else {
        voicer = false;
        for (var i = 0; i < element.length; i++) {
            element[i].style.color = "gray";
        }
        clearInterval(threadvoicer);
        recognition.stop();
    }
}

function speech() {
    var element = document.getElementsByClassName("speech");
    if (!speeching) {
        speeching = true;
        for (var i = 0; i < element.length; i++) {
            element[i].style.color = "white";
        }
        var msg = new SpeechSynthesisUtterance();
        msg.text = playlisttemp + ", " + titletemp;
        window.speechSynthesis.speak(msg);
    }
    else {
        speeching = false;
        for (var i = 0; i < element.length; i++) {
            element[i].style.color = "gray";
        }
    }
}

function startVoicer() {
    if (voicer)
        try {
            recognition.start();
        }
        catch {}
}

function restartVoicer() {
    if (voicer)
        try {
            setTimeout(() => { recognition.start() }, 1000);
            recognition.stop();
        }
        catch {}
}

recognition.onspeechend = () => {
    if (voicer)
        restartVoicer();
};

recognition.onresult = (result) => {
    if (voicer) {
        var str = result.results[0][0].transcript;
        if (str.length > 100) {
            restartVoicer();
        }
        if (str == "Next.") {
            plusSlides(1);
        }
        if (str == "Previous.") {
            plusSlides(-1);
        }
        if (str == "All random.") {
            allrand = false;
            allrandom();
        }
        if (str == "Random.") {
            rand = false;
            random();
        }
        if (str == "Loop.") {
            looping = false;
            loop();
        }
        if (str == "Straight.") {
            if (allrand)
                allrandom();
            if (rand)
                random();
            if (looping)
                loop();
        }
    }   
};

function setPlayer(ind) {
    var folder = $("#navbar .folder:visible").text();
    var playervideo = document.getElementsByClassName("video " + folder);
    playervideo[0].id = playerid[ind];
    var playercenteredtitle = document.getElementsByClassName("centered title " + folder);
    playercenteredtitle[0].innerHTML = playertitle[ind];
}

window.addEventListener("resize", resizingWindow);

function resizingWindow() {
    sizescreeny = window.innerHeight;
    canvas.width = window.innerWidth;
    WIDTH = window.innerWidth;
    document.getElementById("navbar").style.top = "-50px";
    document.getElementById("overlay").style.top = "100%";
    collapse = false;
    document.getElementById("list").style.display = "none";
}

function setVisualizer() {      
    canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = 300;
    ctx = canvas.getContext("2d");
    WIDTH = canvas.width;
    HEIGHT = canvas.height;
    navigator.mediaDevices.getUserMedia ({
        audio: true,
	    video: false
    })
    .then(stream => {
        audioCtx = new AudioContext();
        source = audioCtx.createMediaStreamSource(stream);
        analyser = audioCtx.createAnalyser();
        source.connect(analyser);
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        renderFrame();
    })
    .catch();
}

function renderFrame() {
    requestAnimationFrame(renderFrame);
    ctx.fillStyle = "#222222";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    analyser.getByteFrequencyData(dataArray);
    barWidth = WIDTH / bufferLength;
    barHeight = HEIGHT;
    x = 0;
    for (var i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.strokeStyle = "rgb(0, 0, 0)";
        ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
        x += barWidth + 0.3;
    }
    ctx.stroke();
}

document.body.onkeyup = function(e) {
    if (e.keyCode == 177) 
        plusSlides(-1);
    if (e.keyCode == 176) 
        plusSlides(1);
};

    </script>`;

    (function () {
        // more or less stolen form jquery core and adapted by paul irish
        function getScript(url, success) {
            var script = document.createElement('script');
            script.src = url;
            var head = document.getElementsByTagName('head')[0],
                done = false;
            // Attach handlers for all browsers
            script.onload = script.onreadystatechange = function () {
                if (!done && (!this.readyState
                    || this.readyState == 'loaded'
                    || this.readyState == 'complete')) {
                    done = true;
                    success();
                    script.onload = script.onreadystatechange = null;
                    head.removeChild(script);
                }
            };
            head.appendChild(script);
        }
        getScript('https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js', function () {
            $(document).ready(function () {
                var script = document.createElement('script');
                script.src = 'https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js';
                document.head.appendChild(script);
                $('body').html(stringinject);
            });
        });
    })();

  sendResponse({ fromcontent: "This message is from content.js" });
});
