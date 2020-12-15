// Représente une unité d'information.
class Info {

    myMarkerIcon = L.Icon.extend({ // set the style of icons.
        options: {
            iconSize: [70, 70], // size of the icon
            shadowSize: [50, 50], // size of the shadow
            iconAnchor: [20, 40], // point of the icon which will correspond to marker's location
            shadowAnchor: [0, 40], // the same for the shadow
            popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
        }
    });

    constructor(properties) {
        this.keys = ['id', 'timediff', 'description', 'latitude', 'longitude', 'marker', 'source', 'image', 'optJSON'];
        this.info = {};
        this.formInputs = {};
        this.info['id'] = 0; // default value
        if (properties && properties['createdAt'])
            this.info['timediff'] = (currtime.getTime() -
                new Date(properties['createdAt']).getTime()) / 1000;
        if (properties)
            this.updateValues(properties);
    }

    updateValues(fields) {
        for (var k of this.keys) {
            if (fields[k])
                this.info[k] = fields[k]
        }
    }

    // Update the values with the values from the form.
    updateFromForm() {
        var newval = {
            'description': this.formInputs["description"].value.trim(),
            'marker': this.formInputs['marker'].innerHTML.trim(),
            'source': this.formInputs["source"].value.trim(),
            'image': this.formInputs["image"].value.trim() //.substring(0, this.formInputs["image"].value.indexOf('&')).trim()
        }
        for (var k in newval) {
            this.info[k] = newval[k]
        }
    }

    // Build a DOM element displaying the info and put a marker on mymap.
    initDisplay() {
        this.display = document.createElement("div");
        this.display.className = "row no-gutters border";

        this.display.id = 'info' + this.info['id'];

        //description box.
        var desc = document.createElement("div");
        desc.innerHTML = this.info['description'];

        //date box.
        var dbox = document.createElement("div");
        dbox.classList.add(...['infodate', 'align-middle']);
        dbox.innerHTML = this.getTimediff();

        //source box.
        var source = document.createElement("div");
        source.classList.add('infosrc');
        var link = document.createElement("a");
        link.href = this.info["source"];
        link.innerHTML = this.info["source"];
        source.appendChild(link);

        //icon box.
        var iconpath = markerspath + iconUrls[this.info['marker']];
        var iconbox = document.createElement("div");
        var iconimg = document.createElement("img");
        iconimg.classList.add('infoicon');
        iconimg.src = iconpath;
        iconbox.appendChild(iconimg);

        // Optional image.
        var imgbox = document.createElement("div");
        if (this.info['image']) {
            let imgref = document.createElement("img");
            imgref.src = this.info['image'];
            imgref.classList.add('img-fluid');
            imgbox.appendChild(imgref);
        }

        //put boxes in place.
        //var icondaterow = document.createElement("div");
        //icondaterow.classList.add(...['col-12'])
        iconbox.classList.add(...['p-1', 'mr-auto']);
        iconbox.style.width = '70px';
        this.display.appendChild(iconbox)
        dbox.classList.add(...['p-1', 'infodate']);
        this.display.appendChild(dbox)
        //this.display.appendChild(icondaterow);
        desc.classList.add(...['col-12', 'p-2']);
        this.display.appendChild(desc);
        imgbox.classList.add("col-12");
        if (this.info['image']) this.display.appendChild(imgbox);
        source.classList.add(...["row", "no-gutters", "overflow-hidden"]);
        this.display.appendChild(source);

        // add the corresponding marker to mymap.
        this.marker = L.marker(this.getLocation(), {
            icon: new this.myMarkerIcon({
                iconUrl: iconpath
            })
        });
        this.marker.addTo(mymap);

        // add event when focusing on info and loosing focus on targetInfo.
        this.marker.addEventListener('click', () => this.infoTarget());
        this.display.addEventListener('click', () => this.infoTarget());
    }

    // Return the DOM element displaying the info.
    getDisplay() {
        if (!this.display)
            this.initDisplay()
        return this.display
    }

    // Remove the Marker.
    removeMarker() {
        if (this.marker)
            this.marker.remove()
    }

