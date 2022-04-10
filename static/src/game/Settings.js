const Settings = {
    scale: 100,

    get wallGeometry() { return new THREE.BoxGeometry(this.scale * 1.21, this.scale * 0.65, 0.1 * this.scale); },
    get doorsideGeometry() { return new THREE.BoxGeometry(this.scale * 0.35, this.scale * 0.65, 0.1 * this.scale); },
    get floorGeometry() { return new THREE.CylinderGeometry(this.scale * 1.2125, this.scale * 1.2125, this.scale * 0.1, 6); },
    get crateGeometry() { return new THREE.BoxGeometry(this.scale * 0.3, this.scale * 0.3, this.scale * 0.3); },

    get wallMaterial() { return new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load('res/stone-brick.png') })},
    get floorMaterial() { return new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load('res/wooden-floor.png') })},
    get crateMaterial() { return new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load('res/wooden-crate.png') })},

    get wraithMaterial() { return new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load('/res/wraith-texture.png'), morphTargets: true })},
    get skeletonMaterial() { return new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load('/res/skeleton-texture.png'), morphTargets: true })},

    get wall() { return new THREE.Mesh(this.wallGeometry, this.wallMaterial); },
    get doorside() { return new THREE.Mesh(this.doorsideGeometry, this.wallMaterial); },
    get floor() { return new THREE.Mesh(this.floorGeometry, this.floorMaterial); },
    get crate() { return new THREE.Mesh(this.crateGeometry, this.crateMaterial); }
}