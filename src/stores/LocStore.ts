import {makeAutoObservable, } from "mobx";

interface LocationProps {
	x:number,
    y:number,
    z:number,
}

export default class Loc implements LocationProps {

    x: number;
    y: number;
    z: number;

	constructor(loc:LocationProps) {
		makeAutoObservable(this);
		this.x = loc.x;
        this.y = loc.y;
        this.z = loc.z;
	}
    
    

	

	
}