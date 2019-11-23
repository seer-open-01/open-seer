// 系统信息
GameWindowBasic.GameSystemInfo = GameControllerBasic.extend({

    _timer              : null,         // 时间间隔控制ID

    _systemTime         : null,         // 当前系统的时间
    _battery            : null,         // 当前电池的电量

    ctor : function () {
        this._node = ccs.load("res/Games/Com/System/GameSystem.json").node;
        this._node.retain();
        this._init();
        return true;
    },

    _init : function () {
        this._timer = null;
        this._systemTime = game.findUI(this._node, "ND_SystemTime");
        this._battery = game.findUI(this._node, "ND_Battery");
    },

    reset : function () {
        this.closeUpdate();
        this.show(false);
    },

    /**
     * 更新系统信息
     */
    updateSystem : function () {
        this._systemTime.setString(new Date().format("hh:mm"));
        var batteryLevel = Math.floor(Platform.getBatteryLevel() * 100);
        this._battery.setPercent(batteryLevel);
        this._battery.setColor(batteryLevel < 20 ? cc.color(255, 0, 0) : cc.color(255, 255, 255));
    },

    /**
     * 开启自动更新系统信息  每10秒更新一次
     */
    openUpdate : function () {
        if (!this._timer) {
            this._timer = setInterval(this.updateSystem.bind(this), 10000);
            this.updateSystem();
        }
    },

    /**
     * 关闭自动更新系统信息
     */
    closeUpdate : function () {
        if (this._timer) {
            clearInterval(this._timer);
            this._timer = null;
        }
    }
});

GameWindowBasic.GameSystemInfo._instance = null;

/**
 * 获取更新系统信息对象
 * @return {null|GameWindowBasic.GameSystemInfo|*}
 */
GameWindowBasic.GameSystemInfo.getController = function () {
    if (this._instance == null) {
        this._instance = new GameWindowBasic.GameSystemInfo();
    }
    this._instance.reset();
    return this._instance;
};