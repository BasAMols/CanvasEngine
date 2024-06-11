import { DomText } from '../../dom/domText';
import { Color } from '../../utils/colors';
import { Level } from '../../utils/level';
import { Vector2 } from '../../utils/vector2';
import { Vector3, v3 } from '../../utils/vector3';
import { Player } from './player_actor';
import { Collider } from '../../utils/collider';
import { GLobj } from '../../gl/obj';
import { GLCuboid } from '../../gl/cuboid';
import { ObjStorage } from '../../gl/objStorage';
import { Driver } from './car_actor';
import { NPC } from './npc_actor';

export class World extends Level {
    public start = Vector2.zero;
    public background: Color = [0.67451, 0.603922, 0.968627, 1];
    public character: Player;
    public mo: DomText;
    public st: ObjStorage;
    public driving: boolean;
    car: Driver;
    player: Player;

    keyDown(e: KeyboardEvent): void {
        if (e.key === "Enter") {
            this.drive();
        }
    }

    drive(b: boolean = !this.driving) {
        this.driving = b;
        this.player.active = !this.driving;
        this.car.active = this.driving;
        if (this.driving) {
            this.player.position = v3(0, -100, 0);
        } else {
            this.player.position = this.car.position.add(v3(10, 0, 0).rotateXZ(-this.car.rotation.xz.angle())).clone();
        }
    }

    spawnTile(x: number, y: number) {
        const p = v3(
            200 * x - 2000,
            -3,
            200 * y - 100
        );
        if (Math.random() < 0.5) {
            this.addChild(new GLobj({ storage: this.mode.storage, url: 'CountrySide-3-GroundTile1.obj', size: v3(20, 20, 20), position: p }));
        } else {
            this.addChild(new GLobj({ storage: this.mode.storage, url: 'CountrySide-2-GroundTile2.obj', size: v3(20, 20, 20), position: p }));
        }

        if (![9, 10, 11].includes(x) || ![3, 4].includes(y)) {
            for (let rx = 0; rx < 5; rx++) {
                for (let ry = 0; ry < 5; ry++) {
                    if (Math.random() < 0.1) {
                        this.addChild(new GLobj({
                            storage: this.mode.storage,
                            url: ['CountrySide-6-Vegetation5.obj', 'CountrySide-0-Vegetation3.obj', 'CountrySide-6-Vegetation5.obj', 'CountrySide-8-Rock.obj'][Math.floor(Math.random() * 4)],
                            size: v3(
                                10,
                                10,
                                10,
                            ).scale(Math.ceil(Math.random() * 3)),
                            position: p.add(v3(
                                (40 * rx) + (Math.random() * 6),
                                3,
                                (40 * ry) + (Math.random() * 6) - 80
                            )),
                            rotation: v3(
                                0,
                                Math.floor(Math.random() * 4) * Math.PI,
                                0,
                            )
                        }));
                    }
                }
            }
        }
    }

    spawnRoad(x: number, y: number) {
        if (Math.random() < 0.5) {
            this.addChild(new GLobj({ storage: this.mode.storage, url: 'apoc/VoxelNuke-18-RoadTile-1.obj', size: v3(100, 100, 100), position: v3(x * 200 - 2200, -6, y * 200 - 100) }));
        } else {
            this.addChild(new GLobj({ storage: this.mode.storage, url: 'apoc/VoxelNuke-17-RoadTile-0.obj', size: v3(100, 100, 100), position: v3(x * 200 - 2000, -6, y * 200 - 100) }));
        }
        for (let i = 0; i < 6; i++) {
            if (Math.random() < 0.2) {
                this.addChild(new GLobj({ storage: this.mode.storage, url: 'apoc/VoxelNuke-0-Overgrowth-0.obj', size: v3(50, 50, 50), position: v3(x * 200 - 2000 + (i * 33), -4, y * 200 - 55) }));
            }
            if (Math.random() < 0.2) {
                this.addChild(new GLobj({ storage: this.mode.storage, url: 'apoc/VoxelNuke-0-Overgrowth-0.obj', size: v3(50, 50, 50), position: v3(x * 200 - 2000 + (i * 33), -4, (y * 200) - 145), rotation: v3(0, Math.PI, 0) }));
            }
        }
    }


