import { CanvasAnimation } from '../../../elements/canvas/canvasAnimation';
import { GlMesh } from '../../../elements/gl/glMesh';
import { Character } from '../../../utils/character';
import { ElementRelativity } from '../../../utils/elementPosition';
import { TickerReturnData } from '../../../utils/ticker';
import { glController } from './SideController';
import { Vector3 } from '../../../utils/vector3';

export class SideCharacter extends Character {
    public relativity: ElementRelativity = 'anchor';
    public animations: Record<string, CanvasAnimation> = {};
    public direction: number = 1;
    public phase: 'idle' | 'walk' = 'idle';
    public mesh: GlMesh

    constructor({
        position3 = Vector3.f(0),
        size3 = Vector3.f(0)
    }: {
        position3?: Vector3;
        size3?: Vector3;
    } = {}) {
        super({
            position3,
            size3,
            anchorPoint: size3.multiply(0.5,0,0.5), 
        });
        this.addControllers([new glController()])
    }

    build() {
        this.registerControllers(this)
        this.addChild(this.mesh = new GlMesh({ size3: this.size3, colors: [[1,0.3,0.3, 1], [0.3,1,0.3, 1], [0.4,0.4,1, 1], [1,1,0.3, 1], [0.2,1,1, 1], [1,0.2,1, 1]] }));
    }
    public tick(o: TickerReturnData) {
        super.tick(o);
        this.camera.target = this.position3.clone().add(this.size3.multiply(0.5,0.5,0.5)).multiply(1,-1,1);
    }
}