    // Initialize the form to be used.
    initForm() {
        this.form = document.createElement('div')
        this.form.classList.add('formstyle')

        var descbox = document.createElement('div')
        var desclabel = document.createElement('label')
        desclabel.htmlFor = 'description' + (this.info['id'] ? this.info['id'] : 0)
        desclabel.innerHTML = 'Description à afficher :'
        var descinput = document.createElement('textarea')
        descinput.id = desclabel.htmlFor
        descinput.classList.add('form-control')
        descinput.placeholder = 'Résumé'
        descinput.rows = '4'
        descbox.appendChild(desclabel)
        descbox.appendChild(descinput)

        var pickerbox = document.createElement('div')
        var pickerbutton = document.createElement('button')
        pickerbutton.type = 'button'
        pickerbutton.classList.add(...['btn', 'btn-outline-dark', 'selectbox'])
        //pickerbutton.addEventListener('click', () => this.overlaypicker.style.display = "block");
        var pickimg = document.createElement('img')
        pickimg.classList.add('infoicon')
        pickerbox.appendChild(pickerbutton)
        pickerbox.appendChild(pickimg)
        this.setMarker = function (t) {
            pickerbutton.innerHTML = t
            pickimg.src = markerspath + iconUrls[t]
        }

        var srcbox = document.createElement('div')
        var srclabel = document.createElement('label')
        srclabel.htmlFor = 'source' + (this.info['id'] ? this.info['id'] : 0)
        srclabel.innerHTML = 'Source :'
        var srcinput = document.createElement('input')
        srcinput.id = srclabel.htmlFor
        srcinput.type = 'text'
        srcinput.classList.add('form-control')
        srcinput.placeholder = 'Source URL'
        srcbox.appendChild(srclabel)
        srcbox.appendChild(srcinput)

        var imgbox = document.createElement('div')
        var imglabel = document.createElement('label')
        imglabel.htmlFor = 'image' + (this.info['id'] ? this.info['id'] : 0)
        imglabel.innerHTML = 'Lien vers une image :'
        var imginput = document.createElement('input')
        imginput.id = imglabel.htmlFor
        imginput.type = 'text'
        imginput.classList.add('form-control')
        imginput.placeholder = 'Image URL'
        imgbox.appendChild(imglabel)
        imgbox.appendChild(imginput)

        //put boxes in place.
        descbox.classList.add("col-12");
        this.form.appendChild(descbox);
        pickerbox.classList.add(...['row', 'd-flex', 'justify-content-around']);
        this.form.appendChild(pickerbox);
        srcbox.classList.add("col-12");
        this.form.appendChild(srcbox);
        imgbox.classList.add("col-12");
        this.form.appendChild(imgbox);

        // Store inputs element for later retrieval.
        this.formInputs['description'] = descinput
        this.formInputs['marker'] = pickerbutton
        this.formInputs['source'] = srcinput
        this.formInputs['image'] = imginput
    }

    // Build the form element for editing the info.
    buildFormulaire() {
        if (!this.info['marker'])
            this.info['marker'] = Object.keys(iconUrls)[0];
        if (!this.form)
            this.initForm();
        if (!this.overlaypicker)
            this.buildPickOverlay();

        this.setMarker(this.info['marker'])

        //fill with data if exists
        if (this.info['description']) this.formInputs['description'].value = this.info['description'];
        if (this.info['source']) this.formInputs['source'].value = this.info['source'];
        if (this.info['image']) this.formInputs['image'].value = this.info['image'];
    }

    //Initialize the form element for submitting a new info.
    initNewform() {
        this.newform = document.createElement('div')
        var submitbutton = document.createElement('button')
        submitbutton.classList.add(...['btn', 'btn-primary'])
        submitbutton.innerHTML = 'Envoyer !'
        submitbutton.addEventListener('click', () => newinfo.storeToDB())

        var buttdiv = document.createElement('div')
        buttdiv.classList.add(...['row', 'justify-content-center', 'mt4'])
        buttdiv.appendChild(submitbutton)

        this.newform.appendChild(this.form)
        this.newform.appendChild(buttdiv)
    }

    //Return the form element for submitting a new info.
    getNewform() {
        this.buildFormulaire()
        if (!this.newform)
            this.initNewform()
        return this.newform
    }

    //Initialize the form element for editing the info.
    initEditform() {
        this.editform = document.createElement('div')
        var submitbutton = document.createElement('button')
        submitbutton.classList.add(...['btn', 'btn-primary'])
        submitbutton.innerHTML = 'Modifier !'
        submitbutton.addEventListener('click', () => this.storeToDB())

        var delbutton = document.createElement('button')
        delbutton.classList.add(...['btn', 'btn-outline-danger'])
        delbutton.innerHTML = 'Suprimer !'
        delbutton.addEventListener('click', () => this.supprFromDB())

        var buttdiv = document.createElement('div')
        buttdiv.classList.add(...['row', 'justify-content-around', 't2'])
        buttdiv.appendChild(submitbutton)
        buttdiv.appendChild(delbutton)

        this.editform.appendChild(this.form)
        this.editform.appendChild(buttdiv)
    }

    //Return the form element for editing the info.
    getEditform() {
        this.buildFormulaire()
        if (!this.editform)
            this.initEditform()
        return this.editform
    }

