jQuery.scope = function(func,target){ return function() { func.apply(target,arguments);}};
var createClass = function(){ return function(){ this.initialize.apply(this, arguments); };};

var kasairu = {
  DEFAULT_CITY_ID: 1,
  CITIES: {'1':'稚内','2':'旭川','3':'留萌','4':'札幌','5':'岩見沢','6':'倶知安','7':'網走','8':'北見','9':'紋別','10':'根室','11':'釧路','12':'帯広','13':'室蘭','14':'浦河','15':'函館','16':'江差','17':'青森','18':'むつ','19':'八戸','20':'秋田','21':'横手','22':'盛岡','23':'宮古','24':'大船渡','25':'仙台','26':'白石','27':'山形','28':'米沢','29':'酒田','30':'新庄','31':'福島','32':'小名浜','33':'若松','34':'静岡','35':'網代','36':'三島','37':'浜松','38':'名古屋','39':'豊橋','40':'岐阜','41':'高山','42':'津','43':'尾鷲','44':'富山','45':'伏木','46':'金沢','47':'輪島','48':'福井','49':'敦賀','50':'新潟','51':'長岡','52':'高田','53':'相川','54':'水戸','55':'土浦','56':'宇都宮','57':'大田原','58':'前橋','59':'みなかみ','60':'さいたま','61':'熊谷','62':'秩父','63':'東京','64':'大島','65':'八丈島','66':'父島','67':'千葉','68':'銚子','69':'館山','70':'横浜','71':'小田原','72':'長野','73':'松本','74':'飯田','75':'甲府','76':'河口湖','77':'大津','78':'彦根','79':'京都','80':'舞鶴','81':'大阪','82':'神戸','83':'豊岡','84':'奈良','85':'風屋','86':'和歌山','87':'潮岬','88':'岡山','89':'津山','90':'広島','91':'庄原','92':'松江','93':'浜田','94':'西郷','95':'鳥取','96':'米子','97':'下関','98':'山口','99':'柳井','100':'萩','101':'徳島','102':'日和佐','103':'高松','104':'松山','105':'新居浜','106':'宇和島','107':'高知','108':'室戸','109':'清水','110':'福岡','111':'八幡','112':'飯塚','113':'久留米','114':'大分','115':'中津','116':'日田','117':'佐伯','118':'長崎','119':'佐世保','120':'厳原','121':'福江','122':'佐賀','123':'伊万里','124':'熊本','125':'阿蘇乙姫','126':'牛深','127':'人吉','128':'宮崎','129':'延岡','130':'都城','131':'高千穂','132':'鹿児島','133':'鹿屋','134':'種子島','135':'名瀬','136':'那覇','137':'名護','138':'久米島','139':'南大東島','140':'宮古島','141':'石垣島','142':'与那国島'}
};

kasairu.Base = createClass();
kasairu.Base.prototype = {
  
  initialize: function(){
    this.owner  = null;
    this.cityId = null;
  }

  ,isAdmin: function(){
    return !!this.owner.isViewer();
  }
  
  /**
   * アプリのオーナーに関する情報を取得する
   * @param callback Function データストアに送信完了時のコールバック関数
   */
  ,getOwnerData: function(callback){
    var req = opensocial.newDataRequest();
    req.add(req.newFetchPersonRequest("OWNER"), "get_owner");
    req.add(req.newFetchPersonAppDataRequest(opensocial.newIdSpec({"userId":"OWNER"}),["city_id"]),"get_owner_appdata");
    req.send($.scope(function(response){
      var success = true;
      if (response.hadError()) {
        success = false;
      } else {
        this.owner = response.get("get_owner").getData();
        var ownerAppData = response.get("get_owner_appdata").getData();
        // AppDataからcity_idを取得する
        if(ownerAppData[this.owner.getField("id")] && ownerAppData[this.owner.getField("id")]["city_id"]) {
          this.cityId = ownerAppData[this.owner.getField("id")]["city_id"];
        } else {
          this.cityId = kasairu.DEFAULT_CITY_ID;
        }
      }

      callback.apply(this, [success]);
      
    },this));
  }
  
  /**
   * WatherHacksにアクセスして、お天気データを取得する
   * @param cityId Number 地域を表す数値
   * @param callback Function APIアクセス完了時のコールバック関数
   */
  ,fetchWeatherData: function(cityId, callback){
    var params = {};
    params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.TEXT;
    gadgets.io.makeRequest('http://weather.livedoor.com/forecast/webservice/rest/v1?city='+cityId+'&day=today', $.scope(function(data){
      var success = true;
      if (data.errors.length == 0) {
        var bool = /雨/.test($('telop',data.text).text());
      } else {
        success = false;
      }
      callback.apply(this,[bool,success]);
    },this), params);
  }
  
  /**
   * city_idを永続データストアに保存
   * @param cityId Number 地域を表す数値
   * @param callback Function データストアに送信完了時のコールバック関数
   */
  ,updateCityId: function(cityId, callback){
    var req = opensocial.newDataRequest();
    req.add(req.newUpdatePersonAppDataRequest("VIEWER", "city_id", Number(cityId)));
    req.send(callback);
  }
};
