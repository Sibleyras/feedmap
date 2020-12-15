var dayslimit = 14; // Print the latest info of the past <dayslimit> days. Value 0 will fetch all.

var mapcanvas = document.getElementById("mapcanvas");
var infocanvas = document.getElementById("infocanvas");
var targetInfo; //the current targetted info.
var iconUrls; //the urls of type1 is iconUrls['type1].
var infolist; // the list of Info.
var editoverlay;
let allloaded = new CustomEvent('allloaded')
var markerspath = "/images/"
var currtime;

// Our popup style
var infopopup = L.popup({
    minWidth: window.innerWidth / 3,
    maxWidth: window.innerWidth * 3 / 4
});

window.addEventListener("load", () => refreshInfoList());

function refreshInfoList() {
    var nb_parts = 3;
    var parts_loaded = 0;
    var res;

    function lancement(){
        // USE THE DATA WHEN ALL RECEIVED
        if (++parts_loaded == nb_parts) {
            initInfolist();
            for (let e of res) {
                infolist.push(new Info(e))
            }
            setInfoFeedMode() // TODO Default mode based on screen width ?
            window.dispatchEvent(allloaded)
        }
    }

    // FETCH DATA FROM SERVER VIA AJAX
    var xhr = new XMLHttpRequest();
    xhr.open('GET', markerspath+"marker.json", true);
    xhr.onload = function() {
        // WE PARSE THE JSON RESPONSE FROM THE SERVER
        iconUrls = JSON.parse(this.response);
        lancement();
    };
    xhr.send();

    // FETCH DATA FROM SERVER VIA AJAX
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "/infos/getcurrtime", true);
    xhr.onload = function() {
        currtime = new Date(this.response.replace(/['"]+/g, ''))
        lancement();
    };
    xhr.send();

    xhr = new XMLHttpRequest();
    xhr.open('GET', "/infos/getinfolist/"+dayslimit, true);
    xhr.onload = function() {
        // WE PARSE THE JSON RESPONSE FROM THE SERVER
        res = JSON.parse(this.response);
        console.log(res)
        lancement();
    };
    xhr.send();
}

// Clean delete the previous infolist if needed and empty the array.
function initInfolist() {
    if (infolist) {
        for (let i of infolist) {
            i.removeInfo()
        }
    }
    infolist = [];
}

// empty the element parent
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.firstChild.remove();
    }
}

// Put all infos in the infocanvas
function buildInfoList() {
    removeAllChildNodes(infocanvas); // Delete Previous Entries
    console.log('Printing ' + infolist.length + ' entries.')
    for (let info of infolist) {
        infocanvas.appendChild(info.getDisplay());
    }
}

function switchViewMode() {
    if (infocanvas.style.display === "none") {
        setInfoFeedMode()
    } else {
        setFullMapMode()
    }
}

function setFullMapMode() {
    infocanvas.style.display = "none"
    mapcanvas.classList.remove(...['col-6', 'col-sm-7', 'col-md-8', 'col-lg-9'])
    mapcanvas.classList.add('col-12')
}

function setInfoFeedMode() {
    infocanvas.style.display = "block"
    mapcanvas.classList.remove('col-12')
    mapcanvas.classList.add(...['col-6', 'col-sm-7', 'col-md-8', 'col-lg-9'])
    buildInfoList()
    mymap.closePopup()
}