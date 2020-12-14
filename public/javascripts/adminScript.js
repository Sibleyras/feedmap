// --------------------------- TOOLS TO ADD A NEW ENTRY ON MAP CLICK -------------------
window.addEventListener('allloaded', () => mymap.on('click', newInfoPopup));

// Our popup style
var editpopup = L.popup({
    minWidth: window.innerWidth / 3
});

var newinfo = new Info();
editpopup.addEventListener('remove', () => newinfo.updateFromForm());

function newInfoPopup(e) {
    newinfo.updateValues({
        'latitude': e.latlng['lat'],
        'longitude': e.latlng['lng']
    })

    editpopup
        .setLatLng(e.latlng)
        .setContent(newinfo.getNewform())
        .openOn(mymap);
}

// --------------------------- TOOLS TO EDIT/DELETE AN ENTRY -------------------
window.addEventListener('allloaded', () => editdblclick());

var editoverlay;

// Set the edit event on double click on the info display box
function editdblclick() {
    for (let info of infolist) {
        info.getDisplay().addEventListener('dblclick', () => openEditOverlay(info))
    }
}

function openEditOverlay(info) {
    getEditoverlay()
    removeAllChildNodes(editoverlay.firstChild) //cleanse the overlay
    editoverlay.firstChild.appendChild(info.getEditform())
    editoverlay.style.display = "block"
}

// Build a first layer overlay to edit information
function initEditoverlay() {
    editoverlay = document.createElement('div');
    editoverlay.classList.add(...['editoverlay', 'dflex', 'justify-content-center']);
    editoverlay.addEventListener('click', function(e) {
        if (e.target === editoverlay)
            editoverlay.style.display = "none"
    });

    var editbox = document.createElement('div');
    editbox.classList.add('dflex')

    editoverlay.appendChild(editbox);
    document.body.appendChild(editoverlay);
}

//Return the first layer overlay
function getEditoverlay() {
    if (!editoverlay)
        initEditoverlay()
    return editoverlay;
}