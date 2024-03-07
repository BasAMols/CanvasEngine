import { CanvasWrapper } from '../../../canvas/canvasWrapper';
import { CanvasController } from '../../../utils/controller';
import { TickerReturnData } from '../../../utils/ticker';
import { Util } from '../../../utils/utils';
import { Vector2 } from '../../../utils/vector2';

export class CameraController extends CanvasController {
    private target: CanvasWrapper;
    constructor({ target }: {
        target: CanvasWrapper;
    }) {
        super();
        this.target = target;
    }

    public tick(obj: TickerReturnData) {
        super.tick(obj);

        const mid = this.target.position
            .add(this.target.size.subtract(this.mode.size).scale(0.5))
            .scale(-1)
            
        const rel = this.mode.size.subtract(this.level.size);

        this.parent.position = new Vector2(
            rel.x < 0 ? Util.clamp(mid.x, rel.x, 0): rel.x/2,
            rel.y < 0 ? Util.clamp(mid.y, rel.y, 0): rel.y/2
        )

    }
}