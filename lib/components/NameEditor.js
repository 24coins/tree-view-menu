'use babel'

import BasePanel from './BasePanel'
import BaseButton from './BaseButton'
import EventMixin from '../mixins/event'

export default Object.assign({}, EventMixin, BasePanel, {
    init() {
        this.createElement()
        this.createPanel({ extClassName: 'rename' })
        this.addCloseButton()
        this.addSections()
        return this
    },
    addSections() {
        const inputWrapper = document.createElement('section')
        this.addInput(inputWrapper)
        this.element.append(inputWrapper)
        this.addFooter()
    },
    addInput(node) {
        const input = document.createElement('input')
        input.type = 'text'
        node.append(input)
        input.className = 'native-key-bindings input'
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.onConfirm()
            }
        })
        this.input = input
    },

    show() {
        this.panel.show()
        this.input.focus()
    },
    onConfirm() {
        this.emit('confirm', {
            value: this.input.value,
            type: this.type,
        })
    },
    update(cfg) {
        if (cfg.position) {
            this.updatePosition(cfg.position)
        }
        if (cfg.entryName != null) {
            this.updateValue(cfg.entryName)
        }
        if (cfg.type) {
            this.type = cfg.type
        }
    },
    updateValue(value) {
        this.value = value
        this.input.value = value
        let dotPos = this.value.lastIndexOf('.')
        if (dotPos === -1) {
            dotPos = this.value.length
        }
        this.input.setSelectionRange(0, dotPos)
    },
    updateType(type) {
        this.type = type
    },
    reset() {
        this.input.value = this.value
    },
})
