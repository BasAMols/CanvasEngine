import { Renderer } from '../dom/renderer';
import { DomText } from '../dom/domText';
import { GlElement } from '../gl/elementBase';
import { Game } from '../game';

export type inputEvents = 'mouseMove' | 'keyDown' | 'keyUp' | 'click' | 'scroll';
export type inputEventsData = {
    'mouseMove': MouseEvent,
    'keyDown': KeyboardEvent,
    'keyUp': KeyboardEvent,
    'click': MouseEvent,
    'scroll': WheelEvent,
};
export class Input {
    private canvas: Renderer;
    private game: Game;
    private _locked: boolean;
    private overlay: DomText;
    public get locked(): boolean {
        return this._locked;
    }
    public set locked(value: boolean) {
        this._locked = value;
        this.overlay.dom.style.display = !value? 'block': 'none';
    }
    public constructor(game: Game) {
        this.game = game;
        this.canvas = game.renderer;
        this.canvas.dom.addEventListener('mousemove', this.mouseMove.bind(this));
        this.canvas.dom.addEventListener('keydown', this.keyDown.bind(this));
        this.canvas.dom.addEventListener('keyup', this.keyUp.bind(this));
        this.canvas.dom.addEventListener('click', this.mouseClick.bind(this));
        this.canvas.dom.addEventListener('wheel', this.scroll.bind(this));
        this.overlay = new DomText({
            text: 'Pauzed',
        });
        this.overlay.dom.setAttribute('style', `
            transform-origin: left bottom;
            pointer-events: none;
            bottom: 0px;
            left: 0px;
            user-select: none;
            z-index: 999;
            position: absolute;
            height: 100vh;
            width: 100vw;
            color: white !important;
            font-family: monospace;
            font-weight: bold;
            font-size: 40px;
            padding-left: 50px;
            padding-top: 20px;
            box-sizing: border-box;
            text-transform: uppercase;`
        );
        document.body.appendChild(this.overlay.dom);

        document.addEventListener('pointerlockchange', () => {
            this.locked = (document.pointerLockElement === this.canvas.dom);
        });

    }

    public mouseClick(e: MouseEvent) {
        if (this.locked) {
            this.send('click', e);
        } else {
            this.canvas.dom.requestPointerLock();
        }
    }
    public mouseMove(e: MouseEvent) {
        if (this.locked) {
            this.send('mouseMove', e);
        }

    }

    public scroll(e: WheelEvent) {
        if (this.locked) {
            this.send('scroll', e);
        }

    }

    public keyDown(e: KeyboardEvent) {
        if (this.locked) {
            this.send('keyDown', e);
        }
    }

    public keyUp(e: KeyboardEvent) {
        if (this.locked) {
            this.send('keyUp', e);
        }
    }

    private send(event: inputEvents, e: KeyboardEvent | MouseEvent) {
        this.recursive(event, this.game.mode, e);
    }

    private recursive(event: inputEvents, element: GlElement, e: KeyboardEvent | MouseEvent | WheelEvent) {
        if (element.active) {
            if (element[event]) {
                if (event === 'mouseMove' || event === 'click') {
                    element[event](e as MouseEvent);
                } else if (event === 'scroll') {
                    element[event](e as WheelEvent);
                } else {
                    element[event](e as KeyboardEvent);
                }
            }
            element.controllers.forEach((child) => this.recursive(event, child, e));
            element.children.forEach((child) => this.recursive(event, child, e));
        } 
    }
}