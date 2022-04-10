function handleLights(scene) {
    let lHeight = $('<input>');
    lHeight.attr('type', 'range');
    lHeight.css({ 'position': 'absolute', 'left': 0 });
    lHeight.on('input', function() {
        scene.children[0].children.forEach(child => {
            if(child.name == 'light')
                child.position.y = Settings.scale * lHeight.val() / 30;
        });
    });
    $('#hex-root').append(lHeight);

    let lIntensity = $('<input>');
    lIntensity.attr('type', 'range');
    lIntensity.css({ 'position': 'absolute', 'left': 0, 'top': 40 });
    lIntensity.on('input', function() {
        scene.children[0].children.forEach(child => {
            if(child.name == 'light') {
                child.children.forEach(grandchild => {
                    if(grandchild.type == 'PointLight')
                        grandchild.intensity = lIntensity.val() / 20;
                });
            }
        });
    });
    $('#hex-root').append(lIntensity);
}