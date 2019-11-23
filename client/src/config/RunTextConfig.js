/**
 * Created by pander on 2018/7/3.
 */
// ==== 走马灯 配置数据 =====================
var RunTextConfig = {};

// 固定播放消息  循环时间段播放
RunTextConfig.FixedNotice = [];  // {count : 播放次数， interval : 播放间隔， content : 播放内容, startTime : 开始时间， endTime : 结束时间}

// 临时播放消息  临时播放消息播放后删除
RunTextConfig.TemporaryNotice = []; // 结构同上