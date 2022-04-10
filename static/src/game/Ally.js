class Ally extends THREE.Object3D {
    constructor() {
        super();

        this.directionVector = new THREE.Vector3(0, 0, 0);
        this.following = false;

        let mesh = new THREE.Mesh(
            new THREE.SphereGeometry(50, 8, 8),
            new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true})
        );
        mesh.name = 'ally';
        this.add(mesh);

        let axes = new THREE.AxesHelper(200);
        this.add(axes);
    }
    calculateMovement(player) {
        this.directionVector = player.position.clone().sub(this.position).normalize();
        this.directionVector.y = 0;

        let angle = Math.atan2(
            this.position.clone().x - player.position.x,
            this.position.clone().z - player.position.z);
        this.children[1].rotation.y = angle + Math.PI;
    }
}