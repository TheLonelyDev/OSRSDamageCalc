Envil.Sort = {};

// Sort types
Envil.Sort.sortTypes =
{
    stabAttack: 'Stab attack',
    slashAttack: 'Slash attack',
    crushAttack: 'Crush attack',
    magicAttack: 'Magic attack',
    rangeAttack: 'Range attack',
    stabDefence: 'Stab defence',
    slashDefence: 'Slash defence',
    crushDefence: 'Crush defence',
    magicDefence: 'Magic defence',
    rangeDefence: 'Range defence',
    strength: 'Strength',
    rangedStrength: 'Ranged strength',
    magicDamage: 'Magic damage',
    prayer: 'Prayer',
    ge: 'Price',
    weight: 'Weight',
    speed: 'Speed'
};

// Filter types
Envil.Sort.filterTypes =
{
    stabAttack: 'Stab attack',
    slashAttack: 'Slash attack',
    crushAttack: 'Crush attack',
    magicAttack: 'Magic attack',
    rangeAttack: 'Range attack',
    stabDefence: 'Stab defence',
    slashDefence: 'Slash defence',
    crushDefence: 'Crush defence',
    magicDefence: 'Magic defence',
    rangeDefence: 'Range defence',
    strength: 'Strength',
    rangedStrength: 'Ranged strength',
    magicDamage: 'Magic damage',
    prayer: 'Prayer',
    name: 'Name',
    equipmentType: 'Equipment type',
    ge: 'Price',
    weight: 'Weight',
    member: 'Member',
    speed: 'Speed'
};

// Sort object using format
Envil.Sort.sortObject =
    '<li draggable="true" type="{0}">\n' +
    '<span class="mdl-chip mdl-chip--deletable">\n' +
    '<span class="mdl-chip__text">{1}</span>\n' +
    '<button type="button" class="mdl-chip__action"><i class="material-icons">cancel</i></button>\n' +
    '</span>\n' +
    '</li>';

// Filter object using format
Envil.Sort.filterObject =
    '<li draggable="true" key="{0}" value="{1}" type="{2}">\n' +
    '<span class="mdl-chip mdl-chip--contact">\n' +
    '<span class="mdl-chip__contact mdl-color--teal mdl-color-text--white">{2}</span>\n' +
    '<span class="mdl-chip__text">{3} {1}</span>\n' +
    '<button type="button" class="mdl-chip__action"><i class="material-icons">cancel</i></button>\n' +
    '</span>\n' +
    '</li>';

Envil.Sort.sortContainer;
Envil.Sort.sortTypesContainer;

Envil.Sort.filterContainer;
Envil.Sort.filterTypesContainer;
Envil.Sort.filterOperatorContainer;
Envil.Sort.filterValueContainer;

Envil.Sort.load = function()
{
    // Set all containers
    Envil.Sort.sortContainer = document.querySelector('#SortContainer');
    Envil.Sort.sortTypesContainer = document.querySelector('#sortTypes');

    Envil.Sort.filterContainer = document.querySelector('#FilterContainer');
    Envil.Sort.filterTypesContainer = document.querySelector('#filterKey');
    Envil.Sort.filterOperatorContainer = document.querySelector('#filterTypes');
    Envil.Sort.filterValueContainer = document.querySelector('#filterValue');

    // Create dropdown from types
    Object.keys(Envil.Sort.sortTypes).forEach( (key) =>
    {
        var obj = document.createElement('option');
        obj.text = Envil.Sort.sortTypes[key];
        obj.setAttribute('type', key);
        Envil.Sort.sortTypesContainer.append(obj);
    });

    // Create dropdown from types
    Object.keys(Envil.Sort.filterTypes).forEach( (key) =>
    {
        var obj = document.createElement('option');
        obj.text = Envil.Sort.filterTypes[key];
        obj.setAttribute('type', key);
        Envil.Sort.filterTypesContainer.append(obj);
    });

    // Add addsort event listener based on input
    document.querySelector("#addSort").addEventListener('click', (event) =>
    {
        Envil.Sort.createSort(Envil.Sort.sortTypesContainer.options[Envil.Sort.sortTypesContainer.selectedIndex].getAttribute('type'),false);
    });

    // Add addfilter event listener based on input
    document.querySelector("#addFilter").addEventListener('click', (event) =>
    {
        Envil.Sort.createFilter(
            Envil.Sort.filterTypesContainer.options[Envil.Sort.filterTypesContainer.selectedIndex].getAttribute('type'),
            Envil.Sort.filterValueContainer.value,
            Envil.Sort.filterOperatorContainer.options[Envil.Sort.filterOperatorContainer.selectedIndex].getAttribute('type')
        );
    });

    // Create default sort & filter params
    Envil.Sort.createSort(Envil.Item.header.stabAttack, true);
    Envil.Sort.createFilter(Envil.Item.header.equipmentType, "AMMO",'==', true);
};

