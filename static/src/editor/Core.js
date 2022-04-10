$(document).ready(function() {

    getLevels($('#map-list'));
    for(let i = selMin; i <= selMax; i++) {
        let option = $('<option>');
        option.attr('value', i);
        option.text(i);
        $('#map-size').append(option);
    }

    drawLevel(level, $('#hex-editor'));
    $('#hex-preview').text(JSON.stringify(level, null, 4));
    $('#map-size').on('change', function() {
        level = createLevel(parseInt($(this).val()));
        $('#hex-editor').height($(this).val() * 105 + 45);
        $('#hex-preview').text(JSON.stringify(level, null, 4));
        drawLevel(level, $('#hex-editor'));
    });

    $('#view-game').on('click', function() { gotoGame(); });
    $('#view-hex').on('click', function() { document.location.href = '/hex' });
    $('#view-player').on('click', function() { document.location.href = '/player' });
    $('#view-ally').on('click', function() { document.location.href = '/ally' });
    $('#view-allies').on('click', function() { document.location.href = '/allies' });
    $('#view-allymodel').on('click', function() { document.location.href = '/allymodel' });

    $('#type-wall').on('click', function() { $('.selected').removeClass('selected'); type = 'wall'; $(this).addClass('selected'); });
    $('#type-enemy').on('click', function() { $('.selected').removeClass('selected'); type = 'enemy'; $(this).addClass('selected'); });
    $('#type-treasure').on('click', function() { $('.selected').removeClass('selected'); type = 'treasure'; $(this).addClass('selected'); });
    $('#type-light').on('click', function() { $('.selected').removeClass('selected'); type = 'light'; $(this).addClass('selected'); });

    $('#save-btn').on('click', saveLevel);
    $('#load-btn').on('click', loadLevel);

});

const selMin = 4, selMax = 10;
let level = createLevel(selMin);
let type = 'wall';

function getLevels(select) {
    $.ajax({
        url: "/get-levels",
        type: "POST",
        success: function (data) {
            $(select).empty();
            data.forEach(name => {
                let option = $('<option>');
                option.attr('value', name);
                option.text(name);
                $(select).append(option);
            });
        },
    });
}

function saveLevel() {
    if(!$('#map-name').val()) {
        alert('You cannot leave the map name field empty.');
    } else {
        level.name = $('#map-name').val();
        $('#hex-preview').text(JSON.stringify(level, null, 4));
        $.ajax({
            url: "/save-level",
            data: level,
            type: "POST",
            success: function (data) {
                getLevels($('#map-list'));
                alert('Map was successfully saved on the server.');
            },
        });
    }
}

function loadLevel() {
    $.ajax({
        url: "/load-level",
        data: { name: $('#map-list').val() },
        type: "POST",
        success: function (data) {
            level = data;
            level._id = undefined;
            $('#map-name').val(level.name);
            $('#map-size').val(level.size);
            level.size = parseInt(level.size);
            if(!level.hexes) level.hexes = [];
            drawLevel(level, $('#hex-editor'));
            $('#hex-preview').text(JSON.stringify(level, null, 4));
            alert('Map was successfully loaded from the server.');
        },
    });
}

function createLevel(size) {
    $('#hex-preview').empty();
    let level = {};
    level.name = 'untitled';
    level.size = size;
    level.hexes = [];
    return level;
}

function drawLevel(level, container) {
    $('#hex-editor').empty();
    for(let x = 0; x < level.size; x++) {
        for(let z = 0; z < level.size; z++) {
            let current, div = $('<div>');
            div.css({'left': x * 90, 'top': z * 105 + (!(x % 2) ? 0 : 52)});
            if(current = level.hexes.find(hex => { return hex.x == x && hex.z == z; })) {
                current.exit = parseInt(current.exit); current.id = parseInt(current.id);
                current.x = parseInt(current.x); current.z = parseInt(current.z);
                div.css('transform', 'rotate(' + (current.exit * 60) + 'deg)');
                div.text(current.exit);
                div.addClass('arrow');
            }
            div.on('click', function() {
                if(!level.hexes.find(hex => { return hex.x == x && hex.z == z; })) {
                    level.hexes.push(new Hex(level.hexes.length, x, z, type, [], -1));
                    div.addClass('arrow');
                }
                let clicked = level.hexes.find(hex => { return hex.x == x && hex.z == z; });
                if(clicked.type != type) clicked.type = type;
                else clicked.exit += (clicked.exit >= 5 ? -5 : 1);

                div.text(clicked.exit);
                div.css('transform', 'rotate(' + (clicked.exit * 60) + 'deg)');
                $('#hex-preview').text(JSON.stringify(level, null, 4));
            });
            $(container).append(div);
        }
    }
}

function gotoGame() {
    calculateEntrances();
    $.ajax({
        url: "/save-selected",
        data: level,
        type: "POST",
        success: function (data) {
            document.location.href = '/game';
        },
    });
}

function calculateEntrances() {
    level.hexes.forEach(hex => {
        let target, tX, tZ;
        tX = ([0,3].includes(hex.exit) ? 0 : ([1,2].includes(hex.exit) ? 1 : -1));
        if(hex.x % 2 == 0)
            tZ = ([0,1,5].includes(hex.exit) ? -1 : ([2,4].includes(hex.exit) ? 0 : 1));
        else
            tZ = (hex.exit == 0 ? -1 : ([1,5].includes(hex.exit) ? 0 : 1));
        console.log(hex.exit + ' - ' + tX + ' - ' + tZ);
        if(target = level.hexes.find(tHex => { return tHex.x == hex.x + tX && tHex.z == hex.z + tZ; })) {
            if(!target.entrances) target.entrances = [];
            target.entrances.push((hex.exit + 3) % 6);
        }
    });
    console.log(level.hexes);
}