import { Game } from '../game';
import { ElementAttributes } from "../utils/element";
import { Event } from '../utils/event';
import { Mode } from '../utils/mode';
import { TickerReturnData } from '../utils/ticker';
import { Vector2, v2 } from "../utils/vector2";
import { DomElement } from './domElement';

export type DomElementAttributes = ElementAttributes & {
    id?: string,
    size?: Vector2,
    background?: string,
    position?: Vector2;
};
export class Renderer extends DomElement<'canvas'> {
    public tickerData: TickerReturnData;

    constructor(public game: Game) {
        super('canvas');
        this.dom.style.position = 'absolute';
        this.dom.style.pointerEvents = 'all';
        this.dom.style.bottom = '0px';
        this.dom.tabIndex = 1;

        window.addEventListener("resize", () => { 
            this.resize(); 
        });

        this.addEvent(new Event('resize'));
        this.resize();
    }

    resize() {
        this.size = v2(document.body.clientWidth, document.body.clientHeight);
        this.dom.style.width = `${this.size.x}px`;
        this.dom.setAttribute('width', String(this.size.x));

        this.dom.style.height = `${this.size.y}px`;
        this.dom.setAttribute('height', String(this.size.y));

        this.getEvent('resize').alert(this.size);

    }

    public get width() {
        return Math.round(Number(this.dom.style.width.replace(/\D/g, '')));
    }
    public set width(value: number) {
        this.dom.style.width = `${value}px`;
        this.dom.setAttribute('width', String(value));
    }

    public get height() {
        return Math.round(Number(this.dom.style.height.replace(/\D/g, '')));
    }
    public set height(value: number) {
        this.dom.style.height = `${value}px`;
        this.dom.setAttribute('height', String(value));
    }

    public addMode(child: Mode) {
        child.game ??= this.game;
        child.build();
    }

    private _context: '2d' | '3d';
    public get context(): '2d' | '3d' {
        return this._context;
    }
    public set context(value: '2d' | '3d') {
        this._context = value;
    }

    public tick(obj: TickerReturnData) {
        super.tick(obj);
        this.tickerData = obj;
        this.game.GLR.draw();
        this.game.mode.tick(obj);
    }
}


