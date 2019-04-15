var EquipmentTypes =
    {
        AMMO: "Ammunition",
        BODY: "Body",
        CAPE: "Cape",
        FEET: "Feet",
        HAND: "Hand",
        HEAD: "Head",
        LEGS: "Legs",
        NECK: "Neck",
        RING: "Ring",
        SHIELD: "Shield",
        TWO_HANDED: "Two-handed",
        WEAPON: "Weapon"
    };

String.prototype.hashCode = function() {
    var hash = 0, i, chr, len;
    if (this.length === 0) return hash;
    for (i = 0, len = this.length; i < len; i++) {
        chr   = this.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

class Equipment
{
    constructor( equipmentType, name, image, member, speed, weight, ge, data)
    {
        this.equipmentType = equipmentType;
        this.name = name;
        this.image = image;
        this.member = member;
        this.speed = speed;

        this.weight = weight;
        this.ge = ge;

        var i = 0;
        this.stabAttack = data[i++];
        this.slashAttack = data[i++];
        this.crushAttack = data[i++];
        this.magicAttack = data[i++];
        this.rangeAttack = data[i++];
        this.stabDefence = data[i++];
        this.slashDefence = data[i++];
        this.crushDefence = data[i++];
        this.magicDefence = data[i++];
        this.rangeDefence = data[i++];
        this.strength = data[i++];
        this.rangedStrength = data[i++];
        this.magicDamage = data[i++];
        this.prayer  = data[i++];
    }

    isEmpty()
    {
        return this.stabAttack == 0 &&
            this.slashAttack == 0 &&
            this.crushAttack == 0 &&
            this.magicAttack == 0 &&
            this.rangeAttack == 0 &&
            this.stabDefence == 0 &&
            this.slashDefence == 0 &&
            this.crushDefence == 0 &&
            this.magicDefence == 0 &&
            this.rangeDefence == 0 &&
            this.strength == 0 &&
            this.rangedStrength == 0 &&
            this.magicDamage == 0 &&
            this.prayer == 0;
    }
}

var equipments = [];



String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

function sleepFor( sleepDuration ){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ }
}

document.querySelectorAll('div[class="mw-category-group"] ul li applyData').forEach((elm) => {
   var slot = elm.innerHTML.trim().replace(' slot table', '');
   var url = 'https://oldschool.runescape.wiki' + elm.getAttribute('href');

   for (const key in EquipmentTypes)
   {
       if (slot.toUpperCase() === EquipmentTypes[key].toUpperCase())
       {
           slot = key;
       }
   }
console.log(url);
   getPage(url,slot);
});


var i = 0;
var cmds = [];

function getPage(url,slot)
{
    fetch(url).then( (response) => response.text()).then( (text) => {
        const parser = new DOMParser();
        const htmlDocument = parser.parseFromString(text, "text/html");

        table(htmlDocument,slot);

        //console.clear();
       // console.log(JSON.stringify(equipments));
    });
}

function next()
{
    if (i < cmds.length)
    {
        cmds[i++]();
    }
    else
    {
        console.log('ended');
        console.log(JSON.stringify(equipments));
    }
}

function table(doc,slot)
{
    doc.querySelector('table[class="wikitable sortable"]').querySelectorAll('tbody > tr').forEach( (elm) =>
    {
        cmds.push( () =>
        {
            const d = elm.querySelectorAll('td');

            if (d === undefined || d.length === 0)
            {
                next();
                return;
            }

            const name = d[0].querySelector('applyData').innerHTML;
            const member =  d[1].innerHTML.trim() == '<i>Unknown</i>' ? false : d[1].querySelector('applyData').getAttribute('title') == 'Members';

            var data = [];
            for (var i = 0; i < 14; i++)
            {
                data.push(parseInt(d[i+2].innerHTML.trim()));
            }


            const url = d[0].querySelector('applyData').href;
            fetch(url).then( (response) => response.text()).then( (text) => {
                const parser = new DOMParser();
                const htmlDocument = parser.parseFromString(text, "text/html");
                const img = htmlDocument.documentElement.querySelector("td[class='infobox-image inventory-image'] applyData:last-child img");// htmlDocument.documentElement.querySelector('div[class="floatleft"] img') || htmlDocument.documentElement.querySelector("div[class='pi-data-value pi-font'] center applyData:last-child img");
                var speed;
                var ge = 0;
                var weight = 0;
                try {
                    speed = parseInt(htmlDocument.documentElement.querySelector('span[class="speed-bar"] img').getAttribute('alt').replace('.png', '').replace('Monster attack speed ', ''));
                } catch (e) {
                }
                try {
                    ge = htmlDocument.documentElement.querySelector('span[class="infobox-quantity-replace"]').innerHTML.replaceAll(',', '');
                } catch (e) {
                }

                try {
                    weight = htmlDocument.documentElement.querySelector('applyData[title="Weight"]').parentElement.parentElement.querySelector('td').innerHTML.replace('&nbsp;kg', '');//.match(weightPattern)[0];

                    if (weight.includes("Equipped")) {
                        weight = parseFloat(weight.substring(weight.lastIndexOf(":") + 1).replace('</b>', ''));
                    }
                } catch (e) {
                    next();
                    return;
                }

                if (img == undefined) {
                    //console.log("couldn't find img for", name);

                    next();
                    return;
                }

                var eq = new Equipment(slot, name, 'https://oldschool.runescape.wiki' + img.getAttribute("src"), member, speed, weight, ge, data);

                if (!eq.isEmpty()) {
                    equipments.push(eq);
                    console.log('added', name);
                } else {
                    //console.log(name, "is empty");
                }

                next();
            });
        });
    });
}



