import path from 'node:path';
import { readFile } from 'node:fs/promises';

import { deepMerge } from './utils';

export const ORPHANED_CONSTANT = 1;

interface person { name: string, age: number }

function greet( name: string ){
if(name){
console.error( "Hello, " + name + "!" ) }
return 'hi' }

export const exported = greet('world');
export default exported