    // Build a top layer overlay to pick a type.
    buildPickOverlay() {
        this.overlaypicker = document.createElement('div');
        this.overlaypicker.classList.add('pickoverlay');
        this.overlaypicker.addEventListener('click', () => this.overlaypicker.style.display = "none");

        var selectflex = document.createElement('div');
        selectflex.classList.add(...["row", "d-flex", "justify-content-center", "vertical-center"]);
        for (var type in iconUrls) {
            let selectbox = document.createElement('div');
            selectbox.classList.add(...["selectbox"]);

            var a = document.createElement('p');
            a.innerHTML = type;

            var b = document.createElement('img');
            b.classList.add('infoicon');
            b.src = markerspath + iconUrls[type];

            selectbox.appendChild(b);
            selectbox.appendChild(a);

            selectbox.setAttribute('data-type', type);
            selectbox.addEventListener('click',
                () => this.setMarker(selectbox.getAttribute('data-type')));
            selectflex.appendChild(selectbox);
        }
        this.overlaypicker.appendChild(selectflex);
        this.formInputs['marker'].addEventListener('click', () => this.overlaypicker.style.display = "block");
        document.body.appendChild(this.overlaypicker);
    }

    // Highlight the info as targeted if in feed mode; Display the info in a popup in full map mode.
    infoTarget() {
        if (targetInfo)
            targetInfo.unTarget();
        if (infocanvas.style.display === "block") {
            //highlight info box with target classname defined in css/main.css.
            this.getDisplay().classList.add('target');
            this.getDisplay().scrollIntoView(true);
            targetInfo = this;
            //move map view to marker.
            mymap.setView(this.getLocation());
        } else {
            infopopup
                .setLatLng(this.getLocation())
                .setContent(this.getDisplay())
                .openOn(mymap);
            //move map view to popup.
        }
    }

    // Un-highlight the info as targeted.
    unTarget() {
        this.getDisplay().classList.remove('target');
    }

    getLocation() {
        return [this.info['latitude'], this.info['longitude']];
    }

    getId() {
        return this.info['id'] ? this.info['id'] : 'ID inexistant';
    }

    /*
     *   Format the date to be printable.
     *   timestamp is assumed to be in second (and not milisecond)
     */
    getTimediff() {
        var str = this.info['timediff'] > 0 ? 'Il y a ' : 'Dans ';
        var precision = 2 // number of timing information.
        var dhms = [Math.floor(this.info['timediff'] / (3600 * 24)),
            Math.floor(this.info['timediff'] % (3600 * 24) / 3600),
            Math.floor(this.info['timediff'] % 3600 / 60),
            Math.floor(this.info['timediff'] % 60)
        ];
        var espaceinsecable = '&#8239';
        var dhmsname = [espaceinsecable + 'jour', espaceinsecable + 'heure', espaceinsecable + 'minute', espaceinsecable + 'seconde'];

        var i = 0
        while (!dhms[i++] && i < dhms.length);
        if (!dhms[--i])
            return "<p>À l'instant</p>";
        while (precision-- && i < dhms.length)
            str += dhms[i] + dhmsname[i] + (dhms[i++] > 1 ? 's ' : ' ');
        return "<p>" + str + "</p>";
    }

    // To be called to dump the object and free memory.
    removeInfo() {
        this.removeMarker();
        if (this.overlaypicker)
            this.overlaypicker.remove()
    }

    /*
     *   Store the piece of information into the database.
     */
    storeToDB() {
        this.updateFromForm()
        $.ajax({
            url: '/infos/saveinfo',
            type: 'POST',
            cache: false,
            success: function (data) {
                refreshInfoList()
                if (editoverlay && editoverlay.style.display == 'block') // If it is an edit
                    editoverlay.firstChild.innerHTML = data
                else
                    editpopup.setContent(data)
            },
            failure: function (errMsg) {
                if (editoverlay && editoverlay.style.display == 'block') // If it is an edit
                    editoverlay.firstChild.innerHTML = errMsg
                else
                    editpopup.setContent(errMsg)
                console.log(errMsg)
            },
            data: {
                info: JSON.stringify(this.info)
            },
        });
    }

    /*
     *   Delete the piece of information off the database.
     */
    supprFromDB() {
        $.ajax({
            url: '/infos/delinfo',
            type: 'DELETE',
            success: function (data) {
                refreshInfoList()
                editoverlay.firstChild.innerHTML = data
            },
            failure: function (errMsg) {
                editoverlay.firstChild.innerHTML = errMsg
                console.log(errMsg)
            },
            data: {
                infoid: this.info['id']
            },
        });
    }
}