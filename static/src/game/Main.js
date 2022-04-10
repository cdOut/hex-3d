$(document).ready(function() {

    //============================================
    // Basic objects required for 3D

    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(75, $('#hex-root').width() / $('#hex-root').height(), 0.1, 10000);
    let renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor(0x050505);
    renderer.setSize($("#hex-root").width(), $("#hex-root").height());
    camera.position.set(0, Settings.scale * 1.2, Settings.scale);
    camera.updateProjectionMatrix();
    camera.lookAt(scene.position);
    $("#hex-root").append(renderer.domElement);

    //============================================
    // Window resize handling

    $(window).on('resize', this, function(e) {
        camera.aspect = $("#hex-root").width() / $("#hex-root").height();
        renderer.setSize($("#hex-root").width(), $("#hex-root").height());
        camera.updateProjectionMatrix();
    });

    //============================================
    // Loading level data and generating a level

    $.ajax({
        url: "/load-selected",
        type: "POST",
        success: function (data) {
            let level = new Level(data);
            scene.add(level);
            handleLights(scene);
            player.position.copy(scene.getObjectByName('room', true).position);
        },
    });

    //============================================
    // Player movement and raycaster

    let raycaster = new THREE.Raycaster();
    let mouseVector = new THREE.Vector2();
    let clickedVector = new THREE.Vector3(0, 0, 0);
    let directionVector = new THREE.Vector3(0, 0, 0);

    let followers = [];
    let allyOver = undefined;
    let isMouseDown = false;
    $(document).on('mousedown', function(e) { 
        isMouseDown = true; 
        mouseVector.x = (e.clientX / $(window).width()) * 2 - 1;
        mouseVector.y = -(e.clientY / $(window).height()) * 2 + 1;

        raycaster.setFromCamera(mouseVector, camera);
        let clicked, intersects = raycaster.intersectObjects(scene.children, true);
        if(clicked = intersects.find(obj => { return obj.object.name == 'ally'; })) {
            if(!clicked.object.parent.following) {
                clicked.object.parent.following = true;
                followers.push(clicked.object.parent);
                isMouseDown = false;
            }
        }
    });
    $(document).on('mouseup', function() { isMouseDown = false; });
    $(document).on('mousemove', function(e) {
        mouseVector.x = (e.clientX / $(window).width()) * 2 - 1;
        mouseVector.y = -(e.clientY / $(window).height()) * 2 + 1;

        if(allyOver)
            allyOver.getObjectByName('ring').parent.visible = false;
        allyOver = undefined;
        raycaster.setFromCamera(mouseVector, camera);
        let over, intersects = raycaster.intersectObjects(scene.children, true);
        if(over = intersects.find(obj => { return obj.object.name == 'ally'; })) {
            if(!over.object.parent.following) {
                allyOver = over.object.parent;
                allyOver.getObjectByName('ring').parent.visible = true;
            }
        }
    }); 

    //============================================
    // Player related stuff

    let isRunning = false;
    let player = new Model();
    player.loadModel('model', 'res/wraith.js', Settings.wraithMaterial, function(modelData) {
        modelData.position.y = Settings.scale * 0.4;
        scene.add(modelData);
    });
    player.addLights(true);

    //============================================
    // Render function

    let clock = new THREE.Clock();

    render();
    function render() {
        requestAnimationFrame(render.bind(this));

        let delta = clock.getDelta();
        player.updateModel(delta);

        for(let i = 0; i < followers.length; i++) {
            followers[i].updateModel(delta);
        }

        if(allyOver)
            allyOver.updateRing();

        if(isMouseDown) {

            if(!isRunning) {
                isRunning = true;
                player.setAnimation('run');
            }

            followers.forEach(ally => {
                if(!ally.isMoving) {
                    ally.isMoving = true;
                    ally.setAnimation('run');
                }
            });

            raycaster.setFromCamera(mouseVector, camera);
            let intersects = raycaster.intersectObjects(scene.children, true);
            if(intersects[0] = intersects.find(obj => { return obj.object.name == 'floor'; })) {
                clickedVector = intersects[0].point;
                directionVector = clickedVector.clone().sub(player.position).normalize();
                directionVector.y = 0;

                let angle = Math.atan2(
                    player.position.clone().x - clickedVector.x,
                    player.position.clone().z - clickedVector.z);
                player.getObjectByName('model').rotation.y = angle - Math.PI / 2;
            }
        }

        if(Math.abs(player.position.clone().distanceTo(clickedVector)) > 35) {
            player.translateOnAxis(directionVector, 2);
        } else if(isRunning) {
            isRunning = false;
            player.setAnimation('stand');

            followers.forEach(ally => {
                if(ally.isMoving && ally.following) {
                    ally.isMoving = false;
                    ally.setAnimation('stand');
                }
            });
        }

        for(let i = 0; i < followers.length; i++) {
            let target = (i == 0 ? player : followers[i - 1]);
            followers[i].calculateMovement(target);
            if(followers[i].isMoving && Math.abs(followers[i].position.clone().distanceTo(target.position)) > 60)
                followers[i].translateOnAxis(followers[i].directionVector, 1.9);
        }

        player.updateLights(delta);

        camera.position.x = player.position.x;
        camera.position.y = player.position.y + Settings.scale * 1.2;
        camera.position.z = player.position.z + Settings.scale;

        renderer.render(scene, camera);
    }
});