// /**
//  * 语音 SDK
//  * @abstract 语音接口，之前不支持多人同时聊天的语音，底层使用的是c++源码；后来换成支持多人同时聊天的语音，使用的是双语言，android java代码，jos oc源码。
//  * */
//
// var VoiceSDK = VoiceSDK || {
//         cbRecordVolume      : null,         // 录音音量值变化回调函数
//         cbPlayVolume        : null,         // 播放音量值变化回调函数
//         cbOtherMicUp        : null,         // 队伍中其他人上麦
//         cbOtherMicDown      : null,         // 队伍中其他人下麦
//         cbRecordException   : null,         // 实时语音异常回调，如没有权限
//         cbLogin             : null,         // 登录回调函数
//         cbMicUp             : null,         // 上麦回调函数
//
//         _isMicUp            : false,        // 是否上麦
//         _isMicDowning       : false,        // 是否正在下麦
//
//         _isLogin            : false,        // 是否已经登录过语音了
//
//         /**
//          * @abstract 登录语音房间
//          * @param {String} roomId -- 房间号
//          * @param {String} uid -- 用户唯一标识
//          * @param {String} nickName -- 昵称
//          * */
//         loginRoom : function(roomId, uid, nickName) {
//
//             // 设置上麦是否成功的回调
//             this.setMicCallback(this._musicCallback.bind(this));
//
//             // 如果已经登录过了，则不能执行登录操作
//             if (this._isLogin) {
//                 return;
//             }
//
//             this._isLogin = true;
//
//             this._isMicUp = false;
//             this._isMicDowning = false;
//
//             if (arguments.length  < 2) {
//                 cc.log("语音模块 --- loginRoom parameter is null!");
//             }
//
//             if (arguments.length  === 2) {
//                 nickName = uid;
//             }
//
//             if (cc.sys.platform === cc.sys.ANDROID) {
//                 jsb.reflection.callStaticMethod("com/nayun/utils/YYVoiceHelper", "loginRoom",
//                     "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", uid, nickName, roomId);
//             } else if (cc.sys.platform === cc.sys.IPAD || cc.sys.platform === cc.sys.IPHONE) {
//                 cc.log("==> login room AA");
//                 cc.log("roomId = " + roomId);
//                 cc.log("uid = " + uid);
//                 cc.log("nickName = " + nickName);
//                 jsb.reflection.callStaticMethod("YvVoice", "loginRoom:nickName:roomId:", uid, nickName, roomId);
//                 cc.log("finish call static Method");
//             }
//         },
//
//         /**
//          * @abstract 登出语音房间
//          * */
//         logout : function () {
//             // 如果没有登录过，不能执行登出操作
//             if (!this._isLogin) {
//                 return;
//             }
//
//             this._isLogin = false;
//
//             if (cc.sys.platform === cc.sys.ANDROID) {
//                 jsb.reflection.callStaticMethod("com/nayun/utils/YYVoiceHelper", "logout", "()V");
//             } else if (cc.sys.platform === cc.sys.IPAD || cc.sys.platform === cc.sys.IPHONE) {
//                 jsb.reflection.callStaticMethod("YvVoice", "logout");
//             }
//         },
//
//         /**
//          * @abstract 上麦。  多人聊天中，上麦表示已调用麦克风，可以开始录音了。
//          * @param {Number} timeLimit -- 上麦时间限制（秒），如无时间限制，可不填。
//          * */
//         micUp : function (timeLimit) {
//             if (this._isMicDowning) {
//                 // 如果上了麦或者正在下麦都不能上麦
//                 return;
//             }
//
//             if (cc.sys.platform === cc.sys.ANDROID) {
//                 if (arguments.length === 0) {
//                     jsb.reflection.callStaticMethod("com/nayun/utils/YYVoiceHelper", "micUp", "()V");
//                 } else {
//                     jsb.reflection.callStaticMethod("com/nayun/utils/YYVoiceHelper", "micUpWithLimit", "(I)V", timeLimit);
//                 }
//             } else if (cc.sys.platform === cc.sys.IPAD || cc.sys.platform === cc.sys.IPHONE) {
//                 if (arguments.length === 0) {
//                     jsb.reflection.callStaticMethod("YvVoice", "micUp");
//                 } else {
//                     jsb.reflection.callStaticMethod("YvVoice", "micUpWithLimit:", timeLimit);
//                 }
//             }
//         },
//
//         /**
//          * @abstract 下麦。  多人聊天中，下麦表示不再调用麦克风，不能录音了。
//          * @param noDelay       是否不延时处理
//          * */
//         micDown : function (noDelay) {
//             if (noDelay) {
//                 if (cc.sys.platform === cc.sys.ANDROID) {
//                     jsb.reflection.callStaticMethod("com/nayun/utils/YYVoiceHelper", "micDown", "()V");
//                 } else if (cc.sys.platform === cc.sys.IPAD || cc.sys.platform === cc.sys.IPHONE){
//                     jsb.reflection.callStaticMethod("YvVoice", "micDown");
//                 }
//             } else {
//                 this._isMicDowning = true;
//                 setTimeout(function () {
//                     // if (this._isMicUp) {
//                     if (cc.sys.platform === cc.sys.ANDROID) {
//                         jsb.reflection.callStaticMethod("com/nayun/utils/YYVoiceHelper", "micDown", "()V");
//                     } else if (cc.sys.platform === cc.sys.IPAD || cc.sys.platform === cc.sys.IPHONE){
//                         jsb.reflection.callStaticMethod("YvVoice", "micDown");
//                     }
//                     //     this._isMicUp = false;
//                     // }
//                     this._isMicDowning = false;
//                 }.bind(this), 1000);
//             }
//
//         },
//
//         /**
//          * @abstract 设置实时语音录音分贝值回调函数
//          * @param {function} func -- 回调函数。两个函数，1 平均值； 2 峰值
//          * */
//         setVolumeRecordCallback : function (func) {
//             if (func) {
//                 VoiceSDK.cbRecordVolume = func;
//             }
//         },
//
//         /**
//          * @abstract 设置实时语音播放分贝值回调函数
//          * @param {function} func -- 回调函数。两个函数，1 平均值； 2 峰值
//          * */
//         setVolumePlayCallback : function (func) {
//             if (func) {
//                 VoiceSDK.cbPlayVolume = func;
//             }
//         },
//
//         /**
//          * @abstract 游戏中其他人上麦
//          * @param {function} func -- 回调函数。一个字符串参数，uid
//          * */
//         setOtherMicUpCallback : function (func) {
//             if (func) {
//                 VoiceSDK.cbOtherMicUp = func;
//             }
//         },
//
//         /**
//          * @abstract 游戏中其他人下麦
//          * @param {function} func -- 回调函数。一个字符串参数，uid
//          * */
//         setOtherMicDownCallback : function (func) {
//             if (func) {
//                 VoiceSDK.cbOtherMicDown = func;
//             }
//         },
//
//         /**
//          * @abstract 录音异常时的回调接口，比如
//          * @param {function} func -- 回调函数，接收两个参数，1 整数错误标志；2 错误信息
//          * */
//         setRecordExceptionCallback : function (func) {
//             if (func) {
//                 VoiceSDK.cbRecordException = func;
//             }
//         },
//
//         /**
//          * @abstract 登录回调函数
//          * @param {function} func -- 回调函数，接收两个参数，1 返回值（0成功，其他失败）；2 错误信息
//          * */
//         setLoginCallback : function (func) {
//             if (func) {
//                 VoiceSDK.cbLogin = func;
//             }
//         },
//
//         /**
//          * @abstract 设置上麦回调函数
//          * @param {function} func -- 回调函数，接收两个参数，1 返回值（0成功，其他失败）；2 错误信息
//          * */
//         setMicCallback : function (func) {
//             if (func) {
//                 VoiceSDK.cbLogin = func;
//             }
//         },
//
//         _musicCallback : function (value) {
//             this._isMicUp = value == 0;
//         }
//     };
//
// /**
//  * @abstract 供本地云娃sdk调用的接口
//  * @param {Number} type -- 0 录音音量变化回调
//  *                          1 播放语音音量变化
//  *                          2 其他回家上麦
//  *                          3 其他玩家下麦
//  *                          4 录音异常
//  *                          5 登录
//  *                          6 上麦
//  * @param param1 -- 返回参数，因回调函数的不同而不同
//  * @param param2 -- 返回参数，因回调函数的不同而不同
//  * */
// YvVoiceCallBack = function (type, param1, param2) {
//     cc.log("java 回调 js 方法： type - " + type + "; param1 - " + param1 + "; param2 - " + param2);
//
//     type = parseInt(type);
//     switch (type) {
//         case 0:
//             if (VoiceSDK.cbRecordVolume) {
//                 VoiceSDK.cbRecordVolume(param1, param2);
//             } else {
//                 cc.log("录音音量回调函数为空 -----------------------------");
//             }
//             break;
//         case 1:
//             if (VoiceSDK.cbPlayVolume) {
//                 VoiceSDK.cbPlayVolume(param1, param2);
//             } else {
//                 cc.log("播放音量回调函数为空 -----------------------------");
//             }
//             break;
//         case 2:
//             if (VoiceSDK.cbOtherMicUp) {
//                 VoiceSDK.cbOtherMicUp(param1);
//             } else {
//                 cc.log("其他玩家上麦回调函数为空 -----------------------------");
//             }
//             break;
//         case 3:
//             if (VoiceSDK.cbOtherMicDown) {
//                 VoiceSDK.cbOtherMicDown(param1);
//             } else {
//                 cc.log("其他玩家下麦回调函数为空 -----------------------------");
//             }
//             break;
//         case 4:
//             if (VoiceSDK.cbLogin) {
//                 VoiceSDK.cbLogin(param1, param2);
//             } else {
//                 cc.log("其他玩家下麦回调函数为空 -----------------------------");
//             }
//             break;
//         case 5:
//             if (VoiceSDK.cbMicUp) {
//                 VoiceSDK.cbMicUp(param1, param2);
//             } else {
//                 cc.log("其他玩家下麦回调函数为空 -----------------------------");
//             }
//             break;
//         default: break;
//     }
// };
//
//
