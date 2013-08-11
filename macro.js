/********************************************************************

                        JavaScript Library

                                           (c) 2012 - 2013 tyabuta.
********************************************************************/



/*
* DateクラスをYYYY/MM/DDの書式文字列に変換する。
*/
function DateToStringYYYYMMDD(date) {
    var   d = date;
    var str = "";
    str += d.getFullYear() + "/";
    str += ((d.getMonth() < 9) ? "0" : "") + (d.getMonth() + 1) + "/";
    str += ((d.getDate() < 10) ? "0" : "") + d.getDate();
    return str;
}


/*
* 文字列に引数のデータを書き込みます。
* データを書き込む位置に{0}などと表記してください。
* 戻り値: 展開した文字列を返す。
*/
function sprintf(fmt /* ... */){
    for (var i=1; i<arguments.length; i++){
        var reg = new RegExp("\\{" + (i-1) + "\\}", "g");
        fmt = fmt.replace(reg, arguments[i]);
    }
    return fmt;
}



/*
* 数値を指定範囲内におさめる。
* val: 数値, 小数値
*/
function NumberCorrectRange(val, min, max){
    if (max < val) val = max;
    if (val < min) val = min;
    return val;
}


/*
* ポイントがRect内に収まっているか調べる。
*     pt: {x,y}
*   rect: {left,top,width,height}
* return: bool
*/
function PointInRect(pt, rect){
    if (rect.left <= pt.x && pt.x < rect.left+rect.width &&
        rect.top  <= pt.y && pt.y < rect.top+rect.height) return true;
    return false;
}


/*
* ポイントがRect内に収まるような座標を返す。
*     pt: {x,y}
*   rect: {left,top,width,height}
* return: Point
*/
function PointIntoRect(pt, rect){
    var right  = rect.left+rect.width;
    var bottom = rect.top+rect.height;

    if (pt.x  < rect.left) pt.x=rect.left;
    if (right < pt.x)      pt.x=right;
    if (pt.y  < rect.top)  pt.y=rect.top;
    if (bottom< pt.y)      pt.y=bottom;
    return pt;
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

/*
* expがfalseだとアラート表示する。
*/
function ASSERT(exp, msg) {
    if (!exp) alert(msg);
}



/*-------------------------------------------------------------------
* 変換関数
-------------------------------------------------------------------*/

/*
* 16進数の文字列に変換する。
* 1桁の場合はゼロ埋めして16桁で表記する。
*
* 戻り値: 16進数の文字列
*/
function base16(num){
    var ret = num.toString(16);
    if (num < 0x10) return "0" + ret;
    return ret;
}

function str2int(val){
    var i = parseInt(val, 10);

    if (isNaN(i)) return 0;
    return i;
}

/*
* RGBの色コードを表す文字列を取得する。
* color: rgb連想配列{r,g,b}
*
* 戻り値: 16進数文字列を返す。
*/
function rgb2str(color){
    return base16(color.r) + base16(color.g) + base16(color.b);
}

/*
* ARGBの色コードを表す文字列を取得する。
* color: rgb連想配列{a,r,g,b}
*
* 戻り値: 16進数文字列を返す。
*/
function argb2str(color){
    return base16(color.a) + base16(color.r) + base16(color.g) + base16(color.b);
}

/*
* HSV >> RGB 色空間の変換を行う。
*
* h: Hue(色相)           0 - 359
* s: Saturasion(彩度)  0.0 - 1.0
* v: Value(明度)       0.0 - 1.0
*
* 戻り値: rgb連想配列を返す。{r,g,b}
*/
var hsv2rgb = new function(){

    // 0-1の範囲から、0x00-0xFFの範囲で表す数値に変換する関数。(クロージャ)
    var makeRgb = function(fr,fg,fb){
        return {r:~~(255*fr),g:~~(255*fg),b:~~(255*fb)}
    }

    var _hue = -1;
    var Hi   = 0;
    var f    = 0;

    return function(h,s,v){
        // fix value
        //h %= 360;

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


/*
* RGB >> HSV 色空間の変換を行う。
*
* h: Hue(色相)           0 - 359
* s: Saturasion(彩度)  0.0 - 1.0
* v: Value(明度)       0.0 - 1.0
*
* 戻り値: hsv連想配列を返す。{h,s,v}
*/
function rgb2hsv(r,g,b){
    r/=0xff;
    g/=0xff;
    b/=0xff;

    var max = (r>g)? r:g;
        max = (max>b)? max:b;
    if (0==max) return {h:0,s:0,v:0};

    var min = (r<g)? r:g;
        min = (min<b)? min:b;
    if (max==min) return {h:0,s:0,v:max};

    var   s = max-min;
    var hue = 0;
    if     (r==max) hue =  ((g-b)/s)*60;
    else if(g==max) hue = (((b-r)/s)*60)+120;
    else            hue = (((r-g)/s)*60)+240;

    s  /= max;
    v   = max;
    hue = (hue+360)%360;

    return {h:hue,s:s,v:v};
}


/*-------------------------------------------------------------------
* Canvas関数
-------------------------------------------------------------------*/

/*
* Canvasがサポートされているブラウザか調べる。
* canvas: Canvas要素
*
* 戻り値: サポートされているならtrue
*/
function BrowserSupportedCanvas(){
    var canvas = document.createElement("canvas");
    return canvas.getContext? true:false;
}

/*
* Canvasから2Dコンテキストを取得する
* 戻り値: CanvasRenderingContext2Dオブジェクト
*/
function CanvasGetContext2D(canvas){
    // jQueryセレクタの場合、元のDOMを取得する。
    if (canvas.get) canvas = canvas.get(0);
    return canvas.getContext('2d');
}



/*
* 三角形を描画する。
*
*        dc: CanvasのContextオブジェクト
*   basePos: 三角形の頂点座料{x,y}
*         h: 三角形の高さ
* direction: 三角形の指している向き "left", "right", "up", "down"
*
* bFill(default=true):
* 三角形を塗りつぶす場合true、
* dc.fillStyle で設定されている色で塗りつぶされます。
*/
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


function ImageDataSetPixel(imageData, x, y, color){
    var w = imageData.width;
    var h = imageData.height;

    var index = ((y*w)+x)*4;

    imageData.data[index + 0] = color.r;
    imageData.data[index + 1] = color.g;
    imageData.data[index + 2] = color.b;
    imageData.data[index + 3] = color.a;
}

function ImageDataGetPixel(imageData, x, y){
    var w = imageData.width;
    var h = imageData.height;

    var index = ((y*w)+x)*4;

    return {
        r: imageData.data[index +0],
        g: imageData.data[index +1],
        b: imageData.data[index +2],
        a: imageData.data[index +3]
    };
}


