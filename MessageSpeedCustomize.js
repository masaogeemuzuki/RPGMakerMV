//=============================================================================
// MessageSpeedCustomize.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.1 2016/07/23 制御文字「\>\<」が指定されている場合、そちらを優先するよう修正
// 1.1.0 2016/07/12 文章の表示中に決定キーもしくは左クリックで文章を瞬間表示する機能を追加
// 1.0.0 2016/04/12 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Message speed customize
 * @author triacontane
 *
 * @param VariableSpeed
 * @desc Variable number of Message speed
 * @default 1
 *
 * @param RapidShow
 * @desc Rapid show if triggered(ON/OFF)
 * @default OFF
 *
 * @help Customize for message speed
 * 0    : Rapid
 * 1    : Normal
 * 2... : Slowly
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc メッセージ速度調整プラグイン
 * @author トリアコンタン
 *
 * @param 表示速度変数
 * @desc メッセージ表示速度を格納する変数の番号
 * @default 1
 *
 * @param 瞬間表示
 * @desc 文章の表示中に決定ボタンや左クリックで文章を瞬間表示します。(ON/OFF)
 * @default OFF
 *
 * @help メッセージ表示速度を調整します。
 * パラメータで指定した番号の変数に対して以下の値を代入してください。
 * 0     : 瞬間表示
 * 1     : 通常と同様の表示速度
 * 2以上 : 指定したフレーム間隔で一文字を表示します。
 * 
 * ※大きければ大きいほどゆっくりと表示されます。
 *
 * ※公開中の「オプション任意項目作成プラグイン」と組み合わせれば
 * 対象の変数をオプション画面から操作できます。
 * https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/CustomizeConfigItem.js
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(function () {
    'use strict';
    var pluginName = 'MessageSpeedCustomize';

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getParamBoolean = function(paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() === 'ON';
    };

    var getParamOther = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramVariableSpeed  = getParamNumber(['VariableSpeed', '表示速度変数'], 1, 5000);
    var paramRapidShow      = getParamBoolean(['RapidShow', '瞬間表示']);

    //=============================================================================
    // Window_Message
    //  メッセージの表示間隔を調整します。
    //=============================================================================
    var _Window_Message_updateWait = Window_Message.prototype.updateWait;
    Window_Message.prototype.updateWait = function() {
        if (paramRapidShow && this._textState && this.isTriggered()) {
            this._showAll = true;
        }
        return _Window_Message_updateWait.apply(this, arguments);
    };

    var _Window_Message_updateMessage = Window_Message.prototype.updateMessage;
    Window_Message.prototype.updateMessage = function() {
        var speed = $gameVariables.value(paramVariableSpeed);
        if (this._textState && !this._lineShowFast) {
            if (speed <= 0 || this._showAll) {
                this._showFast = true;
            } else {
                this._waitCount = speed - 1;
            }
        }
        return _Window_Message_updateMessage.apply(this, arguments);
    };

    var _Window_Message_onEndOfText = Window_Message.prototype.onEndOfText;
    Window_Message.prototype.onEndOfText = function() {
        _Window_Message_onEndOfText.apply(this, arguments);
        this._showAll = false;
    };
})();

