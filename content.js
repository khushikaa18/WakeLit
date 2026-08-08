const WAKE_TEXT ="get this app back up!";

function findWakeButton(){
    const buttons= Array.from(document.querySelectorAll("button"));
    return buttons.find(function(btn){
        return btn.textContent.toLowerCase().includes(WAKE_TEXT);

    });
}

setTimeout(function(){
    const wakeButton = findWakeButton();
    if(wakeButton){
        wakeButton.click();
        console.log("WakeLit: Clicked the wake button.");
        chrome.runtime.sendMessage({type:"WOKE_APP"});
    }else{
        console.log("WakeLit: App was already awake or wake button not found.");
        chrome.runtime.sendMessage({type:"ALREADY_AWAKE"});
    }
},3000);

