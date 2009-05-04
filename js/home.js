var Main = createClass();
Main.prototype = {
  
  /**
   * コンストラクタ
   */
  initialize: function(){
    this.model = new kasairu.Base();
    this.flashMessage = new gadgets.MiniMessage(null,'flash-message');
    this.setupViews();
    this.model.getOwnerData($.scope( this.onGetOwnerDataHandler,this));
  }
  
  /**
   * ビューを初期化する
   */
  ,setupViews: function(){
  }
  
  /**
   * オーナー情報取得完了後の処理
   */
  ,onGetOwnerDataHandler: function(success){
    // お天気情報の取得
    this.model.fetchWeatherData(this.model.cityId, $.scope(this.onFetchWeatherData,this));
  }
  
  /**
   * お天気データの取得完了後の処理
   * @param isRainy Boolean 雨が振るか？
   */
  ,onFetchWeatherData: function(isRainy, success){
    if (!success) {
      this.flashMessage.createTimerMessage("お天気情報の取得に失敗しました。しばらくしてからもう一度お試しください。", 4 );
    } else {
      // VIEWの変更
      $(".city-name").text(kasairu.CITIES[this.model.cityId]);
      if (isRainy) {
        $("#result-yes").show();
        $("#result-no").hide();
      } else {
        $("#result-yes").hide();
        $("#result-no").show();
      }
    }
  }
  
};

gadgets.util.registerOnLoadHandler(function(){
  var main = new Main();
});
