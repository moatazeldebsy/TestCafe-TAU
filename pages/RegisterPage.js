const {Selector} =  require('testcafe');

function select(selector){
    return Selector(selector).with({boundTestRun:testController})
}

exports.RegisterPage ={
    GenderButton: function() {
        return select('#gender-male');
      },

      Firstname : function()
      {
        return select('input#FirstName');
      },

      Lastname : function()
      {
        return select('#LastName');
      },

      DateOfBirth : function(){
        return select("select[name='DateOfBirthDay']");
      },
      MonthOfBirth : function(){
        return select("select[name='DateOfBirthMonth']");
      },

      YearOfBirth : function(){
        return select("select[name='DateOfBirthYear']");
      },

      Email : function()
      {
        return select('#Email');
      },

      Password : function()
      {
        return select('#Password');
      },

      ConfirmPassword : function()
      {
        return select('#ConfirmPassword');
      },

      RegistrationButton: function(){
        return select('#register-button.button-1.register-next-step-button');
      },

      SuccessfullMessage: function(){
        return select('div.result').withText('Your registration completed');
      },
      
      ListOption : function(){
        return select('option');
      }
}
