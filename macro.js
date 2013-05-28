/********************************************************************

                        JavaScript Library

                                           (c) 2012 - 2013 tyabuta.
********************************************************************/



// ----------------------------------------------
// DateクラスをYYYY/MM/DDの書式文字列に変換する。
// ----------------------------------------------
function DateToStringYYYYMMDD(date) {
    var   d = date;
    var str = "";
    str += d.getFullYear() + "/";
    str += ((d.getMonth() < 9) ? "0" : "") + (d.getMonth() + 1) + "/";
    str += ((d.getDate() < 10) ? "0" : "") + d.getDate();
    return str;
}


// ----------------------------------------------
// expがfalseだとアラート表示する。
// ----------------------------------------------
function ASSERT(exp, msg) {
    if (!exp) alert(msg);
}



// ----------------------------------------------
// 文字列に引数のデータを書き込みます。
// データを書き込む位置に{0}などと表記してください。
// 戻り値: 展開した文字列を返す。
// ----------------------------------------------
var sprintf = function(fmt){
    for (var i=1; i<arguments.length; i++){
        var reg = new RegExp("\\{" + (i-1) + "\\}", "g");
        fmt = fmt.replace(reg, arguments[i]);
    }
    return fmt;
}


// ----------------------------------------------
// 16進数の文字列に変換する。
// 1桁の場合はゼロ埋めして16桁で表記する。
//
// 戻り値: 16進数の文字列
// ----------------------------------------------
var base16 = function(num){
    var ret = num.toString(16);
    if (num < 0x10) return "0" + ret;
    return ret;
}


// ----------------------------------------------
// Canvasがサポートされているブラウザか調べる。
// canvas: Canvas要素
//
// 戻り値: サポートされているならtrue
// ----------------------------------------------
var hasSupportCanvas = function(){
    var canvas = document.createElement("canvas");
    return canvas.getContext? true:false;
}


// ----------------------------------------------
// Canvasから2Dコンテキストを取得する
// 戻り値: CanvasRenderingContext2Dオブジェクト
// ----------------------------------------------
var getContext2d = function(canvas){
    // jQueryセレクタの場合、元のDOMを取得する。
    if (canvas.get) canvas = canvas.get(0);
    return canvas.getContext('2d');
}




/*-------------------------------------------------------------------
* デバック関数
-------------------------------------------------------------------*/

/*
* コンソールに出力するdebugメッセージ用の関数を生成する。
* bDebug: コンソール出力する場合はtrue
*         リリースする時にfalseを指定しておく事で、
*         出力なしに切り替える事ができる。
*
* e.g.
* var dmsg = DebugMessageFactory(true);  // for Debug
* var dmsg = DebugMessageFactory(false); // for Release
*
* 戻り値: デバック関数オブジェクト
*/
function DebugMessageFactory(bDebug){
    if (bDebug && console)
        return function(msg){ console.log(msg);}

    return function(){};
}


// ----------------------------------------------
// RGBの色コードを表す文字列を取得する。
// color: rgb連想配列{r,g,b}
//
// 戻り値: 16進数文字列を返す。
// ----------------------------------------------
var rgbString = function(color){
    return base16(color.r) + base16(color.g) + base16(color.b);
}


// ----------------------------------------------
// HSV >> RGB 色空間の変換を行う。
//
// h: Hue(色相)           0 - 359
// s: Saturasion(彩度)  0.0 - 1.0
// v: Value(明度)       0.0 - 1.0
//
// 戻り値: rgb連想配列を返す。{r,g,b}
// ----------------------------------------------
var hsv2rgb = new function(){

    // 指定された値を適切な範囲に補正する関数。(クロージャ)
    var fixRange = function(val, min, max){
        if (max < val) val = max;
        if (val < min) val = min;
        return val;
    }

    // 0-1の範囲から、0x00-0xFFの範囲で表す数値に変換する関数。(クロージャ)
    var makeRgb = function(fr,fg,fb){
        return {r:~~(255*fr),g:~~(255*fg),b:~~(255*fb)}
    }

    var _hue = -1;
    var Hi  = 0;
    var f  = 0;

    return function(h,s,v){
        // fix value
        //h %= 360;
        //s = fixRange(s, 0.0, 1.0);
        //v = fixRange(v, 0.0, 1.0);

        // s = 0 なら、全ての要素はvに等しい。
        if (s == 0.0) return makeRgb(v,v,v);


        // calculate
        if (_hue != h){
            _hue = h;

            var rf = h/60;
            Hi = (~~(rf))%6;
            f  = rf-Hi;
        }
        var p  = v * (1.0-s);
        var k = (Hi%2)? (v*(1.0-(f*s))) : (v*(1.0-((1.0-f)*s)));

        switch (Hi){
            case 0: return makeRgb(v,k,p);
            case 1: return makeRgb(k,v,p);
            case 2: return makeRgb(p,v,k);
            case 3: return makeRgb(p,k,v);
            case 4: return makeRgb(k,p,v);
            case 5: return makeRgb(v,p,k);
        }

        return null;
    }
}



// ------------------------------------------
// 三角形を描画する。
//
//        dc: CanvasのContextオブジェクト
//   basePos: 三角形の頂点座料{x,y}
//         h: 三角形の高さ
// direction: 三角形の指している向き "left", "right", "up", "down"
//
// bFill(default=true):
// 三角形を塗りつぶす場合true、
// dc.fillStyle で設定されている色で塗りつぶされます。
// --------------------------------------
var drawTriangle = function(dc, basePos, h, direction, bFill){
    if (typeof bFill === 'undefined') bFill = true;
    var halfHeight = h/2;

    dc.beginPath();
    dc.moveTo(basePos.x, basePos.y);

    if ("left" == direction || "right" == direction){
        var dx = (("left"==direction)? basePos.x+h:basePos.x-h);
        dc.lineTo(dx, basePos.y-halfHeight);
        dc.lineTo(dx, basePos.y+halfHeight);
    }
    else if ("up" == direction || "down" == direction){
        var dy = (("up"==direction)? basePos.y+h:basePos.y-h);
        dc.lineTo(basePos.x-halfHeight, dy);
        dc.lineTo(basePos.x+halfHeight, dy);
    }

    dc.closePath();
    if (bFill) dc.fill();
}








