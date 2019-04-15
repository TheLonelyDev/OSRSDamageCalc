Envil.Item = {};

// All the stat icons
Envil.Item.statIcons =
{
    STAB: "https://vignette.wikia.nocookie.net/2007scape/images/5/5c/White_dagger.png/revision/latest?cb=20130227205219",
    SLASH: "https://vignette.wikia.nocookie.net/2007scape/images/8/8b/White_scimitar.png/revision/latest?cb=20130227205337",
    CRUSH: "https://vignette.wikia.nocookie.net/2007scape/images/6/6a/White_warhammer.png/revision/latest?cb=20130227204528",
    MAGIC: "https://vignette.wikia.nocookie.net/2007scape/images/5/5c/Magic_icon.png/revision/latest?cb=20181017210132",
    RANGE: "https://vignette.wikia.nocookie.net/2007scape/images/1/19/Ranged_icon.png/revision/latest?cb=20181017211502",
    STAB_DEFENCE: "https://i.imgur.com/ellZ5AE.png",
    SLASH_DEFENCE: "https://i.imgur.com/Iyr4zqk.png",
    CRUSH_DEFENCE: "https://i.imgur.com/N0ItbPm.png",
    MAGIC_DEFENCE: "https://i.imgur.com/Gu9B3xt.png",
    RANGE_DEFENCE: "https://i.imgur.com/gzoCYYj.png",
    STRENGTH: "https://vignette.wikia.nocookie.net/2007scape/images/1/1b/Strength_icon.png/revision/latest?cb=20181017211100",
    RANGED_STRENGTH: "https://vignette.wikia.nocookie.net/2007scape/images/2/22/Ranged_Strength_icon.png/revision/latest?cb=20140731232105",
    MAGIC_DAMAGE: "https://vignette.wikia.nocookie.net/2007scape/images/c/cc/Magic_Damage_icon.png/revision/latest?cb=20140801000308",
    PRAYER: "https://vignette.wikia.nocookie.net/2007scape/images/f/f2/Prayer_icon.png/revision/latest?cb=20180424010757",
    COINS: "https://vignette.wikia.nocookie.net/2007scape/images/3/30/Coins_10000.png/revision/latest?cb=20181017211444",
    WEIGHT: "https://vignette.wikia.nocookie.net/2007scape/images/8/85/Weight_icon.png/revision/latest?cb=20140513183222",
};

// Default item object (sample)
Envil.Item.default =
{
    equipmentType: '',
    name: '',
    image: '',
    stabAttack: 0,
    slashAttack: 0,
    crushAttack: 0,
    magicAttack: 0,
    rangeAttack: 0,
    stabDefence: 0,
    slashDefence: 0,
    crushDefence: 0,
    magicDefence: 0,
    rangeDefence: 0,
    strength: 0,
    rangedStrength: 0,
    magicDamage: 0,
    prayer: 0,
};

Envil.Item.cached = {};
Envil.Item.data = [];
Envil.Item.header = {};
Envil.Item.result = [];

// Active equipment items (by name/id)
Envil.Item.active =
{
    'AMMO': -1,
    'BODY': -1,
    'CAPE': -1,
    'FEET': -1,
    'HAND': -1,
    'HEAD': -1,
    'LEGS': -1,
    'NECK': -1,
    'SHIELD': -1,
    'WEAPON': -1
};

// Item object to list using format
Envil.Item.object =
    '<div class="mdl-cell mdl-cell--6-col">\n' +
    '<table class="stats">' +
    '<tr><td rowspan="7"><div><img name="thumb" src="{1}" id="{30}"></div></td></tr>' +
    '<tr><td colspan="7"><h1>{0}</h1></td></tr>' +
    '<tr><td>{2}</td><td>{4}</td><td>{6}</td><td>{8}</td><td>{10}</td><td>{22}</td><td>{28}</td></tr>' +
    '<tr><td>{3}</td><td>{5}</td><td>{7}</td><td>{9}</td><td>{11}</td><td>{23}</td><td>{29}</td></tr>' +
    '<tr><td>{12}</td><td>{14}</td><td>{16}</td><td>{18}</td><td>{20}</td><td>{24}</td><td>{26}</td></tr>' +
    '<tr><td>{13}</td><td>{15}</td><td>{17}</td><td>{19}</td><td>{21}</td><td>{25}</td><td>{27}</td></tr>' +
    '<tr><td>{31}</td><td colspan="4">{32}</td><td>{33}</td><td>{34}</td></tr>' +
    '</table>'+
    '</div>';