// Default active set
Envil.Sort.default = function()
{
    Envil.Sort.applyData();

    Envil.Item.setActive(
        {
            'AMMO': -1,
            'BODY': 'Elite void top',
            'CAPE': 'Fire cape',
            'FEET': -1,
            'HAND': 'Void knight gloves',
            'HEAD': 'Void melee helm',
            'LEGS': 'Elite void robe',
            'NECK': 'Amulet of torture',
            'SHIELD': -1,
            'WEAPON': 'Dragon scimitar'
        }
    );
};

// Import data
Envil.Sort.import = function(data)
{
    // Clear everything
    Envil.Sort.clearSort();
    Envil.Sort.clearFilter();

    // Create sort and filters
    data[0].forEach((elm) => Envil.Sort.createSort(elm,true));
    data[1].forEach((elm) => Envil.Sort.createFilter(elm.key, elm.value, elm.type, true));

    Envil.Sort.applyData();
};

// Get sorting parameters from li items
Envil.Sort.getSortParameters = function()
{
    var parameters = [];

    Envil.Sort.sortContainer.querySelectorAll('li[type]').forEach((elm) => {
        parameters.push(elm.getAttribute('type'));
    });

    return parameters;
};

// Get filter parameters from li items
Envil.Sort.getFilterParameters = function()
{
    var parameters = [];
    Envil.Sort.filterContainer.querySelectorAll('li').forEach((elm) => {
        parameters.push(
            {
                key: elm.getAttribute('key'),
                value: elm.getAttribute('value'),
                type: elm.getAttribute('type')
            });
    });

    return parameters;
};

// Remove applyData sort
Envil.Sort.remove = function(event)
{
    event.srcElement.parentElement.parentElement.remove();

    Envil.Sort.applyData();
};


// Drag functionality based on https://codereview.stackexchange.com/questions/127271/javascript-drag-and-drop-sortable-list and https://codepen.io/askfinney/pen/qKXgap
Envil.Sort.drag = null;

Envil.Sort.dragOver = function(e)
{
    if (e.srcElement.getAttribute('type') == undefined || e.srcElement.parentNode != Envil.Sort.drag.parentNode)
    {
        return;
    }

    if (Envil.Sort.isBefore(Envil.Sort.drag, e.target))
    {
        e.target.parentNode.insertBefore(Envil.Sort.drag, e.target);
    }
    else
    {
        e.target.parentNode.insertBefore(Envil.Sort.drag, e.target.nextSibling);
    }
};

Envil.Sort.dragEnd = function(e)
{
    Envil.Sort.drag = null;
    Envil.Sort.applyData();
};

Envil.Sort.dragStart = function(e)
{
    if (e.srcElement.getAttribute('type') == undefined)
    {
        return;
    }

    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", null);
    Envil.Sort.drag = e.target;
};

Envil.Sort.isBefore = function(el1, el2)
{
    if (el2.parentNode === el1.parentNode)
    {
        for (var cur = el1.previousSibling; cur; cur = cur.previousSibling)
        {
            if (cur === el2)
            {
                return true;
            }
        }
    }

    return false;
};


