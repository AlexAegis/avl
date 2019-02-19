import { Basic } from './basic.class';
import { Convertable } from '../..';
export class BasicConvertable extends Basic implements Convertable {
	convertTo(): number {
		return this.n;
	}
}
