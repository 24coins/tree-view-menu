'use babel';

import fs from 'fs';
import notify from './notify';

export default {
    push(list, item) {
        [].push.call(list, item);
    },
    isDirectory(pathName) {
        return new Promise((resolve, reject) => {
            fs.lstat(pathName, (err, stat) => {
                if (err) {
                    notify.error('Error getting path type', err);
                    return resolve(false);
                }
                resolve(stat.isDirectory());
            });
        });
    },
    camelShift(str, small2Big) {
        if (!str) {
            return str;
        }
        const firstLetter = str[0];
        const restLetters = str.slice(1);
        if (small2Big) {
            return firstLetter.toUpperCase() + restLetters;
        }
        return firstLetter.toLowerCase() + restLetters;
    },
    getBtnNameFromSmallCamel(str) {
        if (!str) {
            return '';
        }
        const bigCamel = this.camelShift(str, true);
        const words = [];
        let word = '';
        for (const letter of bigCamel) {
            if (/[a-z]/.test(letter)) {
                word += letter;
            } else {
                words.push(word);
                word = letter;
            }
        }
        words.push(word);
        return words.join(' ');
    },
};
