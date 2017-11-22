'use babel'
/* global atom */
import fs from 'fs'
import path from 'path'
import notify from './notify'
import isGitRepo from 'is-git-repository'
import { spawn } from 'child_process'
import { EOL } from 'os'

function isDirectory(pathname) {
    return new Promise((resolve, reject) => {
        fs.lstat(pathname, (err, stat) => {
            if (err) {
                notify.error('Error getting path type', err)
                return resolve(false)
            }
            resolve(stat.isDirectory())
        })
    })
}

function isDirectorySync(pathname) {
    return fs.lstatSync(pathname).isDirectory()
}

export default {
    isDirectory,
    isDirectorySync,
    push(list, item) {
        [].push.call(list, item)
    },
    doInDirectory(pathname, cb) {
        fs.lstat(pathname, (err, stat) => {
            if (err) {
                return console.error(err)
            }
            cb()
        })
    },

    camelShift(str, small2Big) {
        if (!str) {
            return str
        }
        const firstLetter = str[0]
        const restLetters = str.slice(1)
        if (small2Big) {
            return firstLetter.toUpperCase() + restLetters
        }
        return firstLetter.toLowerCase() + restLetters
    },
    getBtnNameFromSmallCamel(str) {
        if (!str) {
            return ''
        }
        const bigCamel = this.camelShift(str, true)
        const words = []
        let word = ''
        for (const letter of bigCamel) {
            if (/[a-z]/.test(letter)) {
                word += letter
            } else {
                words.push(word)
                word = letter
            }
        }
        words.push(word)
        return words.join(' ')
    },
    closeEntryPane(path) {
        atom.workspace.getTextEditors()
            .forEach(pane => {
                if (path === pane.getPath()) {
                    pane.destroy()
                }
            })
    },
    getNewPath4Create(oldPath, newName) {
        if (this.isDirectorySync(oldPath)) {
            return path.join(oldPath, newName)
        }
        return this.getNewPath4Rename(oldPath, newName)
    },
    getNewPath4Rename(oldPath, newName) {
        const dirname = path.dirname(oldPath)
        return path.join(dirname, newName)
    },
    getClosestDir(pathname) {
        if (this.isDirectorySync(pathname)) {
            return pathname
        }
        return path.dirname(pathname)
    },
    isGitRepo(pathname) {
        return isGitRepo(pathname)
    },
    doNothing() {
        console.info('nothing but a log')
    },
    exec(cmd, args = [], cwd = process.cwd()) {
        const childProcess = spawn(cmd, args, { cwd })
        return new Promise(resolve => {
            try {
                childProcess.stdout.on('data', data => {
                    resolve(String(data))
                })
                childProcess.stderr.on('data', data => {
                    console.error(String(data))
                    resolve(null)
                })
            } catch (e) {
                console.error('error on checking repo root', e)
                resolve(null)
            }
        })
    },
    appendLine(line, filePath) {
        return new Promise((resolve, reject) => {
            fs.appendFile(filePath, line + EOL, 'utf8', err => {
                if (err) {
                    return reject(err)
                }
                resolve()
            })
        })
    },
    getSiblingPaths(pathname) {
        try {
            return new Promise((resolve, reject) => {
                const parent = path.dirname(pathname)
                fs.readdir(parent, (error, files) => {
                    if (error) {
                        resolve([])
                    }
                    resolve(
                        files
                            .map(file => {
                                return path.resolve(parent, file)
                            })
                            .filter(filePath => {
                                return filePath !== pathname && isDirectorySync(filePath)
                            })
                    )
                })
            })
        } catch (e) {
            return Promise.resolve([])
        }
    },
}
