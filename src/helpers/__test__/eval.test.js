import test from 'ava';
import {conditional} from '../eval';

test('should eval as true for strings that are true', t => {
	t.truthy(conditional('2 + 2 === 4', {}));
});

test('should eval as false for strings that are false', t => {
	t.falsy(conditional('2 + 2 === 5', {}));
});

test('should eval as true for variables that are true', t => {
	const data = {bunny: true};
	const result = conditional('this.bunny', data);
	t.truthy(result);
});

test('should eval as false for variables that are false', t => {
	const data = {bunny: false};
	t.falsy(conditional('this.bunny', data));
});

test('should eval as true for variables with comparisons that are true', t => {
	const data = {bunny: 'fluffy', puppy: 'fluffy'};
	t.truthy(conditional('this.bunny === this.puppy', data));
});

test('should eval as false for variables with comparisons that are false', t => {
	const data = {bunny: 'fluffy', puppy: 'cute'};
	t.falsy(conditional('this.bunny === this.puppy', data));
});
