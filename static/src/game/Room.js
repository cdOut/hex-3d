class Room extends THREE.Object3D {
    constructor(entrances, exit) {
        super();

        if(!entrances) entrances = [];
        let side, floor = Settings.floor.clone();
        floor.name = 'floor';
        floor.rotation.y = Math.PI / 6;
        floor.position.y = -Settings.scale * 0.375;
        this.add(floor);
        for(let i = 0; i < 6; i++) {
            let doorways = entrances.concat(parseInt(exit));
            for(let j = 0; j < doorways.length; j++)
                doorways[j] = parseInt(doorways[j]);
            if(doorways.includes(i))
                side = new Doorway();
            else    
                side = Settings.wall.clone();
            side.position.x = Settings.scale * Math.cos(i * Math.PI / 3 - Math.PI / 2);
            side.position.z = Settings.scale * Math.sin(i * Math.PI / 3 - Math.PI / 2);
            side.lookAt(this.position);
            this.add(side);
        }
    }
}