///////////////////////////////////////////////////////////////////////////////
/// 单选按钮组

/**
 * 单选按钮组
 * @param name          名字
 * @param radios        按钮数组
 * @param def           默认按钮索引
 * @param callback      选择回调
 * @param normalColor   普通回调
 * @param selColor      选择颜色
 * @constructor
 */
game.ui.RadioGroup = function(name, radios, def, callback, normalColor, selColor) {

    this.normalColor = normalColor;
    this.selectedColor = selColor;

    this._label = null;
    this.sel = null;
    this.name = name;
    this.onSelectChangedCallback = callback;
    def = def || 0;
    this.selIndex = def;

    var selectedStateEvent = function (sender, type) {
        switch (type) {
            case  ccui.CheckBox.EVENT_UNSELECTED:
                break;
            case ccui.CheckBox.EVENT_SELECTED:
                sender.setEnabled(false);
                for (var index = 0; index < radios.length; ++index) {
                    var radio = radios[index];
                    if (radio.ctrl != sender) {
                        radio.label && radio.label.setTextColor(this.normalColor);
                        radio.ctrl.setSelected(false);
                        radio.ctrl.setEnabled(true);
                    } else {
                        this.selIndex = index;
                        radio.label && radio.label.setTextColor(this.selectedColor);
                    }
                }
                this.sel = sender.owner;
                this.onSelectChangedCallback
                && this.onSelectChangedCallback(this.sel);
                break;
            default:
                break;
        }
    }.bind(this);

    radios.forEach(function(radio){
        radio.ctrl.owner = radio;
        radio.ctrl.addEventListener(selectedStateEvent, this);
        radio.ctrl.setSelected(false);
        radio.ctrl.setEnabled(true);
    }.bind(this));

    // 选中默认
    this.sel = radios[def];
    this.sel.ctrl.setSelected(true);
    this.sel.ctrl.setEnabled(false);

    for (var index = 0; index < radios.length; ++index) {
        var radio = radios[index];
        if (radio.ctrl != this.sel.ctrl) {
            radio.label && radio.label.setTextColor(this.normalColor);
        } else {
            radio.label && radio.label.setTextColor(this.selectedColor);
        }
    }

    /**
     * 设置选中的单选按钮
     */
    this.setSelected = function (index) {
        radios.forEach(function(radio){
            radio.label && radio.label.setTextColor(this.normalColor);
            radio.ctrl.owner = radio;
            radio.ctrl.setSelected(false);
            radio.ctrl.setEnabled(true);
        }.bind(this));

        // 选中默认
        this.sel = radios[index];
        this.sel.ctrl.setSelected(true);
        this.sel.ctrl.setEnabled(false);
        this.sel.label && this.sel.label.setTextColor(this.selectedColor);
    };

    /**
     * 获取选中的按钮
     * @returns {null|*}
     */
    this.getSelected = function(){ return this.sel; };

    /**
     * 获取选中的选项索引
     * @returns {*|number}
     */
    this.getSelectedIndex = function(){ return this.selIndex; };

    /**
     * 设置选择变化回调
     * @param callback
     */
    this.onSelectChanged = function(callback) {
        this.onSelectChangedCallback = callback;
    };
};