// Clear all sorting li
Envil.Sort.clearSort = function()
{
    Envil.Sort.sortContainer.innerHTML = '';
    Envil.Sort.applyData();
};

// Clear all filter li
Envil.Sort.clearFilter = function()
{
    Envil.Sort.filterContainer.innerHTML = '';
    Envil.Sort.applyData();
};

// Create applyData sort object based on data
Envil.Sort.createSort = function(sortType, skip)
{
    if (Envil.Sort.sortTypes[sortType] === undefined)
    {
        console.log('cant createSort');
        return;
    }

    const obj = Envil.createDomElement(Envil.format(Envil.Sort.sortObject,
        sortType, Envil.Sort.sortTypes[sortType]
    ));

    obj.querySelector('button').addEventListener('click', Envil.Sort.remove);

    obj.addEventListener('dragend', Envil.Sort.dragEnd);
    obj.addEventListener('dragover', Envil.Sort.dragOver);
    obj.addEventListener('dragstart', Envil.Sort.dragStart);

    Envil.Sort.sortContainer.append(obj);

    if (!skip)
    {
        Envil.Item.resetPage();
        Envil.Sort.applyData();
    }

    return obj;
};

// Remove applyData filter
Envil.Sort.removeFilter = function(key)
{
    Envil.Sort.filterContainer.querySelectorAll('li').forEach((elm) => {
        if (key == elm.getAttribute('key'))
        {
            elm.remove();
        }
    });
};

// Create filter object
Envil.Sort.createFilter = function(key, value, type, skip)
{
    if (Envil.Sort.filterTypes[key] === undefined || value == '')
    {
        console.log('cant createFilter');
        return;
    }

    const obj = Envil.createDomElement(Envil.format(Envil.Sort.filterObject,
        key, value, type, Envil.Sort.filterTypes[key]
    ));

    obj.querySelector('button').addEventListener('click', Envil.Sort.remove);

    obj.addEventListener('dragend', Envil.Sort.dragEnd);
    obj.addEventListener('dragover', Envil.Sort.dragOver);
    obj.addEventListener('dragstart', Envil.Sort.dragStart);

    Envil.Sort.filterContainer.append(obj);

    if (!skip)
    {
        Envil.Item.resetPage();
        Envil.Sort.applyData();
    }

    return obj;
};

// Apply sorting & filtering
Envil.Sort.applyData = function()
{
    var data = Object.values(Envil.Item.data);

    Envil.Sort.getFilterParameters().forEach((filter) =>
    {
        data = data.filter( (val) => eval("'" + val[filter.key] + "'" + filter.type + "'" + filter.value + "'") );
    });

    Envil.Item.render(data
        .sort(
            Envil.Sort.sort.apply(this, Envil.Sort.getSortParameters())
        ).reverse());

    if (!Envil.edit)
    {
        Envil.DPS.do();
    }
};

// Multi array/object sorting using https://www.growingwiththeweb.com/2014/07/order-a-js-array-by-multiple-properties.html
Envil.Sort.sort = function(prop)
{
    var args = Array.prototype.slice.call(arguments, 1);
    return function (a, b) {
        var equality = a[prop] - b[prop];
        if (equality == 0 && arguments.length > 1)
        {
            return Envil.Sort.sort.apply(null, args)(a, b);
        }
        return equality;
    };
};

// Filter function based on eval and https://www.growingwiththeweb.com/2014/07/order-a-js-array-by-multiple-properties.html
Envil.Sort.filter = function(prop)
{
    var args = Array.prototype.slice.call(arguments, 1);
    return function (a) {
        if (prop === undefined)
        {
            return true;
        }
        var equality = eval("'" + a[prop.key] + "'" + prop.type + "'" + prop.value + "'");
        if (equality === true && args.length > 1)
        {
            return Envil.Sort.filter.apply(null, args)(a);
        }
        return equality;
    };
};