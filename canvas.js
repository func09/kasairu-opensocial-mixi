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
    
    // 地域設定ボックスのトグル
    $('#toggle-setting-city').click(function(){
      $('#box-setting-city').toggle();
    });
    
    // 地域設定変更ボタン押下時の処理
    $('#btn-setting').click($.scope(function(){
      
      // city_idをセレクトメニューから取得
      this.model.cityId = $('#city-select').attr('value');
      
      // お天気データを取得
      this.model.fetchWeatherData(this.model.cityId, $.scope(this.onFetchWeatherData, this));
      
      // city_idを永続データに保存
      this.model.updateCityId(this.model.cityId, $.scope(this.onUpdateCityId, this));
      
    }, this));
    
  }
  
  /**
   * オーナー情報取得完了後の処理
   */
  ,onGetOwnerDataHandler: function(success){
  
    // Owner == Viewerであるか調べる
    if (!this.model.isAdmin()) {
      $('#box-setting').remove();
    }
    
    // セレクトメニューのチェック状態を変更する
    $('#city-select option[value='+this.model.cityId+']').attr('selected','selected');

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
  
  /**
   * city_id保存後の処理
   */
  ,onUpdateCityId: function(response){
    
    if(response.hadError()){
      this.flashMessage.createTimerMessage("地域設定の保存に失敗しました。もう一度やり直してみてください。", 4 );
    } else {
      this.flashMessage.createTimerMessage("地域設定を『"+kasairu.CITIES[this.model.cityId]+"』として保存しました。", 2, function(){
        $('#box-setting-city').fadeOut();
        return true;
      });
    }
    
  }
  
};



gadgets.util.registerOnLoadHandler(function(){
  var main = new Main();
});
