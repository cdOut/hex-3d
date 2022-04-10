class Light extends THREE.Object3D {
    constructor() {
        super();

        let bGeometry = new THREE.SphereGeometry(Settings.scale * 0.05, 8, 8);
        let bMaterial = new THREE.MeshBasicMaterial({
            wireframe: true,
            color: 0xffffff
        });
        let bulb = new THREE.Mesh(bGeometry, bMaterial);
        this.add(bulb)

        let point = new THREE.PointLight(0xffefd5);
        point.distance = Settings.scale * 3;
        point.intensity = 1;
        this.name = 'light';
        this.add(point);
    }
}