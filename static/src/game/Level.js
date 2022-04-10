class Level extends THREE.Object3D {
    constructor(scheme) {
        super();
        this.name = 'level';
        this.allies = [];
        if(scheme.hexes) {
            scheme.hexes.forEach(hex => {
                let room = new Room(hex.entrances, hex.exit);
                let size = new THREE.Box3().setFromObject(room);
                room.name = 'room';
                room.position.x = hex.x * ((Math.abs(size.min.x) + size.max.x ) * 0.75);
                room.position.z = hex.z * (Math.abs(size.min.z) + size.max.z) + (hex.x % 2 == 0 ? 0 : size.max.z);
                room.position.y = Math.abs(size.min.y);
                this.add(room);
    
                switch(hex.type) {
                    case 'light':
                        let light = new Light();
                        light.position.x = room.position.x;
                        light.position.z = room.position.z;
                        light.position.y = Math.abs(size.min.y) * 2.5;
                        this.add(light);
                        break;
                    case 'treasure':
                        let crate = Settings.crate.clone();
                        crate.position.copy(room.position);
                        crate.position.y = Math.abs(size.min.y) * 0.6;
                        this.add(crate);
                        break;
                    case 'enemy':
                        let that = this;
                        let ally = new Model();
                        ally.loadModel('ally', 'res/skeleton.js', Settings.skeletonMaterial, function(modelData) {
                            modelData.position.copy(room.position);
                            modelData.position.y = Settings.scale * 0.35;
                            modelData.getObjectByName('ally').rotation.y = Math.PI / 1.5;
                            modelData.mixer.timeScale = 0.7;
                            modelData.addRing();
                            modelData.addLights();
                            that.allies.push(modelData);
                            that.add(modelData);
                        });
                        break;
                }
            });
        }
    }
}