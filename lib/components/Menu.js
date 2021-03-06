'use babel'
/* globals atom */
import _ from '../util/util'
import EventMixin from '../mixins/event'
import BasePanel from './BasePanel'
import MenuButton from './MenuButton'
import constant from '../constant'
import { name as packageName } from '../../package.json'

export default Object.assign({}, BasePanel, EventMixin, {
    name: 'Menu',
    buttons: {},
    init(args) {
        this.createElement()
        this.addCloseButton()
        this.setBtnStubs()
        this.createPanel({ extClassName: 'menu' })
        this.initTips()
        this.buttonWidth = args.buttonWidth
        this.listenBlur()
        return this
    },
    setBtnStubs() {
        constant.buttons.forEach(btn => {
            const stub = document.createElement('span')
            stub.id = 'btn-stub-' + btn.value
            this.element.append(stub)
        })
    },
    initTips() {
        this.tips = document.createElement('p')
        this.tips.textContent = 'Please add buttons from setting panel.'
    },
    addButton(btnId, opt = {}) {
        if (this.buttons[btnId]) {
            return
        }
        if (this.buttons.default) {
            this.removeDefaultBtn()
        }
        const defaultCb = e => {
            this.emit(btnId, {
                position: this.position,
            })
        }
        this.buttons[btnId] = Object.create(MenuButton).init({
            id: btnId,
            name: opt.name || _.getBtnNameFromSmallCamel(btnId),
            className: `${packageName}-btn menu`,
            parentNode: this.element.querySelector('#btn-stub-' + btnId),
            onClick: opt.cb || defaultCb,
            width: this.buttonWidth,
        })
    },
    removeButton(btnId) {
        if (this.buttons[btnId]) {
            this.buttons[btnId].eject()
            this.buttons[btnId] = false
        }
        if (btnId !== 'default') {
            this.checkButtonEmpty()
        }
    },
    updateBtnName(id, name) {
        const button = this.buttons[id]
        if (button) {
            button.updateName(name)
        }
    },
    removeDefaultBtn() {
        this.removeButton('default')
        this.element.removeChild(this.tips)
    },
    haveButtons() {
        return Object.getOwnPropertyNames(this.buttons).length
    },
    addTipsAndDefaultBtn() {
        this.element.append(this.tips)
        this.addButton('default', {
            name: 'Add Button',
            cb: () => {
                atom.workspace.open(`atom://config/packages/${packageName}`)
                this.hide()
            },
        })
    },
    checkButtonEmpty() {
        if (!this.haveButtons()) {
            this.addTipsAndDefaultBtn()
        }
    },
    show(position) {
        this.panel.show()
        this.updatePosition(position)
        this.resizeWrapper()
    },
    updateButtonsWidth(width) {
        this.buttonWidth = width
        Object.keys(this.buttons).forEach(btnId => {
            const btn = this.buttons[btnId]
            if (btn) {
                btn.updateWidth(width)
            }
        })
    },
})