    build() {
        super.build();
        
        this.addChild(new NPC({
            size: v3(6, 33, 8),
            position: v3(220, 11, 736),
            rotation: v3(0, Math.PI, 0)
        }));

        this.player = new Player({
            size: v3(6, 33, 8),
            position: v3(150, 1, 500),
            rotation: v3(0, -2.3, 0)
        });
        this.addChild(this.player);
        this.car = new Driver({
            size: v3(36, 26, 93),
            position: v3(130, 1, 600),
            rotation: v3(0, 2.3, 0)
        });
        this.addChild(this.car);
        this.car.active = false;

        this.addChild(new GLCuboid({ size: v3(3500, 1, 5000), position: v3(-5600, -2, -2000), colors: [[0.317, 0.362, 0.298, 1]] }));
        this.addChild(new GLCuboid({ size: v3(4000, 1, 5000), position: v3(1900, -2, -2000), colors: [[0.317, 0.362, 0.298, 1]] }));
        this.addChild(new GLCuboid({ size: v3(4000, 1, 1800), position: v3(-2100, -2, -2000), colors: [[0.317, 0.362, 0.298, 1]] }));
        this.addChild(new GLCuboid({ size: v3(4000, 1, 800), position: v3(-2100, -2, 2200), colors: [[0.317, 0.362, 0.298, 1]] }));

        for (let x = 0; x < 20; x++) {
            for (let y = 0; y < 12; y++) {
                if (y === 3) {
                    this.spawnRoad(x, y);
                } else {
                    this.spawnTile(x, y);
                }

            }
        }

        // this.addChild(new GLobj({ storage: this.mode.storage, url: 'apoc/VoxelNuke-23-ConcreteGroundTile.obj', size: v3(50, 50, 50), position: v3(100, -3, 550) }));
        // this.addChild(new GLobj({ storage: this.mode.storage, url: 'apoc/VoxelNuke-23-ConcreteGroundTile.obj', size: v3(50, 50, 50), position: v3(300, -3, 550) }));
        // this.addChild(new GLobj({ storage: this.mode.storage, url: 'apoc/VoxelNuke-23-ConcreteGroundTile.obj', size: v3(50, 50, 50), position: v3(100, -3, 750) }));
        // this.addChild(new GLobj({ storage: this.mode.storage, url: 'apoc/VoxelNuke-23-ConcreteGroundTile.obj', size: v3(50, 50, 50), position: v3(300, -3, 750) }));

        this.addChild(new GLobj({ storage: this.mode.storage, url: 'CountrySide-4-Vegetation1.obj', size: v3(20, 20, 20), rotation: v3(0, Math.PI, 0), position: v3(-100 - 20, 5, 670) }));
        this.addChild(new GLobj({ storage: this.mode.storage, url: 'CountrySide-4-Vegetation1.obj', size: v3(25, 25, 25), rotation: v3(0, 0, 0), position: v3(-20 - 20, 6, 760) }));
        this.addChild(new GLobj({ storage: this.mode.storage, url: 'CountrySide-4-Vegetation1.obj', size: v3(25, 25, 25), rotation: v3(0, Math.PI / 2, 0), position: v3(0 - 20, 3, 670) }));
        this.addChild(new GLobj({ storage: this.mode.storage, url: 'Plane01.obj', size: v3(30, 30, 30), position: v3(420, 16, 720), rotation: v3(0, Math.PI / 4 + Math.PI / 2, -0.12) }));
        this.addChild(new GLobj({ storage: this.mode.storage, url: 'CountrySide-5-House.obj', size: v3(18, 18, 18), position: v3(200, 43, 800), rotation: v3(0, -Math.PI / 2, 0) }));

        (([
            [v3(-5000, -1000, -2000), v3(10000, 1000, 4000), Vector3.up, false], // floor
            [v3(150, -3, 727), v3(100, 15, 168), Vector3.up, false], // floor
        ]) as ([Vector3, Vector3, Vector3, boolean?])[]).forEach(([position, size, direction, show]) => {
            this.addChild(new Collider({ position, size, direction, showMesh: show === undefined ? false : show, showArrows: false }));
        });

    }

}