var rest   = require('restler');

module.exports = {
    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        if(!step.input('url')) {
            return this.fail({
                message: 'A URL is required',
                input: step.inputs()
            });
        }

        var saveUrl = step.input('url')[0];
        var self = this;

        var data = {
            url: saveUrl,
            consumer_key: dexter.environment('pocket_consumer_key'),
            access_token: dexter.environment('pocket_access_token')
        };

        rest.post("https://getpocket.com/v3/add", {data : data}).on('complete', function(result, response) {
              try {
                  if(response.statusCode != 200) {
                      return self.fail(response.headers);
                  }else{
                      self.complete(response);
                  }
              } catch(e) {
                  /* ignore any error parsing and just return null */
                  self.fail(e);
              }
          });
    }
};
