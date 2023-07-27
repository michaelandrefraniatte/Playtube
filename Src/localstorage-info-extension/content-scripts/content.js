chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

document.getElementsByTagName('html')[0].innerHTML = '<head></head><body></body>';

var script = document.createElement('script'); 
script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js'; 
document.head.appendChild(script);

var stringinject = `
    <link rel="shortcut icon" href="${request.favicon}" type="image/png" />
    
    <style>
    
    html, body {
        background-color: #222;
        color: white;
        margin: 10px;
        padding: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    </style>`;

document.getElementsByTagName('head')[0].innerHTML = stringinject;

stringinject = `

<div id="info"></div>

<script>

    function getUsedSpaceOfLocalStorageInBytes() {
        // Returns the total number of used space (in Bytes) of the Local Storage
        var b = 0;
        for (var key in window.localStorage) {
            if (window.localStorage.hasOwnProperty(key)) {
                b += key.length + localStorage.getItem(key).length;
            }
        }
        return b;
    }
    function getUnusedSpaceOfLocalStorageInBytes() {
        var maxByteSize = 10485760; // 10MB
        var minByteSize = 0;
        var tryByteSize = 0;
        var testQuotaKey = 'testQuota';
        var timeout = 20000;
        var startTime = new Date().getTime();
        var unusedSpace = 0;
        do {
            runtime = new Date().getTime() - startTime;
            try {
                tryByteSize = Math.floor((maxByteSize + minByteSize) / 2);
                localStorage.setItem(testQuotaKey, new Array(tryByteSize).join('1'));
                minByteSize = tryByteSize;
            } catch (e) {
                maxByteSize = tryByteSize - 1;
            }
        } while ((maxByteSize - minByteSize > 1) && runtime < timeout);
        localStorage.removeItem(testQuotaKey);
        if (runtime >= timeout) {
            console.log("Unused space calculation may be off due to timeout.");
        }
        // Compensate for the byte size of the key that was used, then subtract 1 byte because the last value of the tryByteSize threw the exception
        unusedSpace = tryByteSize + testQuotaKey.length - 1;
        return unusedSpace;
    }
    function getLocalStorageQuotaInBytes() {
        // Returns the total Bytes of Local Storage Space that the browser supports
        var unused = getUnusedSpaceOfLocalStorageInBytes();
        var used = getUsedSpaceOfLocalStorageInBytes();
        var quota = unused + used;
        return "Total : " + quota / 1000 + ", Unused : " + unused / 1000 + ", Used : " + used / 1000 + ", in Kilo Bytes.";
    }
    $(document).ready(function() {
        var div = document.getElementById('info');
        div.innerHTML = getLocalStorageQuotaInBytes();
    });

</script>`;

    (function () {
        getScript('https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js', function () {
            $(document).ready(function () {
                $('body').html(stringinject);
            });
        });
        function getScript(url, success) {
            var script = document.createElement('script');
            script.src = url;
            var head = document.getElementsByTagName('head')[0],
                done = false;
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
    })();

  sendResponse({ fromcontent: "This message is from content.js" });
});
