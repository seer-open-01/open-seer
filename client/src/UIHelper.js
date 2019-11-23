// ==== UI帮助程序 ==================================================
game.UIHelper = {

    /**
     * 根据名字查找子节点
     * @param node
     * @param name
     * @returns {*}
     */
    findChildByName : function(node, name) {
        //if (node.getName() == name) {
        //    return node;
        //}
        if(node == null)
            cc.log("==> 查找子节点错误，节点名称：" + name);

        var children = node.getChildren();

        // 查找子节点
        for (var key in children) {
            if (!children.hasOwnProperty(key)) {
                continue;
            }

            var child = children[key];
            if (child.getName() == name) {
                return child;
            }
        }

        // 查找后辈节点
        for (key in children) {
            if (!children.hasOwnProperty(key)) {
                continue;
            }

            var target = arguments.callee(children[key], name);
            if (target) {
                return target;
            }
        }

        return null;
    },

    /**
     * 获取该节点的世界坐标
     * @param node          需要获取世界坐标的节点
     * @returns {null}
     * @author Jiyou Mo
     */
    getWorldPosition : function(node) {
        var pos = node.getPosition();
        var parent = node.getParent();
        while (parent) {
            if(parent.getName() == "") {
                break;
            }

            pos.x *= parent.getScaleX();
            pos.y *= parent.getScaleY();

            var ax = parent.getAnchorPoint().x;
            var ay = parent.getAnchorPoint().y;
            pos.x += parent.getPosition().x - parent.getContentSize().width * ax;
            pos.y += parent.getPosition().y - parent.getContentSize().height * ay;
            parent = parent.getParent();
        }
        return pos;
    }
};
// SHORT NAMES
game.findUI = game.UIHelper.findChildByName;