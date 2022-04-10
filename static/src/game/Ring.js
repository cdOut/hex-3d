class Ring extends THREE.Object3D {
    constructor() {
        super();

        let geometry = new THREE.TorusGeometry(Settings.scale * 0.2, 3, 2, 8);
        let material = new THREE.MeshBasicMaterial({ color: 0x00A817 });
        let ringMaterial = new THREE.Mesh(geometry, material);
        ringMaterial.rotation.x = Math.PI / 2
        ringMaterial.name = 'ring';
        this.add(ringMaterial);
        this.visible = false;
        this.angle = 0;
    }
    resetAngle() {
        this.angle = 0;
    }
    updateAngle() {
        this.rotation.y = this.angle * Math.PI / 180;
        this.angle += 1;
    }
}