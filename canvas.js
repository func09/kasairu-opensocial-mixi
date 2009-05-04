var Main = Class.create();
Main.prototype = {
  
  /**
   * コンストラクタ
   */
  initialize: function(){
    this.model = new kasairu.Base();
    this.flashMessage = new gadgets.MiniMessage(__MODULE_ID__,'flash-message');
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
      this.model.updateCityId(this.model.cityId,$.scope(functin(response){
        if(response.hadError()){
          this.flashMessage.createTimerMessage("地域設定の保存に失敗しました。もう一度やり直してみてください。", 4 );
        } else {
          this.flashMessage.createTimerMessage("地域設定を『"+kasairu.CITIES[this.model.cityId]+"』として保存しました。", 2, function(){
            $('#box-setting-city').fadeOut();
            return true;
          });
        }
      },this));
      
    },this));
  }
  
  /**
   * オーナー情報取得完了後の処理
   */
  ,onGetOwnerDataHandler: function(response){
  
    if (response.hadError()) {
      return;
    }
    
    this.owner = response.get("get_owner").getData();
    var ownerAppData = response.get("get_owner_appdata").getData();
    
    // Owner == Viewerであるか調べる
    if (this.owner.isViewer()) {
      this.isAdmin = true;
    } else {
      $('#box-setting').remove();
    }
    
    // AppDataからcity_idを取得する
    if(ownerAppData[owner.getField("id")] && ownerAppData[owner.getField("id")]["city_id"]) {
      cityId = ownerAppData[owner.getField("id")]["city_id"];
    } else {
      cityId = DEFAULT_CITY_ID;
    }

    // セレクトメニューのチェック状態を変更する
    $('#city-select option[value='+cityId+']').attr('selected','selected');

    // お天気情報の取得
    fetchWeatherData(cityId, $.scope(this.onFetchWeatherData,this));
  }
  
  /**
   * お天気データの取得完了後の処理
   */
  ,onFetchWeatherData: function(data){
  }
  
};



gadgets.util.registerOnLoadHandler(function(){
  var main = new Main();
});
