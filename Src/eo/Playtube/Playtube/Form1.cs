using System;
using System.Windows.Forms;
using System.IO;
using System.Diagnostics;
using System.Threading.Tasks;
using System.Threading;
using EO.WebBrowser;
namespace Playtube
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }
        public static string txt;
        private void Form1_Shown(object sender, EventArgs e)
        {
            this.pictureBox1.Dock = DockStyle.Fill;
            EO.WebEngine.BrowserOptions options = new EO.WebEngine.BrowserOptions();
            options.EnableWebSecurity = false;
            EO.WebBrowser.Runtime.DefaultEngineOptions.SetDefaultBrowserOptions(options);
            EO.WebEngine.Engine.Default.Options.AllowProprietaryMediaFormats();
            EO.WebEngine.Engine.Default.Options.SetDefaultBrowserOptions(new EO.WebEngine.BrowserOptions
            {
                EnableWebSecurity = false
            });
            this.webView1.Create(pictureBox1.Handle);
            this.webView1.Engine.Options.AllowProprietaryMediaFormats();
            this.webView1.SetOptions(new EO.WebEngine.BrowserOptions
            {
                EnableWebSecurity = false
            });
            this.webView1.Engine.Options.DisableGPU = false;
            this.webView1.Engine.Options.DisableSpellChecker = true;
            this.webView1.Engine.Options.CustomUserAgent = "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko";
            Navigate("https://www.youtube.com/feed/subscriptions");
            webView1.RegisterJSExtensionFunction("SaveStorage", new JSExtInvokeHandler(WebView_JSSaveStorage));
            webView1.RegisterJSExtensionFunction("OpenStorage", new JSExtInvokeHandler(WebView_JSOpenStorage));
            webView1.RegisterJSExtensionFunction("DownloadTXT", new JSExtInvokeHandler(WebView_JSDownloadTXT));
        }
        private void Navigate(string address)
        {
            webView1.Url = address;
        }
        private void webView1_LoadCompleted(object sender, LoadCompletedEventArgs e)
        {
            Task.Run(() => LoadPage());
        }
        private void webView1_RequestPermissions(object sender, RequestPermissionEventArgs e)
        {
            e.Deny();
        }
        private void webView1_NewWindow(object sender, NewWindowEventArgs e)
        {
            e.Accepted = false;
        }
        private void webView1_BeforeNavigate(object sender, BeforeNavigateEventArgs e)
        {
            if (e.NewUrl.StartsWith("https://www.youtube.com/watch?v="))
            {
                Process.Start(e.NewUrl);
                e.Cancel = true;
            }
        }
        private void LoadPage()
        {
            string tempsavepath = System.Reflection.Assembly.GetEntryAssembly().Location.Replace(@"file:\", "").Replace(Process.GetCurrentProcess().ProcessName + ".exe", "").Replace(@"\", "/").Replace(@"//", "") + "tempsave";
            string savedstorage = "[]";
            if (File.Exists(tempsavepath))
            {
                using (StreamReader file = new StreamReader(tempsavepath))
                {
                    savedstorage = file.ReadLine().Replace(@"""", "'");
                }
            }
            else
            {
                using (StreamWriter createdfile = new StreamWriter(tempsavepath))
                {
                    createdfile.WriteLine("[]");
                }
            }
            string backgroundcolor = "";
            string overlaycolor = "";
            string previousnextbuttonshovercolor = "";
            string titlehoverbackgroundcolor = "";
            using (System.IO.StreamReader file = new System.IO.StreamReader("colors.txt"))
            {
                file.ReadLine();
                backgroundcolor = file.ReadLine();
                file.ReadLine();
                overlaycolor = file.ReadLine();
                file.ReadLine();
                previousnextbuttonshovercolor = file.ReadLine();
                file.ReadLine();
                titlehoverbackgroundcolor = file.ReadLine();
                file.Close();
            }
            string stringinject;
            stringinject = @"document.getElementsByTagName('html')[0].innerHTML = '<head></head><body></body>';";
            this.webView1.EvalScript(stringinject);
            stringinject = @"
    <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'>
    <link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css'>
    <link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.css'>
    <style>

        body {
            font-family: sans-serif;
            background-color: backgroundcolor;
            color: #FFFFFF;
        }

        .row > .col-lg-4,
        .col-6 {
            padding: 0;
        }

        .slideshow-container {
            justify-content: center;
            display: flex;
        }

        .menushow-container a {
            align-items: center;
            margin: 15px;
            color: #FFFFFF;
        }

        .menushow-container div {
            align-items: center;
            margin: 15px;
            color: #FFFFFF;
        }

        #navbar {
            background: overlaycolor;
            position: fixed;
            width: 100%;
            display: flex;
            justify-content: center;
            transition: top 0.3s;
        }

        #overlay {
            background: overlaycolor;
            position: fixed;
            overflow-y: auto;
            overflow-x: hidden;
            display: block;
            width: 100%;
            transition: top 0.3s;
            left: 0;
            right: 0;
            bottom: 0;
        }

        #list {
            background: overlaycolor;
            position: fixed;
            overflow-y: auto;
            overflow-x: hidden;
            display: none;
            top: 50px;
            width: 100%;
            height: calc(100vh - 50px - 35vh);
            left: 0;
            right: 0;
            bottom: 0;
        }

            #list a {
                color: #FFFFFF;
                display: inline-block;
                margin: 20px;
            }

        #overlay iframe {
            pointer-events: none;
        }

        .goto, .gotochannel, .collaspse, .folderminus, .folderplus, .foldersave, .folderopen, .fileminus, .fileplus, .addapikey, .random {
            cursor: pointer;
            text-align: center;
            color: white;
            overflow: hidden;
        }

        .centered {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
        }

            .centered:hover {
                background-color: titlehoverbackgroundcolor;
            }

        .prev, .next {
            cursor: pointer;
            position: absolute;
            top: 50%;
            width: auto;
            padding: 16px;
            margin-top: -22px;
            color: white;
            font-weight: bold;
            font-size: 18px;
            transition: 0.6s ease;
            border-radius: 0 3px 3px 0;
            user-select: none;
            text-decoration: none;
        }

        .prev {
            left: 0;
            border-radius: 3px 0 0 3px;
        }

        .next {
            right: 0;
            border-radius: 3px 0 0 3px;
        }

            .prev:hover, .next:hover {
                background-color: previousnextbuttonshovercolor;
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

        .navMenu {
            transform: translate(-30px, 0px);
        }

        .myMenu {
            transform: translate(-30px, 0px);
        }

        .hide {
            display: none;
        }

        .show {
            display: flex;
        }

        .spinner {
            position: absolute;
            top: calc(50% - 10vh);
            left: calc(50% - 10vh);
            text-align: center;
            font-size: 20vh;
        }

        ::-webkit-scrollbar {
            width: 10px;
        }

        ::-webkit-scrollbar-track {
            background: overlaycolor;
        }

        ::-webkit-scrollbar-thumb {
            background: #888;
        }

            ::-webkit-scrollbar-thumb:hover {
                background: #eee;
            }

        .overlaytitle {
            height: 7vh;
            color: #FFFFFF;
        }

        .overlayimage {
            height: 100%;
            width: 100%;
        }
    </style>
".Replace("\r\n", " ").Replace("backgroundcolor", backgroundcolor).Replace("overlaycolor", overlaycolor).Replace("previousnextbuttonshovercolor", previousnextbuttonshovercolor).Replace("titlehoverbackgroundcolor", titlehoverbackgroundcolor);
            stringinject = @"""" + stringinject + @"""";
            stringinject = @"document.getElementsByTagName('head')[0].innerHTML = " + stringinject + @";";
            this.webView1.EvalScript(stringinject);
            stringinject = @"var script = document.createElement('script'); script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js'; document.head.appendChild(script);";
            this.webView1.EvalScript(stringinject);
            stringinject = @"var script = document.createElement('script'); script.src = 'https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js'; document.head.appendChild(script);";
            this.webView1.EvalScript(stringinject);
            stringinject = @"

    <div class='slideshow-container container-sm h-100'>
    </div>

    <div id='list'>
    </div>

    <div id='overlay'>
    </div>

    <div class='menushow-container' id='navbar'>
    </div>

    <div class='fa fa-spinner fa-spin spinner hide'></div>

    <script>
var cutfilmon = false;
var menuIndex = 1;
var slideIndex = 1;
var objdata = {};
var videoPlayer = {};
var sizescreenx = $(document).width();
var sizescreeny = $(document).height();
var videos = {};
var done = false;
var wd = 2;
var wu = 2;
var checkfolder = '';
var collapse = false;
var thumbnails = {};
var titles = {};
var playlists = {};
var isplaylist = {};
var rand = false;
var goingtovideo = false;
var playerid = [];
var playertitle = [];
var visiblingimagecount = 0;

function changeTitle() {
    document.title = 'playtube by michael franiatte';
}

$.ajax({
    url: 'https://www.youtube.com/iframe_api',
    dataType: 'script'
}).done(function() {
    loadPlayer();
});

function loadPlayer() {
    window.onYouTubePlayerAPIReady = function() {
        changeTitle();
        getAllFilesFromFolders();
    };
}

function setVideoSource(id) {
    var folder = $('.folder:visible').text();
    var videoid = id.replace(folder + '-', '');
    createPlayer(id, sizescreenx, sizescreeny, videoid, '');
    var str = id.replace(folder + '-', 'https://www.youtube.com/watch?v=');
    var a = document.getElementById('download');
    a.href = str;
}

function setVideoPlayOverlay() {
    var element = document.getElementsByClassName('thumbnailed');
    for (var i = 0; i < element.length; i++) {
        element[i].style.width = '100%';
        element[i].style.height = '100%'; 
    }
    $('img').removeClass('thumbnailed');
    var id = $('.video:visible').attr('id');
    var el = document.getElementById(id + '-Overlay');
    el.classList.add('thumbnailed');
    var elements = document.getElementsByClassName('overlaytitle');
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.cssText = 'height:7vh;color:#FFFFFF;';
    }
    var e = document.getElementById(id + '-OverlayTitle');
    e.style.cssText = 'height:7vh;color:#FFFFFF;font-style:italic;';
}

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function showSlides(n) {
    var classname = $('.video:visible').attr('class'); 
    var folder =  classname.replace('video ', '');
    var id = $('.video:visible').attr('id'); 
    var previousvideoid = id.replace(folder + '-', '');
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
    var folder = $('.folder:visible').text();
    var files = objdata[folder];
    if (n > files.length) {
        slideIndex = 1;
    }    
    if (n < 1) {
        slideIndex = files.length;
    }
    if (rand & !goingtovideo) {
        var rndnext = files.length;
        var rnd = Math.floor(Math.random() * rndnext) + 1;
        slideIndex = rnd;
    }
    setPlayer(slideIndex - 1);
    setVideoSource(playerid[slideIndex - 1]);
    setVideoPlayOverlay();
}

function plusMenu(n) {
    showMenu(menuIndex += n);
}

function showMenu(n) {
    var menu = document.getElementsByClassName('myMenu');
    if (n > menu.length) {
        menuIndex = 1;
    }
    if (n < 1) {
        menuIndex = menu.length;
    }
    for (var i = 0; i < menu.length; i++) {
        menu[i].style.display = 'none';
    }
    menu[menuIndex-1].style.display = 'block';
    createOverlay();
    setTimeout((function(){
        setVideoPlayOverlay();
    })
    , 500);
}

function getAllFilesFromFolders() {
    try {
        $('.spinner').removeClass('hide');
        $('.spinner').addClass('show');
        playlists = JSON.parse(JSON.stringify(savedstorage) || '[]');
        playlists = transformObj(playlists);
        var grouped = transformArr(playlists);
        grouped.forEach(function(val, index) {
            var name = decodeURIComponent(escape(window.atob(val.playlist)));
            var files = val.videoids;
            var array = [];
            var n = 0;
            for (let file of files) {
                if (file.videoid != '' & file.videotitle != '') {
                    var videoid = file.videoid;
    	            array.push(videoid);
                    titles[videoid] = decodeURIComponent(escape(window.atob(file.videotitle)));
                    thumbnails[videoid] = 'https://img.youtube.com/vi/' + videoid + '/mqdefault.jpg';
                }
             };
             objdata[name] = array;
        });
    }
    catch { }
    $('.spinner').removeClass('show');
    $('.spinner').addClass('hide');
    createMenu();
    clickMenu();
}

function createPlayer(classid, x, y, videoid, playlistid) {
    window.YT.ready(function() {
        if (videoid != '') {
            videoPlayer[videoid] = new YT.Player(classid, {
                width: 'auto',
                height: y,
                videoId: videoid,
                playerVars: {
                },
                events: {  
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange, 
                    'onError': onPlayerError
                }
            });  
         }
         if (playlistid != '') {
            videoPlayer[playlistid] = new YT.Player(classid, {
                width: 'auto',
                height: y,
                playerVars: {
                    listType: 'playlist',
                    list: playlistid
                }
            });  
         }
    });
}

function onPlayerReady(event) {  
    event.target.setPlaybackQuality('small'); 
    if (checkVideoInOverlay()) {
        if (event.target.getDuration() <= 0) {
            slideIndex += 1;
            showSlides(slideIndex);
        }
        if (event.data != YT.PlayerState.PLAYING) {
            var classname = $('.video:visible').attr('class'); 
            var folder =  classname.replace('video ', '');
            var id = $('.video:visible').attr('id'); 
            var str = id.replace(folder + '-', '');
            videoPlayer[str].playVideo();
         }
    }
} 

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
        event.target.destroy();
    };
    if (checkVideoInOverlay()) {
        if (event.data == YT.PlayerState.ENDED) {
            if (rand) {  
                var folder = $('.folder:visible').text();
                var files = objdata[folder];
                var rndnext = files.length;
                var rnd = Math.floor(Math.random() * rndnext) + 1;
                slideIndex = rnd;
                var rndnext = files.length;
                var rnd = Math.floor(Math.random() * rndnext) + 1;
                slideIndex = rnd;
                setPlayer(slideIndex - 1);
                setVideoSource(playerid[slideIndex - 1]);
                setVideoPlayOverlay();
            }
            else {
                slideIndex += 1;
                showSlides(slideIndex);
            }
        }
        if (event.data != YT.PlayerState.PAUSED) {
            var classname = $('.video:visible').attr('class'); 
            var folder =  classname.replace('video ', '');
            var id = $('.video:visible').attr('id'); 
            var str = id.replace(folder + '-', '');
            videoPlayer[str].playVideo();
        }
    }
    goingtovideo = false;
}

function onPlayerError(event) {
    if (checkVideoInOverlay()) {
        slideIndex += 1;
        showSlides(slideIndex);
        var classname = $('.video:visible').attr('class'); 
        var folder =  classname.replace('video ', '');
        var id = $('.video:visible').attr('id'); 
        var str = id.replace(folder + '-', '');
        videoPlayer[str].playVideo();
    }
}

function createMenu() {
    var keyNames = Object.keys(objdata);
    let htmlString = '';
    htmlString = `<div class=\'bg-light collaspse\' style=\'display:float;position:absolute;float:left;left:10px;\' onclick=\'listCollaspse();\' title=\'see playlists\'>
                    <i class=\'fa fa-bars\'></i></div>
                    <div class=\'bg-light folderminus\' style=\'display:float;position:absolute;float:left;left:40px;\' onclick=\'listminus();\' title=\'remove a playlist\'>
                    <i class=\'fa fa-minus\'></i></div>
                    <div class=\'bg-light folderplus\' style=\'display:float;position:absolute;float:left;left:70px;\' onclick=\'listplus();\' title=\'add a playlist\'>
                    <i class=\'fa fa-plus\'></i></div>
                    <div class=\'icon-download\' style=\'display:float;\'><label for=\'filename\'>
                    <div class=\'bg-light foldersave\' style=\'display:float;position:absolute;float:left;left:100px;bottom:0px\'>
                    <i class=\'fa fa-save\' title=\'save playlists\'></i></div></label>
                    <input type=\'button\' onClick=\'handleFilename()\' value=\'Save\' class=\'button\' id=\'filename\'></div>
                    <div class=\'icon-upload\' style=\'display:float;\'><label for=\'txtFileInput\'>
                    <div class=\'bg-light folderopen\' style=\'display:float;position:absolute;float:left;left:130px;bottom:0px\'>
                    <i class=\'fa fa-folder-open\' title=\'open playlists\'></i></div></label>
                    <input type=\'button\' id=\'txtFileInput\' onClick=\'OpenStorage()\'></div>
                    <div class=\'navMenu\'><a href='#' onclick=\'plusMenu(-1)\' style=\'text-decoration:none;\' title=\'see previous playlist\'><</a></div>`;
    for (let keyName of keyNames) {
        htmlString += 
        `<div class=\'myMenu\'>
            <a href='#' onclick=\'clickMenu()\' class=\'folder\' style=\'text-decoration:none;\' title=\'open playlist\'>`+ keyName +`</a>
        </div>`;
    }
    htmlString += `<div class=\'navMenu\'><a href='#' onclick=\'plusMenu(1)\' style=\'text-decoration:none;\' title=\'see next playlist\'>></a></div>
                    <div class=\'bg-light random\' style=\'display:float;position:absolute;float:right;right:130px;color:gray;\' onclick=\'random();\' title=\'set random playing\'>
                    <i class=\'fa fa-random\'></i></div>
                    <div class=\'bg-light addapikey\' style=\'display:float;position:absolute;float:right;right:100px;\' onclick=\'addapikey();\' title=\'add API key\'>
                    <i class=\'fa fa-unlock\'></i></div>
                    <div class=\'bg-light fileminus\' style=\'display:float;position:absolute;float:right;right:70px;\' onclick=\'videominus();\' title=\'remove a video\'>
                    <i class=\'fa fa-minus\'></i></div>
                    <div class=\'bg-light fileplus\' style=\'display:float;position:absolute;float:right;right:40px;\' onclick=\'videoplus();\' title=\'add video(s)\'>
                    <i class=\'fa fa-plus\'></i></div>
                    <a href=\'\' class=\'bg-light\' style=\'display:float;position:absolute;float:right;right:10px;\' id=\'download\' title=\'go to youtube video\'>
                    <i class=\'fa fa-youtube-play\'></i></a>`;
    $('.menushow-container').append(htmlString);
    var folders = (Object.keys(objdata).map(key => key));
    var index = 0;
    htmlString = ``;
    for (let folder of folders) {
    	    htmlString += `<a onclick=\'goToChannel(this)\' data-folder=\'` + index + `\' class=\'gotochannel\'>` + folder + `</a>`;
            index++;
    }
    $('#list').append(htmlString);
    showMenu(1);
}
 
function clickMenu() {
    var folder = $('.folder:visible').text();
    var files = objdata[folder];
    playerid = [];
    playertitle = [];
    for (let file of files) {
        playerid.push(folder + '-' + file);
        playertitle.push(titles[file]);
    }
    $('.slideshow-container').html('');
    let htmlString = ``;
    htmlString = `<div style=\'top:10%;align-items:center;position:absolute;\'>` + folder + `</div>
                       <div class=\'mySlides\' align=\'center\'>
                        <div class=\'item\'> 
                        <div id=\'\' class=\'video ` + folder + `\' style=\'width:60%;height:70%;top:15%;left:20%;display:block;position:absolute;\'></div>
                        <div class=\'centered title ` + folder + `\' style=\'top:90%;align-items:center;position:absolute;\'></div>
                        </div>
                       </div>`;
    htmlString += `<div>
                    <a class=\'prev\' onclick=\'plusSlides(-1)\' style=\'text-decoration:none;color:white;\'>&#10094;</a>
                    <a class=\'next\' onclick=\'plusSlides(1)\' style=\'text-decoration:none;color:white;\'>&#10095;</a>
                   </div>`;
    $('.slideshow-container').html(htmlString);
    slideIndex = 1;
    showSlides(1);
 }

function createOverlay() {
    var folder = $('.folder:visible').text();
    var folderindex = (Object.keys(objdata).map(key => key)).indexOf(folder);
    var fileindex = 0;
    if (folder != checkfolder) {
        checkfolder = folder;
        var files = objdata[folder];
        let htmlString = `<div class=\'container\'>
                             <div class=\'row row-eq-height\'>`;
        for (let file of files) {
    	     htmlString += `<a onclick=\'goToVideo(this)\' data-folderindex=\'` + folderindex + `\' data-fileindex=\'` + fileindex + `\' class=\'goto\'>
                              <div class=\'col-xs-3\' style=\'margin-top:3vh;\'>
                                <img class=\'align-middle overlayimage\' src=\'\' id=\'` + folder + `-` + file + `-Overlay\' style=\'height:100%;width:100%;min-height:150px;\'>
                                <div class=\'text-center align-middle overlaytitle\' id=\'` + folder + `-` + file + `-OverlayTitle\' style=\'min-height:7vh;width:auto;color:#FFFFFF;\'></div>
                              </div>
                            </a>`;
             fileindex++;
        }
        htmlString += `</div>
                      </div>`;
        $('#overlay').html(htmlString);
        visiblingimagecount = 0;
        showImages();
        if ($('#overlay').get(0).scrollTop != 0) {
            document.getElementById('overlay').scrollTop = '0px';
        }
        document.getElementById('navbar').style.top = '0px';
        document.getElementById('overlay').style.top = '65vh';
        document.getElementById('overlay').style.paddingBottom = '15px';
    }
}

function checkVideoInOverlay() {
    var txt = $('.video:visible').attr('class'); 
    var folder = txt.replace('video ', '');
    return folder == $('.folder:visible').text();
}

function goToVideo(el) {
    goingtovideo = true;
    clickMenu();
    var fileindex = Number(el.dataset.fileindex);
    slideIndex += fileindex;
    showSlides(slideIndex);
}

function goToChannel(el) {
    var folderindex = Number(el.dataset.folder);
    menuIndex = folderindex + 1;
    showMenu(menuIndex);
}

$(document).on('mousemove', function(event) {
    mouseOnTop(event.pageY);
});

function mouseOnTop(y) {
    if (wd == 1) {
        document.getElementById('navbar').style.top = '0px';
        document.getElementById('overlay').style.top = '65vh';
        document.getElementById('overlay').style.paddingBottom = '15px';
    }
    if (wu == 1 & !collapse) {
        document.getElementById('navbar').style.top = '-50px';
        document.getElementById('overlay').style.top = '100vh';
    }
    var windowsizey = $(window).innerHeight();
    if (y < 50 | y > windowsizey * 65 / 100 + 6)
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
        document.getElementById('list').style.display = 'inline-block';
    }
    else {
        collapse = false;
        document.getElementById('list').style.display = 'none';
    }
}

function listminus() {
    var item = prompt('Please enter a playlist name to delete:', '');
    if (!(item == null || item == '')) {
        item = window.btoa(unescape(encodeURIComponent(item)));
        playlists = JSON.parse(JSON.stringify(savedstorage) || '[]');
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
        SaveStorage(JSON.stringify(grouped));
    }
}

function listplus() {
    var item = prompt('Please enter a playlist name to add:', '');
    if (!(item == null || item == '')) {
        item = window.btoa(unescape(encodeURIComponent(item)));
        playlists = JSON.parse(JSON.stringify(savedstorage)) || [];
        playlists = transformObj(playlists);
        playlists.push({videoid: '', videotitle: '', playlist: item});
        var tempgrouper = playlists;
        var grouped = transformArr(tempgrouper);
        grouped = transformInpand(grouped);
        SaveStorage(JSON.stringify(grouped));
    }
}

function videominus() {
    var folder = $('.folder:visible').text();
    if (folder != '') {
        var item = prompt('Please enter a video id to delete from ' + folder + ' playlist:', '');
        if (!(item == null || item == '')) {
            playlists = JSON.parse(JSON.stringify(savedstorage) || '[]');
            playlists = transformObj(playlists);
            var newplaylists = [];
            playlists.forEach(function(val, index) {
                if ((val.videoid != item & val.playlist == window.btoa(unescape(encodeURIComponent(folder)))) | val.playlist != window.btoa(unescape(encodeURIComponent(folder)))) {
                    newplaylists.push({videoid: val.videoid, videotitle: val.videotitle, playlist: val.playlist});
                }
            });
            var tempgrouper = newplaylists;
            var grouped = transformArr(tempgrouper);
            grouped = transformInpand(grouped);
            SaveStorage(JSON.stringify(grouped));
        }
    }
}

function videoplus() {
    var folder = $('.folder:visible').text();
    if (folder != '') {
        var item = prompt('Please enter a video or playlist or channel id to add in ' + folder + ' playlist:', '');
        if (!(item == null || item == '')) {
            $('.spinner').removeClass('hide');
            $('.spinner').addClass('show');
            var isnotchannelplaylistid = false;
            var isnotplaylistid = false;
            var str = item[0] + item[1];
            (async () => {   
                if (str == 'UC') {                 
                    try {
                        var channelplaylistid = 'UU' + item.slice(2); 
                        var apikey = localStorage.getItem('apikey') || '';
                        var array = [];
                        var objdetails = [];
                        var nextpagetoken = '';
                        var nomorevideo = false;
                        var param = 'playlistId=' + channelplaylistid;
                        const responsef = await fetch('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&videoEmbeddable=true&maxResults=50&' + param + '&key=' + apikey);
                        const files = await responsef.json();
                        for (let file of files.items) {
                            var videoid = file.snippet.resourceId.videoId;
                            var title = window.btoa(unescape(encodeURIComponent(file.snippet.title)));
    	                    array.push(videoid);
                            objdetails[videoid] = title;
                        }
                        try {
                            nextpagetoken = files.nextPageToken;
                            if (nextpagetoken == 'undefined' | nextpagetoken == '' | nextpagetoken == null) {
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
                            const responsenf = await fetch('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&videoEmbeddable=true&maxResults=50&pageToken=' + nextpagetoken + '&' + param + '&key=' + apikey);
                            const nfiles = await responsenf.json();
                            for (let file of nfiles.items) {
                                var videoid = file.snippet.resourceId.videoId;
                                var title = window.btoa(unescape(encodeURIComponent(file.snippet.title)));
    	                        array.push(videoid);
                                objdetails[videoid] = title;
                            }
                            try {
                                nextpagetoken = nfiles.nextPageToken;
                                if (nextpagetoken == 'undefined' | nextpagetoken == '' | nextpagetoken == null) {
                                    break;
                                }
                            }
                            catch {
                                break;
                            }
                        }
                        playlists = JSON.parse(JSON.stringify(savedstorage) || '[]');
                        playlists = transformObj(playlists);
                        var newplaylists = [];
                        playlists.forEach(function(val, index) {
                            var inarray = array.includes(val.videoid);
                            if ((val.playlist == window.btoa(unescape(encodeURIComponent(folder))) & !inarray) | val.playlist != window.btoa(unescape(encodeURIComponent(folder)))) {
                                if (val.videotitle != 'Private Video')
                                    newplaylists.push({videoid: val.videoid, videotitle: val.videotitle, playlist: val.playlist});
                            }
                        });
                        for (let id of array) {
                            if (objdetails[id] != 'Private Video')
                                newplaylists.push({videoid: id, videotitle: objdetails[id], playlist: window.btoa(unescape(encodeURIComponent(folder)))});
                        }
                        var tempgrouper = newplaylists;
                        var grouped = transformArr(tempgrouper);
                        grouped = transformInpand(grouped);
                        SaveStorage(JSON.stringify(grouped));
                    }
                    catch {
                        isnotchannelplaylistid = true;
                    }
                }
                if (str != 'UC' | isnotchannelplaylistid) {                  
                    try {
                        var channelplaylistid = item; 
                        var apikey = localStorage.getItem('apikey') || '';
                        var array = [];
                        var objdetails = [];
                        var nextpagetoken = '';
                        var nomorevideo = false;
                        var param = 'playlistId=' + channelplaylistid;
                        const responsef = await fetch('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&' + param + '&key=' + apikey);
                        const files = await responsef.json();
                        for (let file of files.items) {
                            var videoid = file.snippet.resourceId.videoId;
                            var title = window.btoa(unescape(encodeURIComponent(file.snippet.title)));
    	                    array.push(videoid);
                            objdetails[videoid] = title;
                        }
                        try {
                            nextpagetoken = files.nextPageToken;
                            if (nextpagetoken == 'undefined' | nextpagetoken == '' | nextpagetoken == null) {
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
                            const responsenf = await fetch('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&pageToken=' + nextpagetoken + '&' + param + '&key=' + apikey);
                            const nfiles = await responsenf.json();
                            for (let file of nfiles.items) {
                                var videoid = file.snippet.resourceId.videoId;
                                var title = window.btoa(unescape(encodeURIComponent(file.snippet.title)));
    	                        array.push(videoid);
                                objdetails[videoid] = title;
                            }
                            try {
                                nextpagetoken = nfiles.nextPageToken;
                                if (nextpagetoken == 'undefined' | nextpagetoken == '' | nextpagetoken == null) {
                                    break;
                                }
                            }
                            catch {
                                break;
                            }
                        }
                        playlists = JSON.parse(JSON.stringify(savedstorage) || '[]');
                        playlists = transformObj(playlists);
                        var newplaylists = [];
                        playlists.forEach(function(val, index) {
                            var inarray = array.includes(val.videoid);
                            if ((val.playlist == window.btoa(unescape(encodeURIComponent(folder))) & !inarray) | val.playlist != window.btoa(unescape(encodeURIComponent(folder)))) {
                                if (val.videotitle != 'Private Video')
                                    newplaylists.push({videoid: val.videoid, videotitle: val.videotitle, playlist: val.playlist});
                            }
                        });
                        for (let id of array) {
                            if (objdetails[id] != 'Private Video')
                                newplaylists.push({videoid: id, videotitle: objdetails[id], playlist: window.btoa(unescape(encodeURIComponent(folder)))});
                        }
                        var tempgrouper = newplaylists;
                        var grouped = transformArr(tempgrouper);
                        grouped = transformInpand(grouped);
                        SaveStorage(JSON.stringify(grouped));
                    }
                    catch {
                        isnotplaylistid = true;
                    }
                    if (isnotplaylistid) {
                        var videoid = item;
                        var videotitle = '';
                        var videothumbnail = '';
                        $.ajax({
                            type: 'GET',
                            async: false,
                            cache: false,
                            url: 'https://noembed.com/embed?url=https://www.youtube.com/watch?v=' + videoid,
                            dataType: 'json',
                            success: function(data) {
                                if (data.error != '404 Not Found') {
                                    videotitle = window.btoa(unescape(encodeURIComponent(data.title)));
                                }
                            }
                        });
                        playlists = JSON.parse(JSON.stringify(savedstorage)) || [];
                        playlists = transformObj(playlists);
                        if (videotitle != 'Private Video')
                            playlists.push({videoid: item, videotitle: videotitle, playlist: window.btoa(unescape(encodeURIComponent(folder)))});
                        var tempgrouper = playlists;
                        var grouped = transformArr(tempgrouper);
                        grouped = transformInpand(grouped);
                        SaveStorage(JSON.stringify(grouped));
                    }
                }
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
	exportTableToTXT('playtube.txt');
}

function exportTableToTXT(filename) {
    var txt = JSON.stringify(savedstorage);
    DownloadTXT(txt, filename);
}

function addapikey() {
    var key = localStorage.getItem('apikey');
    var item = prompt('Please enter a youtube API key for add videos from a playlist or channel id:', key);
    if (!(item == null || item == '')) {
        localStorage.setItem('apikey', item);
    }
}

function random() {
    var element = document.getElementsByClassName('random');
    if (!rand) {
        rand = true;
        for (var i = 0; i < element.length; i++) {
            element[i].style.color = 'white';
        }
    }
    else {
        rand = false;
        for (var i = 0; i < element.length; i++) {
            element[i].style.color = 'gray';
        }
    }
}

function showImages() {
    var folder = $('.folder:visible').text();
    var files = objdata[folder];
    var scrollsize = $('#overlay').get(0).scrollHeight;
    var scrollpos = $('#overlay').get(0).scrollTop;
    var numvisible = scrollpos / scrollsize * files.length + 8;
    var ytimages = document.getElementsByClassName('overlayimage');
    var yttitles = document.getElementsByClassName('overlaytitle');
    var i;
    if (yttitles[visiblingimagecount].innerHTML == '') {
        for (i = visiblingimagecount; i < numvisible & i < files.length; i++) {
            if (yttitles[i].innerHTML == '') {
                var overlayimageid = ytimages[i].id;
                var str = overlayimageid.replace(folder + '-', '');
                var file = str.replace('-Overlay', '');
                ytimages[i].src = thumbnails[file];
                yttitles[i].innerHTML = titles[file];
            }
        }
    }
    visiblingimagecount = i;
}

$('#overlay').scroll(function() {
    showImages();
});

function setPlayer(ind) {
    var folder = $('.folder:visible').text();
    var playervideo = document.getElementsByClassName('video ' + folder);
    playervideo[0].id = playerid[ind];
    var playercenteredtitle = document.getElementsByClassName('centered title ' + folder);
    playercenteredtitle[0].innerHTML = playertitle[ind];
}
</script>
<script>

$('body').on('click', 'img', function() {
    var source = this.src;
    var input = document.createElement('textarea');
    input.value = source;
    document.body.appendChild(input);
    input.select();
    document.execCommand('Copy');
    input.remove();
});

</script>
".Replace("\r\n", " ").Replace("savedstorage", savedstorage);
            stringinject = @"""" + stringinject + @"""";
            stringinject = @"$(document).ready(function(){$('body').html(" + stringinject + @");});";
            this.webView1.EvalScript(stringinject);
        }
        void WebView_JSSaveStorage(object sender, JSExtInvokeArgs e)
        {
            string tempsavepath = System.Reflection.Assembly.GetEntryAssembly().Location.Replace(@"file:\", "").Replace(Process.GetCurrentProcess().ProcessName + ".exe", "").Replace(@"\", "/").Replace(@"//", "") + "tempsave";
            using (StreamWriter createdfile = new StreamWriter(tempsavepath))
            {
                string str = e.Arguments[0] as string;
                createdfile.WriteLine(str);
            }
            Navigate("https://www.youtube.com/feed/subscriptions");
        }
        [STAThread]
        void WebView_JSOpenStorage(object sender, JSExtInvokeArgs e)
        {
            Thread newThread = new Thread(new ThreadStart(showOpenFileDialog));
            newThread.SetApartmentState(ApartmentState.STA);
            newThread.Start();
        }
        public void showOpenFileDialog()
        {
            string str = "";
            OpenFileDialog op = new OpenFileDialog();
            op.Filter = "All Files(*.*)|*.*";
            if (op.ShowDialog() == DialogResult.OK)
            {
                using (StreamReader file = new StreamReader(op.FileName))
                {
                    str = file.ReadLine();
                }
                string tempsavepath = System.Reflection.Assembly.GetEntryAssembly().Location.Replace(@"file:\", "").Replace(Process.GetCurrentProcess().ProcessName + ".exe", "").Replace(@"\", "/").Replace(@"//", "") + "tempsave";
                using (StreamWriter createdfile = new StreamWriter(tempsavepath))
                {
                    createdfile.WriteLine(str);
                }
                Navigate("https://www.youtube.com/feed/subscriptions");
            }
        }
        [STAThread]
        void WebView_JSDownloadTXT(object sender, JSExtInvokeArgs e)
        {
            txt = e.Arguments[0] as string;
            Thread newThread = new Thread(new ThreadStart(showSaveFileAsDialog));
            newThread.SetApartmentState(ApartmentState.STA);
            newThread.Start();
        }
        public void showSaveFileAsDialog()
        {
            SaveFileDialog sa = new SaveFileDialog();
            sa.Filter = "All Files(*.*)|*.*";
            if (sa.ShowDialog() == DialogResult.OK)
            {
                using (StreamWriter createdfile = new StreamWriter(sa.FileName))
                {
                    createdfile.WriteLine(txt);
                }
            }
        }
        private void timer1_Tick(object sender, EventArgs e)
        {
            try
            {
                if (this.WindowState == FormWindowState.Minimized)
                {
                    this.pictureBox1.Visible = false;
                }
                else
                {
                    this.pictureBox1.Visible = true;
                }
            }
            catch { }
            if (webView1.Url.Contains("youtu"))
            {
                string stringinject = @"
                    document.cookie = 'VISITOR_INFO1_LIVE = oKckVSqvaGw; path =/; domain =.youtube.com';
                    var cookies = document.cookie.split('; ');
                    for (var i = 0; i < cookies.length; i++)
                    {
                        var cookie = cookies[i];
                        var eqPos = cookie.indexOf('=');
                        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
                    }
                    var el = document.getElementsByClassName('ytp-ad-skip-button');
                    for (var i=0;i<el.length; i++) {
                        el[i].click();
                    }
                    var element = document.getElementsByClassName('ytp-ad-overlay-close-button');
                    for (var i=0;i<element.length; i++) {
                        element[i].click();
                    }
                    var scripts = document.getElementsByTagName('script');
                    for (let i = 0; i < scripts.length; i++)
                    {
                        var content = scripts[i].innerHTML;
                        if (content.indexOf('ytp-ad') > -1) {
                            scripts[i].innerHTML = '';
                        }
                        var src = scripts[i].getAttribute('src');
                        if (src.indexOf('ytp-ad') > -1) {
                            scripts[i].setAttribute('src', '');
                        }
                    }
                    var iframes = document.getElementsByTagName('iframe');
                    for (let i = 0; i < iframes.length; i++)
                    {
                        var content = iframes[i].innerHTML;
                        if (content.indexOf('ytp-ad') > -1) {
                            iframes[i].innerHTML = '';
                        }
                        var src = iframes[i].getAttribute('src');
                        if (src.indexOf('ytp-ad') > -1) {
                            iframes[i].setAttribute('src', '');
                        }
                    }
                    var allelements = document.querySelectorAll('*');
                    for (var i = 0; i < allelements.length; i++) {
	                    var classname = allelements[i].className;
                        if (classname.indexOf('ytp-ad') > -1)  {
                                allelements[i].innerHTML = '';
			            }
                    }
                ".Replace("\r\n", " ");
                this.webView1.QueueScriptCall(stringinject);
            }
        }
        private void Form1_FormClosed(object sender, FormClosedEventArgs e)
        {
            this.webView1.Dispose();
        }
    }
}