// Result object using format
Envil.Item.resultObject =
    '<div class="mdl-cell mdl-cell--12-col">\n' +
    '<table class="stats">' +
    '<tr><td>{0}</td><td>{2}</td><td>{4}</td><td>{6}</td><td>{8}</td><td>{20}</td><td>{26}</td></tr>' +
    '<tr><td>{1}</td><td>{3}</td><td>{5}</td><td>{7}</td><td>{9}</td><td>{21}</td><td>{27}</td></tr>' +
    '<tr><td>{10}</td><td>{12}</td><td>{14}</td><td>{16}</td><td>{18}</td><td>{22}</td><td>{24}</td></tr>' +
    '<tr><td>{11}</td><td>{13}</td><td>{15}</td><td>{17}</td><td>{19}</td><td>{23}</td><td>{25}</td></tr>' +
    '<tr><td>{28}</td><td colspan="4">{29}</td><td>{30}</td><td>{31}</td></tr>' +
    '</table>'+
    '</div>';

Envil.Item.resultContainer;
Envil.Item.itemContainer;
Envil.Item.paginationContainer;

// Load function
Envil.Item.load = function()
{
    // remap the statIcons to img objects
    for (const key in Envil.Item.statIcons)
    {
        Envil.Item.statIcons[key] = '<img width="16" height="16" src="' + Envil.Item.statIcons[key] + '" class="material-icons">';
    }

    /* Set the default active item */
    Envil.Item.data.push(Envil.Item.default);

    /* Set the result sortContainer */
    Envil.Item.resultContainer = document.querySelector('div[name="result"]');
    Envil.Item.itemContainer = document.querySelector('#content');
    Envil.Item.paginationContainer = document.querySelector('#pagination');

    /* Make equipment icons clickable ¨*/
    document.querySelectorAll('div[class*="equipment"]').forEach( (elm) =>
    {
       elm.addEventListener('click', (event) =>
       {
           var slot = elm.getAttribute('name').replace('slot', '').toUpperCase();
           Envil.Item.activeSlot = slot;
           Envil.Sort.removeFilter(Envil.Item.header.equipmentType);
           Envil.Sort.createFilter(Envil.Item.header.equipmentType, Envil.Item.activeSlot, '==');
       });
    });
};

// Fetch the data, do some basic data manipulation then create object in cache
Envil.Item.fetch = function()
{
    Envil.loadData((data) => { if ( data[Envil.Item.header.equipmentType] == 'TWO_HANDED' ) { data[Envil.Item.header.equipmentType] = 'WEAPON'; } Envil.Item.create(data); } );
};

// Get an active array of items
Envil.Item.get = function()
{
    return Object.values(Envil.Item.active).map( (index) => { return Envil.Item.data[index]; } );
};

// Calc the result stats based on an active set
Envil.Item.calcFor = function(active)
{
    // Get all active items and filter out bad values
    var out = Object.values(active).map( (index) => { return Envil.Item.data.find(function(element) {
        return element[1] == index;
    });} ).filter((elm) => elm != null);

    if (out.length === 0)
    {
        // Fill the array with 0
        out = [Array(21).fill(0)];
    }

    // Count everything together and make one array and round on 2 decimal points
    return out.reduce((r, a) => r.map((b, i) => a[i] + b)).map((elm)=> Math.round(elm * 100) / 100);
};

