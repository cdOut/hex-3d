class Model extends THREE.Object3D {
    constructor() {
        super();
        this.mixer = null;
        this.directionVector = new THREE.Vector3(0, 0, 0);
        this.isMoving = false;
        this.following = false;
    }
    loadModel(name, url, material, callback) {
        this.modelName = name;
        let loader = new THREE.JSONLoader();
        let that = this;
        loader.load(url, function(geometry) {
            let meshModel = new THREE.Mesh(geometry, material);
            meshModel.name = name;
            meshModel.rotation.y = -Math.PI / 2;
            meshModel.scale.set(Settings.scale * 0.01, Settings.scale * 0.01, Settings.scale * 0.012);
            that.mixer = new THREE.AnimationMixer(meshModel);
            that.mixer.clipAction('stand').play();
            that.add(meshModel);
            callback(that);
        });
    }
    updateModel(delta) {
        if(this.mixer)
            this.mixer.update(delta);
    }
    setAnimation(name) {
        if(this.mixer) {
            this.mixer.uncacheRoot(this.getObjectByName(this.modelName));
            this.mixer.clipAction(name).play();
        }
    }
    addRing() {
        this.hasRing = true;
        let selectRing = new Ring();
        this.add(selectRing);
    }
    addLights(isPlayer) {
        let point = new THREE.PointLight(0x39ff14, 2);
        point.distance = Settings.scale * 0.5;
        this.add(point);

        if(isPlayer) {
            let geometry = new THREE.BoxGeometry(100, 100, 100);
            let material = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
            let pointer = new THREE.Mesh(geometry, material);
            pointer.position.y = -50;
            pointer.name = 'pointer';
            this.add(pointer);

            let spot = new THREE.SpotLight(0x00a86b, 1);
            spot.name = 'spot';
            spot.angle = Math.PI / 4;
            spot.distance = Settings.scale;
            spot.target = pointer;
            this.add(spot);

            this.angle = 0;
        }
    }
    updateRing() {
        this.getObjectByName('ring', true).parent.updateAngle();
    }
    updateLights() {
        if(!this.angle) this.angle = 0;
        this.getObjectByName('pointer').position.x = Settings.scale * 0.5 * Math.sin(this.angle * Math.PI / 180);
        this.getObjectByName('pointer').position.z = Settings.scale * 0.5 * Math.cos(this.angle * Math.PI / 180);
        this.angle += 2;
    }
    calculateMovement(target) {
        this.directionVector = target.position.clone().sub(this.position).normalize();
        this.directionVector.y = 0;

        let angle = Math.atan2(
            this.position.clone().x - target.position.x,
            this.position.clone().z - target.position.z);
        this.getObjectByName(this.modelName, true).rotation.y = angle - Math.PI / 2;
    }
}