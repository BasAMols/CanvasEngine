import { buffers } from './glr';
import { Vector3 } from '../utils/vector3';
import { GlElement, GlElementAttributes } from './elementBase';
import { GLTexture } from './texture';

export type GLRendableAttributes = GlElementAttributes & {
    opacity?: number
};

export abstract class GLRendable extends GlElement {
    public buffer: buffers;
    public opacity: number = 1;
    public colors: [number, number, number, number][] = [];
    public abstract verticesCount: number;
    public abstract texture: GLTexture;

    constructor(attr: GLRendableAttributes = {}) {
        super(attr);
        this.opacity = attr.opacity !== undefined? attr.opacity:1
    }

    public build() {
        this.buffer = {
            positionBuffer: this.positionBuffer(this.size),
            indices: this.indexBuffer(),
            textureCoord: this.textureBuffer(this.size),
            normalBuffer: this.normalBuffer(),
        };
        this.GLR.initGlElement(this);
        // this.texture = new GLTexture(this.game, { url: 'cubetexture.png' });
    };

    public ready() {
        this.build();
        if (this.game.waitCount) {
            this.game.waitCount--;
        }
    }

    protected abstract indexBuffer(): WebGLBuffer;
    protected abstract positionBuffer(size: Vector3): WebGLBuffer;
    protected abstract textureBuffer(size: Vector3): WebGLBuffer;
    protected abstract normalBuffer(): WebGLBuffer;

    getIndexBuffer(indices: number[]) {
        const indexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        this.gl.bufferData(
            this.gl.ELEMENT_ARRAY_BUFFER,
            new Uint32Array(indices),
            this.gl.STATIC_DRAW,
        );
        return indexBuffer;
    }

    getPositionBuffer(positions: number[]) {
        const positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);
        return positionBuffer;
    }

    getTextureBuffer(coordinates: number[]) {
        const textureCoordBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, textureCoordBuffer);
        this.gl.bufferData(
            this.gl.ARRAY_BUFFER,
            new Float32Array(coordinates),
            this.gl.STATIC_DRAW,
        );
        return textureCoordBuffer;
    }

    getNormalBuffer(coordinates: number[]) {

        const normalBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalBuffer);

        this.gl.bufferData(
            this.gl.ARRAY_BUFFER,
            new Float32Array(coordinates),
            this.gl.STATIC_DRAW,
        );
        
        return normalBuffer;
    }


}


