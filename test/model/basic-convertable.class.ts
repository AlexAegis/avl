import { Basic } from './basic.class';
import { Convertable } from '../../src/interface/convertable.interface';
export class BasicConvertable extends Basic implements Convertable {
	convertTo(): number {
		return this.n;
	}
}