// Calc for the current set and show the result
Envil.Item.calc = function()
{
    Envil.Item.result = Envil.Item.calcFor(Envil.Item.active);

    Envil.Item.resultContainer.innerHTML = Envil.format(Envil.Item.resultObject,
        (Envil.Item.statIcons.STAB), Envil.Item.result[Envil.Item.header.stabAttack],
        (Envil.Item.statIcons.SLASH), Envil.Item.result[Envil.Item.header.slashAttack],
        (Envil.Item.statIcons.CRUSH), Envil.Item.result[Envil.Item.header.crushAttack],
        (Envil.Item.statIcons.MAGIC), Envil.Item.result[Envil.Item.header.magicAttack],
        (Envil.Item.statIcons.RANGE), Envil.Item.result[Envil.Item.header.rangeAttack],
        (Envil.Item.statIcons.STAB_DEFENCE), Envil.Item.result[Envil.Item.header.stabDefence],
        (Envil.Item.statIcons.SLASH_DEFENCE), Envil.Item.result[Envil.Item.header.slashDefence],
        (Envil.Item.statIcons.CRUSH_DEFENCE), Envil.Item.result[Envil.Item.header.crushDefence],
        (Envil.Item.statIcons.MAGIC_DEFENCE), Envil.Item.result[Envil.Item.header.magicDefence],
        (Envil.Item.statIcons.RANGE_DEFENCE), Envil.Item.result[Envil.Item.header.rangeDefence],
        (Envil.Item.statIcons.STRENGTH), Envil.Item.result[Envil.Item.header.strength],
        (Envil.Item.statIcons.RANGED_STRENGTH), Envil.Item.result[Envil.Item.header.rangedStrength],
        (Envil.Item.statIcons.MAGIC_DAMAGE), Envil.Item.result[Envil.Item.header.magicDamage],
        (Envil.Item.statIcons.PRAYER), Envil.Item.result[Envil.Item.header.prayer],
        (Envil.Item.statIcons.COINS), Envil.Item.result[Envil.Item.header.ge],
        (Envil.Item.statIcons.WEIGHT), Envil.Item.result[Envil.Item.header.weight],
        Envil.Item.result[Envil.Item.header.speed], Envil.Item.result[Envil.Item.header.member], Envil.Item.result[Envil.Item.header.equipmentType]
    );

    //

    Envil.DPS.do();
    Envil.export();
};

// Click function
Envil.Item.click = function(event, data)
{
    // Get slot element for current equipmenttype
    var x = document.querySelector('div[name="' + data[Envil.Item.header.equipmentType].toLowerCase() + 'slot"] div img');

    // Check if the slot is set or not; unset if set else set
    if (x.getAttribute('src') !== data[Envil.Item.header.image])
    {
        x.setAttribute('src', data[Envil.Item.header.image]);
        x.parentElement.parentElement.setAttribute('active','');
        Envil.Item.active[Envil.Item.activeSlot] = data[Envil.Item.header.name];
    }
    else
    {
        x.setAttribute('src','');
        x.parentElement.parentElement.removeAttribute('active');
        Envil.Item.active[Envil.Item.activeSlot] = -1;
    }

    // Recalc stats
    Envil.Item.calc();
};

// AntiClick function (remove)
Envil.Item.antiClick = function(event, data)
{
    // Get slot element for current equipmenttype
    var x = document.querySelector('div[name="' + data[Envil.Item.header.equipmentType].toLowerCase() + 'slot"] div img');

    // Make the element empty
    x.setAttribute('src','');
    x.parentElement.parentElement.removeAttribute('active');
    Envil.Item.active[Envil.Item.activeSlot] = -1;

    // Recalc stats
    Envil.Item.calc();
};

// Set an object of active items as active
Envil.Item.setActive = function(items)
{
    for (const key in items)
    {
        const item = items[key];

        // Find the cached data by name
        var data = Object.values(Envil.Item.data).find( (obj) => { return obj[Envil.Item.header.name] == item; } );

        // Get slot item
        var x = document.querySelector('div[name="' + key.toLowerCase() + 'slot"] div img');

        if (x == undefined)
        {
            return;
        }

        // Check if the slot item exists, fil it in with the data and mark the active array
        if (data !== undefined)
        {
            x.setAttribute('src', data[Envil.Item.header.image]);
            x.parentElement.parentElement.setAttribute('active', '');
            Envil.Item.active[key] = data[Envil.Item.header.name];
        }
        else
        {
            x.setAttribute('src', '');
            x.parentElement.parentElement.removeAttribute('active');
            Envil.Item.active[key] = -1;
        }
    }

    Envil.Item.calc();
};

