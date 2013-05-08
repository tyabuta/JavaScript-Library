
/*
* DateクラスをYYYY/MM/DDの書式文字列に変換する。
*/
function date_to_yyyymmdd(date) {
    var   d = date;
    var str = "";
    str += d.getFullYear() + "/";
    str += ((d.getMonth() < 9) ? "0" : "") + (d.getMonth() + 1) + "/";
    str += ((d.getDate() < 10) ? "0" : "") + d.getDate();    
    return str;
}


/*
* expがfalseだとアラート表示する。
*/
function ASSERT(exp, msg) {
    if (!exp) alert(msg);
}


