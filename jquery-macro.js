/********************************************************************

                    JavaScript Library for jQuery

                                                   (c) 2014 tyabuta.
********************************************************************/


/*
* 指定要素にhidden入力を追加する。
*/
function addInputHidden($to, _name, _value){
    $('<input>').attr({type:'hidden', name:_name, value:_value}).appendTo($to);
}

/*
* 全aタグのhrefリンクをonclickによる遷移に置換する
*/
function anchorHrefToEventScript(){
    $('a').each(function(){
        var url = $(this).attr('href');
        $(this).removeAttr('href');
        $(this).click(function(){
            location.href = url;
        });
    });
}