// Create applyData new Item object by data
Envil.Item.new = function(data)
{
    const obj = Envil.createDomElement(Envil.format(Envil.Item.object, data[Envil.Item.header.name], data[Envil.Item.header.image],
        (Envil.Item.statIcons.STAB), data[Envil.Item.header.stabAttack],
        (Envil.Item.statIcons.SLASH), data[Envil.Item.header.slashAttack],
        (Envil.Item.statIcons.CRUSH), data[Envil.Item.header.crushAttack],
        (Envil.Item.statIcons.MAGIC), data[Envil.Item.header.magicAttack],
        (Envil.Item.statIcons.RANGE), data[Envil.Item.header.rangeAttack],
        (Envil.Item.statIcons.STAB_DEFENCE), data[Envil.Item.header.stabDefence],
        (Envil.Item.statIcons.SLASH_DEFENCE), data[Envil.Item.header.slashDefence],
        (Envil.Item.statIcons.CRUSH_DEFENCE), data[Envil.Item.header.crushDefence],
        (Envil.Item.statIcons.MAGIC_DEFENCE), data[Envil.Item.header.magicDefence],
        (Envil.Item.statIcons.RANGE_DEFENCE), data[Envil.Item.header.rangeDefence],
        (Envil.Item.statIcons.STRENGTH), data[Envil.Item.header.strength],
        (Envil.Item.statIcons.RANGED_STRENGTH), data[Envil.Item.header.rangedStrength],
        (Envil.Item.statIcons.MAGIC_DAMAGE), data[Envil.Item.header.magicDamage],
        (Envil.Item.statIcons.PRAYER), data[Envil.Item.header.prayer],
        data.name,
        (Envil.Item.statIcons.COINS), data[Envil.Item.header.ge],
        (Envil.Item.statIcons.WEIGHT), data[Envil.Item.header.weight]
    ));

    // Set click event
    obj.querySelector('img[name="thumb"]').parentElement.parentElement.addEventListener('click', (event) => Envil.Item.click(event, data));

    return obj;
};

// Create cached data and elements
Envil.Item.create = function(data)
{
    var obj = Envil.Item.cached[data.name] || Envil.Item.new(data);

    Envil.Item.cached[data[Envil.Item.header.name]] = obj;
    Envil.Item.data.push(data);
};

// Clears current dom elements
Envil.Item.clearItems = function()
{
    Envil.Item.itemContainer.innerHTML = '';
};

// Render applyData given array (see Envil -> Sort)
Envil.Item.render = function(arr)
{
    // Clear & export everything
    Envil.Item.clearItems();
    Envil.export();

    // Define pagination
    Envil.Item.pageLimit = Math.ceil(arr.length / Envil.Item.perPage);
    var pag = '<li class="mdl-navigation__link" onclick="Envil.Item.previousPage()"> &lt; </li>';
    for (var i = 0; i < Envil.Item.pageLimit; i++ )
    {
        pag += '<li class="mdl-navigation__link" onclick="Envil.Item.setPage(event)"> ' + i + ' </li>';
    }

    Envil.Item.paginationContainer.innerHTML = pag + '<li class="mdl-navigation__link" onclick="Envil.Item.nextPage()"> &gt; </li>';

    // Apply pagination limits
    arr.slice(Envil.Item.page*Envil.Item.perPage, (Envil.Item.page+1)*Envil.Item.perPage).forEach((obj) => { Envil.Item.itemContainer.append(Envil.Item.cached[obj[Envil.Item.header.name]]); });
};

// Pagination basics
Envil.Item.perPage = 20;
Envil.Item.pageLimit = 0;
Envil.Item.page = 0;

Envil.Item.setPage = function(e)
{
    Envil.Item.page = (parseInt(e.target.innerHTML.trim())).clamp(0, Envil.Item.pageLimit-1);
    Envil.Sort.applyData();
};

Envil.Item.nextPage = function()
{
    Envil.Item.page = (Envil.Item.page + 1).clamp(0, Envil.Item.pageLimit-1);
    Envil.Sort.applyData();
};

Envil.Item.previousPage = function()
{
    Envil.Item.page = (Envil.Item.page - 1).clamp(0, Envil.Item.pageLimit-1);
    Envil.Sort.applyData();
};

Envil.Item.resetPage = function()
{
    Envil.Item.page = 0;
};

// Add to loading func
Envil.addLoad(Envil.Item.load);