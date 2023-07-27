const sendMessageId = document.getElementById("sendmessageid");
if (sendMessageId) {
  sendMessageId.onclick = function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        {
            favicon: chrome.extension.getURL("icons/li128x128.png"),
            tabId: tabs[0].id
        },
        function(response) {
          console.log("message with url sent");
          window.close();
        }
      );
    });
  };
}