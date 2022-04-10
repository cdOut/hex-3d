class Doorway extends THREE.Object3D {
    constructor() {
        super();

        let left = Settings.doorside.clone();
        let right = Settings.doorside.clone();
        left.position.x = -(Settings.scale * 0.43);
        right.position.x = Settings.scale * 0.43;
        this.add(left);
        this.add(right);
    }
}