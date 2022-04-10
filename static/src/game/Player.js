class Player extends THREE.Object3D {
    constructor() {
        super();

        let geometry = new THREE.BoxGeometry(100, 100, 100);
        let material = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true });
        this.playerMesh = new THREE.Mesh(geometry, material);
        this.add(this.playerMesh);

        let axes = new THREE.AxesHelper(200);
        this.playerMesh.add(axes);
    }

    getPlayerMesh() {
        return this.playerMesh;
    }
};