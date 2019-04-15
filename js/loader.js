// Envil variable
var Envil = {};

Envil.edit = false;
Envil.skip = false;
Envil.loading;
Envil.exportContainer;


/*
Load function, set the export & loading container and fetch data from the DB from Envil Item
 */
Envil.load = function()
{
    Envil.exportContainer = document.querySelector('#export');
    Envil.loading = document.querySelector('#spinner');
    Envil.Item.fetch();
};

/*
Import applyData profile from applyData code
 */
Envil.importFromUrl = function()
{
    if (!Envil.isLoaded)
    {
        return;
    }

    var importCode = decodeURI(new URL(window.location.href).searchParams.get("id"));

    try
    {
        if (importCode == undefined || !Envil.import(importCode)) {
            Envil.Sort.default();
        }
    }
    catch (e)
    {
        console.log(e);
        Envil.Sort.default();
    }
};

Envil.request = function(uInt8Array,cb)
{
    // Create the data base from an int 8 array and fetch all data
    var db = new SQL.Database(uInt8Array);
    var contents = db.exec("SELECT * FROM `result (2)`;");

    // Create applyData header array to easily identify data eg header.stabAttack
    var i = 0;
    Envil.Item.header = contents[0].columns.reduce((o,val) => { o[val] = i++; return o; }, {});

    // Remap sortTypes and filterTypes automatically to update their keys to the int value (header)
    Object.keys(Envil.Sort.sortTypes).forEach((elm) => { Envil.Sort.sortTypes[Envil.Item.header[elm]] = Envil.Sort.sortTypes[elm]; delete Envil.Sort.sortTypes[elm]; } );
    Object.keys(Envil.Sort.filterTypes).forEach((elm) => { Envil.Sort.filterTypes[Envil.Item.header[elm]] = Envil.Sort.filterTypes[elm]; delete Envil.Sort.filterTypes[elm]; } );

    // Execute the callback on each result item
    contents[0].values.forEach(function(elm)
    {
        cb(elm);
    });

    // Load Sort
    Envil.Sort.load();

    // Check to import data from teh URL
    Envil.importFromUrl();

    // Remove loading animation
    Envil.loading.remove();

    // Dirty hack to reupgrade everything
    document.querySelectorAll('*').forEach((elm) => elm.removeAttribute('data-upgraded'));
    componentHandler.upgradeDom();
};

/*
Load the data data
 */
Envil.loadData = function(cb)
{
    const url = './js/data/db.sqlite';

    fetch(url)
    .then(function(response) {
        return response.arrayBuffer();
    })
    .then(function(buffer) {
        Envil.request(new Uint8Array(buffer),cb);
    });
};


/*
Clamp a number between values

Source: https://stackoverflow.com/questions/11409895/whats-the-most-elegant-way-to-cap-a-number-to-a-segment
 */
Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};


/*
Array formatting based on {0}

Source: https://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format
 */
Envil.format = function(string)
{
    var args = Array.prototype.slice.call(arguments, 1);
    return string.replace(/{(\d+)}/g, function(match, number) {
        return typeof args[number] != 'undefined'
            ? args[number]
            : match
            ;
    });
};

/*
Create applyData dom element based on applyData string/html

Source: https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro
 */
Envil.createDomElement = function(html)
{
    var template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
};

/*
Export the data to applyData JSON array and then based64 encode it, skip if the import/export is dirty
 */
Envil.export = function()
{
    if (Envil.skip)
    {
        return;
    }

    console.log("exporting");

    const str = btoa(JSON.stringify(
        {
            active: Envil.Item.active,
            sort: [ Envil.Sort.getSortParameters(), Envil.Sort.getFilterParameters() ],
            stats: Envil.DPS.current()
        }));

    window.history.pushState('page2', 'Title', './?id=' + encodeURI(str));

    this.exportContainer.value = str;
};

/*
Import the base64 encoded JSON array into the system based on parameter or input
 */
Envil.import = function(s)
{
    const str = s || document.querySelector('#import').value.trim();

    if (str == '' || str == 'null')
    {
        return;
    }

    this.exportContainer.value = s;

    Envil.skip = true;

    const data = JSON.parse(atob(str));

    Envil.Item.setActive(data.active);
    Envil.DPS.import(data.stats);
    Envil.Sort.import(data.sort);

    Envil.skip = false;

    return true;
};


/*
Data and item loading section, load by Envil.addLoad();
 */

Envil.loadCb = [];
Envil.isLoaded = false;
Envil.required = [ 'Item', 'Sort', 'DPS' ];

Envil.run = function()
{
    for (const key in Envil.required)
    {
        if (!Envil.hasOwnProperty(Envil.required[key]))
        {
            return;
        }
    }

    Envil.load();
};

Envil.addLoad = function(cb)
{
     if (Envil.isLoaded)
     {
         cb();
         Envil.run();
     }
     else
     {
         Envil.loadCb.push(cb);
     }
};

Envil.doLoad = function()
{
    Envil.loadCb.forEach((cb) => cb());

    Envil.run();

    Envil.isLoaded = true;
};

// Register the service worker for db caching
if ('serviceWorker' in navigator)
{
    try {
        navigator.serviceWorker.register('./js/service-worker.js', {
            scope: './js/'
        });
    }
    catch(e)
    {
        console.log(e);
    }
}

// Hook on onLoad
window.addEventListener('load', Envil.doLoad);

// If URL changes -> refresh importer
window.addEventListener('popstate', Envil.importFromUrl);