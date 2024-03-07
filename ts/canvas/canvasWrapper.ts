import { ElementRelativity } from '../utils/elementPosition';
import { CanvasElement, CanvasElementAttributes, CanvasElementType } from './canvasElement';

export type CanvasWrapperAttributes = CanvasElementAttributes & {
}
export abstract class CanvasWrapper extends CanvasElement {
    public type: CanvasElementType = 'wrapper';
    public relativity: ElementRelativity =  'anchor';
}

